# Meto — System overview

> What Meto is and how the system works end-to-end.

---

## The problem

Every time you open ChatGPT, Claude, Gemini, or another AI tool, you start from zero. You re-explain who you are, what you do, and how you like to work. That context is valuable — and ephemeral.

## What Meto does

Meto is a **personal AI identity layer**. You describe yourself once. Meto structures that into a persistent profile, compiles it into ready-to-paste context blocks tuned for different AI tools, scores how well AI would understand you, and helps you close gaps — optionally publishing selected parts on a public page.

**Tagline:** Stop introducing yourself to AI.

---

## Core concepts

| Concept | Meaning |
|---------|---------|
| **Profile sections** | Structured facts about you (about, work, projects, skills, goals, working style, context for AI). Stored in Postgres, editable anytime. |
| **Compiled context** | A single block of text optimized for pasting into an AI chat or custom instructions field. |
| **Format** | How the compiled text is written — Universal (generic), Claude (prose), ChatGPT (bullets), Gemini (conversational). |
| **Context score** | 0–100 rating of how well an AI would understand you from your profile, plus actionable **gaps** (weak sections). |
| **Gap fix** | Short AI micro-interview targeting one known gap — faster than full onboarding. |
| **Quick update** | Free-form chat on the dashboard to reflect life/work changes across sections. |
| **Public profile** | A username URL where visitors see sections you marked `is_public`. |

Meto is **not** a general chat product. It does not replace ChatGPT or Claude. It produces and maintains the context you bring *into* those tools.

---

## User journeys

### Try before signup (landing chat)

```
Landing chat → Sign up (if needed) → Save 4 sections → Dashboard
```

Visitors chat with Meto on `/` before or after auth. The AI asks one question at a time and incrementally fills `about`, `work`, `projects`, and `goals`. When ready, the user saves → `POST /api/onboarding/save-from-landing` → redirect to dashboard.

See **`docs/AI_SYSTEM.md`** for prompt behavior and client storage keys.

### New user (full onboarding)

```
Landing → Sign up → Onboarding → Dashboard → Copy context → Paste into any AI
```

**Onboarding paths:**

1. **Brain dump** — paste everything; LLM extracts JSON → 7 sections
2. **Chat** — short interview; when done, LLM extracts JSON → sections
3. **Skip** — empty starter section; fill manually on dashboard

If the user has no sections, `/dashboard` redirects to `/onboarding`.

### Returning user

```
Login → Dashboard (context score + section quality) → Profile / Workspace / Updates / Fixes
```

- **Profile** — edit all sections with tiered layout and completion progress
- **Workspace** — pick sections + format, copy to clipboard (no LLM)
- **Updates** — describe changes in plain language; AI proposes section updates
- **Fixes** — view context score gaps; fix one or fix all with targeted AI questions

Compiled output is **cached**. Refreshing does not call the LLM unless sections changed or the user clicks regenerate.

### Close a gap (fix with AI)

```
Dashboard or Fixes → Fix with AI → Quick update (gap mode) → Save → Score re-analyzes
```

Context score identifies weak sections. **Fix single** runs a 1–3 question interview for one gap. **Fix all** walks the high-impact queue one section at a time. Updates merge into profile sections and trigger local recompile.

### Public sharing

```
Settings: claim username → Profile: toggle section public → /profile/username
```

Visitors see public sections and a locally compiled universal preview. No login required.

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js App     │────▶│  Supabase   │
│  (React)    │◀────│  Router + API    │◀────│  Auth + DB  │
└─────────────┘     └────────┬─────────┘     └─────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  DeepSeek (1st)  │
                    │  Gemini (fallback)│
                    │  onboarding,     │
                    │  compile, score, │
                    │  update, gap fix │
                    └──────────────────┘
```

| Layer | Technology |
|-------|------------|
| Frontend | Next.js App Router, React, Tailwind, Recharts (dashboard) |
| Backend | Next.js Route Handlers (API routes), Server Components |
| Auth & DB | Supabase (Postgres + Auth + RLS) |
| AI | DeepSeek primary, Gemini fallback (`src/lib/llm.ts`) |
| Hosting | Vercel |

Session handling: `@supabase/ssr` with middleware refresh (`src/middleware.ts`).

---

## Data model (logical)

```
auth.users
    └── profiles (1:1)
            ├── context_sections (1:many)
            ├── compiled_profiles (1:many, one row per format)
            ├── context_scores (1:1, latest analysis)
            └── onboarding_chats (1:many, optional history)
