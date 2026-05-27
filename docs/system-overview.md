# Meto — System overview

> What Meto is and how the system works end-to-end.

---

## The problem

Every time you open ChatGPT, Claude, Gemini, or another AI tool, you start from zero. You re-explain who you are, what you do, and how you like to work. That context is valuable — and ephemeral.

## What Meto does

Meto is a **personal AI identity layer**. You describe yourself once. Meto structures that into a persistent profile, compiles it into ready-to-paste context blocks tuned for different AI tools, and optionally publishes selected parts on a public page.

**Tagline:** Stop introducing yourself to AI.

---

## Core concepts

| Concept | Meaning |
|---------|---------|
| **Profile sections** | Structured facts about you (about, work, projects, skills, goals, working style, context for AI). Stored in Postgres, editable anytime. |
| **Compiled context** | A single block of text optimized for pasting into an AI chat or custom instructions field. |
| **Format** | How the compiled text is written — Universal (generic), Claude (prose), ChatGPT (bullets), Gemini (conversational). |
| **Public profile** | A username URL where visitors see sections you marked `is_public`. |

Meto is **not** a chat product. It does not replace ChatGPT or Claude. It produces the context you bring *into* those tools.

---

## User journeys

### New user

```
Landing → Sign up → Onboarding → Dashboard → Copy context → Paste into any AI
```

**Onboarding paths:**

1. **Brain dump** — paste everything; Gemini extracts JSON → 7 sections
2. **Chat** — short interview; when done, Gemini extracts JSON → sections
3. **Skip** — empty starter section; fill manually on dashboard

If the user has no sections, `/dashboard` redirects to `/onboarding`.

### Returning user

```
Login → Dashboard → Edit sections → Regenerate compile → Copy
```

Compiled output is **cached**. Refreshing the dashboard does not call Gemini unless sections changed or user clicks regenerate.

### Public sharing

```
Settings: claim username → Dashboard: toggle section public → /profile/username
```

Visitors see public sections and a locally compiled universal preview. No login required.

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js 14 App  │────▶│  Supabase   │
│  (React)    │◀────│  Router + API    │◀────│  Auth + DB  │
└─────────────┘     └────────┬─────────┘     └─────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Google Gemini   │
                    │  (onboarding +   │
                    │   compile)       │
                    └──────────────────┘
```

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 App Router, React 18, Tailwind, Geist fonts |
| Backend | Next.js Route Handlers (API routes), Server Components |
| Auth & DB | Supabase (Postgres + Auth + RLS) |
| AI | `@google/generative-ai` (Gemini) |
| Hosting | Vercel |

Session handling: `@supabase/ssr` with middleware refresh (`src/middleware.ts`).

---

## Data model (logical)

```
auth.users
    └── profiles (1:1)
            ├── context_sections (1:many)
            ├── compiled_profiles (1:many, one row per format)
            └── onboarding_chats (1:many, optional history)
```

**`context_sections`** — source of truth for profile content.

**`compiled_profiles`** — derived cache. Invalidated when any section’s `updated_at` is newer than `last_compiled`.

**`profiles`** — identity metadata (username for public URL, display name).

---

## AI flows

### Onboarding (extract)

```
User input (text or chat)
        │
        ▼
   Gemini + prompt 1A or 1C
        │
        ▼
   JSON { about, work, projects, ... }
        │
        ▼
   Insert context_sections rows
```

Chat interview uses prompt **1B** per turn until the model outputs `PROFILE_READY`, then **1C** runs once to extract.

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

If Gemini fails (quota, overload, model error), **`compile-local.ts`** builds a deterministic template from section titles and content — same structure, no AI polish.

---

## Security model

- **Authentication:** Supabase Auth (email + Google). Protected pages require a valid session.
- **Authorization:** Row Level Security — users read/write only their own data.
- **Public data:** Only sections with `is_public = true` are readable anonymously (via RLS + public profile page query).
- **Secrets:** `GEMINI_API_KEY` is server-only. Supabase anon key is public (RLS enforces access).
- **Account deletion:** Settings → DELETE calls `delete_own_account()` RPC.

---

## What runs where

| Action | Server | Client |
|--------|--------|--------|
| Page render (landing, public profile) | Server Components | — |
| Dashboard, onboarding, settings | — | Client components + fetch to API |
| Gemini calls | API routes only | Never in browser |
| Supabase reads (public profile) | Server Component | — |
| Supabase auth session | Middleware + server/client helpers | Client for sign-out |

---

## External dependencies

| Service | Role |
|---------|------|
| **Supabase** | Users, sessions, Postgres, RLS |
| **Google Gemini** | Onboarding extraction + profile compilation |
| **Vercel** | Build, deploy, env vars |
| **GitHub** | Source control; Vercel watches `main` |

---

## Product boundary

**Meto owns:** structured profile storage, AI-assisted extraction/compilation, copy UX, optional public page.

**Meto does not own:** the conversation inside ChatGPT/Claude/Gemini, model selection in those tools, or long-term memory inside third-party AI products.

The compiled block is the handoff artifact — designed to be pasted once at the start of a session or saved in each tool’s custom instructions field.

---

## Related doc

For build-specific scope, file map, API list, and v1 gaps → see **`docs/v1-internal.md`**.
