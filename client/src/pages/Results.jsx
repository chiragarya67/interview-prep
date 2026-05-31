import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const scoreColor = (score) => {
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#eab308";
  return "#ef4444";
};

const ScoreCircle = ({ score }) => {
  const color = scoreColor(score);
  const size = 140;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[36px] font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif", color }}>
            {score}
          </span>
          <span className="text-gray-400 text-[12px]">out of 10</span>
        </div>
      </div>
      <div className="mt-[12px] px-[16px] py-[6px] rounded-full text-[13px] font-semibold"
        style={{ color, background: `${color}18` }}>
        {score >= 7 ? "Excellent" : score >= 4 ? "Good Effort" : "Needs Work"}
      </div>
    </div>
  );
};

const QuestionCard = ({ item, index }) => {
  const [showSuggested, setShowSuggested] = useState(false);
  const color = scoreColor(item.aiScore);

  return (
    <div className="p-[24px] rounded-[16px] fade-in-up"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        animationDelay: `${index * 0.08}s`,
      }}>
      <div className="flex items-start gap-[14px] mb-[16px]">
        <div className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center text-[13px] font-bold flex-shrink-0 mt-[1px]"
          style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
          {index + 1}
        </div>
        <p className="text-white font-medium text-[15px] leading-[1.6]">{item.question}</p>
        <div className="ml-auto flex-shrink-0 px-[12px] py-[4px] rounded-full text-[13px] font-bold"
          style={{ color, background: `${color}18` }}>
          {item.aiScore}/10
        </div>
      </div>

      {item.userAnswer ? (
        <div className="mb-[14px] p-[14px] rounded-[10px]"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[1px] mb-[6px]">Your Answer</p>
          <p className="text-gray-300 text-[14px] leading-[1.6]">{item.userAnswer}</p>
        </div>
      ) : (
        <div className="mb-[14px] p-[14px] rounded-[10px]"
          style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <p className="text-red-400 text-[13px] italic">No answer provided</p>
        </div>
      )}

      <div className="mb-[14px] p-[14px] rounded-[10px]"
        style={{ background: `${color}08`, border: `1px solid ${color}25` }}>
        <p className="text-[11px] font-semibold uppercase tracking-[1px] mb-[6px]" style={{ color: `${color}99` }}>
          AI Feedback
        </p>
        <p className="text-gray-300 text-[14px] leading-[1.6]">{item.aiFeedback}</p>
      </div>

      <button
        onClick={() => setShowSuggested(!showSuggested)}
        className="text-[13px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-none">
        {showSuggested ? "▲ Hide suggested answer" : "▼ Show suggested answer"}
      </button>

      {showSuggested && (
        <div className="mt-[12px] p-[14px] rounded-[10px]"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[1px] mb-[6px]">
            Suggested Answer
          </p>
          <p className="text-gray-300 text-[14px] leading-[1.6]">{item.suggestedAnswer}</p>
        </div>
      )}
    </div>
  );
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pairs = [], role = "", difficulty = "" } = location.state || {};

  const [results, setResults] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (pairs.length === 0) {
      navigate("/start");
      return;
    }
    evaluateAnswers();
  }, []);

  const evaluateAnswers = async () => {
    setLoading(true);
    try {
      const res = await api.post("/interview/evaluate", { answers: pairs });
      const { evaluations, overallScore: score } = res.data;

      const combined = pairs.map((p, i) => ({
        question: p.question,
        userAnswer: p.userAnswer,
        aiScore: evaluations[i]?.score ?? 0,
        aiFeedback: evaluations[i]?.feedback ?? "No feedback available.",
        suggestedAnswer: evaluations[i]?.suggestedAnswer ?? "No suggested answer.",
      }));

      setResults(combined);
      setOverallScore(score);
    } catch (err) {
      toast.error("Failed to evaluate answers");
      navigate("/start");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saved) return;
    setSaving(true);
    try {
      await api.post("/interview/save", {
        role,
        difficulty,
        overallScore,
        questions: results.map((r) => ({
          question: r.question,
          userAnswer: r.userAnswer,
          aiScore: r.aiScore,
          aiFeedback: r.aiFeedback,
          suggestedAnswer: r.suggestedAnswer,
        })),
      });
      setSaved(true);
      toast.success("Session saved to history!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="text-center">
          <div className="w-[56px] h-[56px] rounded-full border-[3px] border-indigo-500 border-t-transparent spinner mx-auto mb-[20px]" />
          <h3 className="text-white font-bold text-[20px] mb-[8px]" style={{ fontFamily: "Syne, sans-serif" }}>
            AI is evaluating your answers...
          </h3>
          <p className="text-gray-400 text-[14px]">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[80px] pb-[60px] px-[20px]" style={{ background: "#0a0a0f" }}>
      <div className="max-w-[800px] mx-auto">

        {/* Score header */}
        <div className="p-[40px] rounded-[24px] mb-[40px] text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h1 className="text-[28px] font-bold text-white mb-[28px]" style={{ fontFamily: "Syne, sans-serif" }}>
            Interview Complete!
          </h1>
          <ScoreCircle score={overallScore} />
          <p className="text-gray-400 text-[14px] mt-[20px]">
            {role} · {difficulty} · {results.length} questions
          </p>

          <div className="flex items-center justify-center gap-[12px] mt-[28px] flex-wrap">
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="px-[24px] py-[11px] rounded-[12px] text-[14px] font-semibold transition-all border cursor-pointer disabled:opacity-60"
              style={{
                background: saved ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.15)",
                borderColor: saved ? "rgba(34,197,94,0.4)" : "rgba(99,102,241,0.4)",
                color: saved ? "#86efac" : "#a5b4fc",
              }}>
              {saving ? "Saving..." : saved ? "✓ Saved to History" : "Save Session"}
            </button>
            <button
              onClick={() => navigate("/start")}
              className="px-[24px] py-[11px] rounded-[12px] text-[14px] font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              Try Again →
            </button>
            <button
              onClick={() => navigate("/history")}
              className="px-[24px] py-[11px] rounded-[12px] text-[14px] font-medium text-gray-400 hover:text-white transition-all cursor-pointer border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
              View History
            </button>
          </div>
        </div>

        {/* Questions breakdown */}
        <h2 className="text-[20px] font-bold text-white mb-[20px]" style={{ fontFamily: "Syne, sans-serif" }}>
          Detailed Breakdown
        </h2>
        <div className="flex flex-col gap-[16px]">
          {results.map((item, i) => (
            <QuestionCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
