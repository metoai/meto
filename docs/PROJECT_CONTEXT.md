# Meto — Complete Project Context

> **Purpose of this document:** Upload this file to any AI assistant (ChatGPT, Claude, Gemini, Cursor, etc.) to give full context about the Meto codebase, product, and architecture.  
> **Product:** Meto — personal AI identity layer  
> **Production URL:** https://www.metoai.site (canonical; apex redirects to www)  
> **Repository:** https://github.com/metoai/meto  
> **Stack:** Next.js 16 (App Router) · React 18 · TypeScript · Tailwind CSS · Supabase · DeepSeek/Gemini · Vercel · Polar (billing) · MCP (`mcp-handler`, `@modelcontextprotocol/sdk`)

---

## 1. Elevator pitch

**Meto helps people stop re-introducing themselves to every AI.**

Users describe who they are once. Meto structures that into a persistent **profile** made of editable **sections**, compiles it into portable context, scores how well an AI would understand them (**context score**), and suggests **gaps** to fix with short AI-guided interviews. Optional **public profile** pages let others (or other AIs) read selected public sections. Meto now supports **remote MCP handoff** so compatible clients (e.g., Cursor / Claude setup via `mcp-remote`) can fetch context directly instead of manual copy/paste.

Meto is **not** a chatbot product. It does not replace ChatGPT or Claude. It produces and maintains the context users paste *into* those tools.

**Tagline:** Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, ChatGPT, or Gemini.

---

## 2. The problem Meto solves

Every time someone opens a new AI tool, they start from zero: role, projects, preferences, goals. That context is valuable and usually lost between sessions and products.

Meto centralizes that identity as structured data, keeps it up to date, and exports it in formats each AI understands.

---

## 3. Core concepts (glossary)

| Term | Definition |
|------|------------|
| **Profile** | One per authenticated user (`profiles` table). Holds username, display name, billing plan, etc. |
| **Context section** | A structured piece of the user's identity: title + markdown-like content + `section_type` + `is_public`. Source of truth. |
| **Core section types** | `about`, `work`, `projects`, `skills`, `goals` — weighted heavily in context score. |
| **Full section set (onboarding)** | Seven types: above plus `working_style`, `context_for_ai`. |
| **Custom sections** | User-created sections with arbitrary `section_type` / title. Appended when compiling. |
| **Compiled context** | Derived text block optimized for pasting into an AI. Cached per user per **format**. |
| **Format** | `universal`, `claude`, `chatgpt`, `gemini`, `deepseek`, `grok`, `kimi`, `qwen` — workspace platform tabs + compile templates. |
| **Context score** | 0–100 rating + headline + summary + **gaps** (weak/missing sections). Cached in `context_scores`. Re-analyzed on login and after profile edits. |
| **Gap** | Actionable weakness detected by scoring (e.g. thin `projects`, missing `goals`). Badge count = live `contextScore.gaps.length` (resolved sections filtered out). |
| **Gap fix** | Short AI interview (1–3 questions) targeting one gap or a queued “fix all” flow. |
| **Quick update** | Free-form chat on dashboard; AI proposes merges across sections; user confirms save. |
| **Landing chat** | Pre-auth try flow on `/`; collects partial profile (`about`, `work`, `projects`, `goals`) before signup. Hero includes proof cards, compact chat widget, and numbered step map (Chat → Build → Share). |
| **Workspace** | MCP Quick Connect card (recommended) + two-column copy builder: **left** — platform tabs (Paste into) + section grid (3 columns) with public toggles; **right** — copy prompt + text preview, then scenario presets. |
| **MCP handoff** | Remote server at `/api/mcp/{username}` (Bearer `profiles.mcp_access_token`). Resources: `profile://{section}`, `profile://handoff`. Tool: `update_meto_profile`. Cursor uses streamable HTTP; Claude Desktop uses `mcp-remote` config from workspace. Requires username before token generation. |
| **MCP access API** | `GET/POST/DELETE /api/profile/mcp-access` — token lifecycle + Cursor/Claude JSON config snippets; updates `mcp_last_used_at` on successful MCP calls. |
| **Public profile** | `https://www.metoai.site/profile/[username]` — branded page; only `is_public` sections. AI fetchers get plain text via `/api/public/profile/[username]/context`. |
| **Bootstrap API** | `GET /api/profile/bootstrap` — single request loads portal data (profile, sections, score, entitlements). |

