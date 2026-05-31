import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const scoreColor = (score) => {
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#eab308";
  return "#ef4444";
};

const SessionCard = ({ session, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const color = scoreColor(session.overallScore);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this session?")) return;
    setDeleting(true);
    try {
      await api.delete(`/interview/history/${session._id}`);
      toast.success("Session deleted");
      onDelete(session._id);
    } catch (err) {
      toast.error("Failed to delete session");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-[16px] overflow-hidden transition-all"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

      {/* Card header */}
      <div
        className="p-[20px] flex items-center gap-[16px] cursor-pointer hover:bg-white/[0.02] transition-all"
        onClick={() => setExpanded(!expanded)}>

        <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center text-[18px] font-bold text-white flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}33`, color }}>
          {session.overallScore}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="text-white font-semibold text-[15px]">{session.role}</span>
            <span className="px-[8px] py-[2px] rounded-full text-[11px] font-medium text-gray-400"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              {session.difficulty}
            </span>
          </div>
          <div className="text-gray-500 text-[12px] mt-[3px]">
            {new Date(session.createdAt).toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric", year: "numeric",
            })}
            {" · "}{session.questions?.length || 0} questions
          </div>
        </div>

        <div className="flex items-center gap-[10px] flex-shrink-0">
          <div className="px-[12px] py-[5px] rounded-full text-[12px] font-bold"
            style={{ color, background: `${color}18` }}>
            {session.overallScore}/10
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer border-none bg-transparent">
            {deleting ? "..." : "🗑️"}
          </button>
          <span className="text-gray-500 text-[16px] transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▼
          </span>
        </div>
      </div>

      {/* Expanded questions */}
      {expanded && (
        <div className="border-t border-white/[0.06]">
          <div className="p-[20px] flex flex-col gap-[14px]">
            {session.questions?.map((q, i) => {
              const qColor = scoreColor(q.aiScore);
              return (
                <div key={i} className="p-[16px] rounded-[12px]"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-start justify-between gap-[12px] mb-[10px]">
                    <p className="text-white text-[14px] font-medium leading-[1.5]">{q.question}</p>
                    <span className="px-[10px] py-[3px] rounded-full text-[12px] font-bold flex-shrink-0"
                      style={{ color: qColor, background: `${qColor}18` }}>
                      {q.aiScore}/10
                    </span>
                  </div>
                  {q.userAnswer && (
                    <p className="text-gray-400 text-[13px] leading-[1.5] mb-[8px]">
                      <span className="text-gray-600 font-medium">Your answer: </span>
                      {q.userAnswer.length > 200 ? q.userAnswer.slice(0, 200) + "..." : q.userAnswer}
                    </p>
                  )}
                  {q.aiFeedback && (
                    <p className="text-gray-500 text-[13px] leading-[1.5] italic">
                      {q.aiFeedback}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const History = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/interview/history");
        setSessions(res.data.sessions || []);
      } catch (err) {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = (id) => {
    setSessions((prev) => prev.filter((s) => s._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="text-center">
          <div className="w-[48px] h-[48px] rounded-full border-[3px] border-indigo-500 border-t-transparent spinner mx-auto mb-[16px]" />
          <p className="text-gray-400 text-[14px]">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[80px] pb-[60px] px-[20px]" style={{ background: "#0a0a0f" }}>
      <div className="max-w-[800px] mx-auto">

        <div className="flex items-center justify-between mb-[40px]">
          <div>
            <h1 className="text-[32px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Interview History
            </h1>
            <p className="text-gray-400 text-[14px] mt-[6px]">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} completed
            </p>
          </div>
          <button
            onClick={() => navigate("/start")}
            className="px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold text-white transition-all hover:opacity-90 cursor-pointer border-none"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            + New Interview
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="p-[60px] rounded-[20px] text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[48px] mb-[16px]">📋</div>
            <h3 className="text-white font-bold text-[20px] mb-[8px]" style={{ fontFamily: "Syne, sans-serif" }}>
              No sessions yet
            </h3>
            <p className="text-gray-400 text-[14px] mb-[24px]">
              Complete your first interview and save the results to see them here.
            </p>
            <button
              onClick={() => navigate("/start")}
              className="px-[24px] py-[11px] rounded-[12px] text-[14px] font-semibold text-white cursor-pointer border-none"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              Start First Interview →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {sessions.map((session) => (
              <SessionCard key={session._id} session={session} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
