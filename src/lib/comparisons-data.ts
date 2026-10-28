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
  {
    slug: "mem0-vs-meto",
    title: "Mem0 vs Meto — Generic Chatbot RAG vs Multi-IDE Developer Memory",
    metaTitle: "Mem0 vs Meto — Chatbot Memory vs AI Developer Rule Engine Compared",
    metaDescription:
      "Comparing Mem0's conversational memory layer with Meto's code-centric multi-IDE rule compiler and MCP memory protocol. Learn which is best for developers.",
    targetQuery: "mem0 vs meto",
    headline: "Generic Chatbot Memory Doesn't Understand Codebases. Meto Does.",
    subtitle:
      "Mem0 focuses on consumer chatbots and generic conversation storage. Meto is engineered specifically for software development: compiling rules for Cursor, Claude Code, and Windsurf while serving architectural ADRs over MCP.",
    traditionalLabel: "Mem0 Generic RAG Memory",
    traditionalPros: [
      "Broad SDK support for consumer LLM chatbots",
      "Automatic entity and user profile extraction",
      "Good for customer support and open-ended dialogue",
    ],
    traditionalCons: [
      "Zero Multi-IDE Rule Compilation: Cannot generate .cursor/rules, CLAUDE.md, or .windsurfrules",
      "No Architectural Decision Modeling: Treats code conventions as generic conversational text",
      "No IDE Integration: Lacks native hooks for Cursor Composer, Claude Code CLI, or Windsurf Cascade",
      "Vector Hallucinations: Generic similarity search frequently retrieves outdated or conflicting code snippets",
    ],
    metoPros: [
      "Multi-IDE Rule Compiler: Compiles canonical conventions into native .cursor/rules/*.mdc and CLAUDE.md",
      "3-Tier Architecture: Separates global developer directives, project ADRs, and negative antipatterns",
      "Model Context Protocol (MCP): Connects natively to Cursor, Windsurf, Claude Code, and Google Antigravity",
      "Context Health Score: Interactive audit engine detects rule conflicts and missing stack directives",
    ],
    featuresMatrix: [
      {
        feature: "Primary Use Case",
        traditional: "Consumer chatbots & open-ended user chats",
        meto: "Professional software development & AI coding assistants",
        metoAdvantage: true,
      },
      {
        feature: "Native IDE Rule Generation",
        traditional: "None (requires custom manual integration)",
        meto: "Generates .cursor/rules, CLAUDE.md, and .windsurfrules",
        metoAdvantage: true,
      },
      {
        feature: "Model Context Protocol (MCP)",
        traditional: "Third-party community wrappers",
        meto: "Native high-performance local & edge SSE MCP servers",
        metoAdvantage: true,
      },
      {
        feature: "Negative Knowledge (Antipatterns)",
        traditional: "Implicit vector similarity without hard boundaries",
        meto: "Explicit rejected patterns & constraint enforcement",
        metoAdvantage: true,
      },
      {
        feature: "Developer CLI Tooling",
        traditional: "General Python/TypeScript client library",
        meto: "Dedicated 'npx meto-cli' for rule sync and drift checks",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "Chatbot Memory vs Developer Architecture Memory",
        body: "Mem0 is built to remember facts about human users in conversational chatbots (e.g., 'User prefers coffee over tea' or 'User's dog is named Max'). However, software development demands deterministic architectural constraints: which database ORM is authorized, what version of Next.js is running, and which antipatterns are forbidden. Meto is purpose-built to model technical decisions and enforce them across coding assistants.",
      },
      {
        heading: "The Power of Deterministic Rule Compilation",
        body: "While vector search is useful for unstructured documentation, coding assistants in IDEs perform best when given deterministic rule files with glob pattern matching. Meto translates your high-level architecture into precise MDC rule files that only load into Cursor when editing relevant files, eliminating token bloat and hallucinations.",
      },
      {
        heading: "When to Choose Which?",
        body: "If you are building a conversational consumer chatbot or a virtual customer support agent, Mem0 is an appropriate choice. If you are a developer or engineering team seeking to eliminate AI amnesia across Cursor, Claude Code, Windsurf, Copilot, and VS Code, Meto is engineered specifically for your workflow.",
      },
    ],
    faq: [
      {
        question: "Can I use Meto if I already have Mem0 in my backend?",
        answer:
          "Yes. Mem0 and Meto serve completely different purposes. Mem0 operates inside your application's user-facing chatbot, while Meto operates on your local developer workstation to sync context across your coding IDEs.",
      },
      {
        question: "Does Meto use vector embeddings or deterministic rules?",
        answer:
          "Meto combines both: deterministic rule compilation for instant, zero-latency IDE matching, alongside semantic knowledge graph search via MCP for deep architectural ADR lookups.",
      },
      {
        question: "How does Meto integrate with Cursor and Claude Code?",
        answer:
          "Meto connects directly via Model Context Protocol (MCP) and compiles native rule files into your repository root with a single 'npx meto-cli sync' command.",
      },
    ],
  },
  {
    slug: "copilot-instructions-vs-meto",
    title: "GitHub Copilot Instructions vs Meto Dynamic MCP",
    metaTitle: "Copilot Instructions vs Meto — Static Markdown vs Dynamic Multi-IDE Rules",
    metaDescription:
      "Compare .github/copilot-instructions.md with Meto's multi-IDE rule compiler and live MCP server. Discover how to keep Copilot, Cursor, and Claude in perfect sync.",
    targetQuery: "copilot instructions vs meto",
    headline: "Escape Static .github/copilot-instructions.md. Sync Everywhere.",
    subtitle:
      "GitHub Copilot's instruction file only works inside VS Code and GitHub Copilot. Meto unifies Copilot with Cursor, Claude Code, and Windsurf through automatic compilation and live MCP memory.",
    traditionalLabel: "Static .github/copilot-instructions.md",
    traditionalPros: [
      "Native support in GitHub Copilot Chat",
      "Committed directly into your Git repository",
      "Understood by GitHub.com web reviews",
    ],
    traditionalCons: [
      "Vendor Silo: Completely ignored by Cursor Composer, Windsurf Cascade, and Claude Code CLI",
      "Manual Duplication: Must be copied and manually reformatted into .cursor/rules and CLAUDE.md",
      "No Dynamic MCP Querying: Cannot be queried on demand for specific file types or subdirectories",
      "No Context Scoring: Lacks conflict detection when multiple instructions contradict each other",
    ],
    metoPros: [
      "Unified Compilation: Generates .github/copilot-instructions.md, .cursor/rules, and CLAUDE.md simultaneously",
      "Cross-Tool Portability: Gives Cursor and Claude Code the exact same context Copilot receives",
      "Live MCP Server: Serves rich context over Model Context Protocol to all supporting IDEs",
      "Automated Drift Detection: Meto CLI ensures local instruction files never diverge from canonical architecture",
    ],
    featuresMatrix: [
      {
        feature: "Cross-IDE Support",
        traditional: "GitHub Copilot & VS Code only",
        meto: "Cursor, Windsurf, Claude Code, VS Code, and Copilot",
        metoAdvantage: true,
      },
      {
        feature: "Multi-Format Rule Compilation",
        traditional: "Single markdown file only",
        meto: "Compiles to Copilot, Cursor MDC, and CLAUDE.md",
        metoAdvantage: true,
      },
      {
        feature: "Dynamic Model Context Protocol",
        traditional: "Static file parsed at prompt start",
        meto: "On-demand tool queries via MCP",
        metoAdvantage: true,
      },
      {
        feature: "Rule Conflict & Gap Analysis",
        traditional: "None (contradictions pass through undetected)",
        meto: "Automated Context Health Score engine",
        metoAdvantage: true,
      },
      {
        feature: "Developer Identity & Seniority",
        traditional: "Must be hardcoded into every repo's instructions",
        meto: "Global developer layer inherited automatically",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "The Friction of Static Copilot Instructions",
        body: "GitHub Copilot introduced .github/copilot-instructions.md to allow developers to set project standards. However, in modern teams, developers frequently use Cursor, Claude Code CLI, or Windsurf alongside Copilot. Because each tool expects instructions in a different file format and directory structure, engineering teams face a maintenance nightmare trying to keep 3 or 4 rule files in sync.",
      },
      {
        heading: "Meto as the Canonical Upstream",
        body: "Meto solves this by treating .github/copilot-instructions.md as a compile target rather than a manual editing chore. You define your stack conventions and ADRs in Meto once. When you run 'npx meto-cli sync', Meto generates the exact .github/copilot-instructions.md file that Copilot expects, while simultaneously updating Cursor's MDC rules and Claude's CLAUDE.md.",
      },
      {
        heading: "Eliminating Repo Clutter",
        body: "Often, developers want personal coding shortcuts (like preferred aliases or test commands) that do not belong in a team-shared .github/copilot-instructions.md. Meto cleanly separates your personal developer profile from repository directives, keeping shared instructions clean and professional.",
      },
    ],
    faq: [
      {
        question: "Does Meto overwrite my existing copilot-instructions.md?",
        answer:
          "Meto CLI can inspect and import your existing copilot-instructions.md file during setup, converting your existing rules into canonical directives before generating updated files.",
      },
      {
        question: "Can Copilot use Meto's MCP server directly?",
        answer:
          "Yes! GitHub Copilot in VS Code now supports Model Context Protocol. You can configure Meto as an MCP server in your VS Code settings to provide live context to Copilot Chat.",
      },
      {
        question: "What if some members of my team use Cursor and others use Copilot?",
        answer:
          "Meto ensures both developers experience identical AI behavior. Cursor users receive .cursor/rules and live MCP context, while Copilot users receive .github/copilot-instructions.md, all derived from the same source.",
      },
    ],
  },
  {
    slug: "windsurfrules-vs-meto",
    title: "Static .windsurfrules vs Meto Cross-IDE Protocol",
    metaTitle: ".windsurfrules vs Meto — Windsurf Cascade Context Management Compared",
    metaDescription:
      "Compare static .windsurfrules with Meto's multi-IDE rule compiler and Model Context Protocol server. Learn how to prevent rule drift between Windsurf and Cursor.",
    targetQuery: "windsurfrules vs meto",
    headline: "Stop Rewriting Rules When Switching Between Windsurf and Cursor.",
    subtitle:
      "Windsurf Cascade's .windsurfrules files don't share context with Cursor or Claude. Meto compiles a single source of truth across all three editors.",
    traditionalLabel: "Static .windsurfrules Files",
    traditionalPros: [
      "Native support in Codeium Windsurf Cascade",
      "Simple to place in repository root",
      "Read automatically on conversation start",
    ],
    traditionalCons: [
      "IDE Lock-in: Incompatible with Cursor's modern .cursor/rules/*.mdc format and Claude's CLAUDE.md",
      "Rule Drift: Updating Windsurf rules leaves Cursor and Copilot on stale conventions",
      "Token Bloat: Injects the entire rule file into every Cascade prompt regardless of task relevance",
      "No Personal Developer Identity: Personal conventions cannot be shared across multiple private repos",
    ],
    metoPros: [
      "Universal Rule Compilation: Compiles .windsurfrules, .cursor/rules, and CLAUDE.md in lockstep",
      "Native Cascade MCP Support: Windsurf connects directly to Meto as an MCP server",
      "Token Optimization: MCP tools fetch only relevant directives, saving Cascade context tokens",
      "Interactive Health Score: Audits rule consistency across all your projects",
    ],
    featuresMatrix: [
      {
        feature: "Multi-IDE Synchronization",
        traditional: "Windsurf only (requires separate files for Cursor/Claude)",
        meto: "Windsurf, Cursor, Claude Code, VS Code, and Copilot",
        metoAdvantage: true,
      },
      {
        feature: "Model Context Protocol Support",
        traditional: "None (static file only)",
        meto: "Full Cascade MCP server integration",
        metoAdvantage: true,
      },
      {
        feature: "Token Efficiency",
        traditional: "Dumps entire rule file into Cascade prompt",
        meto: "On-demand tool queries via MCP",
        metoAdvantage: true,
      },
      {
        feature: "Rule Conflict Auditing",
        traditional: "None (contradictions pass through silently)",
        meto: "Automated Context Health Score engine",
        metoAdvantage: true,
      },
      {
        feature: "Global Developer Directives",
        traditional: "Manual copy-paste into every repo's .windsurfrules",
        meto: "Centralized profile inherited across all workspaces",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "The Multi-Editor Reality of 2026",
        body: "Many developers use Windsurf for its revolutionary Cascade agent flow, while simultaneously relying on Cursor for specific extensions and Claude Code for terminal scripting. Managing .windsurfrules, .cursorrules, and CLAUDE.md separately creates an unsustainable maintenance burden.",
      },
      {
        heading: "Connecting Windsurf Cascade via MCP",
        body: "Windsurf Cascade features native support for Model Context Protocol. By adding Meto as an MCP server in your Windsurf configuration, Cascade queries your verified conventions dynamically during execution, ensuring the model never hallucinates outdated patterns.",
      },
      {
        heading: "Automated Compilation with Meto CLI",
        body: "If your repository requires offline file-based rules, 'npx meto-cli sync' automatically generates and formats your .windsurfrules file alongside Cursor's .cursor/rules/*.mdc, guaranteeing 100% architectural parity across your entire engineering team.",
      },
    ],
    faq: [
      {
        question: "How do I connect Meto to Windsurf Cascade?",
        answer:
          "Open Windsurf settings, navigate to Cascade MCP, and add Meto's SSE or stdio endpoint. Windsurf will immediately gain access to your verified stack directives and memory.",
      },
      {
        question: "Can Meto compile both .windsurfrules and .cursor/rules together?",
        answer:
          "Yes. Meto CLI detects your project structure and generates both formats from your single canonical Meto profile.",
      },
      {
        question: "Does Meto share my code with Codeium or external servers?",
        answer:
          "No. Meto only stores and serves your developer conventions and architectural decisions, never your source code.",
      },
    ],
  },
  {
    slug: "threadctx-vs-meto",
    title: "threadctx-mcp vs Meto — Local JSON vs Multi-IDE Compiler",
    metaTitle: "threadctx-mcp vs Meto — Cursor & Claude Shared Memory Compared",
    metaDescription:
      "Compare threadctx-mcp (Smriti MCP) with Meto. Discover why raw JSON memory files fall short compared to deterministic multi-IDE rule compilation and 3-tier MCP memory.",
    targetQuery: "threadctx vs meto",
    headline: "Why Raw JSON Files Fail for Cursor and Claude Code.",
    subtitle:
      "threadctx-mcp dumps raw chat transcripts into a local JSON file. Meto compiles deterministic rules (.cursor/rules, CLAUDE.md) while exposing an intelligent 3-tier memory protocol over MCP.",
    traditionalLabel: "threadctx-mcp (Smriti MCP)",
    traditionalPros: [
      "Local-first storage in a project JSON file",
      "Zero hosted server requirement for basic setups",
      "Simple npm package for quick evaluation",
    ],
    traditionalCons: [
      "No Rule Compilation: Cannot generate or synchronize .cursor/rules/*.mdc or CLAUDE.md files",
      "No Conflict Detection: Appends raw conversational notes without auditing contradictory directives",
      "Siloed to Two Tools: Lacks support for Windsurf Cascade, Google Antigravity, VS Code, or GitHub Copilot",
      "No Web Dashboard: Managing, editing, or sharing directives across teams requires manual JSON editing",
    ],
    metoPros: [
      "Multi-IDE Rule Compilation: Automatically compiles and formats .cursor/rules/*.mdc, CLAUDE.md, and .windsurfrules",
      "3-Tier Memory Architecture: Cleanly separates global developer directives, project ADRs, and negative antipatterns",
      "Context Health Score: Proactively audits directives for gaps, outdated libraries, and conflicting instructions",
      "Universal Portability: Works across Cursor, Claude Code, Windsurf, Google Antigravity, VS Code, and Copilot",
    ],
    featuresMatrix: [
      {
        feature: "Multi-IDE Rule Compilation",
        traditional: "None (stores raw chat text in JSON)",
        meto: "Compiles Cursor MDC, CLAUDE.md & Windsurf",
        metoAdvantage: true,
      },
      {
        feature: "Negative Knowledge & Antipatterns",
        traditional: "None (raw conversational log)",
        meto: "Explicit constraint & antipattern enforcement",
        metoAdvantage: true,
      },
      {
        feature: "Rule Conflict Auditing",
        traditional: "None",
        meto: "Automated Context Health Score engine",
        metoAdvantage: true,
      },
      {
        feature: "IDE Ecosystem Support",
        traditional: "Cursor & Claude Code only",
        meto: "Cursor, Claude, Windsurf, Antigravity, VS Code & Copilot",
        metoAdvantage: true,
      },
      {
        feature: "Quickstart CLI Tooling",
        traditional: "npx threadctx-mcp init",
        meto: "npx meto-cli sync",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "The Limitation of Unstructured Chat Logs",
        body: "Tools like threadctx-mcp attempt to share memory by appending unstructured chat transcripts into a project-level JSON file. In practice, this quickly becomes a junk drawer of stale conversation fragments that bloat prompt tokens and cause LLM attention degradation. Coding assistants do not need chat transcripts—they need authoritative architectural decisions, strict negative constraints, and framework versions.",
      },
      {
        heading: "Deterministic Rule Files vs Passive JSON",
        body: "Cursor and Claude Code perform at their highest accuracy when given native configuration files with glob matchers (.cursor/rules/*.mdc and CLAUDE.md). Meto acts as an automated compiler, generating native rule files with zero latency while exposing dynamic MCP tools for deeper architectural lookups.",
      },
      {
        heading: "Expanding Beyond Cursor and Claude",
        body: "While threadctx-mcp targets only Cursor and Claude, modern developers frequently use Windsurf Cascade for agentic flows, GitHub Copilot for inline completions, and Google Antigravity for workspace agents. Meto's universal protocol ensures all of your tools remain in 100% architectural lockstep.",
      },
    ],
    faq: [
      {
        question: "Can I switch from threadctx-mcp to Meto?",
        answer:
          "Yes. You can paste your existing threadctx JSON data into Meto's quick-update chat or run 'npx meto-cli sync' to instantly compile your standards into clean .cursor/rules and CLAUDE.md files.",
      },
      {
        question: "Is Meto local-first like threadctx-mcp?",
        answer:
          "Yes. Meto operates local-first. Rules are compiled directly onto your local disk and can be committed to Git, while MCP context queries execute locally or over fast edge SSE proxies.",
      },
      {
        question: "How do the CLI commands compare?",
        answer:
          "Where threadctx uses 'npx threadctx-mcp init' to create a JSON file, Meto uses 'npx meto-cli sync' to compile clean, native rule files across all your IDEs.",
      },
    ],
  },
  {
    slug: "cognee-vs-meto",
    title: "Cognee vs Meto — AI Agent Graph vs Developer Rule Compiler",
    metaTitle: "Cognee vs Meto — Python Knowledge Graph vs Multi-IDE Developer Memory",
    metaDescription:
      "Compare Cognee's Python-based knowledge graph memory with Meto's developer-first rule compiler and MCP protocol. Learn which fits your coding workflow.",
    targetQuery: "cognee vs meto",
    headline: "Heavy Python Graphs vs Instant Developer Rule Compilation.",
    subtitle:
      "Cognee is a complex graph database framework designed for AI research agents. Meto is purpose-built for software engineers: compiling native rules for Cursor, Claude Code, and Windsurf in seconds.",
    traditionalLabel: "Cognee Knowledge Graph",
    traditionalPros: [
      "Advanced graph database pipelines for enterprise AI agents",
      "Multi-modal vector embeddings and graph traversal",
      "Open-source Python framework",
    ],
    traditionalCons: [
      "Massive Setup Overhead: Requires Python environment, Neo4j/graph databases, and complex orchestration",
      "No Native IDE Rule Files: Cannot compile .cursor/rules/*.mdc, CLAUDE.md, or .windsurfrules",
      "Not Built for Software Engineers: Lacks understanding of package managers, linting rules, and stack constraints",
      "High Latency & Token Cost: Running graph lookups on every prompt adds latency and compute overhead",
    ],
    metoPros: [
      "Zero Infrastructure: Runs instantly via 'npx meto-cli sync' with zero Python, Docker, or database setup",
      "Multi-IDE Rule Generation: Compiles native MDC rule files and CLAUDE.md with frontmatter glob matching",
      "3-Tier Developer Memory: Purpose-built for stack directives, project ADRs, and negative antipatterns",
      "Fast Local & Edge MCP: Sub-millisecond response times without graph traversal delays",
    ],
    featuresMatrix: [
      {
        feature: "Setup Time & Complexity",
        traditional: "Hours (Python, Docker, Graph DB)",
        meto: "60 seconds (npx meto-cli sync)",
        metoAdvantage: true,
      },
      {
        feature: "Native IDE Rule Compilation",
        traditional: "None",
        meto: "Cursor MDC, CLAUDE.md, Windsurf",
        metoAdvantage: true,
      },
      {
        feature: "Target Audience",
        traditional: "AI researchers & enterprise agent builders",
        meto: "Professional software developers & teams",
        metoAdvantage: true,
      },
      {
        feature: "Negative Knowledge Enforcement",
        traditional: "Unreliable graph traversal",
        meto: "Explicit rejected patterns",
        metoAdvantage: true,
      },
      {
        feature: "Maintenance Overhead",
        traditional: "High (requires managing database nodes)",
        meto: "Zero (local-first compiler & edge MCP)",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "Research Framework vs Developer Tooling",
        body: "Cognee is an ambitious research framework that constructs knowledge graphs from unstructured documents using vector search and entity relationships. While powerful for building custom AI agent platforms in Python, it is far too heavy and complex for a developer who simply wants their Cursor Composer and Claude Code CLI to remember their coding conventions.",
      },
      {
        heading: "The Zero-Overhead Advantage of Meto",
        body: "Developers do not want to maintain a local Neo4j database or write Python pipelines just to sync coding standards. Meto gives developers the exact outcome they want—consistent AI output across every editor—in a single command: 'npx meto-cli sync'.",
      },
      {
        heading: "Deterministic Guardrails Beat Fuzzy Graphs",
        body: "When coding, fuzzy graph traversals frequently pull in out-of-context documentation snippets that dilute model attention. Meto uses deterministic rule compilation for local files, paired with targeted Model Context Protocol (MCP) tool execution for deep architectural queries.",
      },
    ],
    faq: [
      {
        question: "Is Meto an alternative to Cognee?",
        answer:
          "For software engineers using AI coding assistants (Cursor, Claude Code, Windsurf), yes. Meto replaces the need for heavy graph databases with instant rule compilation and MCP memory.",
      },
      {
        question: "Do I need to install Python or Docker to use Meto?",
        answer:
          "No. Meto requires zero dependencies. You can run 'npx meto-cli sync' directly from your existing terminal with Node.js.",
      },
      {
        question: "Can Meto export context to multiple AI tools?",
        answer:
          "Yes. Meto generates rules for Cursor, Claude Code, Windsurf, GitHub Copilot, and connects to any MCP-compatible editor.",
      },
    ],
  },
  {
    slug: "gcontext-vs-meto",
    title: "gcontext vs Meto — Shared Markdown Folder vs Multi-IDE Rule Protocol",
    metaTitle: "gcontext vs Meto — File-Based Context vs Dynamic Rule Compiler",
    metaDescription:
      "Compare gcontext's shared markdown directory with Meto's multi-IDE rule compiler and live MCP memory protocol. Discover which best prevents AI context drift.",
    targetQuery: "gcontext vs meto",
    headline: "Beyond Dumb Folders: Intelligent Rule Compilation & 3-Tier Memory.",
    subtitle:
      "gcontext exposes a raw folder of markdown files through an MCP server. Meto compiles deterministic rules for Cursor, Claude Code, and Windsurf while providing an interactive Context Health Score.",
    traditionalLabel: "gcontext (Shared Folder MCP)",
    traditionalPros: [
      "Simple concept: exposes a local folder of files via MCP",
      "Agents can read and write plain markdown files",
      "Minimal setup for basic file sharing",
    ],
    traditionalCons: [
      "Zero Rule Compilation: Does not generate .cursor/rules/*.mdc, CLAUDE.md, or .windsurfrules",
      "Manual Organization: Developers must manually organize and maintain dozens of markdown files",
      "No Conflict Detection: No automated validation when files contain conflicting or outdated instructions",
      "No Negative Knowledge Layer: Cannot explicitly enforce forbidden patterns or blocked imports",
    ],
    metoPros: [
      "Automated Rule Compiler: Translates your architecture into native Cursor MDC, CLAUDE.md, and Windsurf rules",
      "3-Tier Structured Memory: Explicitly organizes Global Directives, Project ADRs, and Anti-Patterns",
      "Context Health Score: Proactively detects missing stack directives and contradictory rules",
      "Multi-Tool Support: Native integrations for Cursor, Claude Code, Windsurf, VS Code, and Copilot",
    ],
    featuresMatrix: [
      {
        feature: "Multi-IDE Rule Compilation",
        traditional: "None (raw markdown files)",
        meto: "Native .cursor/rules, CLAUDE.md, .windsurfrules",
        metoAdvantage: true,
      },
      {
        feature: "Negative Knowledge / Antipatterns",
        traditional: "None",
        meto: "Explicit constraint enforcement",
        metoAdvantage: true,
      },
      {
        feature: "Rule Conflict Auditing",
        traditional: "None",
        meto: "Automated Context Health Score engine",
        metoAdvantage: true,
      },
      {
        feature: "Automated Glob Pattern Scoping",
        traditional: "None",
        meto: "Frontmatter glob matching for apps & packages",
        metoAdvantage: true,
      },
      {
        feature: "Team & Monorepo Synchronization",
        traditional: "Manual file copying",
        meto: "'npx meto-cli sync' in CI and local",
        metoAdvantage: true,
      },
    ],
    detailedBreakdown: [
      {
        heading: "The Trap of Managing Raw Markdown Files",
        body: "gcontext takes a straightforward approach: point an MCP server at a folder containing markdown files so Claude and Cursor can read and write to it. While intuitive, this approach quickly breaks down as a project grows. Developers end up with unmaintained markdown files that contradict each other, and neither editor knows which rules apply to which file types.",
      },
      {
        heading: "Why Rule Compilation Is Essential",
        body: "Meto recognizes that modern editors perform best when rules are compiled into their native formats (.cursor/rules/*.mdc with glob matchers and CLAUDE.md). Meto eliminates the chore of manual markdown editing by compiling clean, targeted rule files automatically.",
      },
      {
        heading: "Intelligent Memory vs Passive File Storage",
        body: "Rather than treating context as generic text files, Meto structures memory into Global Directives, Project ADRs, and Negative Knowledge. When an AI tool queries Meto via MCP, it receives structured, verified constraints rather than an entire directory of notes.",
      },
    ],
    faq: [
      {
        question: "How does Meto differ from gcontext?",
        answer:
          "gcontext is simply a file-server over MCP that serves markdown files from a folder. Meto is an intelligent developer context compiler that generates native rules (.cursor/rules, CLAUDE.md) and exposes structured 3-tier memory.",
      },
      {
        question: "Can Meto read my existing markdown notes?",
        answer:
          "Yes. You can paste your existing markdown guidelines or notes into Meto's chat or onboarding, and Meto automatically categorizes them into verified tech stack directives and ADRs.",
      },
      {
        question: "Which tool is faster to set up?",
        answer:
          "Both set up in under two minutes. With Meto, running 'npx meto-cli sync' immediately compiles rules for all your installed IDEs.",
      },
    ],
  },
];

export function getComparisonBySlug(slug: string): ComparisonItem | undefined {
  return COMPARISONS_LIST.find((c) => c.slug === slug);
}
