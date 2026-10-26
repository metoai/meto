import { MCP_TOOL_ICONS, AI_PLATFORM_ICONS, type McpToolId } from "./ai-platform-icons";
import {
  buildAntigravityMcpJson,
  buildClaudeCodeCliCommand,
  buildClaudeDesktopMcpJson,
  buildCopilotInstructions,
  buildCopilotMcpJson,
  buildCursorMcpJson,
  buildVSCodeMcpJson,
  buildWindsurfMcpJson,
  buildZedMcpJson,
} from "./mcp-install";

export type IntegrationStep = {
  title: string;
  description: string;
  code?: string;
  language?: string;
  filename?: string;
};

export type IntegrationFaq = {
  question: string;
  answer: string;
};

export type IntegrationItem = {
  slug: string;
  toolId?: McpToolId;
  name: string;
  category: "ide" | "chat" | "agent";
  tagline: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  iconUrl: string;
  overview: string[];
  painPoint: string;
  solution: string;
  keyBenefits: string[];
  steps: IntegrationStep[];
  faq: IntegrationFaq[];
  getSnippet: (endpointUrl: string, token: string) => string;
};

export const INTEGRATIONS_LIST: IntegrationItem[] = [
  {
    slug: "cursor",
    toolId: "cursor",
    name: "Cursor",
    category: "ide",
    tagline: "One-Click Persistent Context & MCP Server for Cursor IDE",
    summary:
      "Connect your Meto profile directly to Cursor via Model Context Protocol (MCP). No more outdated .cursorrules or copy-pasting your tech stack into agent chats.",
    metaTitle: "Cursor MCP Setup & Persistent AI Context Guide — Meto",
    metaDescription:
      "Learn how to connect Cursor to Meto via Model Context Protocol (MCP). Give Cursor Composer and chat persistent memory of your tech stack, coding standards, and project rules.",
    badge: "1-Click SSE / MCP",
    iconUrl: MCP_TOOL_ICONS.cursor.url,
    painPoint:
      "Static .cursorrules files quickly go stale, clutter your repository, and don't adapt when your preferences, libraries, or architecture evolve across projects.",
    solution:
      "Meto serves a live, verified Model Context Protocol endpoint that Cursor Composer queries on-demand, injecting your validated coding directives and architecture preferences into every conversation.",
    keyBenefits: [
      "1-Click deep link installation directly into Cursor Settings",
      "Native Server-Sent Events (SSE) protocol for real-time prompt context",
      "Eliminates repository clutter from duplicated rules files",
      "Automatic context scoring ensures your AI directives stay comprehensive",
    ],
    overview: [
      "Cursor is the premier AI-first code editor built on VS Code. With native MCP support, Cursor can fetch dynamic developer profiles without hardcoded instructions.",
      "By adding Meto as an MCP server, Cursor Composer will always know your preferred framework versions, styling conventions, testing tools, and design system choices.",
    ],
    steps: [
      {
        title: "One-Click Connect (Fastest)",
        description:
          "Click the Connect button on your Meto dashboard to trigger the native cursor:// deeplink. Cursor will automatically add Meto to your installed MCP servers.",
      },
      {
        title: "Manual Configuration in Cursor Settings",
        description:
          "Open Cursor → Settings (Gear icon) → Features → MCP. Click 'Add New MCP Server', select SSE, and paste your live Meto endpoint URL.",
        filename: ".cursor/mcp.json",
        language: "json",
      },
      {
        title: "Verify Connection in Composer",
        description:
          "Open Cursor Composer (Cmd+I or Ctrl+I) and type: 'Use my Meto MCP profile — summarize who I am and my tech stack.' Cursor will invoke the Meto tool and acknowledge your stack.",
        code: "Use my Meto MCP profile — summarize who I am and my tech stack.",
        language: "text",
      },
    ],
    faq: [
      {
        question: "Does Meto replace my project-specific .cursorrules?",
        answer:
          "Meto complements project-specific rules. Meto manages your global developer identity, preferred libraries, coding style, and personal directives so you never have to re-introduce your background in any repository.",
      },
      {
        question: "Is Cursor MCP communication secure?",
        answer:
          "Yes. All requests are authenticated via personal Bearer tokens over HTTPS. Your tokens can be revoked or regenerated at any time from your Meto security settings.",
      },
    ],
    getSnippet: (url, token) => buildCursorMcpJson(url, token),
  },
  {
    slug: "windsurf",
    toolId: "windsurf",
    name: "Windsurf",
    category: "ide",
    tagline: "Live Context & Cascade MCP Integration for Windsurf IDE",
    summary:
      "Equip Windsurf's Cascade flow agent with your complete developer identity. Synchronize verified tech stack preferences and code quality rules across every session.",
    metaTitle: "Windsurf Cascade MCP Configuration & Rules Guide — Meto",
    metaDescription:
      "Set up Model Context Protocol (MCP) in Windsurf IDE. Give Cascade automated access to your verified coding standards, architectural guidelines, and tech stack.",
    badge: "Direct SSE",
    iconUrl: MCP_TOOL_ICONS.windsurf.url,
    painPoint:
      "Codeium's Windsurf Cascade agent starts with a blank slate in every workspace, requiring repetitive prompt engineering to enforce your preferred patterns.",
    solution:
      "Meto connects to Windsurf's mcp_config.json via mcp-remote proxy, allowing Cascade to query your verified profile directives before executing multi-file edits.",
    keyBenefits: [
      "Seamless integration with Windsurf Cascade agent workflows",
      "Consistent coding standards across frontend, backend, and database tiers",
      "Persistent memory of past debugging decisions and project architecture",
      "Zero manual setup when switching machines or working on fresh clones",
    ],
    overview: [
      "Windsurf by Codeium is an agentic IDE designed for deep multi-file codebase operations with Cascade.",
      "Integrating Meto ensures Cascade generates production-ready code that matches your preferred typing strictness, state management solutions, and error handling patterns.",
    ],
    steps: [
      {
        title: "Open Windsurf MCP Config",
        description:
          "In Windsurf, press Cmd+Shift+P (or Ctrl+Shift+P) and search for 'Windsurf: Open MCP Config'. Or open ~/.codeium/windsurf/mcp_config.json directly.",
      },
      {
        title: "Paste Meto Configuration",
        description:
          "Add the Meto stdio proxy configuration under the 'mcpServers' object key with your unique auth token.",
        filename: "~/.codeium/windsurf/mcp_config.json",
        language: "json",
      },
      {
        title: "Test Cascade Awareness",
        description:
          "Start a Cascade prompt and verify it retrieves your active directives and stack.",
        code: "Check my Meto profile to verify what technologies and frameworks I use.",
        language: "text",
      },
    ],
    faq: [
      {
        question: "Does Windsurf support mcp-remote for hosted MCP servers?",
        answer:
          "Yes. Windsurf executes npx -y mcp-remote, securely establishing a bridge between local Cascade sessions and your hosted Meto profile.",
      },
      {
        question: "Can Cascade read specific project context from Meto?",
        answer:
          "Yes. Meto provides both global developer profile resources and per-project directives (e.g. profile://project/{slug}) that Cascade can inspect.",
      },
    ],
    getSnippet: (url, token) => buildWindsurfMcpJson(url, token),
  },
  {
    slug: "antigravity",
    toolId: "antigravity",
    name: "Google Antigravity",
    category: "agent",
    tagline: "Autonomous Agentic Context for Google Antigravity & AGY CLI",
    summary:
      "Connect Meto to Google Antigravity. Give DeepMind's agentic coding platform and subagent teams complete awareness of your stack, coding standards, and project goals.",
    metaTitle: "Google Antigravity MCP Setup & Agent Directives — Meto",
    metaDescription:
      "Configure Google Antigravity (AGY) with Meto Model Context Protocol (MCP). Feed personal coding directives and architectural blueprints into autonomous agent loops.",
    badge: "Native MCP / AGY",
    iconUrl: MCP_TOOL_ICONS.antigravity.url,
    painPoint:
      "Autonomous AI coding agents in Google Antigravity can veer off course or make incorrect library choices without clear architectural boundaries and verified stack context.",
    solution:
      "Meto acts as the persistent knowledge brain for Antigravity, letting planner agents and subagent trees read your architectural directives and avoid unwanted refactors.",
    keyBenefits: [
      "Compatible with Google Antigravity IDE, 2.0 Desktop app, and agy CLI",
      "Subagents inherit your verified tech stack and testing requirements",
      "Reduces hallucination by anchoring agents to explicit directives",
      "Integrates with Antigravity slash commands (/goal, /plan, /boost)",
    ],
    overview: [
      "Google Antigravity is DeepMind's autonomous coding assistant and agent environment. It excels at long-running tasks, complex refactors, and paired programming.",
      "Connecting Meto via MCP allows Antigravity agents to inspect your verified directives, tech stack versions, and coding preferences seamlessly.",
    ],
    steps: [
      {
        title: "Configure Antigravity MCP Server",
        description:
          "Add Meto to your Antigravity global MCP server configurations in ~/.gemini/antigravity/mcp/ or via the agy CLI settings.",
        filename: "~/.gemini/antigravity/mcp/meto.json",
        language: "json",
      },
      {
        title: "Test with Agent Planner",
        description:
          "In Antigravity chat, trigger an audit: 'Read my Meto profile to verify my architectural conventions.'",
        code: "Use my Meto MCP profile — summarize who I am, what I'm building, and my tech stack.",
        language: "text",
      },
    ],
    faq: [
      {
        question: "How does Antigravity access Meto tools and resources?",
        answer:
          "Antigravity lazily loads Meto's MCP tools (get_profile, get_project_context, list_directives) and resources, calling them only when relevant to minimize token overhead.",
      },
      {
        question: "Can I use Meto with the Antigravity Python SDK?",
        answer:
          "Yes. Any Antigravity agent or workflow created via the Python SDK can connect to Meto's standard MCP server protocol.",
      },
    ],
    getSnippet: (url, token) => buildAntigravityMcpJson(url, token),
  },
  {
    slug: "claude-desktop",
    toolId: "claude",
    name: "Claude Desktop & Code",
    category: "chat",
    tagline: "Persistent Context for Anthropic Claude Desktop and Claude Code CLI",
    summary:
      "Empower Claude with an accurate, verified representation of your developer identity. Connect Claude Desktop and Claude Code CLI via Model Context Protocol.",
    metaTitle: "Claude Desktop & Claude Code MCP Setup Guide — Meto",
    metaDescription:
      "Integrate Anthropic Claude Desktop and Claude Code CLI with Meto MCP. Give Claude persistent knowledge of your coding style, bio, and active tech stack.",
    badge: "Stdio Proxy",
    iconUrl: MCP_TOOL_ICONS.claude.url,
    painPoint:
      "Claude conversations reset every session. You constantly have to re-type 'I'm a senior fullstack engineer using Next.js 16, Supabase, and Tailwind'.",
    solution:
      "Meto synchronizes your profile directly into Claude Desktop's MCP environment, giving Claude instantaneous access to your verified stack without prompt boilerplate.",
    keyBenefits: [
      "Native support for both Claude Desktop app and Claude Code CLI",
      "Works with Claude 3.7 Sonnet hybrid reasoning models",
      "Instant synchronization when you update your skills in Meto",
      "Eliminates repetitive initial prompt explanations",
    ],
    overview: [
      "Anthropic's Claude is renowned for its nuanced code analysis and architectural problem solving.",
      "Connecting Claude Desktop to Meto gives Claude access to your background, preferred testing libraries, and styling standards in every conversation.",
    ],
    steps: [
      {
        title: "Open Claude Desktop Settings",
        description:
          "In Claude Desktop, click Claude in the menu bar → Settings → Developer → Edit Config (or open ~/Library/Application Support/Claude/claude_desktop_config.json on macOS, or %APPDATA%\\Claude\\claude_desktop_config.json on Windows).",
      },
      {
        title: "Insert Meto MCP Config",
        description:
          "Paste the Meto mcp-remote configuration under the mcpServers object and save.",
        filename: "claude_desktop_config.json",
        language: "json",
      },
      {
        title: "Restart Claude Desktop",
        description:
          "Relaunch Claude Desktop. Look for the hammer/tools icon in the chat prompt to confirm Meto is active.",
      },
    ],
    faq: [
      {
        question: "Can I use Claude Code in the terminal with Meto?",
        answer:
          "Yes! Run: claude mcp add meto -- npx -y mcp-remote <endpointUrl> --header 'Authorization: Bearer <token>' to connect Claude Code instantly.",
      },
    ],
    getSnippet: (url, token) => buildClaudeDesktopMcpJson(url, token),
  },
  {
    slug: "vscode",
    toolId: "vscode",
    name: "VS Code",
    category: "ide",
    tagline: "MCP Context for Cline, Roo Code, and Continue in Visual Studio Code",
    summary:
      "Give VS Code's top AI autonomous extensions (Cline, Roo Code, Continue) access to your personal developer profile and verified codebase directives.",
    metaTitle: "VS Code MCP Setup for Cline, Roo Code & Continue — Meto",
    metaDescription:
      "Connect VS Code AI extensions to Meto MCP. Guide Cline, Continue, and Roo Code with your verified stack, architecture standards, and developer preferences.",
    badge: "Extension Ready",
    iconUrl: MCP_TOOL_ICONS.vscode.url,
    painPoint:
      "Autonomous coding extensions in VS Code make incorrect assumptions about package versions or create unneeded boilerplate without explicit architectural constraints.",
    solution:
      "Meto provides a unified MCP server that Cline, Roo Code, and Continue query during task execution, ensuring all generated files adhere to your tech stack.",
    keyBenefits: [
      "Unified context across Cline, Roo Code, and Continue extensions",
      "Works with local open-source models (Ollama) and cloud LLMs",
      "Enforces strict typing, linting, and folder structure conventions",
      "Zero maintenance across multiple VS Code workspace windows",
    ],
    overview: [
      "Visual Studio Code remains the most popular code editor, with an ecosystem of autonomous agent extensions like Cline and Continue.",
      "Meto bridges the gap by providing these extensions with dynamic developer identity and project memory.",
    ],
    steps: [
      {
        title: "Open Extension MCP Settings",
        description:
          "In VS Code, open your extension panel (Cline or Continue). Click the MCP servers tab (or open cline_mcp_settings.json).",
      },
      {
        title: "Paste Configuration",
        description:
          "Add Meto under the 'mcpServers' configuration object.",
        filename: "cline_mcp_settings.json",
        language: "json",
      },
    ],
    faq: [
      {
        question: "Does this work on VS Code Remote SSH / Dev Containers?",
        answer:
          "Yes. Because Meto runs over standard npx mcp-remote, it works in local, remote SSH, WSL2, and Docker dev container environments.",
      },
    ],
    getSnippet: (url, token) => buildVSCodeMcpJson(url, token),
  },
  {
    slug: "chatgpt",
    name: "ChatGPT & Custom GPTs",
    category: "chat",
    tagline: "Tailored Custom Instructions & Knowledge for OpenAI ChatGPT",
    summary:
      "Configure ChatGPT Personalization and Custom GPTs with your tailored Meto developer prompt. Experience answers that are customized to your exact skill level and stack.",
    metaTitle: "ChatGPT Custom Instructions & Developer Profile Setup — Meto",
    metaDescription:
      "Optimize OpenAI ChatGPT with custom developer instructions generated by Meto. Get code suggestions that automatically match your exact frameworks and language preferences.",
    badge: "Custom Instructions",
    iconUrl: AI_PLATFORM_ICONS.chatgpt.url,
    painPoint:
      "ChatGPT default responses include generic explanations, unrelated frameworks, or deprecated syntax that you already know.",
    solution:
      "Meto generates a hyper-targeted Custom Instructions prompt compiled specifically for OpenAI's token limits and prompt formatting.",
    keyBenefits: [
      "Optimized for ChatGPT 4o, o1, and o3-mini reasoning models",
      "Eliminates unwanted beginner explanations in code responses",
      "Automatically mentions your preferred UI libraries and testing frameworks",
      "Easy copy-paste into ChatGPT Settings → Personalization",
    ],
    overview: [
      "OpenAI ChatGPT is used by millions of engineers daily. By feeding your Meto compiled profile into Custom Instructions, ChatGPT adapts every answer to your workflow.",
    ],
    steps: [
      {
        title: "Open Personalization in ChatGPT",
        description:
          "In ChatGPT, click your profile avatar (bottom-left) → Settings → Personalization.",
      },
      {
        title: "Paste into Custom Instructions",
        description:
          "Paste your compiled Meto profile prompt into 'What would you like ChatGPT to know about you to provide better responses?'.",
      },
    ],
    faq: [
      {
        question: "How often should I update ChatGPT custom instructions?",
        answer:
          "Whenever your tech stack or primary project focus changes in Meto, copy the updated prompt with one click from your Meto workspace.",
      },
    ],
    getSnippet: () => "",
  },
  {
    slug: "gemini",
    name: "Google Gemini & AI Studio",
    category: "chat",
    tagline: "Personalized System Instructions for Google Gemini Gems & AI Studio",
    summary:
      "Supercharge Google Gemini with custom developer Gems and AI Studio system instructions. Tap into Gemini's 2M token window with your full architectural context.",
    metaTitle: "Google Gemini Gems & AI Studio System Prompt Guide — Meto",
    metaDescription:
      "Configure Google Gemini custom Gems and AI Studio with your verified Meto developer identity. Get tailored code recommendations from Gemini 2.5 Flash and Pro.",
    badge: "Custom Gems",
    iconUrl: AI_PLATFORM_ICONS.gemini.url,
    painPoint:
      "Gemini's massive context window is underutilized if it doesn't know your specific project constraints, testing methodology, and preferred state management.",
    solution:
      "Meto formats your full developer profile into structured Markdown, ready to drop into Gemini Gems or Google AI Studio System Instructions.",
    keyBenefits: [
      "Leverage Gemini 2.5 Pro's 2,000,000 token context window with full project context",
      "Create specialized coding Gems (e.g., 'Senior Next.js Architect')",
      "Consistent API design standards across conversations",
      "Verified accuracy via Meto's interactive context score",
    ],
    overview: [
      "Google Gemini delivers state-of-the-art multimodal reasoning. Giving Gemini your Meto context transforms it into your personal technical co-founder.",
    ],
    steps: [
      {
        title: "Open Gems Manager in Gemini",
        description:
          "In Google Gemini, click Gems in the left sidebar → New Gem (or open System Instructions in Google AI Studio).",
      },
      {
        title: "Paste Meto Context Prompt",
        description:
          "Name your Gem (e.g. 'My Coding Assistant') and paste your compiled Meto prompt into the Instructions field.",
      },
    ],
    faq: [
      {
        question: "Can I use this with Google AI Studio API calls?",
        answer:
          "Yes. The prompt can be set as the system_instruction parameter in the Google Generative AI SDK (Python/Node).",
      },
    ],
    getSnippet: () => "",
  },
  {
    slug: "github-copilot",
    toolId: "copilot",
    name: "GitHub Copilot & Codex",
    category: "ide",
    tagline: "Persistent Context & Rules for GitHub Copilot Chat",
    summary:
      "Instruct GitHub Copilot and Codex with your verified architectural standards. Add Meto instructions to .github/copilot-instructions.md or Copilot MCP.",
    metaTitle: "GitHub Copilot Chat & Codex Instructions Guide — Meto",
    metaDescription:
      "Configure GitHub Copilot and Codex with persistent developer directives from Meto. Prevent outdated suggestions and maintain consistency across GitHub repos.",
    badge: "Copilot MCP / Instructions",
    iconUrl: MCP_TOOL_ICONS.copilot.url,
    painPoint:
      "GitHub Copilot often suggests outdated APIs, incorrect utility functions, or patterns that violate your repository conventions.",
    solution:
      "Meto generates both dynamic Copilot MCP configurations and concise .github/copilot-instructions.md files that anchor Copilot Chat to your verified standards.",
    keyBenefits: [
      "Works in VS Code, JetBrains IDEs, and GitHub.com PR reviews",
      "Enforces company or personal architectural guidelines",
      "Dynamic MCP support in Copilot Chat preview channels",
      "Eliminates hallucinated imports and incompatible packages",
    ],
    overview: [
      "GitHub Copilot is the industry-standard inline coding assistant. Providing it with Meto directives ensures inline completions and chat responses follow your conventions.",
    ],
    steps: [
      {
        title: "Option A: Add .github/copilot-instructions.md",
        description:
          "Create .github/copilot-instructions.md in your repository root and paste your Meto developer directives.",
        filename: ".github/copilot-instructions.md",
        language: "markdown",
      },
      {
        title: "Option B: Configure Copilot MCP",
        description:
          "In VS Code settings.json, add Meto under 'github.copilot.chat.mcpServers'.",
        filename: ".vscode/settings.json",
        language: "json",
      },
    ],
    faq: [
      {
        question: "Does GitHub Copilot read .github/copilot-instructions.md automatically?",
        answer:
          "Yes! GitHub Copilot Chat natively reads .github/copilot-instructions.md in the current repository and includes it in every chat request context.",
      },
    ],
    getSnippet: (url, token) => buildCopilotMcpJson(url, token),
  },
];

export function getIntegrationBySlug(slug: string): IntegrationItem | undefined {
  return INTEGRATIONS_LIST.find((i) => i.slug === slug);
}
