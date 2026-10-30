# Meto — Complete Product Overview
> **A Comprehensive, Non-Technical Guide to What Meto Is, Why It Matters, and How It Works.**

---

## 1. Executive Summary

**Meto is your universal AI identity layer.** It allows you to describe who you are, what you work on, and how you think **once**, and gives every AI tool you use instant, persistent memory about you.

* **Tagline:** *Every AI should already know you. Tell Meto once — never start from scratch in Claude, ChatGPT, Cursor, or Gemini again.*
* **Product Category:** Universal Context Layer / AI Identity & Portable Memory.
* **What Meto is NOT:** Meto is **not** another chatbot or AI wrapper. It does not replace ChatGPT, Claude, or Cursor. Instead, Meto is the identity and memory layer that **powers** them, ensuring every AI tool knows who you are from the very first prompt.

---

## 2. The Problem Meto Solves

### The "Blank Slate" Crisis & AI Fragmentation
Today, knowledge workers, developers, and founders use multiple AI tools every single day:
- **Claude** for deep reasoning, architectural design, and long-form writing.
- **ChatGPT** for quick research, brainstorming, and ad-hoc problem solving.
- **Cursor / Windsurf** for daily code writing, debugging, and terminal automation.
- **Gemini / Perplexity** for live web searches and deep fact-finding.

### The Pain Points:
1. **You Start From Zero Every Single Time:** Every new chat begins with a blank slate. You waste 10–15 minutes re-explaining your background, your role, your company's tech stack, coding preferences, and tone guidelines.
2. **Context Fragmentation (Siloed Memory):** Even if ChatGPT starts to "remember" small facts about you, that memory is trapped inside OpenAI's walled garden. Claude knows nothing about it. Cursor knows nothing about it. You are fragmented across half a dozen closed ecosystems.
3. **Generic AI Answers ("Slop"):** When an AI doesn't know your context, it gives you generic, textbook answers designed for an average beginner. You have to prompt it 3–5 times just to get something tailored to your actual seniority level and environment.
4. **Maintenance Overhead:** As your role changes, tech stacks evolve, and active projects pivot, keeping your custom instructions updated across 5 different tools is impossible.

---

## 3. How Meto Works

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│  Tell Meto Once │ ────▶ │ Context Health Score │ ────▶ │ Universal Sync      │
│  (Chat / Import)│       │  & Gap Analysis      │       │ (MCP / Copy / Link) │
└─────────────────┘       └──────────────────────┘       └──────────┬──────────┘
                                                                    │
                    ┌─────────────────┬──────────────────┬──────────┴──────────┐
                    ▼                 ▼                  ▼                     ▼
               Claude Pro          ChatGPT            Cursor / IDE          Gemini
