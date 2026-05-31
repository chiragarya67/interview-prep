const { GoogleGenerativeAI } = require("@google/generative-ai");
const Session = require("../models/Session");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FALLBACK_QUESTIONS = [
  "Explain the difference between var, let, and const in JavaScript.",
  "What is the event loop in Node.js and how does it work?",
  "Describe the concept of closures in JavaScript with an example.",
  "What are RESTful APIs and what are the core HTTP methods?",
  "Explain the difference between SQL and NoSQL databases.",
  "What is async/await and how does it differ from Promises?",
  "Describe the virtual DOM and how React uses it.",
  "What is CORS and why is it important?",
  "Explain the concept of middleware in Express.js.",
  "What are React hooks and why were they introduced?",
  "Describe the difference between authentication and authorization.",
  "What is memoization and when would you use it?",
  "Explain how indexes work in MongoDB.",
  "What is the difference between shallow copy and deep copy in JavaScript?",
  "Describe the MVC architecture pattern and its benefits.",
];

const generateQuestions = async (req, res) => {
  try {
    const { role, difficulty, count } = req.body;

    if (!role || !difficulty || !count) {
      return res.status(400).json({ message: "Role, difficulty, and count are required" });
    }

    const prompt = `Generate ${count} ${difficulty} technical interview questions for a ${role} developer. Return ONLY a JSON array of strings, no explanation, no markdown, no backticks. Example: ["Question 1?","Question 2?"]`;

    let questions = [];

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        questions = parsed.slice(0, count);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (geminiError) {
      console.error("Gemini error, using fallback:", geminiError.message);
      questions = FALLBACK_QUESTIONS.slice(0, count);
    }

    res.json({ questions });
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};

const evaluateAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers array is required" });
    }

    const answersText = answers
      .map(
        (a, i) =>
          `Question ${i + 1}: ${a.question}\nAnswer: ${a.userAnswer || "(No answer provided)"}`
      )
      .join("\n\n");

    const prompt = `You are a strict technical interviewer. Evaluate each answer below and return ONLY a JSON array where each item has: score (0-10 integer), feedback (string of 1-2 sentences), suggestedAnswer (string of 2-3 sentences). No extra text, no markdown, no backticks. Evaluate ${answers.length} answers:\n\n${answersText}`;

    let evaluations = [];

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        evaluations = parsed;
      } else {
        throw new Error("Invalid evaluation format");
      }
    } catch (geminiError) {
      console.error("Gemini evaluation error, using fallback:", geminiError.message);
      evaluations = answers.map((a) => ({
        score: a.userAnswer && a.userAnswer.trim().length > 20 ? 6 : 3,
        feedback:
          a.userAnswer && a.userAnswer.trim().length > 20
            ? "Your answer shows some understanding. Consider adding more detail and examples."
            : "Answer was too brief or missing. A complete answer is expected.",
        suggestedAnswer:
          "A strong answer would clearly define the concept, explain how it works with a concrete example, and discuss practical use cases or trade-offs.",
      }));
    }

    const overallScore = Math.round(
      evaluations.reduce((sum, e) => sum + (e.score || 0), 0) / evaluations.length
    );

    res.json({ evaluations, overallScore });
  } catch (error) {
    console.error("Evaluate answers error:", error);
    res.status(500).json({ message: "Failed to evaluate answers" });
  }
};

const saveSession = async (req, res) => {
  try {
    const { role, difficulty, overallScore, questions } = req.body;

    if (!role || !difficulty || questions === undefined) {
      return res.status(400).json({ message: "Missing session data" });
    }

    const session = await Session.create({
      userId: req.user.id,
      role,
      difficulty,
      overallScore,
      questions,
    });

    res.status(201).json({ message: "Session saved successfully", session });
  } catch (error) {
    console.error("Save session error:", error);
    res.status(500).json({ message: "Failed to save session" });
  }
};

const getHistory = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ sessions });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id, userId: req.user.id });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await Session.findByIdAndDelete(id);
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ message: "Failed to delete session" });
  }
};

const getDashboard = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const user = await User.findById(req.user.id).select("-password");

    const totalSessions = sessions.length;
    const averageScore =
      totalSessions > 0
        ? Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / totalSessions)
        : 0;
    const bestScore = totalSessions > 0 ? Math.max(...sessions.map((s) => s.overallScore)) : 0;
    const recentSessions = sessions.slice(0, 3);

    res.json({ user, totalSessions, averageScore, bestScore, recentSessions });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswers,
  saveSession,
  getHistory,
  deleteSession,
  getDashboard,
};
