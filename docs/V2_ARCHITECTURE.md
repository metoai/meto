# Meto V2 Architecture Migration

> **Status:** Planning only — no implementation yet.  
> **Foundation:** Existing Meto codebase (`context_sections` as source of truth today).  
> **Constraint:** Evolve in place; no rewrite; no data loss; all current features keep working during migration.

---

## Executive Summary

Transform Meto from a **profile builder** into a **Living AI Memory** platform.

- The **profile is no longer the source of truth** — it becomes a generated representation.
- The **source of truth** becomes structured **knowledge objects** with a relationship layer.
- Existing sections (About, Work, Projects, etc.) remain as **user-friendly views**.
- Personal and Developer audiences share one backend with **workspace modes**, not two products.

**Do not implement everything in one commit.** Follow the phased roadmap at the end of this document.

---

## 1. Full Architecture Review

### Today (V1)

```
User input (chat, paste, MCP, editor)
        ↓
context_sections (markdown, 7 presets + custom)  ← SOURCE OF TRUTH
        ↓
┌───────────────────┬────────────────────┐
│ compiled_profiles │ context_scores     │  ← DERIVED CACHES
└───────────────────┴────────────────────┘
        ↓
Views: Workspace copy, MCP resources, public profile, 8 compile formats
```

**Strengths to preserve**

- Working onboarding, quick update, gap fix, score, compile, MCP, billing, public profile
- Human-in-the-loop on dashboard updates (trust)
- Deterministic fallbacks (`compile-local.ts`, `analyzeContextScoreLocally`)
- Entitlements + AI usage on `profiles`
- MCP live with `profile://handoff` + `update_meto_profile`

**Gap vs V2 vision**

- Updates are **section-shaped**, not **memory-shaped**
- No project entity — dev context lives in `projects` markdown
- No relationship graph — contradictions and duplicates are invisible
- Score evaluates **section thinness**, not **knowledge quality**
- One dashboard for two audiences (personal vs developer)
- MCP writes sections directly without extraction layer

### Target (V2)

```
Raw input (chat, paste, MCP, editor, docs, repo signals)
        ↓
Knowledge extraction (typed, multi-object)
        ↓
knowledge_objects + knowledge_links  ← NEW SOURCE OF TRUTH
        ↓
Relationship / project graph
        ↓
Generated views (materialized)
        ├── context_sections (legacy-compatible)
        ├── compiled_profiles
        ├── context_scores (v2)
        ├── MCP resources
        └── future: resume, dev prompt packs, per-project context
        ↓
Integrations: Cursor, Claude, ChatGPT, public profile, future GitHub
```

**Core principle:** Sections become **user-friendly projections**, not the canonical store.

---

## 2. Existing System Analysis

| Layer | What exists | Key files |
|-------|-------------|-----------|
| **Auth** | Supabase Auth, middleware refresh | `middleware.ts`, `auth/callback` |
| **Data** | `profiles`, `context_sections`, `compiled_profiles`, `context_scores`, `onboarding_chats` | migrations + `types.ts` |
| **Onboarding** | Brain dump, chat, skip, landing save | `onboarding-flow.tsx`, `/api/onboarding/*` |
| **Updates** | Quick update, gap fix, doc ingest | `update-chat/route.ts`, `use-quick-update-chat.ts` |
| **Score** | LLM + local heuristic, gaps, `resolved_sections` | `context-score.ts` |
| **Compile** | LLM single-pass + `compileLocally` (8 formats) | `compile/route.ts`, `compile-local.ts` |
| **Workspace** | MCP card + copy composer | `workspace-page-client.tsx`, `context-composer.tsx` |
| **MCP** | Streamable HTTP, resources, tool | `api/mcp/[username]/[[...path]]/route.ts` |
| **Public** | Branded page + API context | `public-profile-view.tsx`, `public-context.ts` |
| **Billing** | Polar trial/free/pro | `billing-profile.ts`, `entitlements.ts` |
| **Prompts** | Central registry | `meto-prompts.ts` (+ inline landing prompt) |
| **Admin** | Full user CRUD | `/api/admin/*` |

### Section model today

