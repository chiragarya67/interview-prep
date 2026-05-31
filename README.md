# 🎯 AI Interview Prep Platform

> Practice technical interviews with an AI interviewer. Get questions, answer them by typing or voice, and receive instant AI feedback.

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Good First Issues](https://img.shields.io/badge/good%20first%20issues-10-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ⚠️ Current State — Needs Contributors!

This app has a working skeleton but several core features are broken or incomplete. **That's exactly why it's open source** — we need your help to make it work properly.

**What works:**
- User registration and login (JWT auth)
- Select role, difficulty, number of questions
- Basic interview session UI (question cards, textarea)
- Results page UI with score display
- Session history page UI

**What is broken / missing:**
- 🔴 Voice input — mic button not working properly
- 🔴 Gemini questions inconsistent — sometimes returns wrong format
- 🔴 AI evaluation sometimes fails silently
- 🔴 No loading states on most buttons
- 🔴 App is not mobile responsive
- 🔴 Error messages are not user friendly
- 🔴 No tests written at all
- 🔴 Timer resets incorrectly between questions

**This is intentional** — these are your contribution opportunities. Pick an issue, fix it, open a PR.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini 1.5 Flash (free) |
| Auth | JWT |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally
- Free Gemini API key → [aistudio.google.com](https://aistudio.google.com/app/apikey)

### Setup

```bash
# 1. Fork this repo then clone your fork
git clone https://github.com/YOUR_USERNAME/AI-Interview-Prep.git
cd AI-Interview-Prep

# 2. Setup server
cd server
npm install
cp .env.example .env
# Open .env and fill in your keys
npm run dev

# 3. Setup client (new terminal)
cd client
npm install
npm run dev
```

App → `http://localhost:5173`  
API → `http://localhost:5000`

---

## 📁 Project Structure

```
AI-Interview-Prep/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── StartInterview.jsx
│       │   ├── InterviewSession.jsx
│       │   ├── Results.jsx
│       │   └── History.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── api/
│           └── axios.js
└── server/
    ├── controllers/
    │   ├── authController.js
    │   └── interviewController.js
    ├── routes/
    ├── models/
    └── middleware/
```

---

## 🐛 Good First Issues

Pick any one. Comment on the GitHub issue to get assigned.

| # | Issue | Difficulty |
|---|-------|-----------|
| 1 | Fix voice input — mic button not working | 🟡 Medium |
| 2 | Add loading spinner on all API buttons | 🟢 Easy |
| 3 | Fix Gemini response parsing — wrong format crashes app | 🟡 Medium |
| 4 | Make app mobile responsive | 🟡 Medium |
| 5 | Show proper error messages instead of silent failures | 🟢 Easy |
| 6 | Fix timer — resets incorrectly between questions | 🟢 Easy |
| 7 | Add empty state UI on History page | 🟢 Easy |
| 8 | Add character counter on answer textarea | 🟢 Easy |
| 9 | Write basic API tests for auth routes | 🟡 Medium |
| 10 | Add dark/light mode toggle in Navbar | 🟡 Medium |

---

## 🤝 How to Contribute

1. Find an issue above
2. Comment — *"I'd like to work on this"*
3. Fork and create a branch: `git checkout -b fix/issue-2-loading-spinner`
4. Make your changes
5. Open a Pull Request

---

## 📜 License

MIT
