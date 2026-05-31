import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideNavOn = ["/", "/login", "/register"];
  if (hideNavOn.includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav style={{ background: "rgba(10,10,20,0.95)", borderBottom: "1px solid #1e1e3a" }}
      className="fixed top-0 left-0 right-0 z-[50] backdrop-blur-[10px]">
      <div className="max-w-[1200px] mx-auto px-[20px] py-[14px] flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-[10px] no-underline">
          <div className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <span className="text-white text-[16px]">⚡</span>
          </div>
          <span className="text-white font-bold text-[18px]" style={{ fontFamily: "Syne, sans-serif" }}>
            PrepAI
          </span>
        </Link>

        <div className="flex items-center gap-[8px]">
          <Link to="/dashboard"
            className={`px-[14px] py-[7px] rounded-[8px] text-[14px] font-medium transition-all no-underline ${
              location.pathname === "/dashboard"
                ? "bg-[#1e1e3a] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#1a1a2e]"
            }`}>
            Dashboard
          </Link>
          <Link to="/start"
            className={`px-[14px] py-[7px] rounded-[8px] text-[14px] font-medium transition-all no-underline ${
              location.pathname === "/start"
                ? "bg-[#1e1e3a] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#1a1a2e]"
            }`}>
            Interview
          </Link>
          <Link to="/history"
            className={`px-[14px] py-[7px] rounded-[8px] text-[14px] font-medium transition-all no-underline ${
              location.pathname === "/history"
                ? "bg-[#1e1e3a] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#1a1a2e]"
            }`}>
            History
          </Link>

          <div className="w-[1px] h-[20px] bg-[#2a2a4a] mx-[6px]" />

          <div className="flex items-center gap-[10px]">
            <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <button onClick={handleLogout}
              className="px-[14px] py-[7px] rounded-[8px] text-[13px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
