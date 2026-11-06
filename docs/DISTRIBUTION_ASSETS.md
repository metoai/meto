# Meto Zero-Dollar Developer Distribution & Backlink Playbook

Use these exact, copy-paste ready templates to submit Meto to the highest-authority developer registries and GitHub repositories. These provide immediate domain authority, referral traffic, and search indexing signals.

---

## 1. GitHub `awesome-mcp-servers` Submission

**Target Repositories:**
- `punkpeye/awesome-mcp-servers`
- `appcypher/awesome-mcp-servers`
- `modelcontextprotocol/servers`

**PR Title:**
`Add Meto: Universal Developer Context & Multi-IDE AI Rules MCP Server`

**Markdown Entry to Insert under `Developer Tools` or `Memory / Personalization`:**
```markdown
- [Meto](https://www.metoctx.com) - Universal Model Context Protocol (MCP) server that synchronizes developer identity, coding standards, and architectural decisions across Cursor, Claude Code, Windsurf, and VS Code without prompt bloat.
```

---

## 2. GitHub `awesome-cursorrules` Submission

**Target Repository:**
- `PatrickJS/awesome-cursorrules`

**PR Title:**
`Add Meto: Multi-IDE Rule Compiler and Live MCP Server`

**Markdown Entry to Insert under `Tools / Rule Managers`:**
```markdown
- [Meto](https://www.metoctx.com) - Open context protocol and rule compiler. Automatically compiles canonical developer directives into modern `.cursor/rules/*.mdc`, `CLAUDE.md`, and `.windsurfrules`, keeping multiple repositories synchronized. Includes a free in-browser [Cursor to CLAUDE.md Converter](https://www.metoctx.com/tools/cursor-to-claude).
```

---

## 3. MCP Registry Submissions

### A. Glama.ai ([https://glama.ai/mcp/servers](https://glama.ai/mcp/servers))
- **Server Name:** `meto-mcp`
- **Short Tagline:** Universal developer context, multi-IDE rules, and persistent memory across Cursor, Claude Code, and Windsurf.
- **Repository / Package:** `npx -y meto-mcp@latest`
- **Homepage:** `https://www.metoctx.com`
- **Tags:** `developer-tools`, `cursor`, `claude-code`, `context`, `memory`, `rules`

### B. Smithery.ai ([https://smithery.ai](https://smithery.ai))
- **Install Command:** `npx -y @smithery/cli install meto-mcp`
- **Categories:** `Productivity`, `Developer Tools`
- **Description:** Synchronizes your coding standards, architectural decisions, and stack conventions across any AI coding assistant without prompt token bloat.

### C. PulseMCP ([https://pulsemcp.com](https://pulsemcp.com))
- **Name:** Meto Context Protocol
- **Endpoint / Type:** SSE Proxy & Stdio
- **Documentation:** `https://www.metoctx.com/integrations/cursor`

---

## 4. Cursor Forum Value Post

**Target Category:** [forum.cursor.com](https://forum.cursor.com) -> *Community / Tools*  
**Title:** *How we solved rule drift across 20+ repos using live MCP (and built a free .mdc to CLAUDE.md converter)*

**Body Copy:**
```markdown
Hey everyone,

Like many of you, our team started by committing `.cursorrules` (and now `.cursor/rules/*.mdc`) into our repositories. But as our stack evolved, older repos were left following outdated conventions, and switching between Cursor and the new Claude Code CLI meant maintaining two completely different rule formats.

We solved this in two ways and wanted to share them with the community:

1. **Free In-Browser Converter & Linter:**
We built a free zero-data tool to instantly translate `.cursor/rules/*.mdc` (with globs) into `CLAUDE.md` and `.windsurfrules`, with an automated token bloat and rule quality audit:
👉 https://www.metoctx.com/tools/cursor-to-claude

2. **Open Rules Catalog:**
We also open-sourced our production rules for Next.js 15, strict TypeScript/Zod, FastAPI, and Supabase:
👉 https://www.metoctx.com/rules

3. **Live Sync with MCP:**
For developers managing dozens of repositories, we built Meto—an open Model Context Protocol server that serves your canonical rules dynamically so your assistants stay in sync without manual file duplication.

Would love feedback on the converter and how you're currently handling cross-IDE rule drift!
```

---

## 5. Reddit Value Answer Template

**Target Subreddits:** `r/CursorAI`, `r/ClaudeAI`, `r/LocalLLaMA`  
**When to Post:** Whenever a developer asks *"How do you sync Cursor rules across projects?"* or *"Can I use Cursor rules in Claude Code?"*

**Response:**
```markdown
Cursor evaluates rules on three tiers: Project Rules (`.cursor/rules/*.mdc`), Account Cloud Rules (Settings UI), and Local Rules (`~/.cursor/rules/`).

The reason symlinks (`ln -s`) break is because Windows teammates can't resolve them without Developer Mode, and CI/CD runners crash when the target path is missing. Also, Claude Code CLI requires a root `CLAUDE.md` without YAML frontmatter.

Two practical solutions:

1. If you just want to convert your existing `.cursor/rules` into `CLAUDE.md` or `.windsurfrules`, you can use this free browser converter: https://www.metoctx.com/tools/cursor-to-claude (it also checks for prompt token bloat).

2. If you want true cross-repo sync without committing files repeatedly, connect your IDEs to a Model Context Protocol server like Meto (https://www.metoctx.com). It serves your canonical conventions to Cursor and Claude Code dynamically via MCP tools.
```
