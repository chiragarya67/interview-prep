import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const roles = ["Frontend", "Backend", "Full Stack", "DSA"];
const difficulties = ["Easy", "Medium", "Hard"];
const questionCounts = [5, 10, 15];

const StartInterview = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Frontend");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await api.post("/interview/generate", { role, difficulty, count });
      const { questions } = res.data;
      if (!questions || questions.length === 0) {
        toast.error("No questions generated. Please try again.");
        return;
      }
      toast.success(`${questions.length} questions ready!`);
      navigate("/session", { state: { questions, role, difficulty } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const SelectGroup = ({ label, options, value, onChange }) => (
    <div>
      <label className="block text-[13px] font-semibold text-gray-300 mb-[12px] uppercase tracking-[1px]">
        {label}
      </label>
      <div className="flex flex-wrap gap-[10px]">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="px-[20px] py-[10px] rounded-[10px] text-[14px] font-medium transition-all cursor-pointer border"
            style={{
              background: value === opt ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
              borderColor: value === opt ? "#6366f1" : "rgba(255,255,255,0.1)",
              color: value === opt ? "#a5b4fc" : "#9ca3af",
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-[80px] pb-[60px] px-[20px]" style={{ background: "#0a0a0f" }}>
      <div className="max-w-[620px] mx-auto">
        <div className="mb-[40px]">
          <h1 className="text-[32px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
            Configure Interview
          </h1>
          <p className="text-gray-400 text-[15px] mt-[8px]">
            Select your preferences and let AI generate your questions.
          </p>
        </div>

        <div className="p-[36px] rounded-[20px] flex flex-col gap-[32px]"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>

          <SelectGroup label="Role" options={roles} value={role} onChange={setRole} />
          <SelectGroup label="Difficulty" options={difficulties} value={difficulty} onChange={setDifficulty} />
          <SelectGroup
            label="Number of Questions"
            options={questionCounts}
            value={count}
            onChange={setCount}
          />

          {/* Summary */}
          <div className="p-[20px] rounded-[12px]"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <p className="text-indigo-300 text-[14px]">
              <span className="font-semibold">Session preview:</span>{" "}
              {count} {difficulty} questions for a {role} developer
            </p>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-[15px] rounded-[12px] text-[16px] font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            {loading ? (
              <span className="flex items-center justify-center gap-[10px]">
                <span className="w-[18px] h-[18px] rounded-full border-[2px] border-white border-t-transparent spinner inline-block" />
                Generating with AI...
              </span>
            ) : (
              "Generate & Start Interview →"
            )}
          </button>
        </div>

        <div className="mt-[24px] grid grid-cols-3 gap-[12px]">
          {[["🤖", "AI Questions"], ["⏱️", "Timed Session"], ["📊", "Instant Score"]].map(([icon, label]) => (
            <div key={label} className="p-[16px] rounded-[12px] text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-[22px] mb-[6px]">{icon}</div>
              <div className="text-gray-400 text-[12px]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