- **7 presets:** `about`, `work`, `projects`, `skills`, `goals`, `working_style`, `context_for_ai`
- **Custom sections:** `section_type = "custom"` or `custom:Title` in LLM updates
- Landing collects 4; full onboarding collects 7

### Update JSON shape (all update flows)

```json
{
  "reply": "...",
  "done": true,
  "updates": {
    "about": "",
    "work": "",
    "projects": "",
    "skills": "",
    "goals": "",
    "working_style": "",
    "context_for_ai": "",
    "custom:Section Title": ""
  }
}
```

### Critical behavioral differences

| Path | Writes | User confirms? | Compile |
|------|--------|----------------|---------|
| Dashboard quick update | `context_sections` | Yes | Local universal |
| Gap fix | Same | Yes | Local universal |
| MCP `update_meto_profile` | Same | **No** | Local universal |
| Profile editor | Direct PATCH | Yes | On next compile/score |

---

## 3. Migration Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Dual source of truth during migration | High | Single write path to `knowledge_objects`; sections become generated |
| MCP auto-write without confirm | High | Route MCP through extraction; auto-apply only high-confidence |
| Score/compile cache invalidation | Medium | Event-driven regen on `memory_updated` |
| Base schema not in repo migrations | Medium | Add baseline migration snapshot before V2 tables |
| LLM extraction quality | High | Shadow mode first; always confirm on dashboard |
| Performance (graph + regen) | Medium | Incremental regen; debounce; background jobs |
| Public profile drift | Medium | Public view from `visibility = public` memories only |
| Admin tooling gap | Medium | Extend admin API for knowledge CRUD in Phase 3+ |
| Over-engineering UX | High | Personal mode hides graph; dev mode opt-in |

---

## 4. Database Migration Strategy

**Rule:** Additive only. Never drop `context_sections` in V2.

### Phase 2 tables (proposed)

```sql
-- Core memory store
knowledge_objects (
  id uuid PK,
  user_id uuid FK → profiles,
  type text,           -- identity|preference|rule|goal|project|...
  title text,
  content text,
  confidence numeric,  -- 0-1
  importance int,      -- 1-5
  visibility text,     -- private|public|integration
  source text,         -- quick_update|onboarding|mcp|import|manual|migration
  status text,         -- active|archived|superseded|pending_review
  created_by text,     -- user|ai|system
  tags text[],
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  last_verified_at timestamptz
)

knowledge_links (
  id uuid PK,
  user_id uuid FK,
  from_memory_id uuid FK,
  to_memory_id uuid FK,
  relation_type text,  -- works_at|founded|uses|depends_on|contradicts|...
  strength numeric,
  created_at timestamptz
)

knowledge_sources (
  id uuid PK,
  user_id uuid FK,
  memory_id uuid FK,
  source_type text,    -- chat_message|document|mcp_call|section_import
  source_ref text,
  excerpt text,
  created_at timestamptz
)

-- Developer workspace (Phase 6)
projects (
  id uuid PK,
  user_id uuid FK,
  slug text,
  name text,
  description text,
  status text,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
)

project_memories (
  project_id uuid FK,
  memory_id uuid FK,
  role text,           -- architecture|stack|rules|tasks|...
  PRIMARY KEY (project_id, memory_id)
)

-- Generated view tracking (Phase 4)
generated_views (
  id uuid PK,
  user_id uuid FK,
  view_type text,      -- section_about|compile_universal|mcp_handoff|...
  target_key text,
  content text,
  content_hash text,
  source_memory_version text,
  generated_at timestamptz
)

-- User preference (Phase 5)
-- profiles.workspace_mode text  -- 'personal' | 'developer'
```

### Incremental migration of existing data

**Phase 3 — Backfill (one-time, idempotent)**

1. For each `context_sections` row → create `knowledge_objects` via heuristic mapping
2. Store `source = 'migration'` + link in `knowledge_sources`
3. Write `generated_views` rows pointing to current section content
4. Do not delete original sections until V2 regen matches within tolerance

**Ongoing dual-write (Phase 3–4)**

```
User confirms update
  → write knowledge_objects
  → regen context_sections (overwrite)
  → invalidate compiled_profiles / context_scores
```

**Cutover (Phase 4+)**

- Reads for MCP/public/compile can come from `generated_views` or regen pipeline
- Profile editor edits section → parse into memory diff (or advanced memory editor)

