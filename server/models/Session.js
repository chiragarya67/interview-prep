const mongoose = require("mongoose");

const questionResultSchema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, default: "" },
  aiScore: { type: Number, default: 0 },
  aiFeedback: { type: String, default: "" },
  suggestedAnswer: { type: String, default: "" },
});

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    overallScore: { type: Number, default: 0 },
    questions: [questionResultSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