---

## 4. Technology stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 18, Tailwind CSS 3, Geist fonts, Lucide icons |
| Charts | Recharts (dashboard sparkline) |
| Theming | Custom `ThemeProvider` (`src/components/theme-provider.tsx`), CSS variables in `src/app/globals.css` |
| MCP | `mcp-handler` + `@modelcontextprotocol/sdk` — Streamable HTTP + SSE at `/api/mcp/[username]/[[...path]]` |
| Auth & DB | Supabase (Postgres, Auth, Row Level Security) |
| AI (server-only) | DeepSeek primary (`DEEPSEEK_API_KEY`), Google Gemini fallback (`GEMINI_API_KEY`) via `src/lib/llm.ts` |
| Billing | Polar.sh (`@polar-sh/sdk`) — checkout, webhooks, subscription sync; custom fetcher in `src/lib/polar.ts` for Node 24 / Next.js compatibility |
| Rate limiting | In-memory + optional Upstash Redis (`src/lib/rate-limit.ts`) |
| Hosting | Vercel (deploys from `main`) |

**Important:** API keys never ship to the browser. All LLM calls run in Next.js Route Handlers.

---

## 5. High-level architecture

```
┌──────────────┐     ┌─────────────────────────┐     ┌─────────────────┐
│   Browser    │────▶│  Next.js 16 App Router  │────▶│    Supabase     │
│  (React)     │◀────│  Pages + API routes     │◀────│  Auth + Postgres│
└──────────────┘     └───────────┬─────────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              DeepSeek LLM   Gemini LLM   Polar webhooks
              (primary)      (fallback)   (billing)
```

**Session flow:** `@supabase/ssr` with middleware (`src/middleware.ts`) refreshes auth cookies on each request.

**Data flow principle:** `context_sections` is the source of truth. `compiled_profiles` and `context_scores` are derived caches invalidated when sections change.

---

## 6. Repository structure

```
meto/
├── docs/
│   ├── PROJECT_CONTEXT.md      ← this file (AI onboarding)
│   ├── system-overview.md      ← product + journeys
│   ├── AI_SYSTEM.md            ← every AI flow, prompts, caching
│   └── v1-internal.md          ← routes, API table, env, file map
├── public/brand/               ← logo SVGs
├── src/
│   ├── app/                    ← Next.js App Router
│   │   ├── page.tsx            ← landing + try chat
│   │   ├── layout.tsx          ← root layout, ThemeProvider
│   │   ├── globals.css         ← design tokens, brand-spot, brand-surface
│   │   ├── auth/               ← login, signup, callback
│   │   ├── (protected)/        ← requires login
│   │   │   ├── onboarding/
│   │   │   ├── (portal)/       ← dashboard, settings, workspace, etc.
│   │   │   └── billing/
│   │   ├── profile/[username]/ ← public profile
│   │   └── api/                ← Route Handlers (backend)
│   │       └── mcp/[username]/[[...path]]/  ← remote MCP (per-user)
│   ├── components/
│   │   ├── dashboard/          ← editor, score UI, quick update
│   │   ├── portal/             ← sidebar layout, settings panel
│   │   ├── context-share/      ← workspace copy builder, MCP quick connect (`mcp-quick-connect-card.tsx`)
│   │   ├── onboarding/
│   │   ├── marketing/
│   │   ├── billing/
│   │   └── auth/
│   ├── hooks/                  ← use-context-score, use-quick-update-chat
│   └── lib/                    ← business logic, prompts, LLM, Supabase helpers
├── supabase/migrations/        ← SQL schema, RLS, billing, security
├── .env.example
├── package.json
└── tailwind.config.ts
```

---

## 7. User journeys

### 7.1 Try before signup (landing)