---

## 5. API Changes

**Principle:** Add routes; deprecate nothing until Phase 10.

| Phase | New routes | Existing routes |
|-------|------------|-----------------|
| 2 | — | Unchanged |
| 3 | `GET/POST /api/knowledge` | `update-chat` writes through adapter |
| 3 | `POST /api/knowledge/extract` | Shadow: returns memories + still writes sections |
| 4 | `GET /api/knowledge/graph` | `compile` reads from regen service |
| 4 | `POST /api/views/regenerate` | Internal/cron |
| 5 | `PATCH /api/profile/me` + `workspace_mode` | Bootstrap returns mode |
| 6 | `GET/POST /api/projects` | — |
| 6 | `GET /api/projects/[id]/context` | Dev prompt packs |
| 7 | `POST /api/profile/context-score` v2 logic | Same endpoint, new analyzer |
| 8 | `POST /api/profile/update-chat` extract preview | Same URL, richer response |

### Update-chat response evolution (Phase 8)

```json
{
  "reply": "...",
  "extracted_memories": [
    { "type": "company", "title": "Stripe", "content": "...", "confidence": 0.9 }
  ],
  "proposed_section_updates": {},
  "done": false
}
```

### MCP (Phase 4+)

- Resources read from `generated_views` or live regen
- `update_meto_profile` → extraction → memories (configurable auto-apply threshold)

---

## 6. Component Changes

| Area | V1 | V2 change |
|------|-----|-----------|
| **Portal nav** | Fixed 5 items | Mode-aware nav; dev adds Projects home |
| **Dashboard** | Score + sections | Personal: unchanged; dev: project grid |
| **Profile editor** | Section cards | Same UI + "Edit memories" toggle (Phase 8) |
| **Update page** | Chat only | Knowledge Update: extract preview cards |
| **Workspace** | Copy + MCP | Personal: same; Dev: project context + prompt packs |
| **Fixes** | Section gaps | Memory-quality issues (stale, duplicate, contradict) |
| **Onboarding** | → sections | → memories → regen sections (invisible to user) |
| **Settings** | Account | + Workspace mode switch |

### New component groups

```
src/components/knowledge/     # memory cards, extract preview, graph (dev)
src/components/projects/      # project hub, project memory panels
src/components/workspace-modes/
src/lib/knowledge/            # extraction, graph, regen orchestration
src/lib/views/                # section generator, compile generator, mcp generator
src/lib/projects/             # dev prompt packs
```

---

## 7. Prompt Changes

### New prompt family

| Prompt ID | Purpose | Output |
|-----------|---------|--------|
| `EXTRACT_MEMORIES` | Parse utterance → typed objects | `{ memories: [...], links: [...] }` |
| `CLASSIFY_MEMORY` | Disambiguate type | Single type + confidence |
| `REGENERATE_SECTION` | Memories subset → section markdown | Plain text |
| `REGENERATE_COMPILE` | Memories → format-specific | Plain text |
| `SCORE_KNOWLEDGE_V2` | Graph analysis | `{ score, issues: [...] }` |
| `DETECT_CONTRADICTIONS` | Compare new vs existing | `{ conflicts: [...] }` |
| `PROJECT_EXTRACT` | Dev utterance → project-scoped memories | Project-tagged objects |

### Existing prompts (keep during migration)

- `buildUpdateContextPrompt` → wrapped by extraction layer (Phase 3 shadow)
- `buildContextScorePrompt` → runs in parallel with v2 until cutover (Phase 7)
- Landing/onboarding prompts → unchanged until Phase 5+

Suggested location: `src/lib/knowledge-prompts.ts` imported by `meto-prompts.ts`.

---

## 8. AI Pipeline Changes

### Current pipeline

```
User text → LLM → { updates: { section: markdown } } → mergeProfileSectionUpdates → compileLocally
```

### V2 pipeline

```
User text
  → EXTRACT_MEMORIES (LLM)
  → validate + dedupe + link inference
  → user confirm (dashboard) / auto (MCP, configurable)
  → persist knowledge_objects + knowledge_links
  → enqueue view regeneration
      → REGENERATE_SECTION (per affected preset)
      → REGENERATE_COMPILE (per format, cached)
      → rebuild MCP handoff bundle
      → context_score_v2
```

