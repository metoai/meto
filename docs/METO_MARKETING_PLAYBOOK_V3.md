# METO AI — Zero-Budget Marketing Playbook v3
### Universal Developer Memory & AI Identity Across Every Model, IDE, and Agent.

---

## Executive Summary & Core Positioning

### 1. The Strategic Pivot
The *"ChatGPT forgets who you are"* angle is obsolete. Big AI labs (OpenAI, Anthropic, Google) are rapidly adding native memory, custom instructions, and project workspaces. Competing on single-tool memory is a losing battle.

**The Real Problem is AI Fragmentation & Walled Gardens:**
- Today's engineer uses **Cursor** for rapid coding, **Claude Code** for complex refactoring, **Google Antigravity** for multi-agent tasks, **ChatGPT** for brainstorming, and **Perplexity** for research.
- Every platform’s memory is locked inside its own proprietary silo:
  - ChatGPT memory does not talk to Claude.
  - Claude Projects do not sync with Cursor.
  - Gemini context does not follow you to local models or new AI startups.
- **The result:** Every time you switch tools or try a new model, you start from zero—re-explaining your role, tech stack, architectural decisions (ADRs), and coding conventions.

### 2. The Core Value Proposition
> **"You are not the same in every room, but you shouldn't have to introduce yourself every time you walk in. Meto is your universal AI context layer—connecting your verified identity, tech stack, and architectural decisions across every AI model, IDE, and agent."**

### 3. The Dual Product Architecture (The Competitive Moat)
| Channel / Persona | What Meto Delivers | Why Users Can't Just Use a Notepad |
| :--- | :--- | :--- |
| **AI IDEs & Coding Agents**<br>*(Cursor, Antigravity, Claude, Windsurf)* | **Live Model Context Protocol (MCP) + Universal Rule Sync** (`npx @metoai/cli init`) | Meto connects directly over JSON-RPC. Agents query `profile://handoff` and call `recall_meto_context` automatically to check past decisions and stack standards. |
| **Web Chatbots & LLMs**<br>*(ChatGPT, Claude.ai, Gemini, Perplexity)* | **1-Click Portable Context Bundle** | Formats verified background, communication directives, and active goals into an optimized context payload ready for any prompt box. |

---

## Part 1 — Channel-Specific Messaging Angles

| Angle | Primary Persona | Core Hook | Best Channels |
| :--- | :--- | :--- | :--- |
| **Walled Gardens vs. Open Context** | Senior Engineers, Tech Leads | *"OpenAI and Anthropic solve memory for themselves. Meto solves context for you."* | Hacker News, r/ClaudeAI, Twitter |
| **Dual IDE Sync (Cursor + Claude)** | Fullstack Engineers, Early Adopters | *"Stop suffering from rule drift when switching between Cursor and Claude Code."* | r/CursorAI, r/LocalLLaMA, GitHub |
| **The AI Passport** | Founders, Indie Hackers, PMs | *"50 new AI tools launched this week. Stop being a stranger to every single one."* | r/SideProject, Product Hunt, Twitter |
| **The AI Identity Layer** | Broad Tech, Career Switchers | *"LinkedIn is your professional identity. GitHub is your code. Meto is your AI identity."* | r/Futurology, Medium, LinkedIn |

### What NOT to Say Anymore:
- ❌ *"AI has no memory"* &rarr; Big models do have memory now; this makes you look out of touch.
- ❌ *"A text snippet you can paste"* &rarr; Sounds like a glorified notepad.
- ✅ **Say Instead:** *"Portable context protocol"*, *"Universal rule sync across IDEs"*, *"The open AI identity layer"*.

---

## Part 2 — The Reddit Tactical Engine (Anti-Ban 2-Step Formula)

Reddit is the highest-converting early acquisition channel for Meto, but subreddits like `r/ChatGPT` and `r/ClaudeAI` aggressively filter direct promotional links.

