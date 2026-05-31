const express = require("express");
const router = express.Router();
const {
  generateQuestions,
  evaluateAnswers,
  saveSession,
  getHistory,
  deleteSession,
  getDashboard,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/generate", generateQuestions);
router.post("/evaluate", evaluateAnswers);
router.post("/save", saveSession);
router.get("/history", getHistory);
router.delete("/history/:id", deleteSession);
router.get("/dashboard", getDashboard);

module.exports = router;
