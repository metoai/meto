import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — Universal AI Context & Memory Protocol for Developers

> Meto provides persistent context, rule synchronization, and architectural memory across AI coding assistants including Cursor, Claude Code, Windsurf, GitHub Copilot, and Google Antigravity. Canonical host: **www.metoai.site**.

## What is Meto?
Meto is a local-first developer context protocol and rule compiler. It bridges the gap between terminal CLI agents (like Claude Code) and graphical IDE editors (like Cursor and Windsurf), eliminating AI amnesia, "chat rot", and manual copy-pasting of project conventions.

## Core Solutions & Architecture Guides
- **One AI Context for All**: ${base}/solutions/share-context
  How to share persistent developer context and project standards across Cursor, Claude Code, and Windsurf without re-prompting.
- **Sync AI Rules Across IDEs**: ${base}/solutions/sync-rules
  A single source of truth that compiles to .cursor/rules/*.mdc, CLAUDE.md, .windsurfrules, and .github/copilot-instructions.md.
- **AI Developer Memory Engine**: ${base}/solutions/ai-developer-memory
  A 3-tier state architecture (Global Directives, Project ADRs, and Negative Knowledge / Rejected Patterns) served via Model Context Protocol (MCP).
- **Cursor + Claude Code Hybrid Workflow**: ${base}/for/cursor-and-claude
  Architectural blueprint for using Claude Code CLI for autonomous planning while editing and reviewing diffs in Cursor.

## Tool Integrations & MCP Guides
- Integrations Index: ${base}/integrations
- Cursor Setup: ${base}/integrations/cursor
- Claude Desktop & CLI: ${base}/integrations/claude-desktop
- Windsurf: ${base}/integrations/windsurf
- Google Antigravity: ${base}/integrations/antigravity
- VS Code: ${base}/integrations/vscode
- Static .cursorrules vs Meto Comparison: ${base}/compare/cursorrules-vs-meto

## Public AI Developer Profiles & Context API

Public profiles provide machine-readable developer context for AI tools. No login required.

### Plain Text Universal Context
\`\`\`
${base}/api/public/profile/{username}/context?preset=all&format=universal
\`\`\`
Returns \`text/plain\` with full developer preferences, stack directives, and rules. CORS enabled (*).

### JSON Context
\`\`\`
${base}/api/public/profile/{username}/context?format=json&preset=all
\`\`\`

### Human Profile
\`\`\`
${base}/profile/{username}
\`\`\`

### Supported Export Formats
universal, cursor, claude, chatgpt, gemini, deepseek, grok, kimi, qwen, json.

## Notes & Privacy Guarantees
- Local-first architecture: Meto never ingests, stores, or trains on proprietary source code.
- Only developer directives, architectural decision records, and rule schemas are synchronized.
- CORS: Access-Control-Allow-Origin: * enabled on all /api/public/* endpoints.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