### The 2-Step Anti-Ban Formula:
1. **The Post (100% Value, Zero Direct Links):** Frame the post around genuine workflow frustration, architectural tradeoffs, or multi-tool friction. End with a question asking how others handle it.
2. **The Comment Handoff:** When commenters ask *"How did you solve this?"* or *"What tool are you building?"*, reply in the comments with the clean link (`https://www.metoctx.com`). This signals community demand to the algorithm and bypasses automods.

---

### Ready-to-Post Reddit Templates

#### Template 1: The Multi-IDE Context Drift (Target: `r/ClaudeAI`, `r/CursorAI`)
```text
Title:
I switch between Cursor, Claude Code, and ChatGPT daily. The context drift across models was driving me crazy.

Body:
Every time a new benchmark drops, I try the new model. Right now my daily stack is Cursor for inline editing, Claude 3.7 for complex architecture design, and ChatGPT/Perplexity for research.

The problem: each platform's memory is a walled garden.
- ChatGPT memory stays inside OpenAI.
- Claude Projects don't sync with Cursor.
- Cursor rules don't travel to Claude Code in the terminal.

Every session starts with friction: re-specifying my stack (Next.js App Router, strict TypeScript, Supabase RLS), re-explaining my coding standards (no premature abstractions, no conversational filler), and reminding the agent not to suggest libraries we already rejected.

I got tired of copy-pasting markdown files between repos, so I built an open context sync layer:
1. It runs a local CLI command (`npx @metoai/cli init`) to sync .cursorrules, CLAUDE.md, and GEMINI.md simultaneously while preserving custom repo rules.
2. It exposes a hosted Model Context Protocol (MCP) server so Cursor and Claude can pull architecture decisions automatically via JSON-RPC.
3. For web LLMs, it compiles an instant identity block.

Curious how other multi-agent developers manage context drift right now? Do you maintain separate rule files manually or keep a central doc?
```

---

#### Template 2: The Fragmentation Reframe (Target: `r/LocalLLaMA`, `r/artificial`)
```text
Title:
We don't have an AI memory problem anymore. We have an AI fragmentation problem.

Body:
Most discussions around AI memory focus on single-agent retention. But power users aren't using one model—we're using 5 to 10 across local inference (Ollama/LM Studio), hosted agents (Claude, Cursor), and web interfaces (ChatGPT, Grok, DeepSeek).

The hidden cost isn't that models can't remember—it's that memory is centralized in proprietary silos. When you switch models, your context starts from zero.

What we actually need is an open, portable AI Identity Protocol:
- A user-owned profile defining who you are, how you work, and your tech stack.
- Native MCP handoff for agentic workflows.
- Zero vendor lock-in.

I've been working on an open platform to test this (metoctx.com). What core fields do you think a universal AI identity should carry?
```

---

#### Template 3: Solo Builder Origin (Target: `r/SideProject`, `r/Entrepreneur`)
```text
Title:
I tried 14 new AI tools this year. I was a stranger to all of them. So I built an AI passport.

Body:
Every week a new AI startup launches with an amazing specialized feature. But the onboarding tax is brutal: every tool expects you to spend the first 10 minutes typing out your role, your industry, your formatting preferences, and what you're working on.

I built Meto (https://www.metoctx.com) over the past few weeks to solve this.
- You configure your profile once (role, tech stack, architectural rules, tone).
- For web tools: 1 click copies an optimized universal prompt block.
- For IDEs: It connects via Model Context Protocol (MCP) and syncs rules (.cursorrules, CLAUDE.md, GEMINI.md) automatically.

Completely free to use, no credit card required. Would love honest feedback from other builders who hop between AI tools!
```

---

## Part 3 — Twitter / X Growth Engine

### Profile Architecture
- **Handle:** `@metoai`
- **Name:** Alazar | building Meto (@metoai)
- **Bio:** AI models multiply. Your context shouldn't start from zero. Building @metoai — universal developer memory & MCP sync for Cursor, Claude & web AIs.
- **Link:** `https://www.metoctx.com`
- **Pinned Tweet:** The Walled Garden Manifesto (Tweet 1 below)

