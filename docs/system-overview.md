# Meto — System overview

> What Meto is and how the system works end-to-end.  
> **Production:** https://www.metoai.site (canonical; apex redirects to www)

---

## The problem

Every time you open ChatGPT, Claude, Gemini, or another AI tool, you start from zero. You re-explain who you are, what you do, and how you like to work. That context is valuable — and ephemeral.

## What Meto does

Meto is a **personal AI identity layer**. You describe yourself once. Meto structures that into a persistent profile, compiles it into ready-to-paste context blocks tuned for different AI tools, scores how well AI would understand you, and helps you close gaps — optionally publishing selected parts on a public page.

**Tagline:** Every AI should already know you.

**Landing hero copy** (live in `src/components/landing/landing-hero-copy.tsx`; `src/lib/landing-copy.ts` is unused):

- Eyebrow: *Structured context for every AI*
- Headline: *Never explain yourself twice.*
- Subhead: *Paste your bio or let Meto learn as you work. Give every AI instant memory via link or MCP.*
- Outcome: *One conversation → Universal AI memory*

Meto is **not** a general chat product. It does not replace ChatGPT or Claude. It produces and maintains the context you bring *into* those tools — now including **remote MCP** for Cursor and Claude Desktop.

---

## Core concepts

| Concept | Meaning |
|---------|---------|
| **Profile sections** | Structured facts about you (`about`, `work`, `projects`, `skills`, `goals`, `working_style`, `context_for_ai`, plus custom sections). Stored in Postgres, editable anytime. |
| **Compiled context** | A single block of text optimized for pasting into an AI chat or custom instructions field. |
| **Format** | How compiled text is written — Universal, Claude, ChatGPT, Gemini, DeepSeek, Grok, Kimi, Qwen (8 platform tabs in Workspace). |
| **Context score** | 0–100 rating + headline + summary + actionable **gaps**. Re-analyzed on login and after profile edits when the user has LLM quota; otherwise a local heuristic runs on Free. |
| **Gap fix** | Short AI micro-interview targeting one known gap — faster than full onboarding. |
| **Quick update** | Free-form chat on Updates to reflect life/work changes across sections; optional document upload for fact extraction. |
| **Workspace** | Two-column UI: platform tabs + section grid (left); copy prompt, preview, scenario (right). |
| **Public profile** | Branded page at `/profile/{username}`; AI tools fetch plain text from `/api/public/profile/{username}/context`. |
| **Entitlements** | Plan-aware feature flags and AI quotas — trial, Free, or Pro (`src/lib/entitlements.ts`). |
| **Bootstrap** | `GET /api/profile/bootstrap` — single portal load for profile, sections, score, and entitlements. |
| **MCP handoff** | Remote server at `/api/mcp/{username}` — Bearer token auth, `profile://` resources, `update_meto_profile` tool. Workspace Quick Connect card generates Cursor/Claude configs. |

---

## Plans & billing

New accounts start on a **3-day trial** with Pro-feature access and **50 total AI actions** for the trial window (not monthly).

| Plan | Price | AI actions | What you get |
|------|-------|------------|--------------|
| **Trial** | Free for 3 days | 50 total | Gap fix, quick update, LLM score, LLM compile, onboarding AI (one path per account) |
| **Free** | $0 | 0 | Manual section editing, local/heuristic score, local compile, workspace copy, public profile, 1 custom section |
| **Pro** | $10/mo (Polar) | 600/month | Everything in trial features ongoing; up to 5 custom sections |

**Upgrade path:** `/pricing` or in-app upgrade gates → `POST /api/billing/checkout` (Polar) → `/billing/success` → `POST /api/billing/sync` → dashboard.

**Billing stack:** Polar.sh checkout, webhooks (`POST /api/billing/webhook`), subscription sync. Trial expiry cron: `GET /api/cron/trial-expiry` (Bearer `CRON_SECRET`). Optional `METO_GRANDFATHER_PRO=true` bypasses limits for internal accounts.

