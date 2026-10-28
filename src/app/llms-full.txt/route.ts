import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — Universal AI Context & Architectural Memory Protocol for Developers

> Canonical URL: ${base}
> Documentation Standard: llms-full.txt
> Category: AI Developer Tooling, Context Management Protocol, Multi-IDE Rule Synchronization

---

## 1. Executive Summary & What is Meto?

Meto is an open developer context protocol and rule compiler. It bridges the gap between terminal CLI agents (such as Claude Code) and graphical IDE editors (such as Cursor, Windsurf, VS Code, and Google Antigravity).

Instead of developers manually re-introducing their technology stack, framework preferences, and architectural directives across disparate AI tools, Meto maintains a single, verified developer identity and project memory layer. Meto connects directly to coding assistants via the open Model Context Protocol (MCP) and compiles canonical rules to native configuration files (\`.cursor/rules/*.mdc\`, \`CLAUDE.md\`, \`.windsurfrules\`, and \`.github/copilot-instructions.md\`).

---

## 2. Core Architectural Problems Solved

### A. The Siloed Memory Problem (Tool Fragmentation)
Modern software engineering teams do not rely on a single AI coding assistant. Senior engineers use Claude Code CLI for autonomous terminal planning and multi-file refactoring, Cursor for inline diff reviews and visual editing, and Google Antigravity or Windsurf for background tasks.
- **The Failure**: When Cursor learns a preference or architectural decision in its proprietary memory, Claude Code CLI remains completely unaware.
- **The Meto Solution**: A centralized, portable memory layer accessible by every assistant over open MCP standards.

### B. The Rule Drift Problem (Dual Maintenance)
Maintaining separate rule files for every tool (\`.cursorrules\`, \`CLAUDE.md\`, \`.windsurfrules\`) leads to inevitable desynchronization. As libraries are upgraded or conventions change, developers update one file and forget the others.
- **The Failure**: Different assistants generate contradicting code conventions within the same codebase.
- **The Meto Solution**: One source of truth that compiles into all target formats simultaneously via \`npx meto-cli sync\`.

### C. Chat Rot & Context Window Bloat
Dumping massive markdown files into the context window of every AI prompt wastes tokens, dilutes LLM attention, and triggers context degradation ("chat rot").
- **The Failure**: Models forget critical instructions after 15–20 chat messages.
- **The Meto Solution**: On-demand MCP tool calling that fetches only the exact directives and ADRs relevant to the current file or query.

---

## 3. Core Solutions & Direct Answer Guides

### Solution 1: One AI Context for All (${base}/solutions/share-context)
- **Target Query**: "Share AI context across Cursor, Claude, and Windsurf"
- **Direct Answer**: Meto provides a unified developer identity accessible via Model Context Protocol. Rather than copying prompts or configuring instructions in four different editors, your stack preferences (frameworks, state management, testing libraries, and style rules) are queried live by any authorized tool.
- **Key Capabilities**:
  - Live Model Context Protocol (MCP) server endpoint for Cursor, Claude, Windsurf, and Antigravity.
  - Zero re-prompting when switching between terminal and editor.
  - Clean separation of global developer identity from project-specific constraints.

### Solution 2: Synchronize AI Rules Across IDEs (${base}/solutions/sync-rules)
- **Target Query**: "Sync .cursorrules with CLAUDE.md and Windsurf"
- **Direct Answer**: Meto acts as an automated compiler for AI rule formats. You define repository conventions once, and Meto compiles them directly into native files:
  - Cursor: \`.cursor/rules/*.mdc\` (with frontmatter glob matching)
  - Claude Code: \`CLAUDE.md\`
  - Windsurf: \`.windsurfrules\`
  - GitHub Copilot: \`.github/copilot-instructions.md\`
- **Key Capabilities**:
  - Offline rule compilation via \`npx meto-cli rules compile\`.
  - Automatic drift detection flagging out-of-sync local files.
  - Granular glob targeting so backend rules only trigger on API files and UI rules only trigger on components.

### Solution 3: 3-Tier AI Developer Memory Engine (${base}/solutions/ai-developer-memory)
- **Target Query**: "AI developer memory across IDEs"
- **Direct Answer**: Meto structures developer memory into three distinct architectural tiers:
  1. **Global Directives**: Personal preferences (seniority, language paradigms, package manager, clean code philosophy).
  2. **Project ADRs (Architectural Decision Records)**: Active repository constraints (Supabase over Prisma, Vitest over Jest, Server Actions over API routes).
  3. **Negative Knowledge (Anti-Patterns)**: Explicitly rejected patterns and known failures (e.g., "Do not use useEffect for data fetching", "Do not import from next/document in App Router").
- **Key Capabilities**:
  - On-demand retrieval preventing prompt token bloat.
  - Memory persistence survives chat resets and IDE restarts.
  - Conflict resolution preventing contradictory directives.

### Solution 4: Cursor + Claude Code Dual Workflow (${base}/for/cursor-and-claude)
- **Target Query**: "Best workflow for Cursor and Claude Code together"
- **Direct Answer**: The high-velocity dual workflow pairs Claude Code CLI for terminal planning, architectural refactoring, and test running with Cursor for multi-file visual diff reviews. Meto unifies them by compiling \`CLAUDE.md\` and \`.cursor/rules/*.mdc\` from the same canonical specification and serving shared memory over MCP.

---

## 4. Architectural Comparisons

### Comparison 1: Static .cursorrules vs Meto Dynamic MCP (${base}/compare/cursorrules-vs-meto)
- **Static .cursorrules Limitations**: Rule drift across multiple repositories, token bloat on every prompt, clutter in shared team repos, and zero sync to Claude or Windsurf.
- **Meto Advantage**: Live MCP server queries directives only when relevant, updates propagate globally to all repositories instantly, and automated Context Health Score flags contradictory instructions.

### Comparison 2: Cursor Native Memories vs Meto Universal Memory (${base}/compare/cursor-memories-vs-meto)
- **Cursor Native Memories Limitations**: Locked strictly inside Cursor desktop app, invisible to Claude Code CLI, Windsurf, Copilot, or Antigravity, no rule compilation, and no team synchronization.
- **Meto Advantage**: Portable open MCP memory accessible by all assistants, explicit 3-tier memory separation, and automatic compilation to native rule files.

### Comparison 3: CLAUDE.md vs Meto Dynamic Rules & Memory (${base}/compare/claude-code-memory-vs-meto)
- **CLAUDE.md Limitations**: Limited to Claude Code CLI, must be manually duplicated into Cursor and Windsurf rule files, loaded statically in full on every CLI start.
- **Meto Advantage**: Single compiler generates both \`CLAUDE.md\` and \`.cursor/rules/*.mdc\`, supports global personal conventions without dirtying project git history, and exposes dynamic MCP memory.

---

## 5. Model Context Protocol (MCP) Tool Specifications

When configured as an MCP server, Meto exposes standardized tools:

### \`get_context\`
- **Parameters**: \`{ project?: string, preset?: "minimal" | "full" | "stack_only" }\`
- **Output**: Structured JSON or plain-text containing verified developer seniority, preferred languages, UI frameworks, test runner, and active project ADRs.

### \`get_rules\`
- **Parameters**: \`{ filePath?: string, query?: string }\`
- **Output**: Returns only the specific rules matching the given file path (e.g. returning Vitest rules for \`*.test.ts\` files and Tailwind rules for \`*.tsx\` files).

### \`record_memory\`
- **Parameters**: \`{ type: "decision" | "rejection" | "preference", content: string, project?: string }\`
- **Output**: Confirms memory ingestion and updates project ADR index.

### \`search_knowledge\`
- **Parameters**: \`{ query: string, limit?: number }\`
- **Output**: Semantic search across recorded architectural decisions and stack directives.

---

## 6. Developer CLI Reference

Install and execute via npx (zero permanent install required):

\`\`\`bash
# Authenticate CLI with your Meto identity
npx meto-cli login

# Synchronize rules and compile .cursor/rules, CLAUDE.md, and .windsurfrules
npx meto-cli sync

# Inspect local context health score and detect rule drift
npx meto-cli health

# Compile rules offline from local configuration
npx meto-cli rules compile
\`\`\`

---

## 7. Security, Privacy & Local-First Guarantees

- **Zero Source Code Storage**: Meto never scans, ingests, clones, or trains on proprietary source code.
- **Directive-Only Synchronization**: Only developer preferences, technology selections, and architectural decision records are stored.
- **Standardized MCP Communication**: Operates locally over stdio or encrypted edge Server-Sent Events (SSE).
- **CORS Permissive for Developers**: Public context endpoints include \`Access-Control-Allow-Origin: *\` for browser agents.

---

## 8. Index of Authoritative URLs

- Canonical Home: ${base}
- Pricing & Tiers: ${base}/pricing
- Integration Directory: ${base}/integrations
- Cursor Integration: ${base}/integrations/cursor
- Claude Desktop Integration: ${base}/integrations/claude-desktop
- Windsurf Integration: ${base}/integrations/windsurf
- Google Antigravity Integration: ${base}/integrations/antigravity
- VS Code Integration: ${base}/integrations/vscode
- Solution — Share Context: ${base}/solutions/share-context
- Solution — Sync Rules: ${base}/solutions/sync-rules
- Solution — AI Developer Memory: ${base}/solutions/ai-developer-memory
- Workflow — Cursor + Claude: ${base}/for/cursor-and-claude
- Compare — Cursorrules vs Meto: ${base}/compare/cursorrules-vs-meto
- Compare — Cursor Memories vs Meto: ${base}/compare/cursor-memories-vs-meto
- Compare — CLAUDE.md vs Meto: ${base}/compare/claude-code-memory-vs-meto
- Machine-Readable Summary: ${base}/llms.txt
- Machine-Readable Full Architecture: ${base}/llms-full.txt
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