**Shadow mode (Phase 3):** Run extraction in parallel; still write sections via V1 path; log diff for quality tuning.

**Regen orchestrator:** `src/lib/views/regenerate.ts`

- Input: `user_id`, `trigger: memory_ids[]`
- Output: updated `context_sections`, `compiled_profiles`, `generated_views`
- Idempotent via `content_hash`

---

## 9. Backwards Compatibility Plan

| Consumer | V1 contract | V2 guarantee |
|----------|-------------|--------------|
| Profile editor | PATCH sections | Still works; writes parsed into memories (Phase 4) |
| MCP resources | `profile://{section}` | Same URIs; content from generated views |
| Public profile | `is_public` sections | Maps from `visibility = public` memories |
| Workspace copy | Section picker | Same UI; sections still listed |
| Bootstrap API | sections array | Same shape; add optional `workspace_mode` |
| Admin | Section CRUD | Extended, not replaced |
| Landing/onboarding | 4/7 section keys | Adapter creates memories + regen sections |
| Billing/entitlements | Unchanged | — |

### Feature flags

| Flag | Purpose |
|------|---------|
| `KNOWLEDGE_LAYER_ENABLED` | Shadow extraction |
| `KNOWLEDGE_WRITE_ENABLED` | Dual write to memories |
| `KNOWLEDGE_READ_ENABLED` | Serve from regen pipeline |
| `WORKSPACE_MODE_DEV_ENABLED` | Developer UI |
| `CONTEXT_SCORE_V2_ENABLED` | New scorer |

Rollback = flip flags; `context_sections` still populated.

---

## 10. Folder Structure Proposal

```
src/
├── lib/
│   ├── knowledge/
│   │   ├── types.ts
│   │   ├── extract.ts
│   │   ├── persist.ts
│   │   ├── graph.ts
│   │   ├── migrate-from-sections.ts
│   │   └── adapters/
│   │       ├── update-chat.ts
│   │       ├── mcp.ts
│   │       └── onboarding.ts
│   ├── views/
│   │   ├── regenerate.ts
│   │   ├── generators/
│   │   │   ├── sections.ts
│   │   │   ├── compile.ts
│   │   │   ├── mcp-handoff.ts
│   │   │   └── public-profile.ts
│   │   └── hash.ts
│   ├── projects/
│   │   ├── types.ts
│   │   └── context-builder.ts
│   ├── context-score-v2.ts
│   └── knowledge-prompts.ts
├── app/api/
│   ├── knowledge/
│   └── projects/
├── components/
│   ├── knowledge/
│   ├── projects/
│   └── workspace-modes/
supabase/migrations/
├── 20260801_knowledge_objects.sql
├── 20260802_knowledge_links.sql
├── 20260803_projects.sql
└── 20260804_generated_views.sql
```

---

## 11. UX Wireframe Proposal

### Workspace mode selection (Settings or first visit)

```
┌─────────────────────────────────────────┐
│  How will you use Meto?                   │
│                                           │
│  ┌──────────────┐  ┌──────────────┐      │
│  │ Personal AI  │  │  Developer   │      │
│  │ Remember me  │  │ Projects &   │      │
│  │ across AI    │  │ AI coding    │      │
│  │ tools        │  │ tools        │      │
│  └──────────────┘  └──────────────┘      │
│  Switch anytime in Settings               │
└─────────────────────────────────────────┘
```

### Personal workspace (unchanged surface)

```
Nav: Dashboard | Profile | Workspace | Updates | Fixes
Dashboard: Score hero → recent updates → quick actions
```

### Knowledge Update flow (Phase 8)

```
┌─ Knowledge Update ─────────────────────┐
│ User: "I started at Stripe as PM"       │
│                                         │
│ Meto extracted:                         │
│ ┌ Company ─ Stripe ────────── [✓][✎]  │
│ ┌ Role ─ PM ───────────────── [✓][✎]  │
│ ┌ Timeline ─ 2026 ──────────── [✓][✎]  │
│                                         │
│ Also updating: Work, About (preview ▾)  │
│ [Cancel]              [Save memories]   │
└─────────────────────────────────────────┘
```

