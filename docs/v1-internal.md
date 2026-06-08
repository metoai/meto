# Meto v1 — Internal build reference

> **Audience:** us (builders). Not user-facing copy.  
> **Status:** shipped MVP on `main`, deployed via Vercel.  
> **Repo:** https://github.com/metoai/meto

---

## What v1 is

v1 is a **working product foundation** with a redesigned dashboard portal. It proves and extends the core loop:

1. Sign up / log in (or try landing chat first)
2. Build a structured AI identity (onboarding or landing save)
3. See context score and section quality on dashboard
4. Edit sections, quick-update via chat, or fix gaps with AI
5. Compile into copy-paste context blocks (8 platform formats)
6. Share via platform-specific prompts or public API URL at `/profile/[username]`

Billing (Polar): trial → Free → Pro with entitlements on LLM routes.

---

## Scope checklist

### In v1

| Area | What works |
|------|------------|
| **Auth** | Email/password signup & login, Google OAuth, session middleware |
| **Landing chat** | Pre-auth try flow; saves 4 sections after signup |
| **Onboarding** | Brain dump, chat interview, skip to manual fill |
| **Profile sections** | 7 core types + custom sections; CRUD from profile page |
| **Context score** | LLM analysis + local fallback; cached in `context_scores` |
| **Fixes** | Gap list by impact; fix single / fix all via gap-fix chat; **always in sidebar**; dynamic badge |
| **Quick update** | Free-form dashboard chat; apply with ripple review |
| **Compile** | Two-step LLM compile (master → format); cache in DB; local fallback |
| **Formats (UI)** | Universal, ChatGPT, Gemini, Claude, DeepSeek, Grok, Kimi, Qwen |
| **Platform share** | ChatGPT/Gemini full prompts; API context URL for others (`platform-share.ts`) |
| **Public profile** | Branded `/profile/[username]`; API context at `/api/public/profile/[username]/context` |
| **Context score sync** | Auto re-analyze on login + after profile edits (`portal-context-score-sync.tsx`) |
| **Settings** | Display name, username, password change, theme, delete account |
| **Dashboard UX** | Collapsible sidebar, signal hero, section quality bars, Recharts sparkline |
| **Billing** | Polar checkout + webhook; trial/free/pro entitlements |
| **SEO** | Metadata, `robots.ts`, `sitemap.ts`, `/llms.txt` |

### Not in v1 (known gaps)

| Item | Notes |
|------|-------|
| **Section regenerator (prompt 1D)** | Not wired to UI |
| **Onboarding re-run** | Reset profile clears data; no dedicated “redo onboarding” flow |
| **Perplexity share tab** | Removed — use universal API URL instead |

---

## Routes & pages

| Path | Auth | Purpose |
|------|------|---------|
| `/` | Public | Landing + try chat |
| `/auth/login` | Public | Login |
| `/auth/signup` | Public | Signup |
| `/auth/callback` | — | OAuth callback |
| `/onboarding` | Protected | First-time profile creation |
| `/dashboard` | Protected | Signal, section quality, workspace shortcuts |
| `/dashboard/profile` | Protected | Full section editor (tiered layout) |
| `/dashboard/workspace` | Protected | Two-column copy builder (platform + sections / preview + scenario) |
| `/dashboard/update` | Protected | Quick update + gap-fix chat |
| `/dashboard/fixes` | Protected | Context score gaps + fix-all |
| `/settings` | Protected | Account & profile settings |
| `/profile/[username]` | Public | Public profile page |
| `/profile/[username]/context` | Public | Plain-text context (rewrites to API) |
| `/api/public/profile/[username]/context` | Public | Plain-text / JSON for AI fetch tools (CORS) |
| `/.well-known/ai-profile/[username]` | Public | Agent-readable profile JSON |
| `/llms.txt` | Public | LLM discovery |

Protected portal routes live under `src/app/(protected)/(portal)/`. Onboarding under `src/app/(protected)/onboarding/`.

