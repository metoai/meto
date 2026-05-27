# Meto v1 — Internal build reference

> **Audience:** us (builders). Not user-facing copy.  
> **Status:** shipped MVP on `main`, deployed via Vercel.  
> **Repo:** https://github.com/metoai/meto

---

## What v1 is

v1 is a **working foundation**, not a polished product. It proves the core loop:

1. Sign up / log in
2. Build a structured AI identity (onboarding)
3. Edit sections on a dashboard
4. Compile into copy-paste context blocks (Universal, Claude, ChatGPT)
5. Optionally share public sections at `/profile/[username]`

UI/UX polish, billing, and several prompt features are intentionally deferred.

---

## Scope checklist

### In v1

| Area | What works |
|------|------------|
| **Auth** | Email/password signup & login, Google OAuth, session middleware |
| **Onboarding** | Brain dump, chat interview, skip to manual fill |
| **Profile sections** | 7 core types + custom sections; CRUD from dashboard |
| **Compile** | Gemini two-step compile (master → format); cache in DB; local fallback |
| **Formats (UI)** | Universal, Claude, ChatGPT |
| **Public profile** | `/profile/[username]` shows `is_public` sections; local universal compile |
| **Settings** | Display name, username, password change, delete account |
| **Dashboard UX** | Sidebar, mobile nav, completion %, last updated, copy compiled text |
| **Landing** | Hero, demo block, FAQ, footer |
| **SEO** | Metadata, `robots.ts`, `sitemap.ts` |

### Not in v1 (known gaps)

| Item | Notes |
|------|-------|
| **Gemini format in UI** | Prompt exists (`compile-local` + `FORMAT_PROMPTS.gemini`); dashboard only shows 3 format tabs |
| **Compact format** | Mentioned in original prompts doc; not implemented |
| **Section regenerator (prompt 1D)** | Not wired to UI |
| **UI/UX polish pass** | Deferred — functional but not final design |
| **Billing / Pro** | Landing mentions Pro “later”; no Stripe |
| **Public page AI compile** | Public profile uses `compileLocally`, not Gemini |
| **Onboarding re-run** | Reset profile clears data; no dedicated “redo onboarding” flow |

---

## Routes & pages

| Path | Auth | Purpose |
|------|------|---------|
| `/` | Public | Landing |
| `/auth/login` | Public | Login |
| `/auth/signup` | Public | Signup |
| `/auth/callback` | — | OAuth callback (sets cookies on redirect) |
| `/onboarding` | Protected | First-time profile creation |
| `/dashboard` | Protected | Main editor; redirects to onboarding if no sections |
| `/settings` | Protected | Account & profile settings |
| `/profile/[username]` | Public | Public profile page |

Protected routes live under `src/app/(protected)/` and use `src/app/(protected)/layout.tsx`.

---

## API routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/onboarding/brain-dump` | Raw text → Gemini JSON → insert sections |
| POST | `/api/onboarding/chat` | Chat turn; returns reply + `done` when `PROFILE_READY` |
| POST | `/api/onboarding/finish-chat` | Chat history → Gemini JSON → insert sections |
| POST | `/api/onboarding/skip` | Inserts empty `about` section so user can fill manually |
| GET/POST | `/api/profile/sections` | List / create sections |
| PATCH/DELETE | `/api/profile/sections/[id]` | Update section (incl. `is_public`) / delete |
| GET | `/api/profile/compile?format=` | Load cached compiled text |
| POST | `/api/profile/compile` | Compile; body: `{ format, force?, localOnly? }` |
| GET/PATCH | `/api/profile/me` | Profile + email; update name, username, password |
| DELETE | `/api/profile/account` | `delete_own_account()` RPC |
| POST | `/api/profile/reset` | Delete sections, compiled profiles, onboarding chats |

---

## Database (Supabase)

| Table | Role |
|-------|------|
| `profiles` | User row (from signup trigger): `username`, `display_name` |
| `context_sections` | Editable profile sections per user |
| `compiled_profiles` | Cached compiled output; unique on `(user_id, format)` |
| `onboarding_chats` | Stored chat transcripts when chat onboarding completes |

**RLS:** Users own their rows. Public read on `context_sections` where `is_public = true` (for public profile page).

**RPC:** `delete_own_account()` — cascaded account deletion from settings.

---

## AI pipeline

All prompts live in **`src/lib/meto-prompts.ts`**. Do not scatter prompts elsewhere.

| Step | Prompt ID | Used when |
|------|-----------|-----------|
| Brain dump extract | 1A | `/api/onboarding/brain-dump` |
| Chat interview | 1B | `/api/onboarding/chat` |
| Chat extract | 1C | `/api/onboarding/finish-chat` |
| Master compile | 1E | `compileProfileWithGemini()` step 1 |
| Format-specific | 2A–2D | `compileProfileWithGemini()` step 2 |

**Gemini client:** `src/lib/gemini.ts`

- Model: `GEMINI_MODEL` env (default chain: `gemini-2.5-flash` → fallbacks)
- Temperatures: `0.3` extract/compile, `0.7` chat
- Retries on 429/503/404; falls back to `src/lib/compile-local.ts`

**Compile caching:**

- GET returns DB cache if `last_compiled >= latest section updated_at`
- POST skips Gemini if cache valid (unless `force: true`)
- Section saves trigger `localOnly` recompile on dashboard (no Gemini call)

---

## Environment

Copy `.env.example` → `.env.local` for local dev.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `GEMINI_API_KEY` | Yes | Google AI Studio key |
| `GEMINI_MODEL` | No | Preferred model (default `gemini-2.5-flash`) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL (OAuth redirects, metadata) |

**Production:** Set the same vars in Vercel. Add production URL to Supabase Auth redirect URLs.

---

## Key files (where to edit what)

| Goal | File |
|------|------|
| Rebrand colors/fonts | `src/lib/brand.ts` |
| Change AI behavior | `src/lib/meto-prompts.ts` |
| Gemini model/retry logic | `src/lib/gemini.ts` |
| Offline compile templates | `src/lib/compile-local.ts` |
| Section save logic | `src/lib/profile-sections.ts` |
| Dashboard editor | `src/components/dashboard/dashboard-editor.tsx` |
| Onboarding UI | `src/components/onboarding/onboarding-flow.tsx` |
| Auth cookie fix | `src/app/auth/callback/route.ts` |
| List available Gemini models | `node scripts/list-models.mjs` |

---

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev                  # http://localhost:3000
```

**Do not** run `npm run build` while `npm run dev` is active — can corrupt `.next`. Stop dev first, or delete `.next` and restart.

---

## Deploy

- **GitHub:** `main` → auto-deploy on Vercel
- **Build:** `next build` (ESLint + TypeScript must pass)

---

## v1 → v2 ideas (not committed)

Use this list when planning; nothing here is built yet.

- UI/UX pass (brand HTML → full app polish)
- Gemini format tab in dashboard
- Wire section regenerator (1D) per section
- Compact format for Kimi/DeepSeek-style tools
- Better public profile (optional Gemini compile, OG images)
- Onboarding redo without full account reset
- Analytics, waitlist, or billing

---

## Quick sanity test

1. Sign up → complete brain dump or chat onboarding
2. Dashboard loads sections + compiled block
3. Edit a section → save → compile updates (local fallback OK)
4. Copy Universal block → paste into Claude/ChatGPT
5. Set username in settings → toggle section public → visit `/profile/username`
6. Google OAuth login works in production (Supabase redirect URLs set)