**Gated AI features** (require trial/Pro with remaining quota): gap fix, quick update, LLM context score, LLM compile, onboarding brain-dump/chat. Free users still get deterministic local compile and heuristic scoring.

---

## User journeys

### Try before signup (landing chat)

```
Landing chat → Sign up (if needed) → Save 4 sections → Dashboard
```

Visitors chat with Meto on `/` before or after auth. The AI asks one question at a time (SSE streaming) and incrementally fills `about`, `work`, `projects`, and `goals`. When ready, the user saves → `POST /api/onboarding/save-from-landing` → redirect to dashboard.

Session state: `localStorage` key `meto_landing_session`. See **`docs/AI_SYSTEM.md`** for prompt behavior.

### New user (full onboarding)

```
Landing → Sign up → Onboarding → Dashboard → Copy context → Paste into any AI
```

**Onboarding paths** (`/onboarding`):

1. **Brain dump** — paste everything; LLM extracts JSON → 7 sections (requires AI quota; one onboarding AI path per account)
2. **Chat** — short interview; when done, LLM extracts JSON → sections
3. **Skip** — empty starter section; fill manually on dashboard

If the user has no sections, `/dashboard` redirects to `/onboarding`.

Signup can carry `?plan=pro` → Polar checkout after account creation.

### Returning user

```
Login → Dashboard (context score + section quality) → Profile / Workspace / Updates / Fixes
```

- **Profile** — edit all sections with tiered layout and public toggles
- **Workspace** — MCP Quick Connect (token, Cursor/Claude config) + pick platform, sections, scenario; copy prompt or formatted text
- **Updates** — describe changes in plain language; attach documents (PDF, DOCX, TXT, MD, CSV, RTF); AI proposes section updates
- **Fixes** — always in sidebar; badge shows open gaps; fix one or fix all with targeted AI questions
- **Settings** — display name, username, password, theme, plan usage, delete account

Context score **re-analyzes on login** and whenever profile data refreshes after edits (`PortalContextScoreSync`), using LLM when `canUseLlmScore` or local analysis on Free.

### Close a gap (fix with AI)

```
Dashboard or Fixes → Fix with AI → Quick update (gap mode) → Save → Score re-analyzes
```

Context score identifies weak sections. **Fix single** runs a 1–3 question interview for one gap. **Fix all** walks the high-impact queue one section at a time. Updates merge into profile sections and trigger local recompile.

Requires trial/Pro with remaining AI quota.

### Document-assisted update

```
Updates → Attach file(s) → POST /api/profile/update-chat/ingest → facts merged into chat → Save
```

Up to 3 files, 5 MB each. PDF and DOCX parsed server-side; facts feed into the quick-update chat context.

### Public sharing

```
Settings: claim username → Profile/Workspace: toggle section public → /profile/username
```

Visitors see a branded public page. AI fetch tools should use:

```
/api/public/profile/{username}/context?preset=all&format=universal
```

Also available:

- `/profile/{username}/context` — plain-text rewrite to the API handler
- `/.well-known/ai-profile/{username}` — structured JSON for agents
- `/llms.txt` — LLM discovery doc with canonical URLs

Bot user-agents hitting `/profile/{username}` are rewritten to plain-text context. No login required.

### MCP connection (Cursor / Claude)

```
Settings: claim username → Workspace: Generate MCP token → Copy Cursor or Claude config → Restart client
```

- Endpoint: `{SITE_URL}/api/mcp/{username}` (Streamable HTTP; Bearer `meto_mcp_*` token)
- Resources: `profile://handoff`, `profile://{section}`
- Tool: `update_meto_profile({ new_fact })`
- Health: `profiles.mcp_last_used_at` shown in Workspace interop panel

### Upgrade to Pro

