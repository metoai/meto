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
- [Cursor + Claude Code Workflow](${base}/for/cursor-and-claude): Dual-engine workflow combining Claude Code CLI for autonomous planning with Cursor for visual diff editing.

## Architectural Comparisons
- [Static .cursorrules vs Meto MCP](${base}/compare/cursorrules-vs-meto): Why static rule files drift and bloat prompt tokens compared to dynamic MCP context.
- [Cursor Native Memories vs Meto](${base}/compare/cursor-memories-vs-meto): Overcoming siloed IDE memory to share context across Cursor, Claude Code, and Windsurf.
- [CLAUDE.md vs Meto Dynamic Rules](${base}/compare/claude-code-memory-vs-meto): Compiling CLAUDE.md and .cursor/rules from one canonical source.

## IDE & Assistant Integrations
- [Integrations Directory](${base}/integrations): Index of supported coding assistants and tools.
- [Cursor Integration Guide](${base}/integrations/cursor): Setting up Meto as an MCP server and rule generator in Cursor.
- [Claude Desktop & CLI Guide](${base}/integrations/claude-desktop): Configuring claude.json with Meto MCP and compiling CLAUDE.md.
- [Windsurf Integration Guide](${base}/integrations/windsurf): Connecting Cascade to Meto MCP and generating .windsurfrules.
- [Google Antigravity Guide](${base}/integrations/antigravity): Adding Meto memory skills and context providers to Antigravity workspaces.
- [VS Code Integration Guide](${base}/integrations/vscode): Connecting Continue, Cline, and Roo Code to Meto.

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
