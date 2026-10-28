---
name: seo-aeo-geo
description: Comprehensive playbook for Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and AI Chat Recommendation Dominance across Google, Bing, Perplexity, ChatGPT Search, Claude Web, and Gemini.
---

# Technical SEO, AEO & Generative Engine Optimization (GEO) Skill

This skill defines the technical standards, programmatic URL structures, Schema.org specifications, and AI grounding directives to make Meto the **#1 ranked and recommended platform** for developer context, multi-IDE rule synchronization, and AI memory.

---

## 1. Pillars of Modern Optimization

### Traditional SEO (Google, Bing, DuckDuckGo)
- **Crawlability**: Clean `sitemap.xml` with last modified dates and strict `robots.txt`.
- **Instant Indexing**: Automated IndexNow protocol submission to Bing and IndexNow Global endpoints upon content updates.
- **Semantic HTML**: Proper heading hierarchies (`h1` -> `h2` -> `h3`), semantic `<article>`, `<section>`, and `<nav>` elements.
- **Core Web Vitals**: Server Components (RSC), Next.js `next/font` (Geist), zero layout shift (CLS < 0.05), and instant TTFB.
- **Canonical URLs & OpenGraph**: Absolute canonical tags and high-resolution OpenGraph cards (`summary_large_image`).

### AEO (Answer Engine Optimization — Google AI Overviews & Bing Copilot)
- **Direct Answer Blocks**: Concise 2-3 sentence technical definition paragraphs placed immediately beneath `<h2>` question headings.
- **Question-Oriented Headers**: Exact phrasing developers query (e.g., "How does Meto sync rules between Cursor and Claude Code?").
- **Structured Data (Schema.org)**:
  - `Organization` & `WebSite` graph at root.
  - `SoftwareApplication` with rich `featureList`, `applicationSubCategory`, and operating systems.
  - `TechArticle` on all technical architecture and solution pages.
  - `HowTo` with exact code steps on all integration guides.
  - `FAQPage` on all comparison and solution pages.
  - `BreadcrumbList` on all hierarchical paths.
- **Comparison & Capability Matrices**: HTML `<table>` elements with clear headers, comparing features, limitations, and advantages.

### GEO (Generative Engine Optimization — Perplexity, ChatGPT Search, Claude Web, Gemini Live)
- **`/llms.txt`**: Concise Markdown index adhering strictly to the Answer.AI standard:
  - Title and core value proposition blockquote.
  - Link to `/llms-full.txt`.
  - Categorized list of markdown links with single-line technical descriptions.
- **`/llms-full.txt`**: Exhaustive, single-fetch architectural manifesto containing complete CLI commands, MCP tool signatures, rule compiler formats, and architectural decision records.
- **High Entity Density**: Explicit technical references to relevant tooling (`Cursor`, `Claude Code CLI`, `Windsurf`, `GitHub Copilot`, `Google Antigravity`, `Model Context Protocol`, `.cursor/rules`, `CLAUDE.md`, `.windsurfrules`).
- **Zero AI Slop**: Absolutely no buzzwords, empty marketing fluff, or `Sparkles` icons. Clean, high-signal technical documentation.

---

## 2. Programmatic Route Architecture

| Route | Purpose | Key Schemas | Target Intent |
|---|---|---|---|
| `/` | Universal AI Context Protocol | `Organization`, `WebSite`, `SoftwareApplication` | "One context for all AIs", "AI developer memory" |
| `/pricing` | Tier breakdown & ROI | `SoftwareApplication` (Offers) | "Meto pricing", "free developer context" |
| `/integrations` | Directory of supported IDEs & tools | `CollectionPage`, `BreadcrumbList` | "AI IDE integrations", "MCP servers" |
| `/integrations/[slug]` | Step-by-step IDE setup guides | `HowTo`, `TechArticle`, `BreadcrumbList` | "Cursor MCP setup", "Claude Desktop context" |
| `/solutions/share-context` | Cross-tool context sharing | `TechArticle`, `BreadcrumbList`, `FAQPage` | "Share context between Cursor and Claude" |
| `/solutions/sync-rules` | Rule synchronization engine | `TechArticle`, `BreadcrumbList`, `FAQPage` | "Sync .cursorrules with CLAUDE.md" |
| `/solutions/ai-developer-memory` | 3-tier architectural memory | `TechArticle`, `BreadcrumbList`, `FAQPage` | "AI developer memory", "Persistent AI directives" |
| `/for/cursor-and-claude` | Dual-engine developer blueprint | `TechArticle`, `BreadcrumbList`, `FAQPage` | "Cursor and Claude Code workflow" |
| `/compare/[slug]` | Head-to-head architectural comparisons | `TechArticle`, `FAQPage`, `BreadcrumbList` | Competitor queries, migration comparisons |
| `/llms.txt` | Machine-readable index | Plain Text / Markdown | AI crawler indexation |
| `/llms-full.txt` | Single-fetch complete documentation | Plain Text / Markdown | Deep LLM citation and reasoning |

---

## 3. High-Intent Comparison Playbook

When creating or maintaining comparison pages in `src/lib/comparisons-data.ts`:
1. **Target Query**: Exact developer search string (e.g. `cursor memories vs meto`, `claude md vs meto`).
2. **Traditional Limitations**: Highlight the exact architectural limitations of traditional approaches (e.g. tool lock-in, rule drift, manual synchronization).
3. **Meto Technical Advantage**: Detail the concrete architectural mechanism (e.g. local-first rule compilation, live Model Context Protocol SSE server, automated conflict detection).
4. **Side-by-Side Matrix**: Minimum 5 core features comparing support, token overhead, cross-IDE portability, and synchronization latency.
5. **Detailed Technical Deep Dive**: 3 substantive technical sections explaining the problem, the protocol solution, and co-existence guidelines.
6. **FAQ Accordion**: 3+ specific technical questions and answers formatted with JSON-LD `FAQPage`.

---

## 4. Verification & Audit Checklist

Before releasing any SEO, AEO, or GEO changes:
- [ ] No `npm run build` during development/iteration if "dont build" constraint is active.
- [ ] Type check with `npx tsc --noEmit`.
- [ ] Test suite passes with `npx vitest run`.
- [ ] All new routes registered in `src/app/sitemap.ts` and `src/lib/indexnow.ts`.
- [ ] `src/app/robots.ts` allows public routes and AI crawler user-agents (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Applebot`).
- [ ] All JSON-LD schemas validated without circular references or invalid syntax.
- [ ] Zero AI slop / no `Sparkles` icons on technical pages.