1. Visitor opens `/` — hero with proof cards (Without/With Meto), **Get started free** CTA, and compact try-chat widget.
2. Hero copy emphasizes **Universal AI memory** via link or MCP; chat collects profile before signup.
3. AI asks one question at a time; client merges `collected` fields (`about`, `work`, `projects`, `goals`).
4. When ready, user signs up → `POST /api/onboarding/save-from-landing` → dashboard.
5. Client storage: `meto_landing_session`, `meto_landing_pending_save` (localStorage).

**Planned (not shipped):** separate `/developers` landing + split onboarding for dev vs consumer audiences.

### 7.2 Full onboarding (post-auth)

Route: `/onboarding` (redirect from `/dashboard` if no sections).

| Path | Behavior |
|------|----------|
| **Brain dump** | Paste text → LLM extracts JSON → 7 sections in DB |
| **Chat** | Interview → `PROFILE_READY` → extract JSON → sections |
| **Skip** | Empty starter section; fill manually on profile page |

### 7.3 Returning user (portal)

| Route | Purpose |
|-------|---------|
| `/dashboard` | Context score hero, section quality bars, fixes CTA, workspace shortcut |
| `/dashboard/profile` | Full section editor (tiered layout, public toggles) |
| `/dashboard/workspace` | Scenario presets, section picker, copy formatted text or profile link |
| `/dashboard/update` | Quick update chat; also hosts **gap-fix** mode via query params |
| `/dashboard/fixes` | Gap list sorted by impact; fix one or fix all with AI. **Always visible** in sidebar; badge shows open gap count (0 = no badge). |
| `/settings` | Email (read-only), display name, username, password, appearance (theme), delete account |

### 7.4 Public sharing & MCP

1. Claim `username` in **Settings** (required before MCP token generation).
2. Toggle `is_public` per section in Profile or Workspace section grid.
3. **Workspace → MCP Quick Connect (recommended):**
   - Generate/rotate `profiles.mcp_access_token`
   - Endpoint: `{SITE_URL}/api/mcp/{username}` (Streamable HTTP POST at root path)
   - Copy Cursor config (`streamable_http` + Bearer header) or Claude Desktop config (`mcp-remote`)
   - Interop health shows last MCP sync via `profiles.mcp_last_used_at`
4. **MCP resources:** `profile://handoff` (compiled + raw bundle), `profile://{section}` per section type.
5. **MCP tool:** `update_meto_profile({ new_fact })` — LLM merges fact into sections, rebuilds compile cache.
6. **Workspace fallback** — for tools without MCP: copy platform-specific prompt (ChatGPT/Gemini) or public API link.
7. Public page: `www.metoai.site/profile/{username}`; AI fetch: `/api/public/profile/{username}/context?preset=all&format=universal`.
8. Middleware rewrites AI bot requests on `/profile/{username}` to the API context endpoint.

**MCP route:** `src/app/api/mcp/[username]/[[...path]]/route.ts` — optional catch-all supports `/sse` and `/message` fallbacks. Transport paths must match client URL (do not use `basePath` suffix `/mcp` when clients POST to `/api/mcp/{username}`).

### 7.5 Close a gap

Dashboard or Fixes → “Fix with AI” → quick-update chat in gap mode → user saves → score re-analyzes.

---

## 8. Routes and pages

| Path | Auth | Description |
|------|------|-------------|
| `/` | Public | Landing page + interactive try chat |
| `/auth/login`, `/auth/signup` | Public | Email/password + Google OAuth |
| `/auth/callback` | — | OAuth redirect handler |
| `/pricing` | Public | Pricing / upgrade |
| `/blog` | Public | Marketing blog placeholder |
| `/onboarding` | Protected | First-time profile creation |
| `/dashboard` | Protected | Home dashboard |
| `/dashboard/profile` | Protected | Section editor |
| `/dashboard/workspace` | Protected | MCP Quick Connect + copy builder |
| `/dashboard/update` | Protected | Quick update + gap fix chat |
| `/dashboard/fixes` | Protected | Score gaps |
| `/settings` | Protected | Account settings |
| `/billing/success` | Protected | Post-checkout |
| `/profile/[username]` | Public | Branded public profile page |
| `/profile/[username]/context` | Public | Plain-text context (rewrites to API) |
| `/api/public/profile/[username]/context` | Public | Plain-text / JSON context for AI fetch tools |
| `/.well-known/ai-profile/[username]` | Public | Machine-readable profile JSON |
| `/llms.txt` | Public | LLM discovery hints |

