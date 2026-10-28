import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — Universal AI Context & Architectural Memory Protocol

> Meto is an open developer context protocol and multi-IDE rule compiler. It bridges terminal CLI agents (Claude Code) and desktop IDEs (Cursor, Windsurf, VS Code, Google Antigravity), eliminating context rot, rule drift, and manual re-prompting. Canonical URL: ${base}.

Full single-fetch documentation is available at: ${base}/llms-full.txt

## Core Solutions & Architecture
- [Share AI Context Across Tools](${base}/solutions/share-context): How to maintain one persistent developer identity across Cursor, Claude Code, and Windsurf via Model Context Protocol (MCP).
- [Sync Rules Across IDEs](${base}/solutions/sync-rules): Single source of truth compiling to .cursor/rules/*.mdc, CLAUDE.md, .windsurfrules, and .github/copilot-instructions.md.
- [AI Developer Memory Engine](${base}/solutions/ai-developer-memory): 3-tier memory protocol separating global directives, project ADRs, and negative antipatterns.
- [Team Context Sync](${base}/solutions/team-context-sync): Centralized architectural standards and negative constraint enforcement for engineering teams.
- [Monorepo AI Rules](${base}/solutions/monorepo-ai-rules): Package-scoped rule compilation and MCP memory for Turborepo, Nx, and pnpm workspaces.
- [Personal AI Identity for All Chatbots](${base}/solutions/personal-ai-identity): One portable identity, background, and communication preference across ChatGPT, Claude.ai, Gemini, and DeepSeek.
- [Universal Custom Instructions](${base}/solutions/universal-custom-instructions): Write custom instructions once and sync them across ChatGPT, Claude Projects, Gemini Advanced, and coding IDEs.
- [Cursor + Claude Code Workflow](${base}/for/cursor-and-claude): Dual-engine workflow combining Claude Code CLI for autonomous planning with Cursor for visual diff editing.

## Architectural Comparisons
- [Static .cursorrules vs Meto MCP](${base}/compare/cursorrules-vs-meto): Why static rule files drift and bloat prompt tokens compared to dynamic MCP context.
- [Cursor Native Memories vs Meto](${base}/compare/cursor-memories-vs-meto): Overcoming siloed IDE memory to share context across Cursor, Claude Code, and Windsurf.
- [CLAUDE.md vs Meto Dynamic Rules](${base}/compare/claude-code-memory-vs-meto): Compiling CLAUDE.md and .cursor/rules from one canonical source.
- [Mem0 vs Meto Developer Memory](${base}/compare/mem0-vs-meto): Generic consumer chatbot RAG memory vs code-centric multi-IDE rule compiler and MCP server.
- [Copilot Instructions vs Meto](${base}/compare/copilot-instructions-vs-meto): Dynamic multi-IDE rule sync vs static .github/copilot-instructions.md.
- [Windsurfrules vs Meto](${base}/compare/windsurfrules-vs-meto): Eliminating rule duplication when switching between Windsurf Cascade and Cursor.
- [threadctx-mcp vs Meto](${base}/compare/threadctx-vs-meto): Why passive JSON memory files fall short compared to deterministic multi-IDE rule compilation.
- [Cognee vs Meto](${base}/compare/cognee-vs-meto): Heavy Python knowledge graphs vs zero-overhead developer context and MCP tooling.
- [gcontext vs Meto](${base}/compare/gcontext-vs-meto): Shared markdown folders vs intelligent 3-tier developer memory and conflict scoring.
- [ChatGPT Custom Instructions vs Meto](${base}/compare/chatgpt-custom-instructions-vs-meto): Why siloed 1,500-character custom instructions fall short compared to universal cross-platform identity and dynamic MCP context.
- [ChatGPT Memory vs Meto](${base}/compare/chatgpt-memory-vs-meto): Black-box proprietary memory locked inside OpenAI vs transparent, portable user memory shared across Claude, Gemini, DeepSeek, and coding tools.

## IDE & Assistant Integrations
- [Integrations Directory](${base}/integrations): Index of supported coding assistants and tools.
- [Cursor Integration Guide](${base}/integrations/cursor): Setting up Meto as an MCP server and rule generator in Cursor.
- [Claude Code CLI Guide](${base}/integrations/claude-code): One-line terminal MCP registration and dynamic CLAUDE.md compilation.
- [Claude.ai Web & Projects Guide](${base}/integrations/claude-ai): Syncing universal custom instructions and project context into Claude.ai and Claude Projects.
- [Claude Desktop Guide](${base}/integrations/claude-desktop): Configuring claude_desktop_config.json with Meto MCP server.
- [Windsurf Integration Guide](${base}/integrations/windsurf): Connecting Cascade to Meto MCP and generating .windsurfrules.
- [Zed Editor Guide](${base}/integrations/zed): Configuring Zed context_servers with Meto MCP.
- [Google Antigravity Guide](${base}/integrations/antigravity): Adding Meto memory skills and context providers to Antigravity workspaces.
- [VS Code Integration Guide](${base}/integrations/vscode): Connecting Continue, Cline, and Roo Code to Meto.
- [GitHub Copilot Guide](${base}/integrations/github-copilot): Generating copilot-instructions.md and configuring VS Code Copilot MCP.
- [ChatGPT Integration Guide](${base}/integrations/chatgpt): Connecting ChatGPT custom instructions and GPT actions to Meto identity.
- [Google Gemini Guide](${base}/integrations/gemini): Syncing persona and preferences with Gemini Advanced and Google AI Studio.
- [DeepSeek Integration Guide](${base}/integrations/deepseek): Applying universal context to DeepSeek Chat and DeepSeek Reasoner sessions.

## Developer CLI Commands
- \`npx meto-cli login\`: Authenticate developer terminal.
- \`npx meto-cli sync\`: Compile canonical rules to .cursor/rules, CLAUDE.md, and .windsurfrules.
- \`npx meto-cli health\`: Audit context completeness and identify rule conflicts.
- \`npx meto-cli rules compile\`: Offline rule compilation from local configuration.

## Privacy & Security Guarantees
- Zero source code storage: Meto never ingests, stores, clones, or trains on proprietary code repositories.
- Only developer directives, architectural decisions, and rule schemas are synchronized.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
