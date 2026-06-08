# Meto

**Every AI should already know you.** Tell Meto once — no more re-introducing yourself in Claude, ChatGPT, Gemini, and every other AI.

**Production:** [https://www.metoai.site](https://www.metoai.site)  
**Repo:** [github.com/metoai/meto](https://github.com/metoai/meto)

---

## What Meto is

Meto is a **personal AI identity layer**. You describe yourself once in structured profile sections. Meto:

- **Scores** how well AI would understand you (context score + gaps)
- **Fixes** thin or missing sections with short AI-guided interviews
- **Compiles** copy-paste context tuned for ChatGPT, Claude, Gemini, DeepSeek, Grok, Kimi, Qwen, and more
- **Shares** a public profile link or plain-text API URL that AI fetch tools can read

Meto is not a chatbot. It maintains the context you paste *into* other AI tools.

---

## Core loop

```
Sections (source of truth)
  → Context score + gaps (auto on login & after edits)
  → Fixes / Updates (fill gaps or reflect life changes)
  → Workspace (copy link or formatted text per AI platform)
  → Paste into any AI chat
```

---

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind · Supabase · DeepSeek / Gemini · Polar billing · Vercel

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill Supabase + LLM keys
npm run dev                  # http://localhost:3000
```

Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` locally. Production should use `https://www.metoai.site`.

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) | Full product + architecture (upload to any AI assistant) |
| [`docs/system-overview.md`](docs/system-overview.md) | Journeys, data model, security |
| [`docs/AI_SYSTEM.md`](docs/AI_SYSTEM.md) | Every AI flow, prompts, caching |
| [`docs/v1-internal.md`](docs/v1-internal.md) | Routes, API table, env vars, file map |
| [`/llms.txt`](https://www.metoai.site/llms.txt) | Machine-readable public profile discovery |

---

## Deploy

Push to `main` → Vercel auto-deploys. Run migrations in Supabase; set Auth redirect URLs for production domain.