Protected routes live under `src/app/(protected)/`. Portal UI uses `PortalLayout` (sidebar + mobile header).

---

## 9. API reference

All routes are under `src/app/api/`. Unless noted, routes require a valid Supabase session.

### Onboarding & landing

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/landing-chat` | Pre-auth chat (supports SSE streaming) |
| POST | `/api/onboarding/save-from-landing` | Persist landing collected sections |
| POST | `/api/onboarding/brain-dump` | Raw text → LLM → insert sections |
| POST | `/api/onboarding/chat` | Onboarding interview turn |
| POST | `/api/onboarding/finish-chat` | Chat history → extract → sections |
| POST | `/api/onboarding/skip` | Create empty starter section |

### Profile & sections

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/profile/bootstrap` | Portal bundle: profile, sections, score, entitlements |
| GET/POST | `/api/profile/sections` | List / create sections |
| PATCH/DELETE | `/api/profile/sections/[id]` | Update (incl. `is_public`) / delete |
| GET | `/api/profile/me` | Profile + email |
| PATCH | `/api/profile/me` | Update display name, username, password |
| GET/POST/DELETE | `/api/profile/mcp-access` | Read/generate/revoke MCP token + client config snippets |
| DELETE | `/api/profile/account` | Delete account (RPC) |
| POST | `/api/profile/reset` | Wipe sections & caches → onboarding |

### AI features

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/profile/compile?format=` | Cached compiled text; POST regenerates |
| GET/POST | `/api/profile/context-score` | Cached score; POST re-analyzes |
| POST | `/api/profile/update-chat` | Quick update, gap fix, apply with review |

### Public & billing

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/public/profile/[username]/context` | Public plain-text / JSON context (CORS, AI-optimized) |
| GET/POST/DELETE | `/api/mcp/[username]` (+ `/sse`, `/message`) | Remote MCP endpoint (Streamable HTTP + SSE, Bearer auth) |
| GET | `/api/public-profile/[username]` | Public profile JSON |
| GET | `/api/profile/entitlements` | Plan limits (trial/free/pro) |
| POST | `/api/billing/checkout` | Polar checkout session |
| POST | `/api/billing/sync` | Sync subscription after payment |
| POST | `/api/billing/webhook` | Polar webhook (service role) |
| GET | `/api/cron/trial-expiry` | Cron: expire trials (`CRON_SECRET`) |

---

## 10. Database (Supabase Postgres)

### Main tables

| Table | Role |
|-------|------|
| `profiles` | 1:1 with `auth.users` — `username`, `display_name`, `plan`, `trial_ends_at`, Polar IDs, `mcp_access_token`, `mcp_last_used_at` |
| `context_sections` | Profile content — `section_type`, `title`, `content`, `is_public`, `updated_at` |
| `compiled_profiles` | Cached compile output — unique `(user_id, format)` |
| `context_scores` | Latest `score`, `headline`, `summary`, `gaps` (jsonb), `analyzed_at` |
| `onboarding_chats` | Optional stored transcripts |
| `ai_usage` | Per-user AI call tracking for plan limits |

### Plans (`profiles.plan`)

- `trial` — time-limited (default ~3 days from signup)
- `free` — limited AI usage
- `pro` — paid via Polar

### Security

- **RLS:** Users read/write only their own rows.
- **Public read:** Anonymous users can read `context_sections` where `is_public = true` (for public profile).
- **Service role:** Webhooks and admin operations only on server.
- **RPC:** `delete_own_account()` for settings delete.

Migrations live in `supabase/migrations/`.

---

## 11. AI system (summary)

**Single prompt file (mostly):** `src/lib/meto-prompts.ts`  
**Landing prompt:** inline in `src/app/api/landing-chat/route.ts`  
**LLM entry:** `generateWithGemini()` in `src/lib/gemini.ts` → `generateText()` in `src/lib/llm.ts`

### Provider chain

1. DeepSeek if `DEEPSEEK_API_KEY` set (models: `DEEPSEEK_MODEL` → `deepseek-v4-flash` → …)
2. Gemini fallback if DeepSeek fails (`GEMINI_API_KEY`)