---

### High-Impact Tweet Templates

#### Batch 1: The Walled Garden Manifesto
```text
Tweet 1 (Pin This):
OpenAI has memory.
Anthropic has Projects.
Google has Gemini context.

All amazing. All walled gardens.

The moment you switch from Cursor to Claude, or Claude to Perplexity, you're a stranger again.

Your developer context belongs to you, not OpenAI.

That's why we built @metoai → https://www.metoctx.com
```

```text
Tweet 2:
The hidden tax of the AI era:

50 new AI tools launch every month.
You try 3 of them.
You spend the first 5 minutes of each explaining:
• Your role
• Your tech stack
• Your formatting preferences
• Things you hate

Meto makes your context portable across every AI instantly.
```

#### Batch 2: The MCP & Developer Workflow Angle
```text
Tweet 3:
Cursor vs Claude Code isn't an either/or choice.
Senior engineers use both.

The headache is rule drift (.cursorrules out of sync with CLAUDE.md).

We added universal rule sync to Meto:
`npx @metoai/cli init`

One command syncs Cursor, Claude, Antigravity & Windsurf rules while preserving custom guidelines.
```

```text
Tweet 4:
Hot take: In 2 years, your Model Context Protocol (MCP) profile will be more important than your resume.

It defines how every autonomous agent, coding assistant, and LLM understands your engineering standards.

Build yours early at https://www.metoctx.com
```

---

## Part 4 — SEO & Programmatic Routing Architecture

Rather than driving all organic search traffic to the homepage, route search intent directly to your dedicated solution pages:

```
                          ┌────────────────────────┐
                          │   Search Intent / Query│
                          └───────────┬────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│ Cursor & Claude  │        │ Rule Sync Across │        │ Developer Memory │
│ Dual Workflows   │        │ IDEs & Agents    │        │ & Past Decisions │
└────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
         ▼                            ▼                            ▼
/for/cursor-and-claude      /solutions/sync-rules       /solutions/ai-developer-memory
```

