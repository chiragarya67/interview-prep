import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success("Account created! Welcome to PrepAI 🎉");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[16px]" style={{ background: "#0a0a0f" }}>
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-[40px]">
          <Link to="/" className="inline-flex items-center gap-[10px] no-underline mb-[32px]">
            <div className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <span className="text-white text-[20px]">⚡</span>
            </div>
            <span className="text-white font-bold text-[22px]" style={{ fontFamily: "Syne, sans-serif" }}>PrepAI</span>
          </Link>
          <h1 className="text-[28px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Create account</h1>
          <p className="text-gray-400 text-[14px] mt-[8px]">Start your interview prep journey</p>
        </div>

        <div className="p-[32px] rounded-[20px]"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
            <div>
              <label className="block text-[13px] font-medium text-gray-300 mb-[8px]">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-[16px] py-[12px] rounded-[10px] text-[14px] text-white placeholder-gray-500 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: errors.name ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                }}
              />
              {errors.name && <p className="text-red-400 text-[12px] mt-[6px]">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-300 mb-[8px]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-[16px] py-[12px] rounded-[10px] text-[14px] text-white placeholder-gray-500 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: errors.email ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                }}
              />
              {errors.email && <p className="text-red-400 text-[12px] mt-[6px]">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-300 mb-[8px]">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full px-[16px] py-[12px] rounded-[10px] text-[14px] text-white placeholder-gray-500 outline-none pr-[44px] transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: errors.password ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-[16px] bg-transparent border-none cursor-pointer">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[12px] mt-[6px]">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-[13px] rounded-[10px] text-[15px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-[4px]"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-[14px] mt-[24px]">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