```
Trial ends or hit quota → Upgrade modal /pricing → Polar checkout → /billing/success → sync → Pro features
```

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js App     │────▶│  Supabase   │
│  (React)    │◀────│  Router + API    │◀────│  Auth + DB  │
└──────┬──────┘     └────────┬─────────┘     └─────────────┘
       │                     │
       │ PostHog (client)    ├──────────────────┐
       │                     ▼                  ▼
       │            ┌──────────────────┐  ┌───────────┐
       │            │ DeepSeek (1st)   │  │ Polar.sh  │
       │            │ Gemini (fallback)│  │ webhooks  │
       │            │ onboarding,      │  └───────────┘
       │            │ compile, score,  │
       │            │ update, gap fix  │
       │            └──────────────────┘
       └────────────────────────────────────────────────────
```

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 App Router, React 18, Tailwind CSS, Geist fonts, Lucide icons, Recharts |
| Theming | `next-themes` (light / dark / system) |
| Backend | Next.js Route Handlers (API routes), Server Components |
| Auth & DB | Supabase (Postgres + Auth + RLS); service role for webhooks and admin |
| AI | DeepSeek primary, Gemini fallback (`src/lib/llm.ts`) |
| Billing | Polar.sh (`@polar-sh/sdk`) |
| Analytics | PostHog (`posthog-js`, optional via `NEXT_PUBLIC_POSTHOG_KEY`) |
| Documents | `pdf-parse`, `mammoth` (update-chat ingest) |
| Rate limiting | In-memory + optional Upstash Redis |
| Hosting | Vercel |

Session handling: `@supabase/ssr` with middleware refresh (`src/middleware.ts`).

---

## Routes (summary)

### Public

| Path | Purpose |
|------|---------|
| `/` | Landing + try chat |
| `/auth/login`, `/auth/signup`, `/auth/callback` | Auth |
| `/pricing` | Plan comparison |
| `/terms`, `/privacy`, `/cookies` | Legal |
| `/blog` | Placeholder |
| `/profile/[username]` | Public profile UI |
| `/profile/[username]/context` | Plain-text context |
| `/.well-known/ai-profile/[username]` | Agent JSON |
| `/llms.txt` | LLM discovery |

### Protected portal

| Path | Purpose |
|------|---------|
| `/onboarding` | Brain dump, chat, or skip |
| `/dashboard` | Context score, section quality, shortcuts |
| `/dashboard/profile` | Full section editor |
| `/dashboard/workspace` | Copy builder |
| `/dashboard/update` | Quick update + gap-fix + document ingest |
| `/dashboard/fixes` | Gap list; fix single / fix all |
| `/settings` | Account, username, theme, plan, delete |
| `/billing/success` | Post-checkout activation |

**Redirects:** no session → `/auth/login`; no sections → `/onboarding`.

### Admin (internal)

| Path | Purpose |
|------|---------|
| `/admin` | Overview stats |
| `/admin/users`, `/admin/users/[id]` | User management |
| `/admin/billing` | Billing overview |
| `/admin/analytics` | Signups, plans, scores, AI usage charts |

Access: `METO_ADMIN_EMAILS` allowlist and/or `admin_users` table. Non-admins redirect to `/dashboard`.

Full route and API tables → **`docs/v1-internal.md`**.

---

## Data model (logical)

```
auth.users
    └── profiles (1:1)
            ├── context_sections (1:many)
            ├── compiled_profiles (1:many, one row per format)
            ├── context_scores (1:1, latest analysis)
            └── onboarding_chats (1:many, optional history)