### High-Intent Keywords & Target URLs
| Target Search Query | Intent Type | Canonical Landing Page |
| :--- | :--- | :--- |
| `cursor and claude dual workflow` | High Intent Comparison | [`/for/cursor-and-claude`](file:///home/alazar/.gemini/antigravity/scratch/meto/src/app/for/cursor-and-claude/page.tsx) |
| `sync rules between cursor and claude` | Developer Tooling Search | [`/solutions/sync-rules`](file:///home/alazar/.gemini/antigravity/scratch/meto/src/app/solutions/sync-rules/page.tsx) |
| `share context between ai tools` | Problem Solution Query | [`/solutions/share-context`](file:///home/alazar/.gemini/antigravity/scratch/meto/src/app/solutions/share-context/page.tsx) |
| `ai developer memory mcp` | Technical Protocol Query | [`/solutions/ai-developer-memory`](file:///home/alazar/.gemini/antigravity/scratch/meto/src/app/solutions/ai-developer-memory/page.tsx) |
| `portable ai identity profile` | Category Creation Query | Homepage (`https://www.metoctx.com`) |

---

## Part 5 — Curated Newsletter Pitch Engine

Curators receive 200+ pitches weekly. They ignore long paragraphs. Use this exact 4-sentence format:

### Pitch Script (Ben's Bites, TLDR AI, The Rundown, Superhuman)
```text
Subject: Tool for readers: Portable AI identity across Claude, Cursor & ChatGPT (MCP + CLI)

Hi [Curator Name],

Quick tool submission for your readers navigating AI fragmentation:

Big AI's memory features are walled gardens (ChatGPT memory doesn't follow you to Claude or Cursor).

We launched Meto (https://www.metoctx.com) — an open context layer that connects across all AI models via native Model Context Protocol (MCP), universal CLI rule sync (`npx @metoai/cli init`), and instant context bundles.

Zero lock-in. Free to use.

30-second walkthrough: [Video Link / Loom]

Best,
Alazar
Founder, Meto
```

---

## Part 6 — Hacker News & Developer Distribution

### Show HN Post Blueprint
- **Title:** `Show HN: Meto – Universal AI context and rule sync for Cursor, Claude, and web LLMs`
- **Tone:** Technical, honest, zero marketing buzzwords.
- **Copy Outline:**
  1. *Problem:* Explain why vendor-locked memory breaks multi-model workflows.
  2. *Architecture:* Detail the Node.js zero-dependency CLI, the JSON-RPC Model Context Protocol endpoint, and atomic rule merging.
  3. *Privacy:* Explicitly clarify where data is stored (Supabase encrypted storage, user-owned context).
  4. *Ask:* Ask the HN community for harsh technical feedback on MCP resource schema design.

---

## Part 7 — 90-Day Execution Calendar

### Month 1: Seeding Developer Communities & Foundation
- **Week 1:**
  - Update Twitter profile and pin the Walled Garden Manifesto.
  - Submit Meto to top 5 AI directories (There's An AI For That, Futurepedia, Toolify, Uneed).
  - Verify CLI v1.1.3 (`npx @metoai/cli init`).
- **Week 2:**
  - Post Template 1 in `r/ClaudeAI` (Anti-ban formula: link in comments only).
  - Publish Cornerstone Article 1 on Dev.to and Hashnode with canonical link to `/for/cursor-and-claude`.
  - Reply to 10 developer threads on Twitter daily.
- **Week 3:**
  - Post Template 3 in `r/SideProject`.
  - Engage with newsletter curators on Twitter (Ben Tossell, Rowan Cheung).
  - Publish Article 2 on Medium with canonical link to `/solutions/sync-rules`.
- **Week 4:**
  - Submit Show HN on Hacker News (Tuesday or Wednesday 8:00 AM ET).
  - Pitch top 3 newsletters (Ben's Bites, TLDR AI, The Neuron).

### Month 2: Momentum & Public Launch
- **Week 5:** Product Hunt Launch (Tuesday 12:01 AM PT). Mobilize initial users for authentic day-1 engagement.
- **Week 6:** Release 60-second video demo showing live context sync between Cursor, Claude, and Antigravity.
- **Week 7:** Post Template 2 in `r/LocalLLaMA` focusing on cross-model local inference.
- **Week 8:** Follow up with newsletter editors who opened pitches.

### Month 3: Audience Compounding & Partnerships
- **Week 9:** Publish monthly "Multi-Tool AI Stack Roundup" article (ranks for recurring monthly keywords).
- **Week 10:** Host or participate in an X Space on "Multi-Agent Workflows & The Future of MCP".
- **Week 11:** Audit Google Search Console keyword queries and spin out targeted landing pages.
- **Week 12:** Growth retrospective: double down on the top performing channel (Reddit vs. Twitter vs. SEO).

---

## Part 8 — North Star Metrics & Tracking

| Metric | Target (Day 30) | Target (Day 60) | Target (Day 90) | Tracking Tool |
| :--- | :--- | :--- | :--- | :--- |
| **Weekly Active Profiles** | 100 | 500 | 2,500 | Supabase DB / PostHog |
| **CLI Invocations (`init` / `mcp`)** | 250 | 1,200 | 5,000 | CLI telemetry / npm stats |
| **MCP Active Connections** | 50 | 300 | 1,500 | Server access logs |
| **Organic Search Impressions** | 1,000/mo | 8,000/mo | 35,000/mo | Google Search Console |

### The Golden Rule:
If weekly user signups flatten, **change only ONE variable at a time** (either the distribution channel or the hook/copy), never both simultaneously. Evaluate performance over a minimum 14-day sample size before pivoting.
