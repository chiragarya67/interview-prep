# Contributing to AI Interview Prep Platform

Thanks for wanting to contribute! This guide will get you from zero to your first PR.

---

## Before You Start

- Check the [open issues](https://github.com/chiragarya67/AI-Interview-Prep/issues) for something to work on
- Comment on the issue — *"I'd like to work on this"* — so we can assign it to you
- Don't open a PR for an issue nobody assigned you — two people might do the same work

---

## Setup

```bash
# Fork the repo first, then:
git clone https://github.com/YOUR_USERNAME/AI-Interview-Prep.git
cd AI-Interview-Prep

# Server
cd server
npm install
cp .env.example .env
# Fill in your keys in .env
npm run dev

# Client (new terminal)
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`

---

## Environment Variables

**server/.env** — copy from `server/.env.example`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/interviewprep
JWT_SECRET=any_random_secret
GEMINI_API_KEY=get_free_key_from_aistudio.google.com
```

**client/.env** — copy from `client/.env.example`
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Making Changes

**Always create a new branch — never commit directly to main.**

```bash
git checkout -b fix/issue-42-loading-spinner
# or
git checkout -b feat/issue-10-dark-mode
```

Branch naming:
- Bug fixes → `fix/issue-NUMBER-short-description`
- New features → `feat/issue-NUMBER-short-description`
- Docs → `docs/what-you-changed`

---

## Opening a PR

1. Push your branch to your fork
2. Open a PR to the `main` branch of this repo
3. Fill in the PR template
4. Link the issue: write `Fixes #42` in the description

We'll review within a few days and either merge or leave feedback.

---

## Code Style

- Keep it simple and readable
- Add a comment if something is non-obvious
- Don't install new packages without discussing in the issue first
- Frontend: Tailwind CSS only, no extra CSS files
- Backend: follow the existing controller → route → model pattern

---

## Need Help?

Comment on the issue you're working on. We're friendly here — no question is too basic.
