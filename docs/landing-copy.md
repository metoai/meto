# Meto — Landing page copy

> All user-facing text on `/`, section by section, in page order.  
> **Source of truth:** component files under `src/components/landing/` and `src/app/page.tsx`.  
> **Note:** `src/lib/landing-copy.ts` has alternate hero strings but is **not wired up** — the live hero uses `landing-hero-copy.tsx`.

---

## SEO / meta (`layout.tsx`)

- **Title:** Meto — Your AI Identity
- **Description:** Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, ChatGPT, or Gemini.

---

## Navigation (`landing-hero-nav.tsx`)

**Brand:** meto

**Nav links:**

- How it works
- Context Score
- Share
- Pricing

**Auth (logged out):**

- Log in
- Get started free

**Auth (logged in):**

- Dashboard

---

## Hero (`landing-hero-copy.tsx`)

**Eyebrow:** Structured context for every AI

**Headline:** Never explain yourself **twice.**

**Subhead:** Paste your bio or let Meto learn as you work. Give every AI instant memory via link or MCP.

**Outcome line:** One conversation → Universal AI memory

**CTAs:**

- Get started free → `/auth/signup`
- See how it works → `#how-it-works`

**Microproof:** No credit card · 2 min setup · Works with Claude, Cursor & ChatGPT

**Proof cards (`landing-hero-proof.tsx`):** Without Meto vs With Meto comparison (desktop: beside copy; mobile: below)

---

## Hero chat (`page.tsx` + `landing-chat.ts`)

**Toolbar (`landing-hero-toolbar.tsx`):** Numbered step map — "Your path" label, `1 Chat — 2 Build — 3 Share` (visual guide, not clickable tabs)

**Opening message (Meto):** Hey — what do you do and what are you working on right now?

**Input placeholders:**

- Before chat: `I'm a designer working on a new product…`
- During chat: `Answer in your own words…`

**Save prompt (after 3 user messages):**

- **Title:** Apply this to your profile?
- **Body:** I've got a good picture of you. Save it to your dashboard, or keep chatting if you want to add more.
- **Logged out note:** Sign in to save — your chat stays on this device until then.
- **Buttons:** Save to my profile · Keep chatting

**Fallback assistant message (on error):** Tell me more — what are you currently working on?

**Aria labels:** End chat · Start chat / Send message · Meto is typing

---

## Works with (`landing-hero-partners.tsx`)

**Label:** Works with

**Platforms (icons only):** ChatGPT · Gemini · Claude · DeepSeek · Grok · Moonshot · Qwen

---

## Problem (`landing-problem-section.tsx` + `landing-problem-feed.tsx`)

**Eyebrow:** The problem

**Title:** Every new AI starts from zero.

**Animated feed:** Each platform shows *"Tell me about yourself."*  
Platforms: ChatGPT · Claude · Gemini · Cursor · Future agents

**Caption:** You answer again. And again.

**Side panel label:** What breaks

**Side panel title:** Your context doesn't travel with you.

**Side panel body:** Every chat starts blank. You rewrite the same bio, restate how you work, and give slightly different answers each time — because nothing carries over between tools or sessions.

---

## How it works (`landing-how-it-works-section.tsx` + demo)

**Eyebrow:** How it works

**Title:** Chat. Build. Share.

**Subtitle:** Three steps to a portable understanding of who you are.

### Step 1 — Chat

- **Title:** Tell Meto who you are
- **Description:** Share your work, projects, goals, and style in a natural conversation.
- **Demo user message:** I'm a product designer building Meto — a profile every AI can read.
- **Demo Meto reply:** Got it. What are you working on right now?

### Step 2 — Build

- **Title:** Meto structures your profile
- **Description:** Everything you share becomes a living profile — organized and always editable.
- **Demo sections:** Work · Projects · Style (with sample values)

### Step 3 — Share

- **Title:** Every AI already knows you
- **Description:** Connect your profile once. Use it with ChatGPT, Claude, agents, and collaborators.
- **Demo link label:** Your link → `meto.app/u/alex`
- **Demo connected:** ChatGPT · Claude · Gemini

---

## Context Score (`landing-context-score-section.tsx` + panel)

**Eyebrow:** Context Score

**Title:** See how well AI understands you.

**Subtitle:** A single score for profile completeness — with clear meters on what still needs work. Fix gaps in a short AI chat.

**Panel labels:** Context score · out of 100 · Thin sections · Fix with AI →

**Demo gaps:** Projects · Goals · Working style

---

## Keep updated (`landing-keep-updated-section.tsx` + panel)

**Eyebrow:** Always current

**Title:** Your profile stays alive.

**Subtitle:** Most tools stop after setup. Tell Meto what changed — your profile and context score update automatically.

**Panel — Quick update:**

- **User:** I started a new startup.
- **Meto:** Got it — I've updated your profile.

**Panel — What changed:**

- Projects updated
- Goals updated
- Context score +4

**Footer note:** Or edit any section manually.

---

## Share (`landing-share-section.tsx` + panel)

**Eyebrow:** Share

**Title:** Use your understanding everywhere.

**Subtitle:** One profile link — paste it into ChatGPT, Claude, agents, collaborators, or anywhere you work with AI.

**Panel:**

- **Your link:** `metoai.site/profile/you` · Live
- **Works everywhere:** ChatGPT · Claude · Gemini · Grok · Cursor · Agents · Team

---

## Pricing (`landing-pricing-section.tsx` + `pricing-plan-data.ts`)

**Eyebrow:** Pricing

**Title:** Start free. Upgrade when you need AI.

**Subtitle:** Every account gets a trial. Pick Free to edit manually, or Pro for AI-powered updates and gap fixes.

### Free — $0 forever

- **Tagline:** Edit manually after your trial. No AI actions.
- **Features:** Manual profile editing · Context score & gaps · Workspace copy · Public profile
- **CTA:** Choose plan

### Pro — $10 / mo *(featured)*

- **Tagline:** 3-day trial first, then subscribe when you're ready.
- **Features:** AI gap fixes & updates · LLM compile for every AI · Brain dump onboarding · 600 AI actions / month
- **Badge:** Popular
- **CTA:** Choose plan

---

## Final CTA (`landing-final-cta-section.tsx`)

**Eyebrow:** Get started

**Title:** Stop starting from zero.

**Body:** One profile that travels with you — so every AI already knows who you are, what you build, and how you work.

**Side copy:** Try Meto free — no credit card, no setup friction.

**Buttons:** Start building → · View pricing

**Footnote:** Free plan available · Upgrade when you need AI

---

## Footer (`landing-page-footer.tsx`)

**Links:** How it works · Context Score · Share · Pricing · Dashboard (if logged in) · Privacy · Terms · Cookies

**Copyright:** © {year} Meto

---

## Auth modal (`profile-auth-modal.tsx` — triggered from landing)

### Gate mode

- **Eyebrow:** Get started
- **Title:** Sign in to chat with Meto
- **Body:** Create a free account or log in to build your AI identity.
- **Tabs:** Sign up · Log in
- **Buttons:** Create account · Log in

### Save mode

- **Eyebrow:** Profile ready
- **Title:** Save your profile
- **Body:** Your AI identity is ready — save it to your dashboard.
- **Button:** Save & go to dashboard

---

## Unused copy file (`landing-copy.ts`)

Not on the live page, but defined:

- **Eyebrow:** Your AI profile
- **Headline:** Stop repeating yourself to every AI.
- **Subhead:** Create a personal AI profile once and use it everywhere.
- **CTA:** Start building now
- **Input placeholder:** What should AI know about you?