### Developer workspace (Phase 6)

```
Nav: Projects | MCP | Connections | Settings

┌─ Projects ─────────────────────────────┐
│ ┌ MetoAI ──────── MCP ✓  Score 78     │
│ ┌ Vouchy ──────── MCP ○  Score 62     │
│ └ Gov Portal ──── MCP ○  Score 45     │
└────────────────────────────────────────┘

Project detail → Tabs: Overview | Architecture | Stack | Rules | Tasks | MCP | Prompts
```

---

## 12. Developer Workspace Proposal

**Mental model:** AI Operating System per project, not profile editor.

| Surface | Content source |
|---------|----------------|
| Project list | `projects` table |
| Architecture / Stack / Rules | `project_memories` filtered by role |
| Prompt packs | Generated from project memory subgraph |
| MCP | Same user token; add `profile://project/{slug}` resource (Phase 6+) |
| Connections | Cursor, Claude, Windsurf, Gemini CLI, GitHub (config UI first) |

**Project knowledge structure**

```
Project
  ├── Architecture
  ├── Business Context
  ├── Stack
  ├── Rules / Coding Standards
  ├── Database
  ├── API
  ├── Current Tasks
  ├── Deployment
  ├── Known Issues
  ├── Prompt Packs
  ├── Documentation
  └── MCP / Connected AI Tools
```

Default dev onboarding: create first project from existing `projects` section via migration.

---

## 13. Personal Workspace Proposal

**No new concepts exposed** to simple users.

- Profile, Score, Updates, Workspace, Fixes — same names
- Under the hood: updates create memories; sections auto-refresh
- Context score explains issues in plain language
- MCP + share link unchanged
- Advanced toggle in Profile: "View underlying memories" (collapsed by default)

---

## 14. Knowledge Object Schema

```typescript
type MemoryType =
  | "identity" | "preference" | "rule" | "goal" | "project"
  | "relationship" | "decision" | "experience" | "timeline"
  | "achievement" | "skill" | "tool" | "company" | "technology"
  | "location" | "task" | "documentation" | "custom";

type MemoryStatus = "active" | "archived" | "superseded" | "pending_review";
type MemoryVisibility = "private" | "public" | "integration";
type MemorySource =
  | "quick_update" | "onboarding" | "landing" | "mcp"
  | "profile_editor" | "document" | "migration" | "manual";

interface KnowledgeObject {
  id: string;
  user_id: string;
  type: MemoryType;
  title: string;
  content: string;
  confidence: number;       // 0–1
  importance: 1 | 2 | 3 | 4 | 5;
  visibility: MemoryVisibility;
  source: MemorySource;
  status: MemoryStatus;
  created_by: "user" | "ai" | "system";
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_verified_at: string | null;
}
```

### Section mapping (generation, not storage)

| Section | Primary memory types |
|---------|---------------------|
| About | identity, location, experience |
| Work | company, experience, role |
| Projects | project, technology, decision |
| Skills | skill, tool, technology |
| Goals | goal, timeline |
| Working Style | preference, rule |
| Context for AI | rule, preference, relationship |

### Example objects

| Type | Example |
|------|---------|
| Preference | "I prefer concise responses." |
| Rule | "Never mention my previous startup." |
| Fact | "I live in Ethiopia." |
| Project | "I'm building Vouchy." |
| Goal | "Launch by August." |
| Decision | "We switched from Firebase to Supabase." |
| Relationship | "John is my cofounder." |

Each object is independently editable.

---

## 15. Relationship Graph Model

```
knowledge_links
  from_memory_id ──relation_type──► to_memory_id
```

### Relation types (starter set)

- `works_at`, `founded`, `maintains`, `uses`, `prefers`
- `depends_on`, `blocked_by`, `related_to`
- `contradicts`, `supersedes`, `verifies`

### Example: "I joined Stripe"

```
[Experience: PM at Stripe] --works_at--> [Company: Stripe]
                                      --timeline--> [Timeline: 2026]
[Goal: Earn USD] <--related_to-- [Experience: PM at Stripe]
```

### Graph health queries (Phase 4+)

- **Contradictions:** two active memories, same type, conflicting content
- **Staleness:** `last_verified_at` > 90 days on high-importance nodes
- **Orphans:** memories with no links
- **Duplicates:** semantic similarity above threshold