```

**`context_sections`** — source of truth for profile content.

**`compiled_profiles`** — derived cache. Invalidated when any section’s `updated_at` is newer than `last_compiled`.

**`context_scores`** — cached score, headline, summary, and gaps array. Invalidated when sections change.

**`profiles`** — identity metadata (username for public URL, display name).

---

## AI flows (summary)

| Flow | Trigger | Output |
|------|---------|--------|
| Landing chat | `/` conversation | 4 partial sections → save on signup |
| Onboarding extract | Brain dump or chat finish | 7 sections in DB |
| Context score | Dashboard / Fixes load | Score + gaps in `context_scores` |
| Quick update | `/dashboard/update` | Proposed section merges → user saves |
| Gap fix | Fix button on gap | 1–3 targeted questions → one section update |
| Compile | Regenerate or stale cache | Formatted block in `compiled_profiles` |

Detailed prompt rules, temperatures, and request/response shapes → **`docs/AI_SYSTEM.md`**.

### Onboarding (extract)

```
User input (text or chat)
        │
        ▼
   LLM + prompt 1A or 1C
        │
        ▼
   JSON { about, work, projects, ... }
        │
        ▼
   Insert context_sections rows
```

### Context score

```
context_sections
        │
        ▼
   LLM (or local fallback)
        │
        ▼
   { score, headline, gaps[] }
        │
        ▼
   Upsert context_scores
```

### Quick update / gap fix

```
User message(s)
        │
        ▼
   LLM → { reply, done, updates }
        │
        ▼
   User confirms Save
        │
        ▼
   Apply review + ripple check → DB → compileLocally
```

### Compile (transform)

```
context_sections (all rows for user)
        │
        ▼
   Step 1: Master compile (1E) → coherent paragraph
        │
        ▼
   Step 2: Format prompt (2A–2D) → tool-specific block
        │
        ▼
   Append custom sections (non-core types)
        │
        ▼
   Save to compiled_profiles + return to client
```

If the LLM fails, **`compile-local.ts`** builds a deterministic template from section titles and content.

---

## Dashboard structure

| Route | Purpose |
|-------|---------|
| `/dashboard` | Context score signal, section quality bars, workspace shortcuts |
| `/dashboard/profile` | Full section editor with tiered layout |
| `/dashboard/workspace` | Copy builder (sections + format presets) |
| `/dashboard/update` | Quick update chat + gap-fix mode |
| `/dashboard/fixes` | Gap list, fix-all CTA, score progress |

Navigation: fixed sidebar (desktop) + bottom tab bar (mobile).

---

## Security model

- **Authentication:** Supabase Auth (email + Google). Protected pages require a valid session.
- **Authorization:** Row Level Security — users read/write only their own data.
- **Public data:** Only sections with `is_public = true` are readable anonymously (via RLS + public profile page query).
- **Secrets:** `DEEPSEEK_API_KEY` and `GEMINI_API_KEY` are server-only. Supabase anon key is public (RLS enforces access).
- **Account deletion:** Settings → DELETE calls `delete_own_account()` RPC.

---

## What runs where

| Action | Server | Client |
|--------|--------|--------|
| Page render (landing, public profile) | Server Components | — |
| Dashboard, onboarding, settings | — | Client components + fetch to API |
| LLM calls | API routes only | Never in browser |
| Context score (cached) | API + DB | Hook + localStorage sparkline |
| Workspace copy | — | `buildContextText()` template |
| Supabase reads (public profile) | Server Component | — |
| Supabase auth session | Middleware + server/client helpers | Client for sign-out |

---

## External dependencies

| Service | Role |
|---------|------|
| **Supabase** | Users, sessions, Postgres, RLS |
| **DeepSeek** | Primary LLM (onboarding, compile, score, updates) |
| **Google Gemini** | Fallback LLM |
| **Vercel** | Build, deploy, env vars |
| **GitHub** | Source control; Vercel watches `main` |

---

## Product boundary

**Meto owns:** structured profile storage, AI-assisted extraction/compilation, context scoring, gap detection and fixes, quick updates, copy UX, optional public page.

**Meto does not own:** the conversation inside ChatGPT/Claude/Gemini, model selection in those tools, or long-term memory inside third-party AI products.

The compiled block is the handoff artifact — designed to be pasted once at the start of a session or saved in each tool’s custom instructions field.

---

## Related docs

| Doc | Contents |
|-----|----------|
| **`docs/AI_SYSTEM.md`** | Deep dive: every AI flow, prompts, gap fix vs update, storage keys |
| **`docs/v1-internal.md`** | Routes, API table, env vars, file map, scope checklist |
