---
name: meto-seo
description: Guidelines and playbooks for Meto's SEO, Generative Engine Optimization (GEO), Schema.org structured data, programmatic integration pages, and Google product indexation.
---

# Meto SEO & GEO Architecture Skill

This skill defines the technical standards, programmatic URL structures, and audit playbooks for maintaining top search engine ranking and AI search engine visibility across Meto (`www.metoai.site`).

## 1. URL Architecture

- **Root & Value Prop**: `/` (Landing page)
- **Pricing**: `/pricing` (Tier breakdowns, Free vs Pro)
- **Integration Hub**: `/integrations` (Directory of supported IDEs and tools)
- **Programmatic Integration Guides**: `/integrations/[slug]`
  - Slugs: `cursor`, `windsurf`, `antigravity`, `claude-desktop`, `vscode`, `chatgpt`, `gemini`, `github-copilot`
- **Architectural Comparisons**: `/compare/[slug]`
  - Slugs: `cursorrules-vs-meto`
- **Public Developer Profiles**: `/profile/[username]`
- **AI Machine Context**:
  - Raw context: `/api/public/profile/[username]/context`
  - Manifest: `/.well-known/ai-profile/[username].json`
  - System summary: `/llms.txt`
- **Viral README Backlinks**: `/api/badge/[username]`

## 2. Structured Data (Schema.org) Requirements

Every public route must supply machine-readable JSON-LD schemas:

1. **Root Layout (`src/app/layout.tsx`)**:
   - `Organization` (Name, logo, social links)
   - `WebSite` (Publisher attribution)
   - `SoftwareApplication` (Developer application category, price offer)
2. **Integration Guide (`/integrations/[slug]`)**:
   - `BreadcrumbList` (Home > Integrations > [Tool Name])
   - `HowTo` (Step-by-step setup actions with code snippets)
   - `FAQPage` (Expandable accordion answers for Google rich snippets)
3. **Comparison Pages (`/compare/[slug]`)**:
   - `BreadcrumbList`
   - `FAQPage`
4. **Public Profile (`/profile/[username]`)**:
   - `ProfilePage` & `Person` (name, knowsAbout, sameAs, hasCredential)

## 3. Generative Engine Optimization (GEO) Standards

To ensure Perplexity, ChatGPT Search, Gemini, and Claude accurately cite Meto:
- Maintain plain-text responses on `/api/public/profile/[username]/context?preset=all`.
- `robots.ts` must explicitly allow `PerplexityBot`, `GPTBot`, `ClaudeBot`, and `Applebot`.
- The `/llms.txt` file must specify canonical URL structures and query parameters.

## 4. Google Products Integration

- **Google Search Console**: Verify via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` meta tag in `src/app/layout.tsx`.
- **Sitemap**: Generated dynamically in `src/app/sitemap.ts` with 1-hour cache revalidation.
- **Instant Indexing API**: Run `npm run seo:ping` (or `node scripts/google-index-ping.mjs [url]`) to notify Google when new routes are created.
- **Core Web Vitals**:
  - Keep LCP < 2.5s by using Server Components (RSC) for hero elements and `next/font` with `Geist`.
  - Keep CLS < 0.1 by specifying explicit width/height or aspect ratios on all SVG logos.
