import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions = [], role = "", difficulty = "" } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/start");
    }
  }, []);

  // Timer
  useEffect(() => {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAnswerChange = (val) => {
    const updated = [...answers];
    updated[currentIndex] = val;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (isRecording) stopRecording();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to results
      const pairs = questions.map((q, i) => ({
        question: q,
        userAnswer: answers[i] || "",
      }));
      navigate("/results", { state: { pairs, role, difficulty } });
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript + " ";
        else interim += transcript;
      }
      if (final) {
        handleAnswerChange((answers[currentIndex] || "") + final);
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      if (e.error !== "aborted") toast.error("Microphone error: " + e.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    toast.success("Recording started — speak your answer");
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    toast.success("Recording stopped");
  };

  const toggleMic = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  if (questions.length === 0) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen pt-[80px] pb-[60px] px-[20px]" style={{ background: "#0a0a0f" }}>
      <div className="max-w-[780px] mx-auto">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-[32px]">
          <div>
            <span className="text-indigo-400 text-[13px] font-semibold uppercase tracking-[1px]">
              {role} · {difficulty}
            </span>
            <h2 className="text-white font-bold text-[18px] mt-[2px]" style={{ fontFamily: "Syne, sans-serif" }}>
              Question {currentIndex + 1} of {questions.length}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-[12px] mb-[2px]">Time on question</div>
            <div className="text-white font-bold text-[22px]" style={{ fontFamily: "Space Mono, monospace" }}>
              {formatTime(elapsed)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[6px] rounded-full mb-[36px] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            }}
          />
        </div>

        {/* Question card */}
        <div className="p-[32px] rounded-[20px] mb-[24px]"
          style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="flex items-start gap-[14px]">
            <div className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[14px] font-bold text-indigo-300 flex-shrink-0 mt-[2px]"
              style={{ background: "rgba(99,102,241,0.2)" }}>
              {currentIndex + 1}
            </div>
            <p className="text-white text-[18px] leading-[1.7] font-medium">
              {questions[currentIndex]}
            </p>
          </div>
        </div>

        {/* Answer area */}
        <div className="relative mb-[24px]">
          <textarea
            ref={textareaRef}
            value={answers[currentIndex]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here, or use the microphone button below to speak..."
            rows={8}
            className="w-full px-[24px] py-[20px] rounded-[16px] text-[15px] text-white placeholder-gray-600 outline-none resize-none leading-[1.8] transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "Syne, sans-serif",
            }}
          />
          {isRecording && (
            <div className="absolute top-[14px] right-[14px] flex items-center gap-[8px] px-[12px] py-[6px] rounded-full"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)" }}>
              <span className="w-[8px] h-[8px] rounded-full bg-red-500 animate-pulse inline-block" />
              <span className="text-red-400 text-[12px] font-medium">Recording...</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-[16px]">
          <button
            onClick={toggleMic}
            className="relative flex items-center gap-[10px] px-[22px] py-[12px] rounded-[12px] text-[14px] font-semibold transition-all border cursor-pointer"
            style={{
              background: isRecording ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
              borderColor: isRecording ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)",
              color: isRecording ? "#f87171" : "#9ca3af",
            }}>
            <span className={`text-[18px] ${isRecording ? "animate-pulse" : ""}`}>🎙️</span>
            {isRecording ? "Stop Recording" : "Use Microphone"}
          </button>

          <div className="flex items-center gap-[12px]">
            {currentIndex > 0 && (
              <button
                onClick={() => { if (isRecording) stopRecording(); setCurrentIndex(currentIndex - 1); }}
                className="px-[20px] py-[12px] rounded-[12px] text-[14px] font-medium text-gray-400 hover:text-white transition-all border border-transparent hover:border-[rgba(255,255,255,0.1)] cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                ← Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-[32px] py-[12px] rounded-[12px] text-[15px] font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {isLast ? "Finish & See Results →" : "Next Question →"}
            </button>
          </div>
        </div>

        {/* Dots navigation */}
        <div className="flex items-center justify-center gap-[8px] mt-[36px]">
          {questions.map((_, i) => (
            <div key={i}
              className="rounded-full transition-all"
              style={{
                width: i === currentIndex ? "24px" : "8px",
                height: "8px",
                background: i < currentIndex
                  ? "#6366f1"
                  : i === currentIndex
                  ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                  : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