```

### Step 1: Tell Meto Once (Effortless Onboarding)
Instead of forcing you to fill out endless dry forms, Meto gives you multiple easy ways to get started:
* **Interactive AI Chat:** A natural conversation where Meto asks 3–4 targeted questions about your current role, key projects, favorite tools, and working style.
* **Brain Dump / Bio Paste:** Paste your existing resume, LinkedIn bio, portfolio text, or previous custom instructions. Meto's AI automatically analyzes the text and extracts your profile.

### Step 2: The Living Profile (7 Core Context Dimensions)
Meto structures your identity into distinct, modular sections that you can edit, update, or toggle anytime:
1. **About:** Who you are, your core philosophy, and your professional background.
2. **Work:** Your current position, company, primary responsibilities, and domain focus.
3. **Projects:** Active codebases, products, or initiatives you are building right now.
4. **Skills & Stack:** Technologies, frameworks, methodologies, and tools you specialize in.
5. **Goals:** What you are trying to achieve in the next 3–6 months.
6. **Working Style:** How you prefer to think, iterate, write, and make decisions.
7. **Context for AI (Directives):** The exact rules AI must follow when assisting you (e.g., *"Never give generic fluff"*, *"Be concise"*, *"Follow strict TypeScript conventions"*).

### Step 3: Context Health Score & Gap Detection
How do you know if an AI has enough information to be useful?
* Meto calculates a **0–100 Context Score** evaluating the clarity, depth, and actionable quality of your profile.
* If a section is thin or ambiguous (e.g., your projects don't mention what framework you're using), Meto identifies a **Gap**.
* Clicking **"Fix Gap"** launches a 30-second micro-interview where Meto asks a single clarifying question and automatically updates the section for you.

### Step 4: Universal Distribution (Sharing With Any AI)
Once your profile is set up, Meto distributes it to your AI tools through three main methods:

#### Method A: Live MCP Integration (Real-Time IDE Memory)
* Compatible with **Cursor**, **Claude Desktop**, **Windsurf**, and any tool supporting the Model Context Protocol (MCP).
* Connect once using your private Meto access token.
* **The Magic:** Whenever you update a project or skill in Meto, your IDE automatically knows about it. No copy-pasting required ever again.

#### Method B: One-Click Model-Tuned Compiles
* Different AI models require different prompt phrasing to perform best.
* Meto's **Workspace** formats your profile into custom-tuned blocks for:
  * **Claude Projects / System Prompts**
  * **ChatGPT Custom Instructions**
  * **Cursor Rules**
  * **Gemini, DeepSeek, Grok, Kimi, and Qwen**
* Simply click **"Copy Context"** and paste it into the AI's settings or starting chat.

#### Method C: Shareable Public AI Profiles
* Every user gets a personalized web link (e.g., `metoai.site/profile/yourname`).
* You control privacy with granular public/private toggles for each section.
* Other people, hiring managers, or web-browsing AI tools (like Perplexity or ChatGPT Browse) can read your context directly from a public link.

### Step 5: Quick Updates (Keeping Memory Fresh)
When your life changes (e.g., you start a new project, switch frameworks, or change priorities), you don't have to overhaul your settings across 5 different apps:
* Open Meto's **Quick Update** chat.
* Type: *"I just launched Project X, and we decided to use Postgres and Next.js 15."*
* Meto's AI automatically updates your `Projects` and `Skills` sections, recalculates your Context Score, and syncs immediately to all your connected AIs.

---

## 4. Key Features & Capabilities

| Feature | What It Does | Why It Matters |
| :--- | :--- | :--- |
| **Modular Profile Engine** | Breaks your identity into 7 structured, editable blocks + custom sections. | You control exactly what context is stored and maintain clear boundaries. |
| **Context Health Score (0–100)** | Real-time diagnostic rating of your profile's completeness. | Ensures your context is strong enough for AIs to provide senior-level answers. |
| **Gap Fix Assistant** | 1–3 question micro-interviews targeted at missing details. | Fixes weak areas in under 30 seconds without tedious manual typing. |
| **Multi-Platform Workspace** | 8 distinct export formats tailored for Claude, ChatGPT, Cursor, Gemini, etc. | Prompts are engineered specifically for each model's reasoning style. |
| **Live MCP Server** | Streams your profile directly into Cursor and Claude Desktop. | Real-time context synchronization without any manual copy-pasting. |
| **Privacy & Visibility Toggles** | Every section has an individual Public/Private toggle. | Sensitive goals and internal notes stay private; portfolio highlights stay public. |
| **Quick Update Chat** | Natural conversational assistant to log life and work changes. | Keeps your context perpetually fresh in under 10 seconds. |
| **Public AI Identity Page** | Branded web page + machine-readable plain text endpoint. | Allows collaborators, clients, and web-connected AIs to know you instantly. |

---

## 5. Without Meto vs. With Meto

| Without Meto | With Meto |
| :--- | :--- |
| ❌ Spend 10 minutes typing your role, stack, and project background into every new chat. | ✅ One click or automatic MCP sync gives every AI tool your exact context instantly. |
| ❌ ChatGPT has some memory, but Claude knows nothing and Cursor is completely blind. | ✅ One universal source of truth shared across all AI models and IDEs. |
| ❌ AI gives generic, beginner-level answers that require 3 rounds of prompt correction. | ✅ AI responds with tailored, senior-level advice on the very first prompt. |
| ❌ Custom instructions get outdated, messy, and neglected across multiple accounts. | ✅ Keep your identity updated in one place with a quick 10-second chat update. |
| ❌ Anxious about switching to a new AI model because you lose all conversational history. | ✅ True portability: switch to any new model (DeepSeek, Grok, Claude 3.7) with 100% of your context intact. |

---

## 6. Who Meto Is For

1. **Software Developers & Engineers:**
   * Constantly switching between Cursor, Claude Desktop, and ChatGPT.
   * Tired of manually creating `.cursorrules` or repeating stack preferences for every repository.
2. **Founders & Solopreneurs:**
   * Wearing 10 hats daily (coding, marketing, product management, hiring).
   * Need AI to understand their business model, target audience, and active milestones without re-explaining it 20 times a day.
3. **Designers & Product Managers:**
   * Need AI to respect their design systems, user personas, and product principles.
4. **Writers & Content Creators:**
   * Need consistent voice, tone guidelines, audience demographics, and editorial standards applied across every AI tool.

---

## 7. The Bigger Vision: Your Passport for the AI Era

In the early web, we had **SSO (Single Sign-On)** like *Sign in with Google* so we wouldn't have to create a new username and password for every website.

In the AI era, we need **Single Identity for AI**:
> When you log into any AI tool, it shouldn't ask *"Who are you?"*  
> It should say: *"Welcome back, I see you're working on Meto with Next.js and Tailwind. Where should we begin today?"*

Meto is building that foundation: **an open, portable, user-owned identity layer that works across every model, every IDE, and every agent.**
