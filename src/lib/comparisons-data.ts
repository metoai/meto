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
    ],
  },
];

export function getComparisonBySlug(slug: string): ComparisonItem | undefined {
  return COMPARISONS_LIST.find((c) => c.slug === slug);
}