---

## API routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/landing-chat` | Landing try chat (inline prompt) |
| POST | `/api/onboarding/save-from-landing` | Persist landing collected sections |
| POST | `/api/onboarding/brain-dump` | Raw text → LLM JSON → insert sections |
| POST | `/api/onboarding/chat` | Chat turn; returns reply + `done` when `PROFILE_READY` |
| POST | `/api/onboarding/finish-chat` | Chat history → LLM JSON → insert sections |
| POST | `/api/onboarding/skip` | Inserts empty `about` section |
| GET/POST | `/api/profile/sections` | List / create sections |
| PATCH/DELETE | `/api/profile/sections/[id]` | Update section (incl. `is_public`) / delete |
| GET | `/api/profile/compile?format=` | Load cached compiled text |
| POST | `/api/profile/compile` | Compile; body: `{ format, force?, localOnly? }` |
| GET/POST | `/api/profile/context-score` | Cached score; POST re-analyzes or applies fixed sections |
| POST | `/api/profile/update-chat` | Quick update, gap fix, and apply modes |
| GET/PATCH | `/api/profile/me` | Profile + email; update name, username, password |
| DELETE | `/api/profile/account` | `delete_own_account()` RPC |
| POST | `/api/profile/reset` | Delete sections, compiled profiles, onboarding chats |
| GET | `/api/profile/bootstrap` | Portal bundle: profile, sections, score, entitlements |
| GET | `/api/public/profile/[username]/context` | Public context (plain text / JSON) |
| GET | `/api/public-profile/[username]` | Public profile JSON |

---

## Database (Supabase)

| Table | Role |
|-------|------|
| `profiles` | User row (from signup trigger): `username`, `display_name` |
| `context_sections` | Editable profile sections per user |
| `compiled_profiles` | Cached compiled output; unique on `(user_id, format)` |
| `context_scores` | Latest score, headline, summary, gaps (jsonb), `analyzed_at` |
| `onboarding_chats` | Stored chat transcripts when chat onboarding completes |

**RLS:** Users own their rows. Public read on `context_sections` where `is_public = true`.

**RPC:** `delete_own_account()` — cascaded account deletion from settings.

---

## AI pipeline

All prompts (except landing) live in **`src/lib/meto-prompts.ts`**. Landing prompt is inline in **`src/app/api/landing-chat/route.ts`**.

| Step | Prompt / function | Used when |
|------|-------------------|-----------|
| Landing chat | `LANDING_CHAT_SYSTEM_PROMPT` | `/api/landing-chat` |
| Brain dump extract | 1A `BRAIN_DUMP_PROMPT` | `/api/onboarding/brain-dump` |
| Chat interview | 1B `CHAT_SYSTEM_PROMPT` | `/api/onboarding/chat` |
| Chat extract | 1C `EXTRACT_FROM_CHAT_PROMPT` | `/api/onboarding/finish-chat` |
| Master compile | 1E `buildMasterCompilerPrompt()` | compile step 1 |
| Format-specific | 2A–2D `buildFormatPrompt()` | compile step 2 |
| Context score | `buildContextScorePrompt()` | `/api/profile/context-score` |
| Quick update | `buildUpdateContextPrompt()` | update-chat (normal) |
| Gap fix single | `buildGapFixUpdatePrompt()` | update-chat (gapFix) |
| Gap fix all | `buildGapFixAllUpdatePrompt()` | update-chat (gapFix mode=all) |
| Apply review | `buildUpdateApplyReviewPrompt()` | update-chat (apply) |
| Ripple review | `buildRippleSectionReviewPrompt()` | update-chat (apply) |

**Full behavior doc:** **`docs/AI_SYSTEM.md`**

**LLM client:** `src/lib/llm.ts` (re-exported from `src/lib/gemini.ts`)

