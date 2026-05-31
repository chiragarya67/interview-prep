import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StartInterview from "./pages/StartInterview";
import InterviewSession from "./pages/InterviewSession";
import Results from "./pages/Results";
import History from "./pages/History";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/start" element={<ProtectedRoute><StartInterview /></ProtectedRoute>} />
          <Route path="/session" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1a1a2e",
              color: "#f0f0f5",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "Syne, sans-serif",
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "#1a1a2e" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#1a1a2e" } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
