export type ComparisonFeature = {
  feature: string;
  traditional: string;
  meto: string;
  metoAdvantage: boolean;
};

export type ComparisonItem = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  targetQuery: string;
  headline: string;
  subtitle: string;
  traditionalLabel: string;
  traditionalPros: string[];
  traditionalCons: string[];
  metoPros: string[];
  featuresMatrix: ComparisonFeature[];
  detailedBreakdown: {
    heading: string;
    body: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
};

export const COMPARISONS_LIST: ComparisonItem[] = [
  {
    slug: "cursorrules-vs-meto",
    title: "Static .cursorrules vs Dynamic Meto MCP",
    metaTitle: ".cursorrules vs Meto Dynamic MCP — Context Management Compared",
    metaDescription:
      "Comparing static .cursorrules files with dynamic Model Context Protocol (MCP) profiles in Meto. Learn how to prevent rule drift and keep AI context updated across all repos.",
    targetQuery: "cursorrules vs mcp",
    headline: "Stop Copy-Pasting .cursorrules. Use Live MCP Identity.",
    subtitle:
      "Why hardcoded .cursorrules files become obsolete, and how a personal Model Context Protocol server keeps Cursor aligned with your exact standards across every repository.",
    traditionalLabel: "Static .cursorrules Files",
    traditionalPros: [
      "Simple to commit into a single repository",
      "No network latency (read directly from disk)",
      "Good for repository-specific scripts and folder structures",
    ],
    traditionalCons: [
      "Rule Drift: When you upgrade a library or change a preference, old repos remain stuck on outdated rules",
      "Token Bloat: Massive markdown files dumped into every single prompt consume context window and increase cost",
      "Repository Clutter: Pollutes open-source projects or client repos with personal coding preferences",
      "No Cross-Tool Sync: Doesn't sync to Windsurf, Claude Desktop, Antigravity, or ChatGPT",
    ],
    metoPros: [
      "Global Sync: Update your preferences once in Meto, and all IDEs immediately receive the latest directives",
      "On-Demand Lazy Loading: Model Context Protocol (MCP) queries only relevant tools and directives when needed",
      "Context Health Score: Interactive audit flags missing or contradictory stack directives before AI halluncinates",
      "Universal Portability: One identity connects seamlessly to Cursor, Windsurf, Claude, VS Code, and Google Antigravity",
    ],
    featuresMatrix: [
      {
        feature: "Multi-Repository Synchronization",
        traditional: "Manual copy-paste into every project root",
        meto: "Instant global synchronization across all repositories",
        metoAdvantage: true,
      },
      {
        feature: "Cross-IDE Support",
        traditional: "Cursor only (requires separate files for Windsurf/Copilot)",
        meto: "Cursor, Windsurf, Antigravity, Claude, VS Code, and ChatGPT",
        metoAdvantage: true,
      },
      {
        feature: "Token Efficiency",
        traditional: "Appended to every prompt verbatim",
        meto: "Lazy-loaded tools and on-demand resource queries via MCP",
        metoAdvantage: true,
      },
      {
        feature: "Rule Conflict Detection",
        traditional: "None (AI can receive contradictory instructions)",
        meto: "Automated Context Score & gap analysis engine",
        metoAdvantage: true,
      },
      {
        feature: "Project-Specific Overrides",
        traditional: "Full manual file editing",
        meto: "Supports per-project namespaces alongside global identity",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "The Problem of 'Context Drift'",
        body: "Developers usually start by creating a .cursorrules file in their primary repository. Over months, they discover better TypeScript patterns, switch from Jest to Vitest, or adopt Tailwind v4. However, older repositories, side projects, and open-source contributions retain the old .cursorrules. The AI ends up generating outdated code because the developer cannot practically update hundreds of rule files manually.",
      },
      {
        heading: "The Model Context Protocol (MCP) Advantage",
        body: "The Model Context Protocol standardizes how AI assistants query external knowledge. Instead of stuffing static text into the system prompt, Cursor connects to Meto as an MCP server. When Cursor needs to write a database query or create a component, it invokes Meto's verified tools to fetch your exact conventions in real-time.",
      },
      {
        heading: "Can You Use Both Together?",
        body: "Yes! The recommended setup is to use Meto for your global developer identity (seniority, preferred languages, primary UI libraries, testing philosophy) and keep a tiny, 5-line .cursorrules file only for repo-specific build commands (like 'npm run test:watch' or 'docker compose up').",
      },
    ],
    faq: [
      {
        question: "Does Meto slow down Cursor responses?",
        answer:
          "No. Meto connects over local or fast edge SSE proxies. MCP tool calls occur asynchronously only when the model determines your profile directives are necessary.",
      },
      {
        question: "Is my code or intellectual property uploaded to Meto?",
        answer:
          "No. Meto stores your developer profile, stack preferences, and architectural directives—not your proprietary source code files.",
      },
      {
        question: "Does Meto compile directly to modern .cursor/rules/*.mdc format?",
        answer:
          "Yes. With 'npx meto-cli sync', Meto compiles your canonical directives into modern Cursor MDC rule files with glob pattern matching.",
      },
    ],
  },
  {
    slug: "cursor-memories-vs-meto",
    title: "Cursor Memories vs Meto Universal Memory",
    metaTitle: "Cursor Memories vs Meto — Global Context vs Siloed IDE Storage",
    metaDescription:
      "Compare Cursor's built-in memories with Meto's open context protocol. Discover why siloed IDE memory fails in multi-tool developer workflows and how to bridge Cursor with Claude Code, Windsurf, and Copilot.",
    targetQuery: "cursor memories vs meto",
    headline: "Why Siloed IDE Memories Fail in Multi-Tool Workflows.",
    subtitle:
      "Cursor Memories remember your habits inside Cursor, but vanish the moment you switch to Claude Code CLI, Windsurf, Copilot, or Antigravity. Meto provides a portable, open memory layer across all your coding environments.",
    traditionalLabel: "Cursor Native Memories",
    traditionalPros: [
      "Zero configuration needed inside Cursor",
      "Automatically summarizes chat history and preferences",
      "Stored locally within Cursor's application data",
    ],
    traditionalCons: [
      "Vendor Lock-in: Memories are completely inaccessible from Claude Code CLI, Windsurf, Copilot, or Google Antigravity",
      "Zero Team Synchronization: Cursor memories cannot be shared with teammates or committed as architectural directives",
      "No Rule Compilation: Memories cannot automatically compile into .cursor/rules, CLAUDE.md, or .windsurfrules",
      "Black-Box Storage: Developers have minimal visibility into how memories are pruned or weighted",
    ],
    metoPros: [
      "Cross-Tool Portability: One single memory layer accessible by Cursor, Claude Code, Windsurf, VS Code, and Copilot",
      "Open Model Context Protocol (MCP): Communicates over standardized MCP tool calls rather than proprietary internal stores",
      "3-Tier Memory Architecture: Separates global developer directives, project-specific ADRs, and negative antipatterns",
      "Automatic Rule Compilation: Syncs your memory directly to .cursor/rules/*.mdc, CLAUDE.md, and .windsurfrules",
    ],
    featuresMatrix: [
      {
        feature: "Cross-Tool Memory Sharing",
        traditional: "Siloed to Cursor editor only",
        meto: "Shared across Cursor, Claude Code, Windsurf, Copilot & Antigravity",
        metoAdvantage: true,
      },
      {
        feature: "Protocol Openness",
        traditional: "Proprietary internal Cursor format",
        meto: "Open Model Context Protocol (MCP) standard",
        metoAdvantage: true,
      },
      {
        feature: "Rule Compiler Integration",
        traditional: "None (separate from .cursorrules)",
        meto: "Direct compilation to .cursor/rules/*.mdc & CLAUDE.md",
        metoAdvantage: true,
      },
      {
        feature: "Negative Knowledge (Antipatterns)",
        traditional: "Unreliable implicit memory decay",
        meto: "Explicit rejected patterns & constraint enforcement",
        metoAdvantage: true,
      },
      {
        feature: "Local-First Storage & Sync",
        traditional: "Synced to Cursor cloud account",
        meto: "Local-first with edge SSE MCP proxy",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "The Trap of Siloed IDE Memory",
        body: "Modern senior engineers do not use a single AI tool. They architect and plan complex features in Claude Code CLI, jump into Cursor for multi-file visual diff editing, and run background agents in Google Antigravity or Windsurf. When Cursor stores memories internally, Claude Code has no idea what Cursor learned, resulting in repetitive prompts and conflicting architectural patterns.",
      },
      {
        heading: "How Meto's 3-Tier Memory Solves Fragmentation",
        body: "Meto structures memory into three explicit layers: Global Directives (seniority, functional programming preferences, package manager), Project ADRs (database choice, authentication strategy, library version constraints), and Negative Knowledge (libraries explicitly forbidden, patterns that previously failed). Every tool connects via MCP or compiled rules, ensuring uniform understanding.",
      },
      {
        heading: "Using Cursor Memories Alongside Meto",
        body: "You do not need to disable Cursor's internal features. Meto serves as your authoritative source of truth, while Cursor's local memory handles micro-interactions within individual coding sessions. Whenever you define a permanent stack convention or project constraint, record it in Meto to propagate it across all your coding tools.",
      },
    ],
    faq: [
      {
        question: "Can I migrate my existing Cursor memories to Meto?",
        answer:
          "Yes. You can paste your existing Cursor memories or custom instructions into Meto's onboarding or quick-update chat. Meto extracts your tech stack, preferences, and directives automatically.",
      },
      {
        question: "Does Meto replace .cursor/rules/*.mdc files?",
        answer:
          "Meto can either compile directly to .cursor/rules/*.mdc files using the Meto CLI ('npx meto-cli sync'), or serve context dynamically via MCP without cluttering your repository.",
      },
      {
        question: "Why is an open MCP memory better than proprietary IDE memory?",
        answer:
          "Model Context Protocol is an open standard supported by Anthropic, Cursor, Zed, Windsurf, and developer tooling ecosystems. An open protocol protects you from vendor lock-in as AI models and editors evolve.",
      },
    ],
  },
  {
    slug: "claude-code-memory-vs-meto",
    title: "CLAUDE.md vs Meto Dynamic Rules & Memory",
    metaTitle: "CLAUDE.md vs Meto — Static Terminal Markdown vs Dynamic Multi-IDE Rules",
    metaDescription:
      "Compare static CLAUDE.md files with Meto's multi-IDE rule compiler and MCP memory. Learn how to keep Claude Code CLI and Cursor in perfect architectural sync.",
    targetQuery: "claude md vs meto",
    headline: "CLAUDE.md Is Great for the Terminal. Meto Connects It to the Rest of Your Stack.",
    subtitle:
      "Claude Code relies on CLAUDE.md in your repository root. But maintaining separate rule files for Claude Code, Cursor (.cursor/rules), and Windsurf (.windsurfrules) causes severe rule drift. Meto compiles one truth for all of them.",
    traditionalLabel: "Static CLAUDE.md Files",
    traditionalPros: [
      "Native support in Claude Code CLI out of the box",
      "Standard markdown file committed to Git",
      "Zero network requests for local CLI sessions",
    ],
    traditionalCons: [
      "Dual Maintenance: Must be manually kept in sync with .cursor/rules/*.mdc and .windsurfrules",
      "Rule Drift: As libraries and architectures evolve, team members forget to update CLAUDE.md across multiple repos",
      "Token Waste: Entire CLAUDE.md is loaded into every single CLI execution regardless of task relevance",
      "No Cross-Repo Global Directives: Personal preferences must be copy-pasted into every single project's CLAUDE.md",
    ],
    metoPros: [
      "Unified Rule Compilation: Single source of truth that compiles to CLAUDE.md, .cursor/rules, and .windsurfrules",
      "Global Developer Layer: Personal preferences (package managers, typing strictness) apply globally without dirtying project repos",
      "Live MCP Memory: Claude Code can query Meto's MCP server dynamically for specific architectural decisions",
      "Automated Drift Prevention: Meto CLI validates that compiled rule files match the canonical architecture",
    ],
    featuresMatrix: [
      {
        feature: "Unified Multi-IDE Generation",
        traditional: "CLAUDE.md only (manual sync with Cursor)",
        meto: "Compiles CLAUDE.md, .cursor/rules, and .windsurfrules from one source",
        metoAdvantage: true,
      },
      {
        feature: "Global Personal Conventions",
        traditional: "Requires manual copy-paste into every repo",
        meto: "Global developer layer inherited across all projects",
        metoAdvantage: true,
      },
      {
        feature: "Dynamic Context Retrieval",
        traditional: "Static file parsed at session start",
        meto: "On-demand tool queries via Model Context Protocol (MCP)",
        metoAdvantage: true,
      },
      {
        feature: "Drift & Conflict Detection",
        traditional: "None (rules can contradict each other)",
        meto: "Automated Context Health Score & rule validator",
        metoAdvantage: true,
      },
      {
        feature: "Local-First Command Line Tooling",
        traditional: "Git committed file",
        meto: "Git committed + 'npx meto-cli' synchronization",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "The Multi-Tool Dilemma: Claude Code CLI + Cursor",
        body: "The highest-performing engineering workflow in 2026 combines Claude Code CLI for autonomous terminal planning, refactoring, and test execution with Cursor for visual editor diffing and inline completions. However, Claude Code reads CLAUDE.md while Cursor reads .cursor/rules/*.mdc. In practice, developers update one file and forget the other. Within weeks, the two AI assistants generate contradicting code patterns.",
      },
      {
        heading: "Meto as the Single Rule Compiler",
        body: "Meto introduces a compiler model for AI rules. You define your stack conventions, architectural decisions, and code style once in Meto (or in a canonical meto.config.json). Running 'npx meto-cli sync' immediately compiles and formats both CLAUDE.md and .cursor/rules/*.mdc, ensuring 100% parity across both tools.",
      },
      {
        heading: "Keeping Repos Clean with Global Directives",
        body: "Committing personal coding preferences (such as keyboard bindings, shell quirks, or personal linting shortcuts) into a shared team repository's CLAUDE.md creates Git noise and team friction. Meto cleanly separates your personal developer profile from project-specific ADRs, keeping repository rule files focused purely on project architecture.",
      },
    ],
    faq: [
      {
        question: "Does Meto replace CLAUDE.md or generate it?",
        answer:
          "Meto generates and compiles CLAUDE.md. You get all the native benefits of Claude Code reading CLAUDE.md locally, without having to write or update it manually.",
      },
      {
        question: "How does Meto work with Claude Code's MCP capabilities?",
        answer:
          "Claude Code CLI natively supports Model Context Protocol. You can add Meto as an MCP server in your claude.json config so Claude Code can query your project memory dynamically.",
      },
      {
        question: "Can I use Meto in teams where some developers use Cursor and others use Claude Code?",
        answer:
          "That is the primary use case for Meto. The entire engineering team stays aligned because Meto ensures all AI coding tools read the exact same architectural standards.",
      },
    ],
  },
];

export function getComparisonBySlug(slug: string): ComparisonItem | undefined {
  return COMPARISONS_LIST.find((c) => c.slug === slug);
}
