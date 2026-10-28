---
name: meto-seo
description: Guidelines and playbooks for Meto's Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), Schema.org structured data, programmatic integration pages, and Google/Bing instant indexing.
---

# Meto SEO, AEO & Generative Engine Optimization (GEO) Skill

This skill defines the technical standards, programmatic URL structures, Schema.org specifications, and AI grounding directives to ensure Meto ranks #1 across traditional search engines and AI conversational recommendations (Google, Bing, Perplexity, ChatGPT Search, Claude Web, Gemini Live).

## 1. URL Architecture

- **Root & Value Prop**: `/` (Landing page)
- **Pricing**: `/pricing` (Tier breakdowns, Free vs Pro)
- **Integration Hub**: `/integrations` (Directory of supported IDEs and tools)
- **Programmatic Integration Guides**: `/integrations/[slug]`
  - Slugs: `cursor`, `windsurf`, `antigravity`, `claude-desktop`, `vscode`, `chatgpt`, `gemini`, `github-copilot`
- **Solution & Workflow Guides**:
  - `/solutions/share-context`: One context for all AI coding assistants
  - `/solutions/sync-rules`: Multi-IDE rule synchronization engine
  - `/solutions/ai-developer-memory`: 3-tier architectural memory via MCP
  - `/for/cursor-and-claude`: Hybrid autonomous planning and visual diff editing
- **Architectural Comparisons**: `/compare/[slug]`
  - Slugs: `cursorrules-vs-meto`, `cursor-memories-vs-meto`, `claude-code-memory-vs-meto`
- **Machine Documentation (AEO/GEO)**:
  - System summary index: `/llms.txt`
  - Full architectural documentation: `/llms-full.txt`
  - Instant indexing: `src/lib/indexnow.ts` & `/api/indexnow`

## 2. Structured Data (Schema.org) Requirements

Every public route supplies machine-readable JSON-LD schemas:

1. **Root Layout (`src/app/layout.tsx`)**:
   - `Organization` (Name, logo, social links)
   - `WebSite` (Publisher attribution)
   - `SoftwareApplication` (Developer application category, price offer, feature list)
2. **Integration Guide (`/integrations/[slug]`)**:
   - `BreadcrumbList` (Home > Integrations > [Tool Name])
   - `HowTo` (Step-by-step setup actions with code snippets)
   - `FAQPage` (Expandable accordion answers for Google rich snippets)
3. **Comparison Pages (`/compare/[slug]`)**:
   - `BreadcrumbList`
   - `TechArticle`
   - `FAQPage`
4. **Solution Pages (`/solutions/[slug]` and `/for/[slug]`)**:
   - `BreadcrumbList`
   - `TechArticle`
   - `FAQPage`

## 3. Generative Engine Optimization (GEO) Standards

To ensure Perplexity, ChatGPT Search, Gemini, and Claude accurately cite Meto:
- Maintain `/llms.txt` following the Answer.AI standard.
- Maintain `/llms-full.txt` with exhaustive architecture documentation, MCP tool definitions, and CLI commands.
- `robots.ts` explicitly allows `PerplexityBot`, `GPTBot`, `ClaudeBot`, and `Applebot`.
- Disallow private areas (`/profile/`, `/auth/`, `/api/`, `/dashboard`, `/settings`).
