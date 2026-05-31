import { Link } from "react-router-dom";

const features = [
  { icon: "🤖", title: "AI-Powered Questions", desc: "Gemini generates role-specific questions tailored to your level" },
  { icon: "🎙️", title: "Voice Input", desc: "Answer using your microphone with real-time speech recognition" },
  { icon: "📊", title: "Smart Evaluation", desc: "Get scored, detailed feedback, and model answers instantly" },
  { icon: "📈", title: "Track Progress", desc: "Review your history and watch your scores improve over time" },
];

const Landing = () => {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <header className="px-[24px] py-[20px] flex items-center justify-between max-w-[1200px] mx-auto">
        <div className="flex items-center gap-[10px]">
          <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <span className="text-white text-[18px]">⚡</span>
          </div>
          <span className="text-white font-bold text-[20px]" style={{ fontFamily: "Syne, sans-serif" }}>
            PrepAI
          </span>
        </div>
        <div className="flex items-center gap-[12px]">
          <Link to="/login"
            className="px-[20px] py-[9px] rounded-[10px] text-[14px] font-medium text-gray-300 hover:text-white border border-[#2a2a4a] hover:border-[#4a4a7a] transition-all no-underline"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            Login
          </Link>
          <Link to="/register"
            className="px-[20px] py-[9px] rounded-[10px] text-[14px] font-semibold text-white no-underline transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-[1200px] mx-auto px-[24px] pt-[80px] pb-[60px] text-center">
        <div className="inline-flex items-center gap-[8px] px-[14px] py-[6px] rounded-full text-[13px] text-indigo-300 mb-[32px]"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }}>
          <span className="w-[6px] h-[6px] rounded-full bg-indigo-400 inline-block" />
          Powered by Google Gemini AI
        </div>

        <h1 className="text-[56px] font-extrabold text-white leading-[1.1] mb-[24px]"
          style={{ fontFamily: "Syne, sans-serif" }}>
          Ace Your Next<br />
          <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Tech Interview
          </span>
        </h1>

        <p className="text-[18px] text-gray-400 max-w-[560px] mx-auto mb-[48px] leading-[1.7]">
          Practice with AI-generated questions, get real-time voice input, and receive
          instant expert feedback to sharpen your skills.
        </p>

        <div className="flex items-center justify-center gap-[16px] flex-wrap">
          <Link to="/register"
            className="px-[32px] py-[14px] rounded-[12px] text-[15px] font-semibold text-white no-underline transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 40px rgba(99,102,241,0.3)" }}>
            Start Practicing Free →
          </Link>
          <Link to="/login"
            className="px-[32px] py-[14px] rounded-[12px] text-[15px] font-medium text-gray-300 hover:text-white no-underline transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mt-[100px]">
          {features.map((f, i) => (
            <div key={i}
              className="p-[28px] rounded-[16px] text-left transition-all hover:translate-y-[-4px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-[32px] mb-[16px]">{f.icon}</div>
              <h3 className="text-white font-semibold text-[16px] mb-[8px]" style={{ fontFamily: "Syne, sans-serif" }}>
                {f.title}
              </h3>
              <p className="text-gray-400 text-[14px] leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-[80px] grid grid-cols-3 gap-[40px] max-w-[600px] mx-auto">
          {[["10K+", "Questions Generated"], ["95%", "User Satisfaction"], ["4.8★", "Average Rating"]].map(([val, label], i) => (
            <div key={i} className="text-center">
              <div className="text-[32px] font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{val}</div>
              <div className="text-gray-500 text-[13px] mt-[4px]">{label}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#1a1a2e] py-[28px] text-center text-gray-500 text-[14px]">
        © 2024 PrepAI — Built with Google Gemini
      </footer>
    </div>
  );
};

export default Landing;
