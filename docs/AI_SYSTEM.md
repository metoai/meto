# Meto — AI system reference

> **Audience:** builders who need to understand, debug, or extend Meto’s AI behavior.  
> **Last updated:** June 2026 — workspace layout, 8 platform formats, public API context, auto score sync, Fixes always visible.

This document explains **every place AI is invoked**, **what each prompt is trying to accomplish**, **how the client and server coordinate**, and **what happens when models fail**.

---

## Table of contents

1. [Principles](#principles)
2. [Provider chain & configuration](#provider-chain--configuration)
3. [Prompt registry](#prompt-registry)
4. [Landing page chat (pre-auth)](#landing-page-chat-pre-auth)
5. [Onboarding (post-auth)](#onboarding-post-auth)
6. [Context score & gap detection](#context-score--gap-detection)
7. [Fixes page & gap-fix flows](#fixes-page--gap-fix-flows)
8. [Quick update (dashboard)](#quick-update-dashboard)
9. [Profile compile (workspace)](#profile-compile-workspace)
10. [Public profile (no AI)](#public-profile-no-ai)
11. [Client storage keys](#client-storage-keys)
12. [Caching & invalidation](#caching--invalidation)
13. [Fallback behavior](#fallback-behavior)
14. [File index](#file-index)

---

## Principles

1. **AI runs only on the server** — browser components call Route Handlers; API keys never ship to the client.
2. **Prompts live in one place** — `src/lib/meto-prompts.ts` (except landing chat, which has an inline prompt in its route file).
3. **JSON in, JSON out** — chat flows return structured `{ reply, done, updates }` or similar; the client renders `reply` and waits for user confirmation before writing to the DB on apply.
4. **Human-in-the-loop saves** — quick update and gap fix propose `updates`; the user clicks **Save changes** before `apply: true` hits the API.
5. **Deterministic fallbacks** — compile and context score can degrade to local heuristics without blocking the product.
6. **Cross-section awareness** — updates are reviewed for ripple effects (especially `projects` and `goals`) before persisting.

---

## Provider chain & configuration

All LLM calls go through `generateWithGemini()` in `src/lib/gemini.ts`, which re-exports `generateText()` from `src/lib/llm.ts`. The name is historical — it is **not** Gemini-only.

```
generateText(prompt, { temperature })
  │
  ├─► DeepSeek (if DEEPSEEK_API_KEY set)
  │     Models: DEEPSEEK_MODEL → deepseek-v4-flash → deepseek-chat → deepseek-v3
  │
  └─► Gemini (if DeepSeek fails or no DeepSeek key, and GEMINI_API_KEY set)
        Models: GEMINI_MODEL → gemini-2.5-flash → gemini-2.0-flash-lite → …
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `DEEPSEEK_API_KEY` | Yes* | Primary LLM provider |
| `DEEPSEEK_MODEL` | No | Override default model |
| `GEMINI_API_KEY` | No | Fallback provider |
| `GEMINI_MODEL` | No | Override Gemini model |

\*At least one of DeepSeek or Gemini must be configured or all AI routes fail.

### Temperatures by flow

| Flow | Temperature | Why |
|------|-------------|-----|
| Landing chat | 0.7 | Conversational, warm |
| Onboarding chat (1B) | 0.7 | Interview tone |
| Brain dump / extract / apply review | 0.3 | Structured JSON extraction |
| Context score | 0.4 | Analytic but not robotic |
| Quick update (normal) | 0.5 | Balance clarity + natural replies |
| Gap fix (single + all) | 0.25 | Short, precise questions |

---

## Prompt registry

| ID | Function / constant | Route(s) | Purpose |
|----|---------------------|----------|---------|
| — | `LANDING_CHAT_SYSTEM_PROMPT` | `POST /api/landing-chat` | Pre-auth onboarding chat |
| 1A | `BRAIN_DUMP_PROMPT` | `POST /api/onboarding/brain-dump` | Paste → 7 sections |
| 1B | `CHAT_SYSTEM_PROMPT` | `POST /api/onboarding/chat` | Onboarding interview |
| 1C | `EXTRACT_FROM_CHAT_PROMPT` | `POST /api/onboarding/finish-chat` | Chat → 7 sections |
| 1D | *(not wired)* | — | Section regenerator (future) |
| 1E | `buildMasterCompilerPrompt()` | `POST /api/profile/compile` | Master paragraph |
| 2A–2D | `buildFormatPrompt()` | `POST /api/profile/compile` | Tool-specific formatting |
| — | `buildContextScorePrompt()` | `POST /api/profile/context-score` | Score + gaps |
| — | `buildUpdateContextPrompt()` | `POST /api/profile/update-chat` | Quick update chat |
| — | `buildGapFixUpdatePrompt()` | `POST /api/profile/update-chat` | Fix **single** gap |
| — | `buildGapFixAllUpdatePrompt()` | `POST /api/profile/update-chat` | Fix **all** gaps (one at a time) |
| — | `buildUpdateApplyReviewPrompt()` | `POST /api/profile/update-chat` (apply) | Pre-save review |
| — | `buildRippleSectionReviewPrompt()` | `POST /api/profile/update-chat` (apply) | projects/goals consistency |

---

## Landing page chat (pre-auth)

### Purpose

Let visitors **try Meto before signup**. A lightweight interview collects partial profile data; after auth, it is saved as real sections.

### User journey

```
/ (landing)
  │
  ├─ Static opening (client-only, no API):
  │    "Hey — what do you do and what are you working on right now?"
  │
  ├─ User can chat without signing in (try before signup)
  │
  ├─ Each turn: POST /api/landing-chat { messages[], collected }
  │    └─ LLM returns { message, profile_ready, collected }
  │
  ├─ Client merges collected fields (non-null overwrites prior)
  │
  ├─ Save prompt when profile_ready OR ≥3 user messages with content
  │
  ├─ Save requires auth → auth modal if not logged in (pending save in localStorage)
  │
  └─ POST /api/onboarding/save-from-landing { collected }
       └─ Inserts up to 4 sections → redirect /dashboard
```

### What the AI does each turn

**Prompt:** inline in `src/app/api/landing-chat/route.ts`

- Role: warm onboarding assistant, **one question at a time**
- Covers: what they do, what they're building, work style, goals
- After ~3–4 exchanges: sets `profile_ready: true`
- Output JSON:

```json
{
  "message": "conversational reply",
  "profile_ready": false,
  "collected": {
    "about": "first person or null",
    "work": "...",
    "projects": "...",
    "goals": "..."
  }
}
```

**Important:** Landing saves only **4 section types** (`about`, `work`, `projects`, `goals`). Skills, working style, and “For the AI” are filled later via onboarding or dashboard.

### Persistence (client)

| Key | Storage | Purpose |
|-----|---------|---------|
| `meto_landing_session` | localStorage | Messages + collected + sessionId |
| `meto_landing_pending_save` | localStorage | User clicked save before login |
| `meto_landing_pending_message` | localStorage | (legacy) deferred message after OAuth — no longer used |

### Files

- UI: `src/app/page.tsx`, `src/components/landing/landing-chat-ui.tsx`
- Shared types/helpers: `src/lib/landing-chat.ts`
- API: `src/app/api/landing-chat/route.ts`
- Save: `src/app/api/onboarding/save-from-landing/route.ts`

---

## Onboarding (post-auth)

### Path A — Brain dump

```
User pastes text
  → POST /api/onboarding/brain-dump { rawText }
  → Prompt 1A extracts JSON (all 7 section keys)
  → Non-empty sections inserted
  → Redirect /dashboard?ready=1
```

### Path B — Chat interview

```
Client seeds CHAT_OPENING_MESSAGE (not from API):
  "Hey! I'll ask you a few quick questions…"

Each user message:
  → POST /api/onboarding/chat { messages[] }
  → Prompt 1B returns { reply, done }
  → done = true when reply contains "PROFILE_READY" (stripped from display)

When done:
  → POST /api/onboarding/finish-chat { messages[] }
  → Prompt 1C extracts full JSON → insert sections + onboarding_chats row
  → Redirect /dashboard?ready=1
```

### Path C — Skip

```
POST /api/onboarding/skip → empty "about" section → /dashboard
```

### Section keys (7)

`about`, `work`, `projects`, `skills`, `goals`, `working_style`, `context_for_ai`

---

## Context score & gap detection

### Purpose

Answer: *“If I pasted this profile into Claude tomorrow, what would it still get wrong?”*  
This drives the **Dashboard signal**, **Fixes page**, and **gap-fix micro-interviews**.

### Flow

```
GET /api/profile/context-score
  └─ Returns cached row from context_scores if analyzed_at >= latest section update

POST /api/profile/context-score { force?, fixedSections? }
  └─ analyzeContextScore(sections)
       ├─ try LLM (buildContextScorePrompt)
       └─ on failure → analyzeContextScoreLocally()
  └─ applyResolvedSections() if fixedSections provided
  └─ Upsert context_scores table
```

### LLM prompt behavior

**File:** `src/lib/context-score.ts` → `buildContextScorePrompt()`

- Input: all preset sections + custom sections with content and `updated_at`
- Output:

```json
{
  "score": 0-100,
  "headline": "short honest summary",
  "summary": "1-2 sentences",
  "gaps": [
    {
      "section_type": "skills",
      "insight": "what AI would get wrong",
      "fix_label": "Fix this →"
    }
  ]
}
```

- Rules: 2–4 gaps max, ordered by impact, second person, reference actual content, flag stale goals

### Local fallback scoring

When LLM unavailable or no content:

- Weighted score from section length thresholds (40+ chars = full weight)
- Priority checks for empty/thin high-value sections (`working_style`, `context_for_ai`, `goals`, …)
- Stale goals if `updated_at` > ~8 months
- Missing core sections flagged

### DB

**Table:** `context_scores` — `score`, `headline`, `summary`, `gaps` (jsonb), `analyzed_at`, `resolved_sections`

### Frontend

- `src/components/portal/portal-context-score-sync.tsx` — auto re-analyze on login and after `refresh()` (profile edits)
- `src/hooks/use-context-score.ts` — fetch + celebrate on score increase; syncs `contextScore` to portal context
- Dashboard: `SignalHero`, `SectionQualityBars` (derived heuristics, not LLM)
- Fixes: `src/components/dashboard/fixes-page-client.tsx` — sidebar badge = `contextScore.gaps.length`

---

## Fixes page & gap-fix flows

### Purpose

Turn context score **gaps** into **filled profile sections** via short AI interviews — not long onboarding chats.

### Where gaps appear

- Dashboard signal strip (“3 gaps to close”)
- `/dashboard/fixes` — grouped High / Medium / Low impact
- Inline on profile section cards (when tiered list was on dashboard)

### Entry points

| Action | URL | sessionStorage |
|--------|-----|----------------|
| Fix single gap | `/dashboard/update?section=X&from=context-score&mode=single&insight=…` | `storeGapFixSession(queue, "single", score)` |
| Fix all high-impact | `/dashboard/update?from=context-score&mode=all` | `storeGapFixSession(fullQueue, "all", score)` |
| Edit manually | `/dashboard/profile?section=X&from=context-score` | No AI |

Before navigation, `storeScoreBeforeFix(currentScore)` enables celebration UI when score rises after fixes.

---

### Fix single — detailed flow

```
1. User clicks "Fix with AI" on one gap (e.g. skills)

2. Client stores session:
   - meto-context-score-gaps → queue (may be full list or single item)
   - meto-context-score-gap-mode → "single"
   - meto-context-score-before → score before fix

3. UpdatePageClient builds GapFixIntent from URL + sessionStorage

4. useQuickUpdateChat bootstraps gap fix:
   POST /api/profile/update-chat
   {
     gapFixInit: true,
     gapFix: { sectionType, insight, mode: "single", ... }
   }

5. Server uses buildGapFixUpdatePrompt():
   - Knows the GAP internally (user must NOT repeat it)
   - Knows target section + current content + full profile summary
   - gapFixQuestionGuide() picks section-specific question strategy

6. First assistant message = first question (max ~20 words, no preamble)

7. User answers → normal chat turns with same prompt until:
   - done: true + updates: { sectionType: "merged content" }
   - OR max 3 questions exhausted

8. Client shows pendingUpdates preview → user clicks Save

9. POST /api/profile/update-chat { apply: true, updates, messages, gapFix }
   - buildUpdateApplyReviewPrompt() refines updates
   - reviewRippleSections() may add projects/goals
   - mergeProfileSectionUpdates() → DB
   - compileLocally("universal") → compiled_profiles cache

10. markGapSectionApplied(sectionType)
    If more gaps in queue → pause UI: "Fix next gap?" or finish
    If done → markCelebratePending() → redirect /dashboard/fixes → re-analyze score
```

### How single-gap questions work

**`gapFixQuestionGuide(sectionType, insight)`** in `meto-prompts.ts` encodes product psychology:

| Section | Question strategy |
|---------|-------------------|
| `skills` | Weekly tools vs “know a bit”; what AI gets wrong about their level |
| `context_for_ai` | Hard rules / never-do’s; either/or (“zero cooking refs when coding?”) |
| `working_style` | One concrete preference: short vs long, bullets vs prose |
| `goals` | What changed recently OR single outcome + timeframe |
| `about` | Identity facts beyond job title |
| `work` | Role + stack + who they build for |
| `projects` | Name + problem + stage in one compound question |

**Strict reply rules (single fix):**

- Max 20 words before the question
- **Banned:** restating the gap, “I understand”, thanking, generic “how do you communicate”
- **First turn:** jump straight to the best question — zero setup
- Exactly **one question per turn**
- Max **3 questions**, then must set `done: true` with written update
- Updates merge with existing content in **first person**

---

### Fix all — detailed flow

Fix-all is **not** one mega-conversation. It is a **queue of single-gap interviews**, one section at a time.

```
1. User clicks "Fix all high-impact gaps (N)" or "Fix all with AI"

2. storeGapFixSession(allGaps, "all", currentScore)

3. Navigate /dashboard/update?from=context-score&mode=all

4. focusIndex = 0 → first gap in queue

5. gapFixInit → buildGapFixAllUpdatePrompt():
   - INTERNAL: section type + gap insight (never quoted to user)
   - Max 2 questions per section (stricter than single’s 3)
   - Max 18 words per reply
   - BANNED: gap counts, section labels, “let’s fix”, mentioning other gaps

6. After user saves one gap:
   - advanceGapFixSession() shifts queue
   - Client auto-starts next gap (new gapFixInit) OR shows pause screen

7. When queue empty:
   - markCelebratePending(fixedSectionTypes)
   - Redirect /dashboard/fixes
   - POST context-score with fixedSections → gaps removed, score may jump
```

**Single vs fix-all prompt differences:**

| | Single (`buildGapFixUpdatePrompt`) | All (`buildGapFixAllUpdatePrompt`) |
|---|--------------------------------------|-------------------------------------|
| Max questions | 3 | 2 |
| Max reply length | 20 words | 18 words |
| Profile context | Full section summary included | Target section only |
| Updates key | Primary target section | Only current focus section |
| Queue | One gap (may share session with full list) | Walks `allGaps[focusIndex]` |

### Init line

Both modes start the LLM conversation with a synthetic user line:

```
GAP_FIX_INIT_USER_LINE = "User: [Ready — ask your first question.]"
```

This triggers the **first question** without the user typing anything.

---

## Quick update (dashboard)

### Purpose

Returning users describe life/work changes in **plain language**. Meto figures out which sections to update — the opposite of gap fix (which targets one known weakness).

### Route

**`POST /api/profile/update-chat`** — single endpoint, multiple modes (see below).

### Normal update journey

```
/dashboard/update
  │
  ├─ Greeting + centered chat input (Claude-style)
  │
  ├─ User: "Started at Stripe as a PM"
  │
  ├─ POST { messages } → buildUpdateContextPrompt()
  │    ├─ May ask ONE clarifying question (done: false)
  │    └─ Or propose updates across sections (done: true)
  │
  ├─ Client shows pendingUpdates:
  │    which sections change + diff preview
  │
  ├─ User clicks Save
  │
  └─ POST { apply: true, updates, messages }
       ├─ buildUpdateApplyReviewPrompt()
       ├─ reviewRippleSections() if projects/goals missing
       ├─ mergeProfileSectionUpdates()
       ├─ compileLocally("universal")
       └─ recordUpdate() → localStorage meto_update_history
```

### Normal update prompt behavior

**`buildUpdateContextPrompt()`**

- Warm, 1–2 sentence replies
- **At most one** clarifying question if update is too vague
- When `done: true`: merged section content in `updates` object
- Cross-section review rules: if work changed, consider projects/goals ripple
- **Never** re-interview like onboarding

### Apply pipeline (all modes)

When `apply: true`:

1. **Review prompt** — expands/refines proposed updates against full conversation
2. **Ripple review** — if `projects` or `goals` absent from updates but other sections changed, extra LLM pass adds consistency
3. **DB merge** — PATCH existing sections or INSERT new types
4. **Local compile** — `compileLocally("universal")` updates cache (**no LLM** on apply)

### Gap fix vs quick update (same API)

| | Quick update | Gap fix |
|---|--------------|---------|
| Trigger | User describes change | User clicked fix on known gap |
| Prompt | `buildUpdateContextPrompt` | `buildGapFixUpdatePrompt` / `buildGapFixAllUpdatePrompt` |
| Goal | Map free text → relevant sections | Fill one thin section |
| Questions | 0–1 clarifying | 1–3 targeted (single) or 1–2 (all) |
| Tone | Friendly friend | Fast, direct, no preamble |
| `gapFixInit` | false | true on first turn |

### Request / response reference

**Chat turn:**

```typescript
// Request
{
  messages: { role: "user" | "assistant"; content: string }[];
  gapFix?: {
    sectionType?: string;
    insight?: string;
    mode?: "single" | "all";
    allGaps?: { sectionType, insight, title? }[];
    focusIndex?: number;
  };
  gapFixInit?: boolean;
}

// Response
{
  reply: string;
  done: boolean;
  updates: Record<string, string>;  // section_type → content
}
```

**Apply:**

```typescript
// Request
{ apply: true, updates: Record<string, string>, messages: [...], gapFix?: ... }

// Response
{ success: true }
```

### Files

- `src/app/api/profile/update-chat/route.ts`
- `src/hooks/use-quick-update-chat.ts`
- `src/components/dashboard/quick-update-chat.tsx`
- `src/components/dashboard/update-page-client.tsx`
- `src/lib/update-history.ts` — localStorage history (max 10 entries)

---

## Profile compile (workspace)

Two distinct paths — do not conflate them.

### A) AI compile (cached, optional)

```
POST /api/profile/compile { format, force?, localOnly? }
  Step 1: buildMasterCompilerPrompt() → master paragraph
  Step 2: buildFormatPrompt(format) → Claude / ChatGPT / Gemini / Universal tone
  Append custom sections as plain text
  Save to compiled_profiles
```

Used when user clicks **Regenerate** or cache is stale. Falls back to `compileLocally()` on retryable errors.

### B) Workspace copy (client template, no LLM)

```
buildContextShareUrl() + buildPlatformShareGuide() in src/lib/platform-share.ts
  → Used by /dashboard/workspace
  → Left column: platform tabs + 3-column section grid with public toggles
  → Right column: copy prompt + text preview, then scenario presets
  → ChatGPT/Gemini: full fetch prompt in clipboard; others: API context URL
  → buildContextText() for instant formatted string
```

### C) After quick update apply

Always **`compileLocally("universal")`** — fast, no API cost.

---

## Public profile & AI fetch (no LLM on page render)

| Route | AI? | Mechanism |
|-------|-----|-----------|
| `/profile/[username]` | No (SSR) | Branded UI; `compileLocally` in hidden block for crawlers |
| `/api/public/profile/[username]/context` | No | Plain text / JSON; **preferred for AI fetch tools** |
| `/profile/[username]/context` | No | Rewrites internally to API route |
| `/.well-known/ai-profile/[username]` | No | Structured JSON document for agents |

**Bot rewrite:** Middleware detects AI fetch user-agents on `/profile/{username}` and serves plain-text context from the API route.

**Share prompts:** `src/lib/platform-share.ts` — ChatGPT gets browse prompt + context URL; Gemini gets profile HTML URL + fetch prompt; universal format returns API link.

Public pages never call `generateWithGemini` for visitors.

---

## Client storage keys

### sessionStorage (gap fix session)

| Key | Constant |
|-----|----------|
| `meto-context-score-gaps` | `CONTEXT_SCORE_GAPS_KEY` — active queue |
| `meto-context-score-gaps-all` | `CONTEXT_SCORE_GAPS_ALL_KEY` — original full queue |
| `meto-context-score-gap-mode` | `CONTEXT_SCORE_GAP_MODE_KEY` — `"single"` \| `"all"` |
| `meto-context-score-before` | `CONTEXT_SCORE_BEFORE_KEY` — score before fixes |
| `meto-context-score-applied-sections` | `CONTEXT_SCORE_APPLIED_KEY` |
| `meto-context-score-celebrate` | `CONTEXT_SCORE_CELEBRATE_KEY` |
| `meto-context-score-fixed-sections` | `CONTEXT_SCORE_FIXED_SECTIONS_KEY` |

**File:** `src/lib/context-score-actions.ts`

### localStorage

| Key | Purpose |
|-----|---------|
| `meto_landing_session` | Landing chat state |
| `meto_landing_pending_save` | Deferred save after auth |
| `meto_landing_pending_message` | Deferred message after auth |
| `meto_update_history` | Last 10 quick updates |
| `meto_score_history` | 7-day context score sparkline |
| `meto_copy_stats` | Workspace copy usage |

---

## Caching & invalidation

| Cache | Table / location | Invalid when |
|-------|------------------|--------------|
| Compiled profile | `compiled_profiles.last_compiled` | Any section `updated_at` newer |
| Context score | `context_scores.analyzed_at` | Any section `updated_at` newer |
| Client score sparkline | localStorage | Appended on each successful analysis |

Force refresh: `POST /api/profile/context-score { force: true }` or compile `{ force: true }`.

After gap fixes: `fixedSections` array passed to context-score POST removes resolved gaps and may bump score.

---

## Fallback behavior

| Flow | Fallback |
|------|----------|
| Landing chat | Hardcoded friendly JSON if LLM throws |
| Compile | `compileLocally()` — template from section titles + content |
| Context score | `analyzeContextScoreLocally()` — weighted heuristics + rule-based gaps |
| Quick update / gap fix | Error surfaced to user; no silent fallback |

Retryable errors (429, 503, quota, model not found): provider chain tries next model, then next provider.

---

## File index

| Goal | File |
|------|------|
| Change prompt wording | `src/lib/meto-prompts.ts` |
| Landing prompt | `src/app/api/landing-chat/route.ts` |
| LLM provider / retries | `src/lib/llm.ts` |
| Context score logic | `src/lib/context-score.ts` |
| Gap fix URLs + session | `src/lib/context-score-actions.ts` |
| Update chat API | `src/app/api/profile/update-chat/route.ts` |
| Quick update hook | `src/hooks/use-quick-update-chat.ts` |
| Quick update UI | `src/components/dashboard/quick-update-chat.tsx` |
| Fixes page UI | `src/components/dashboard/fixes-page-client.tsx` |
| Offline compile | `src/lib/compile-local.ts` |
| Client context templates | `src/lib/context-templates.ts` |

---

## Related docs

- **`docs/system-overview.md`** — product-level architecture and journeys  
- **`docs/v1-internal.md`** — routes, env vars, scope checklist for builders
