export type BlogSection = {
  id?: string;
  heading?: string;
  paragraphs: string[];
  codeBlock?: {
    language: string;
    filename?: string;
    code: string;
  };
  callout?: {
    type: "note" | "tip" | "warning";
    text: string;
  };
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  targetQuery: string;
  headline: string;
  subtitle: string;
  directAnswer: string;
  publishedAt: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  tableOfContents: { id: string; title: string }[];
  sections: BlogSection[];
  faq: {
    question: string;
    answer: string;
  }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-sync-cursor-rules-across-repos",
    title: "How to Sync Cursor Rules Across Multiple Repositories (Without Symlinks)",
    metaTitle: "How to Sync Cursor Rules Across Multiple Repositories — Guide",
    metaDescription:
      "Step-by-step guide on how to sync Cursor rules (.cursor/rules/*.mdc) across multiple repositories and machines without brittle symlinks or copy-pasting.",
    targetQuery: "sync cursor rules across repos",
    headline: "How to Sync Cursor Rules Across Multiple Repositories",
    subtitle:
      "Stop manually copy-pasting .cursorrules into every project. Learn how Cursor evaluates rules, why symlinks break, and how to maintain a single source of truth.",
    directAnswer:
      "Cursor organizes rules into three layers: Project Rules (.cursor/rules/*.mdc), Cloud-Synced User Rules (Cursor Settings > Rules), and Local User Rules (~/.cursor/rules/). To share rules across repositories without copy-paste drift, developers can either maintain a central Git config repository or connect a Model Context Protocol (MCP) server that serves canonical rules to Cursor across all active workspaces.",
    publishedAt: "2026-11-05",
    readTime: "7 min read",
    category: "Cursor IDE",
    author: {
      name: "Alazar Tesema",
      role: "Founder, Meto",
    },
    tags: ["Cursor", "AI Rules", "Developer Productivity", "MCP"],
    tableOfContents: [
      { id: "the-cursor-rules-hierarchy", title: "1. The 3 Layers of Cursor Rules" },
      { id: "why-symlinks-fail", title: "2. Why Symlinks and Shell Scripts Fail" },
      { id: "rule-drift-problem", title: "3. The Hidden Cost of Rule Drift" },
      { id: "mcp-solution", title: "4. The Modern Solution: Live MCP Identity" },
      { id: "step-by-step-guide", title: "5. Step-by-Step Implementation" },
    ],
    sections: [
      {
        id: "the-cursor-rules-hierarchy",
        heading: "1. The 3 Layers of Cursor Rules",
        paragraphs: [
          "Cursor evaluates AI system instructions across three distinct tiers. Understanding where your rules live is essential before attempting to synchronize them across multiple codebases.",
          "First, **Project Rules (`.cursor/rules/*.mdc`)**: These are committed directly to your repository's Git tree. They use YAML frontmatter to define file-matching globs (e.g. `src/components/**/*.tsx`) and enforce repo-specific conventions. They are ideal for team standards but do not automatically replicate to your other private projects.",
          "Second, **Global User Rules (Settings UI)**: Configured in Cursor Settings > General > Rules for AI. These are backed by your Cursor cloud account and automatically sync across your laptops when you log in, but they lack glob matching and apply uniformly to every single prompt.",
          "Third, **Local File-Based User Rules (`~/.cursor/rules/`)**: Stored on your local machine. These stay isolated to that specific computer and do not sync to work laptops or teammates.",
        ],
      },
      {
        id: "why-symlinks-fail",
        heading: "2. Why Symlinks and Shell Scripts Fail",
        paragraphs: [
          "Many developers initially attempt to solve cross-repo rule management using symbolic links (`ln -s ~/central-rules/.cursorrules .cursorrules`) or Git submodules. While this appears clean on a single macOS machine, it introduces critical failure modes in real production teams.",
          "First, Windows developers on your team cannot resolve Unix symlinks without Developer Mode permissions. Second, Git does not track symlink targets reliably across branches, causing broken link warnings. Third, when CI/CD builders or Docker containers clone the repository, the symlinked target path does not exist, causing build scripts to crash.",
        ],
        codeBlock: {
          language: "bash",
          filename: "brittle-symlink-workaround.sh",
          code: `# What many developers try (and regret):
ln -s ~/.config/cursor/rules .cursor/rules
# Problem 1: Breaks on Windows teammates' machines
# Problem 2: Fails in Docker containers and CI runners
# Problem 3: Doesn't sync to Claude Code CLI or Windsurf`,
        },
      },
      {
        id: "rule-drift-problem",
        heading: "3. The Hidden Cost of Rule Drift",
        paragraphs: [
          "Rule drift happens quietly. In January, you write a .cursorrules file recommending Next.js 14 App Router patterns. In March, you discover a cleaner Server Action mutation pattern and update your main repository.",
          "Six months later, you open an older microservice or a client project. Cursor reads the stale January rule file and generates outdated code that fails your current linting rules. You spend 20 minutes debugging AI hallucinations that were caused entirely by your own outdated configuration file.",
        ],
        callout: {
          type: "warning",
          text: "Rule drift is the #1 reason developers report that 'Cursor got dumber over time.' In reality, the editor is faithfully following obsolete instructions committed months ago.",
        },
      },
      {
        id: "mcp-solution",
        heading: "4. The Modern Solution: Live MCP Identity",
        paragraphs: [
          "Instead of scattering static markdown files across dozens of repositories, modern AI workflows use the **Model Context Protocol (MCP)**. Under this architecture, Cursor connects to a personal context server like Meto as an MCP client.",
          "When you upgrade your preferences—such as switching from Jest to Vitest or enforcing Zod v4—you update your canonical profile once. Every repository you open in Cursor immediately receives the latest directives without editing a single file in the repository.",
        ],
      },
      {
        id: "step-by-step-guide",
        heading: "5. Step-by-Step Implementation",
        paragraphs: [
          "To establish a clean, drift-free rule synchronization setup today:",
          "1. Strip personal preferences (formatting, favorite libraries, seniority) out of your repository-level `.cursor/rules` files. Keep repository rules strictly scoped to build commands and directory layouts.",
          "2. Configure an MCP server in Cursor (`~/.cursor/mcp.json` or Cursor Settings > MCP) that serves your developer identity and technical conventions dynamically.",
          "3. For repositories that require static files for team members who do not use Cursor, use a rule compiler (like `npx meto-cli sync`) to compile your canonical directives into `.cursor/rules/*.mdc`, `CLAUDE.md`, and `.windsurfrules` simultaneously.",
        ],
        codeBlock: {
          language: "json",
          filename: "~/.cursor/mcp.json",
          code: `{
  "mcpServers": {
    "meto": {
      "command": "npx",
      "args": ["-y", "meto-mcp@latest"],
      "env": {
        "METO_API_KEY": "YOUR_METO_KEY"
      }
    }
  }
}`,
        },
      },
    ],
    faq: [
      {
        question: "Does Cursor automatically sync rules across different computers?",
        answer:
          "Yes, rules added directly in Cursor Settings > Rules sync across computers via your Cursor account. However, project-level .cursor/rules/*.mdc files only sync if committed to the Git repository.",
      },
      {
        question: "Can I use the same rules in Cursor and Claude Code?",
        answer:
          "Not directly by copy-pasting, because Cursor uses .mdc files with glob patterns, while Claude Code reads a single CLAUDE.md file. You can convert them manually or use an MCP context layer like Meto to serve rules to both tools.",
      },
      {
        question: "How many rules should I include in .cursor/rules?",
        answer:
          "Keep always-on rules under 50 lines to prevent prompt token bloat. Use glob patterns (e.g. globs: ['src/api/**/*.ts']) so rules are only injected when you are actively working in those directories.",
      },
    ],
  },
  {
    slug: "claude-md-vs-cursorrules-guide",
    title: "CLAUDE.md vs .cursorrules: Format Differences, Globs, and Cross-IDE Migration",
    metaTitle: "CLAUDE.md vs .cursorrules — Format Guide & Migration",
    metaDescription:
      "Comprehensive architectural comparison between Claude Code's CLAUDE.md and Cursor's .cursor/rules/*.mdc. Learn syntax differences, scoping, and automated conversion.",
    targetQuery: "convert cursor rules to claude.md",
    headline: "CLAUDE.md vs .cursorrules: Format Differences & Migration",
    subtitle:
      "How Claude Code CLI and Cursor IDE evaluate developer instructions, and how to convert or synchronize rules between them without duplicating files.",
    directAnswer:
      "The primary difference between CLAUDE.md and Cursor rules (.mdc) is scoping: CLAUDE.md is a global markdown document loaded into every Claude Code session, whereas Cursor .mdc files use YAML frontmatter with file globs to inject rules conditionally. Converting between them requires stripping frontmatter for Claude Code, or splitting monolithic CLAUDE.md files into glob-scoped .mdc files for Cursor.",
    publishedAt: "2026-11-04",
    readTime: "6 min read",
    category: "AI Architecture",
    author: {
      name: "Alazar Tesema",
      role: "Founder, Meto",
    },
    tags: ["Claude Code", "Cursor", "CLAUDE.md", "Context Management"],
    tableOfContents: [
      { id: "format-comparison", title: "1. Format & Syntax Comparison" },
      { id: "scoping-and-bloat", title: "2. Scoping: Global vs Glob-Attached" },
      { id: "how-to-convert", title: "3. How to Convert Cursor Rules to CLAUDE.md" },
      { id: "cross-ide-synchronization", title: "4. Cross-IDE Synchronization Strategies" },
    ],
    sections: [
      {
        id: "format-comparison",
        heading: "1. Format & Syntax Comparison",
        paragraphs: [
          "As terminal AI agents like Anthropic's Claude Code gain popularity alongside AI-first IDEs like Cursor, developers find themselves managing dual configuration systems.",
          "Claude Code expects a single markdown file named `CLAUDE.md` in the repository root or at `~/.claude/CLAUDE.md`. It contains build commands, architecture notes, and code style rules.",
          "In contrast, modern Cursor has deprecated the single `.cursorrules` file in favor of the `.cursor/rules/` directory containing structured `.mdc` files with YAML frontmatter specifying `description`, `globs`, and `alwaysApply` flags.",
        ],
        codeBlock: {
          language: "markdown",
          filename: ".cursor/rules/api-conventions.mdc",
          code: `---
description: API route conventions and Zod validation
globs: src/app/api/**/*.ts
alwaysApply: false
---

# API Guidelines
- Always validate incoming request payloads with Zod schemas
- Return standard RFC 7807 Problem Details on HTTP errors`,
        },
      },
      {
        id: "scoping-and-bloat",
        heading: "2. Scoping: Global vs Glob-Attached",
        paragraphs: [
          "The critical architectural difference lies in how context window budget is allocated. Because Claude Code injects the entire `CLAUDE.md` into every CLI command, writing a 600-line documentation file wastes thousands of tokens on every interaction.",
          "Cursor's glob matching mitigates this by only reading `api-conventions.mdc` when an active tab matches `src/app/api/**/*.ts`. However, if you switch to Claude Code, those file-specific rules are completely ignored unless manually included in `CLAUDE.md`.",
        ],
      },
      {
        id: "how-to-convert",
        heading: "3. How to Convert Cursor Rules to CLAUDE.md",
        paragraphs: [
          "To migrate from Cursor rules to Claude Code manually:",
          "1. Locate all `.mdc` files inside `.cursor/rules/`.",
          "2. For rules marked with `alwaysApply: true`, strip the YAML frontmatter block (everything between `---`) and append the markdown text to the root `CLAUDE.md` under `# Core Directives`.",
          "3. For glob-scoped rules (e.g. frontend, database, scripts), condense the imperative rules into focused subsections within `CLAUDE.md` (e.g. `## Frontend Conventions`).",
          "4. Keep total `CLAUDE.md` line count under 150 lines to preserve Claude Code's reasoning budget.",
        ],
      },
      {
        id: "cross-ide-synchronization",
        heading: "4. Cross-IDE Synchronization Strategies",
        paragraphs: [
          "Rather than manually updating both files on every architectural revision, high-velocity engineering teams use unified context synchronization:",
          "With Meto's open protocol, you define your architectural rules, preferred libraries, and negative constraints in one centralized profile. Running `npx meto-cli sync` generates both `.cursor/rules/*.mdc` and `CLAUDE.md` in a single command, ensuring both tools remain 100% synchronized.",
        ],
      },
    ],
    faq: [
      {
        question: "Can Claude Code read .cursor/rules files?",
        answer:
          "Not natively. Claude Code specifically looks for CLAUDE.md in the project root or ~/.claude/CLAUDE.md. It does not automatically parse Cursor's .mdc files.",
      },
      {
        question: "Does CLAUDE.md support glob patterns?",
        answer:
          "No, standard CLAUDE.md does not support glob matching. Everything in CLAUDE.md is loaded globally into the agent's context. For on-demand capabilities, Claude Code uses Skills (.claude/skills/).",
      },
    ],
  },
  {
    slug: "stop-prompt-token-bloat-ai-rules",
    title: "Why Giant .cursorrules Files Degrade AI Quality (And How to Fix Token Bloat)",
    metaTitle: "Why Giant .cursorrules Hurt AI Quality & How to Fix Prompt Bloat",
    metaDescription:
      "Learn why monolithic .cursorrules files cause attention degradation and hallucination in AI coding assistants, and how lazy-loaded MCP rules restore model accuracy.",
    targetQuery: "cursor rules token bloat",
    headline: "Why Giant .cursorrules Degrade AI Code Quality",
    subtitle:
      "Dumping 500 lines of markdown into every AI prompt wastes tokens and causes instruction forgetfulness. Here is how modern context engineering solves it.",
    directAnswer:
      "When system instructions exceed 1,000 tokens, LLMs suffer from the 'lost in the middle' phenomenon, where the model forgets middle constraints and hallucinates deprecated patterns. To prevent token bloat, developers should split monolithic rule files into glob-attached .mdc files or use Model Context Protocol (MCP) servers to lazy-load specific domain rules only when relevant tasks are invoked.",
    publishedAt: "2026-11-03",
    readTime: "5 min read",
    category: "Context Engineering",
    author: {
      name: "Alazar Tesema",
      role: "Founder, Meto",
    },
    tags: ["Token Optimization", "Cursor", "Context Window", "LLM Performance"],
    tableOfContents: [
      { id: "lost-in-the-middle", title: "1. The 'Lost in the Middle' Effect" },
      { id: "token-cost-math", title: "2. The Mathematical Cost of Bloat" },
      { id: "imperative-rule-craft", title: "3. Crafting Ruthlessly Concise Rules" },
      { id: "on-demand-mcp", title: "4. On-Demand Context with MCP" },
    ],
    sections: [
      {
        id: "lost-in-the-middle",
        heading: "1. The 'Lost in the Middle' Effect",
        paragraphs: [
          "A common mistake among developers setting up AI coding assistants is treating rule files as complete documentation handbooks. They paste entire API references, code examples, and styling guides into `.cursorrules`.",
          "Extensive research in transformer architectures demonstrates that as prompt prefixes grow beyond a few hundred tokens, LLMs suffer from severe attention dispersion. The model pays attention to the very beginning and very end of the prompt, while instructions placed in the middle are frequently ignored or hallucinated.",
        ],
      },
      {
        id: "token-cost-math",
        heading: "2. The Mathematical Cost of Bloat",
        paragraphs: [
          "Consider a developer who sends 80 chat and inline edit requests per day. A bloated 1,200-token rule file injects 96,000 unnecessary input tokens into the context window daily.",
          "Beyond the financial API cost, this constant token drag pushes relevant codebase files out of the context window, forcing Cursor or Claude Code to truncate your actual source code when generating completions.",
        ],
      },
      {
        id: "imperative-rule-craft",
        heading: "3. Crafting Ruthlessly Concise Rules",
        paragraphs: [
          "Effective AI rules follow three fundamental rules of thumb:",
          "1. **State Negative Constraints Clearly:** Models respond with exceptional precision to explicit bans. (e.g. *'Do not use axios; use native fetch. Do not install date-fns; use Intl.DateTimeFormat'*).",
          "2. **Point to Concrete Code References:** Instead of explaining a pattern in 20 lines of prose, write: *'Follow error handling patterns established in src/lib/api-response.ts'*.",
          "3. **Prune Universal Knowledge:** Do not teach Claude or GPT how React hooks work. They already know. Only instruct the model on decisions unique to your specific architecture.",
        ],
      },
      {
        id: "on-demand-mcp",
        heading: "4. On-Demand Context with MCP",
        paragraphs: [
          "The ultimate antidote to token bloat is moving from push-based context (dumping everything upfront) to pull-based context (the agent retrieves directives on demand).",
          "With Meto's Model Context Protocol server, your global instructions remain compressed in an external index. When the AI agent determines that a task requires database standards or security policies, it queries Meto via lightweight tool calls, keeping your prompt lean, fast, and razor-sharp.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the recommended size for a .cursorrules file?",
        answer:
          "Always-on global rules should be kept under 50 lines (approx. 300-500 tokens). Detailed subsystem rules should be split into separate .mdc files attached to specific globs.",
      },
      {
        question: "How does MCP solve token bloat compared to static files?",
        answer:
          "Static files are appended to every conversation regardless of task. MCP exposes tools that the model only calls when it specifically needs your conventions, saving context window space for your actual code.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