### AI flows

| Flow | Trigger | Output |
|------|---------|--------|
| Landing chat | `/` conversation | Partial sections + `profile_ready` |
| Brain dump | Onboarding paste | 7 sections JSON → DB |
| Onboarding chat | Interview | Extract on finish → DB |
| Context score | Portal load + after profile changes (`PortalContextScoreSync`) | Score + gaps → `context_scores` |
| Quick update | `/dashboard/update` | Proposed section updates → user saves |
| Gap fix | Fix buttons | Targeted questions → one section at a time |
| Compile | Workspace / regenerate | Master compile → format-specific text → cache |

### Principles

1. AI runs **only on the server**.
2. Structured JSON responses; human confirms before DB writes on updates.
3. **Scope guard** (`METO_SCOPE_GUARD`): models must not act as general assistants.
4. **Fallbacks:** `compile-local.ts` (deterministic compile), `analyzeContextScoreLocally()` if LLM fails.
5. **Caching:** Compile and score skip LLM if DB cache is newer than latest section `updated_at`.
6. **Streaming:** Chat routes can stream plain text via SSE (`src/lib/sse.ts`, `stream-chat-server.ts`) for responsive UI.

**Deep dive:** `docs/AI_SYSTEM.md`

---

## 12. Authentication

- Supabase Auth: email/password and Google OAuth.
- Middleware refreshes session (`src/middleware.ts`).
- `(protected)` layout redirects unauthenticated users to `/auth/login`.
- OAuth callback: `src/app/auth/callback/route.ts`.

---

## 13. Billing (Polar)

- Checkout: `POST /api/billing/checkout` (Node.js runtime; detailed dev errors for invalid/expired `POLAR_ACCESS_TOKEN`)
- `src/lib/polar.ts` uses custom HTTP fetcher to avoid Next.js/Node 24 `expected non-null body source` crashes on Polar 401s
- Webhook updates `profiles.plan`, Polar customer/subscription IDs
- Entitlements gate AI routes (`src/lib/ai-usage.ts`, `src/lib/billing-client.ts`)
- Optional `METO_GRANDFATHER_PRO=true` treats all users as Pro
- Trial expiry cron: `/api/cron/trial-expiry`
- **Ops note:** Sandbox and production Polar tokens/products are separate; `POLAR_SERVER` must match token origin

---

## 14. UI, branding, and dark mode

### Design tokens

- **Source of truth for colors:** `src/lib/brand.ts` (light + `brandDark` palette; sync with `globals.css`).
- **CSS variables:** `:root` and `.dark` in `src/app/globals.css` (`--bg`, `--card`, `--primary`, etc.).
- **Tailwind:** `brand-*` colors map to CSS vars in `tailwind.config.ts`.

### Brand utilities (CSS classes)

| Class | Use |
|-------|-----|
| `.brand-spot` | **Localized** grid + soft orange glow inside a hero component only (landing chat, workspace banner). Not full-page. |
| `.brand-surface` | Featured components: subtle border + lift in dark mode (chat shells, auth card). |
| Regular cards | Standard `--card` / `--border` without pattern. |

### Theme

- `ThemeProvider` (`src/components/theme-provider.tsx`) — light / dark / system (replaces `next-themes` script-injection warning)
- Toggle in marketing nav, portal sidebar, settings → Appearance.

---

## 15. Key client storage keys

| Key | Purpose |
|-----|---------|
| `meto_landing_session` | Landing chat state |
| `meto_landing_pending_save` | Save after auth flag |
| `meto-sidebar-collapsed` | Portal sidebar state |
| Context score sparkline | localStorage via score history helpers |

---

## 16. Environment variables

Copy `.env.example` → `.env.local`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Webhooks, admin |
| `DEEPSEEK_API_KEY` | Yes* | Primary LLM |
| `DEEPSEEK_MODEL` | No | Default `deepseek-v4-flash` |
| `GEMINI_API_KEY` | No | Fallback LLM |
| `GEMINI_MODEL` | No | Default `gemini-2.5-flash` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL (OAuth, metadata) |
| `POLAR_*` | Billing | Access token, webhook secret, product ID, server mode |
| `UPSTASH_REDIS_*` | No | Distributed rate limits |
| `CRON_SECRET` | No | Trial expiry cron |
| `METO_GRANDFATHER_PRO` | No | Bypass plan limits |