admin_users — admin portal allowlist (optional)
```

**`context_sections`** — source of truth for profile content. Public read where `is_public = true`.

**`compiled_profiles`** — derived cache. Invalidated when any section's `updated_at` is newer than `last_compiled`.

**`context_scores`** — cached score, headline, summary, gaps array, and `resolved_sections` (gap-fix progress). Invalidated when sections change.

**`profiles`** — identity metadata (`username`, `display_name`) plus billing: `plan`, `trial_ends_at`, `onboarding_ai_used`, `polar_customer_id`, `polar_subscription_id`, `ai_calls_used`, `ai_usage_period_start`.

AI usage is tracked on **`profiles`**, not a separate table.

---

## AI flows (summary)

| Flow | Trigger | Output | Plan gate |
|------|---------|--------|-----------|
| Landing chat | `/` conversation | 4 partial sections → save on signup | None (pre-auth) |
| Onboarding extract | Brain dump or chat finish | 7 sections in DB | Trial/Pro + quota; one path per account |
| Context score | Portal load + after profile refresh | Score + gaps in `context_scores` | LLM if quota; else local heuristic |
| Quick update | `/dashboard/update` | Proposed section merges → user saves | Trial/Pro + quota |
| Document ingest | File upload on Updates | Extracted facts → update chat | Trial/Pro + quota |
| Gap fix | Fix button on gap | 1–3 targeted questions → section update | Trial/Pro + quota |
| Compile | Regenerate or stale cache | Formatted block in `compiled_profiles` | LLM if quota; else `compile-local.ts` |

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
   LLM (if canUseLlmScore) or analyzeContextScoreLocally()
        │
        ▼
   { score, headline, gaps[] }
        │
        ▼
   Upsert context_scores
```

### Quick update / gap fix

```
User message(s) [+ optional ingested document facts]
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

If the LLM fails or the user is on Free, **`compile-local.ts`** builds a deterministic template from section titles and content.

---

## Dashboard structure

| Route | Purpose |
|-------|---------|
| `/dashboard` | Context score signal, section quality bars, workspace shortcuts |
| `/dashboard/profile` | Full section editor with tiered layout |
| `/dashboard/workspace` | Two-column copy builder: platform tabs, 3-col section grid, preview + scenario |
| `/dashboard/update` | Quick update chat, gap-fix mode, document attachments |
| `/dashboard/fixes` | Gap list (always in nav); fix-all CTA; dynamic badge |
| `/settings` | Account, username, theme, plan usage, delete account |

Navigation: collapsible sidebar (desktop) + bottom tab bar (mobile). Fixes lives in secondary nav with a live gap badge.

---

## Security model

- **Authentication:** Supabase Auth (email + Google). Protected pages require a valid session.
- **Authorization:** Row Level Security — users read/write only their own data.
- **Public data:** Only sections with `is_public = true` are readable anonymously (via RLS + public profile page query).
- **Secrets:** `DEEPSEEK_API_KEY`, `GEMINI_API_KEY`, `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, and `CRON_SECRET` are server-only. Supabase anon key is public (RLS enforces access).
- **Admin:** Service-role Supabase client on admin API routes; session checked against admin allowlist.
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
| Billing webhooks | Polar → API route (service role) | — |
| Product analytics | — | PostHog (lazy-loaded after hydration) |
| Admin operations | API routes + service role | Admin UI |

---

## External dependencies

| Service | Role |
|---------|------|
| **Supabase** | Users, sessions, Postgres, RLS |
| **DeepSeek** | Primary LLM (onboarding, compile, score, updates) |
| **Google Gemini** | Fallback LLM; PDF fact extraction fallback |
| **Polar.sh** | Pro subscriptions, checkout, webhooks |
| **PostHog** | Optional product analytics |
| **Upstash Redis** | Optional distributed rate limits |
| **Vercel** | Build, deploy, env vars, cron |
| **GitHub** | Source control; Vercel watches `main` |

---

## Product boundary

**Meto owns:** structured profile storage, AI-assisted extraction/compilation (when subscribed or on trial), context scoring, gap detection and fixes, quick updates, document-assisted updates, copy UX, optional public page, billing and entitlements.

**Meto does not own:** the conversation inside ChatGPT/Claude/Gemini, model selection in those tools, or long-term memory inside third-party AI products.

The compiled block is the handoff artifact — designed to be pasted once at the start of a session or saved in each tool's custom instructions field. Free users can still build and maintain a profile manually and copy locally compiled context without paid AI.

---

## Related docs

| Doc | Contents |
|-----|----------|
| **`docs/PROJECT_CONTEXT.md`** | Full codebase context for AI assistants — glossary, stack, env vars, file map |
| **`docs/AI_SYSTEM.md`** | Deep dive: every AI flow, prompts, gap fix vs update, storage keys |
| **`docs/v1-internal.md`** | Routes, API table, env vars, scope checklist, local dev |