---

## 16. Generated View Architecture

```
knowledge_objects (+ links)
        ↓
ViewGenerator registry
  ├── section_generator     → context_sections rows
  ├── compile_generator     → compiled_profiles rows
  ├── score_generator       → context_scores (v2)
  ├── mcp_handoff_generator → generated_views (mcp_handoff)
  ├── public_profile_generator
  └── dev_prompt_generator  → per-project (Phase 6)
```

### Registry pattern

```typescript
interface ViewGenerator {
  viewType: string;
  dependencies: MemoryType[];
  generate(userId: string, scope?: ProjectScope): Promise<GeneratedView>;
}
```

### Generated view types

| View | Output |
|------|--------|
| Profile sections | About, Work, Projects, … |
| Resume / LinkedIn / Website | Future formats |
| ChatGPT / Claude / Gemini prompts | Compile formats |
| Developer prompt | Per-project |
| Public profile | Public memories only |
| Workspace prompt | Scenario presets |
| Universal prompt | Default handoff |
| MCP resources | `profile://handoff`, `profile://{section}` |

**Invalidation:** On memory write, compute affected generators from `dependencies` → queue regen.

**`context_sections` in V2:** Rows remain for RLS, public toggles, and editor UX. `content` = generated output unless advanced edit writes back to memories.

---

## 17. Incremental Implementation Roadmap

Each phase is independently deployable behind feature flags. Never break production.

| Phase | Name | Deliverables | Risk |
|-------|------|--------------|------|
| **1** | Architecture analysis | This document, feature flags, baseline schema snapshot | None |
| **2** | Knowledge model | DB tables, types, RLS, empty CRUD API | Low |
| **3** | Migration layer | Section→memory backfill; shadow extraction on update-chat | Low |
| **4** | Generated views | Regen orchestrator; sections from memories; MCP reads generated handoff | Medium |
| **5** | Personal workspace | `workspace_mode` on profiles; onboarding writes memories | Low |
| **6** | Developer workspace | Projects CRUD; dev home UI; project MCP resources | Medium |
| **7** | Context Score V2 | Parallel scorer; new issue types | Low |
| **8** | Knowledge Update | Extract preview UI; confirm flow; memory editor toggle | Medium |
| **9** | Performance | Async regen queue; incremental compile; graph indexes | Low |
| **10** | Cleanup | Remove shadow paths; deprecate direct section LLM updates | Low |

### Recommended first PR (Phase 1–2)

1. This document (`docs/V2_ARCHITECTURE.md`)
2. `knowledge_objects` + `knowledge_links` migration with RLS
3. `src/lib/knowledge/types.ts` — no behavior change
4. Feature flag helper
5. **Zero** changes to existing update/score/compile paths

### What NOT to do in early phases

- Do not split landing pages yet (pairs with Phase 6)
- Do not change MCP tool semantics until Phase 4
- Do not remove `meto-prompts.ts` section update prompts
- Do not expose graph UI to personal users
- Do not delete `context_sections`

---

## Compatibility Checklist

Everything below must keep working throughout migration:

- [ ] Landing chat
- [ ] Onboarding (brain dump, chat, skip)
- [ ] Quick update
- [ ] Gap fixes
- [ ] Compile (8 formats)
- [ ] Workspace copy builder
- [ ] MCP (resources + `update_meto_profile`)
- [ ] Public profile
- [ ] Context score
- [ ] Billing (Polar)
- [ ] Authentication
- [ ] Admin portal

---

## Related Documentation

| Document | Role |
|----------|------|
| `docs/PROJECT_CONTEXT.md` | Current product + architecture (V1) |
| `docs/system-overview.md` | User journeys |
| `docs/AI_SYSTEM.md` | Prompts and AI pipelines |
| `docs/v1-internal.md` | API tables and file index |

---

## Design Principles

Keep the product feeling like:

- Notion — structured, calm
- Linear — fast, minimal
- Cursor / Claude — developer-trusted
- Apple — simple defaults

Avoid enterprise complexity. Simple users never see the graph. Developers opt into power.

---

*Last updated: July 2026 — V2 planning document. No code changes until Phase 2 is approved.*