\*At least one of DeepSeek or Gemini required for AI features.

---

## 17. Deployment and development

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev                  # http://localhost:3000
npm run build
npm start
```

- **Production:** Vercel, branch `main`, auto-deploy from GitHub `metoai/meto`.
- **Supabase:** Run migrations via Supabase CLI or dashboard; enable Auth redirect URLs for production domain.

---

## 18. Where to change what (developer map)

| Goal | File(s) |
|------|---------|
| Product copy / tagline | `src/components/landing/landing-hero-copy.tsx`, `src/lib/workspace-content.ts` |
| Landing layout / proof | `src/components/landing/landing-hero-section.tsx`, `landing-hero-proof.tsx` |
| MCP server | `src/app/api/mcp/[username]/[[...path]]/route.ts` |
| MCP client setup UI | `src/components/context-share/mcp-quick-connect-card.tsx`, `src/app/api/profile/mcp-access/route.ts` |
| Rebrand colors | `src/lib/brand.ts` + `src/app/globals.css` |
| AI behavior / prompts | `src/lib/meto-prompts.ts`, landing `src/app/api/landing-chat/route.ts` |
| Context scoring | `src/lib/context-score.ts` |
| Compile templates | `src/lib/compile-local.ts`, compile route |
| Portal navigation | `src/components/portal/portal-nav.ts`, `portal-layout.tsx` |
| Section types | `src/lib/meto-prompts.ts` (`PROFILE_SECTIONS`) |
| Rate limits | `src/lib/rate-limit.ts` |
| Billing logic | `src/lib/polar.ts`, `src/lib/billing-client.ts`, `src/app/api/billing/*` |
| Public profile | `src/components/public-profile-view.tsx`, `src/app/profile/[username]/`, `src/lib/public-context.ts` |
| AI share / workspace | `src/lib/platform-share.ts`, `src/components/context-share/` |
| Context score sync | `src/components/portal/portal-context-score-sync.tsx`, `src/hooks/use-context-score.ts` |

---

## 19. Product boundaries (what Meto is NOT)

- Not a general-purpose AI chat (scope guard redirects off-topic requests).
- Does not run conversations inside ChatGPT/Claude/Gemini.
- Does not store third-party AI chat history.
- Public profile does not use LLM for visitors (local compile only).
- Does not run chats *inside* third-party products; it supplies profile context and update tools over MCP/public URLs.

**Primary handoff path:** MCP endpoint (`/api/mcp/{username}`) with token auth.  
**Fallback handoff artifact:** compiled context block for manual paste/custom instructions.

---

## 20. Related internal documentation

| Document | Contents |
|----------|----------|
| `docs/system-overview.md` | Product narrative, journeys, architecture diagram |
| `docs/AI_SYSTEM.md` | Every AI route, prompt IDs, temperatures, caching, streaming |
| `docs/v1-internal.md` | Shipped v1 scope, full API table, file index |

---

## 21. Instructions for AI assistants working on this codebase

When helping with Meto:

1. **Read this file first** for product and architecture context.
2. **Preserve the core loop:** sections → compile/score → copy to external AI.
3. **Never put API keys in client code** — use Route Handlers only.
4. **Respect RLS** — user data is per-user; public data only when `is_public`.
5. **Prompt changes** belong in `meto-prompts.ts` (or landing route for landing-only behavior).
6. **Prefer CSS variables** for colors; use `.brand-spot` only on hero/feature surfaces, not whole pages.
7. **Human-in-the-loop** for profile updates: propose changes, then user saves.
8. **Check entitlements** when adding new LLM endpoints.
9. **Match existing patterns:** App Router, client components for interactive portal, `fetch` to `/api/*`.

---

*Last updated: July 2026 — Next.js 16, remote MCP server (Cursor/Claude verified), MCP Quick Connect in workspace, landing conversion refresh (proof cards, Universal AI memory copy), Polar checkout hardening, optional catch-all MCP transport routes.*
