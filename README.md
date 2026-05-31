# 🔍 AI Codebase Navigator

> Paste any GitHub repo URL, ask questions in plain English, and get AI-powered answers with file references.

![License](https://img.shields.io/badge/license-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Good First Issues](https://img.shields.io/github/issues/chiragarya67/AI-Codebase-Navigator/good%20first%20issue)

---

## What is this?

AI Codebase Navigator lets you understand any GitHub repository without reading hundreds of files. You paste a repo URL, ask a question like *"Where is authentication handled?"*, and the app fetches the code and uses Google Gemini AI to answer with exact file paths and explanations.

Built with React, Node.js, Express, MongoDB, and the free Gemini API.

---

## Current State

The app is functional but intentionally left with rough edges — that's where **you** come in.

Things that work:
- Paste a GitHub repo URL and fetch its file tree
- Ask natural language questions about the codebase
- Get AI answers powered by Gemini 1.5 Flash

Things that need work (see [Good First Issues](#good-first-issues)):
- UI needs polish
- No loading states on several API calls
- Error messages are not user-friendly
- No mobile responsiveness
- History page is incomplete
- No empty state illustrations
- Tests are missing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini API (free tier) |
| Auth | JWT |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally
- Free [Gemini API key](https://aistudio.google.com/app/apikey)
- Free [GitHub Personal Access Token](https://github.com/settings/tokens) (optional, increases rate limit)

### Setup

**1. Clone the repo**

```bash
git clone https://github.com/chiragarya67/AI-Codebase-Navigator.git
cd AI-Codebase-Navigator
```

**2. Setup the server**

```bash
cd server
npm install
cp .env.example .env
# Fill in your keys in .env
npm run dev
```

**3. Setup the client**

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`.

### Environment Variables

**server/.env**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/codebase-navigator
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_gemini_key_here
GITHUB_TOKEN=your_github_token_here   # optional
```

**client/.env**

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Good First Issues

These are real problems in the app right now. Pick one, fix it, open a PR.

### 🟢 Beginner Friendly

**#1 — Add loading spinner on the Ask Question button**
When user submits a question, the button has no loading state. It just freezes. Add a spinner and disable the button while the API call is in progress.
File: `client/src/pages/Ask.jsx`

---

**#2 — Show error message when GitHub URL is invalid**
If user pastes a bad URL (not a GitHub repo), the app crashes silently. Validate the URL format and show a proper error toast.
File: `client/src/pages/Home.jsx`

---

**#3 — Empty state on History page**
The history page shows a blank screen when there are no sessions. Add a simple empty state — an icon and a message like "No sessions yet. Start by pasting a repo URL."
File: `client/src/pages/History.jsx`

---

**#4 — Add .env.example files**
The repo has no `.env.example` files. New contributors don't know what variables are needed. Create `server/.env.example` and `client/.env.example` with placeholder values.

---

**#5 — Make the Navbar mobile responsive**
On small screens the navbar links overflow. Add a hamburger menu that opens/closes on click.
File: `client/src/components/Navbar.jsx`

---

**#6 — Add copy button to code snippets in AI answers**
When Gemini returns code in the answer, there's no way to copy it. Add a "Copy" button to each code block.
File: `client/src/components/AnswerCard.jsx`

---

### 🟡 Intermediate

**#7 — Rate limit GitHub API calls**
Currently if someone pastes a new repo every 2 seconds, the server hammers GitHub API. Add a simple per-user cooldown (e.g. 1 request per 5 seconds) on the backend.
File: `server/controllers/repoController.js`

---

**#8 — Add character limit and validation on the question input**
The question textarea accepts unlimited text. Gemini has token limits. Add a 500 character limit with a live counter below the input.
File: `client/src/pages/Ask.jsx`

---

**#9 — Write basic API tests**
There are zero tests. Add Jest + Supertest tests for at minimum: auth routes (register, login) and the `/api/repo/fetch` endpoint.
Files: `server/routes/`, new file `server/tests/`

---

**#10 — Add dark mode toggle**
The app is dark by default but has no way to switch to light mode. Add a toggle button in the Navbar that switches themes and saves preference to localStorage.
File: `client/src/components/Navbar.jsx`

---

## How to Contribute

1. Find an issue above (or open a new one)
2. Comment on the issue — "I'd like to work on this"
3. Fork the repo and create a branch: `git checkout -b fix/issue-number-short-description`
4. Make your changes
5. Open a Pull Request with a short description of what you changed and why

**PR checklist:**
- [ ] App still runs after your change
- [ ] No console errors introduced
- [ ] Code is readable (add a comment if something is non-obvious)

---

## Project Structure

```
AI-Codebase-Navigator/
├── client/                  # React frontend
│   └── src/
│       ├── pages/           # Route-level components
│       ├── components/      # Reusable UI components
│       ├── context/         # Auth context
│       └── api/             # Axios instance
└── server/                  # Express backend
    ├── controllers/         # Business logic
    ├── routes/              # API routes
    ├── models/              # Mongoose schemas
    └── middleware/          # Auth middleware
```

---

## License

MIT — do whatever you want with it.

---

*Found a bug not listed here? Open an issue. Have an idea? Open a discussion.*