- Provider: DeepSeek (primary), Gemini fallback via `GEMINI_API_KEY`
- Models: `DEEPSEEK_MODEL` → `deepseek-v4-flash` → …; Gemini chain in `llm.ts`
- Temperatures: see AI_SYSTEM.md (0.25 gap fix → 0.7 chat)
- Retries on 429/503/404; compile falls back to `compile-local.ts`; context score falls back to `analyzeContextScoreLocally()`

**Compile caching:**

- GET returns DB cache if `last_compiled >= latest section updated_at`
- POST skips LLM if cache valid (unless `force: true`)
- Quick update apply always uses `compileLocally("universal")`

**Context score caching:**

- GET returns DB row if `analyzed_at >= latest section updated_at`
- POST with `force: true` re-runs analysis
- POST with `fixedSections` removes resolved gaps client-side before save

---

## Environment

Copy `.env.example` → `.env.local` for local dev.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `DEEPSEEK_API_KEY` | Yes* | DeepSeek API key |
| `DEEPSEEK_MODEL` | No | Preferred model (default `deepseek-v4-flash`) |
| `GEMINI_API_KEY` | No | Fallback when DeepSeek fails |
| `GEMINI_MODEL` | No | Preferred Gemini model |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL (OAuth, metadata) |

\*At least one LLM key (DeepSeek or Gemini) required for AI features.

**Production:** Set the same vars in Vercel. Add production URL to Supabase Auth redirect URLs.

---

## Key files (where to edit what)

| Goal | File |
|------|------|
| Rebrand colors/fonts | `src/lib/brand.ts` |
| Change AI behavior | `src/lib/meto-prompts.ts` |
| Landing AI prompt | `src/app/api/landing-chat/route.ts` |
| Context score logic | `src/lib/context-score.ts` |
| Gap fix session/URLs | `src/lib/context-score-actions.ts` |
| Quick update hook | `src/hooks/use-quick-update-chat.ts` |
| LLM model/retry logic | `src/lib/llm.ts` |
| Offline compile templates | `src/lib/compile-local.ts` |
| Client context templates | `src/lib/context-templates.ts` |
| Section save logic | `src/lib/profile-sections.ts` |
| Dashboard home | `src/components/dashboard/dashboard-page-client.tsx` |
| Fixes page | `src/components/dashboard/fixes-page-client.tsx` |
| Quick update UI | `src/components/dashboard/quick-update-chat.tsx` |
| Profile editor | `src/components/dashboard/dashboard-editor.tsx` |
| Portal nav/layout | `src/components/portal/portal-nav.ts`, `portal-layout.tsx` |
| Context score auto-sync | `src/components/portal/portal-context-score-sync.tsx` |
| Workspace / share UI | `src/components/context-share/`, `src/lib/platform-share.ts` |
| Public profile | `src/components/public-profile-view.tsx`, `src/lib/public-context.ts` |
| Onboarding UI | `src/components/onboarding/onboarding-flow.tsx` |
| Auth cookie fix | `src/app/auth/callback/route.ts` |

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

## v2 ideas (not committed)

- Wire section regenerator (1D) per section
- OG images for public profiles
- Onboarding redo without full account reset
- Analytics dashboard

---

## Quick sanity test

1. Landing chat → sign up → save → dashboard loads with partial profile
2. Or: sign up → brain dump or chat onboarding → dashboard
3. Context score appears on dashboard; Fixes always in sidebar (badge when gaps exist)
4. Edit a section → score re-analyzes automatically
5. Fix one gap → save → badge count drops
6. Workspace: pick ChatGPT → copy prompt → paste into ChatGPT
7. Settings: username + public toggle → visit `/profile/username`; verify API URL fetches plain text
8. Google OAuth works in production (Supabase redirect URLs set)

---

## Related docs

| Doc | Contents |
|-----|----------|
| **`docs/system-overview.md`** | Product architecture and user journeys |
| **`docs/AI_SYSTEM.md`** | Every AI flow, prompts, gap fix vs update, storage keys |
