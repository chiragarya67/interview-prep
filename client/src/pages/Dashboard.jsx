import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const scoreColor = (score) => {
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#eab308";
  return "#ef4444";
};

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/interview/dashboard");
        setData(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="text-center">
          <div className="w-[48px] h-[48px] rounded-full border-[3px] border-indigo-500 border-t-transparent spinner mx-auto mb-[16px]" />
          <p className="text-gray-400 text-[14px]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Sessions", value: data?.totalSessions ?? 0, icon: "📋" },
    { label: "Average Score", value: data?.averageScore !== undefined ? `${data.averageScore}/10` : "—", icon: "📊" },
    { label: "Best Score", value: data?.bestScore !== undefined ? `${data.bestScore}/10` : "—", icon: "🏆" },
  ];

  return (
    <div className="min-h-screen pt-[80px] pb-[60px] px-[20px]" style={{ background: "#0a0a0f" }}>
      <div className="max-w-[900px] mx-auto">
        {/* Welcome */}
        <div className="mb-[40px]">
          <h1 className="text-[32px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
            Welcome back, {data?.user?.name || user?.name} 👋
          </h1>
          <p className="text-gray-400 text-[15px] mt-[8px]">Ready to sharpen your skills today?</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[40px]">
          {stats.map((s, i) => (
            <div key={i} className="p-[24px] rounded-[16px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-[28px] mb-[12px]">{s.icon}</div>
              <div className="text-[28px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{s.value}</div>
              <div className="text-gray-400 text-[13px] mt-[4px]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Start New */}
        <div className="p-[32px] rounded-[20px] mb-[40px] flex items-center justify-between flex-wrap gap-[20px]"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(99,102,241,0.3)" }}>
          <div>
            <h2 className="text-[22px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Ready for your next interview?
            </h2>
            <p className="text-gray-400 text-[14px] mt-[6px]">
              Practice with AI-generated questions and get instant feedback.
            </p>
          </div>
          <Link to="/start"
            className="px-[28px] py-[12px] rounded-[12px] text-[15px] font-semibold text-white no-underline transition-all hover:opacity-90 hover:scale-105 whitespace-nowrap"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            Start Interview →
          </Link>
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="text-[20px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Recent Sessions
            </h2>
            <Link to="/history" className="text-indigo-400 hover:text-indigo-300 text-[13px] no-underline">
              View all →
            </Link>
          </div>

          {data?.recentSessions?.length === 0 ? (
            <div className="p-[40px] rounded-[16px] text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-[40px] mb-[12px]">🎯</div>
              <p className="text-gray-400 text-[15px]">No sessions yet. Start your first interview!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-[12px]">
              {data.recentSessions.map((session) => (
                <div key={session._id} className="p-[20px] rounded-[14px] flex items-center justify-between gap-[16px]"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-[16px]">
                    <div className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center text-[20px] font-bold text-white"
                      style={{ background: `${scoreColor(session.overallScore)}22`, border: `1px solid ${scoreColor(session.overallScore)}44` }}>
                      {session.overallScore}
                    </div>
                    <div>
                      <div className="text-white font-medium text-[15px]">
                        {session.role} — {session.difficulty}
                      </div>
                      <div className="text-gray-500 text-[12px] mt-[2px]">
                        {new Date(session.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                        {" · "}{session.questions?.length || 0} questions
                      </div>
                    </div>
                  </div>
                  <div className="px-[12px] py-[5px] rounded-full text-[12px] font-semibold"
                    style={{
                      color: scoreColor(session.overallScore),
                      background: `${scoreColor(session.overallScore)}18`,
                    }}>
                    {session.overallScore}/10
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
