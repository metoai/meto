# @metoai/cli

> **⚡ Universal AI Context Engine & Rule Sync CLI for Cursor, Google Antigravity, Claude, Windsurf, Copilot & MCP Tools.**

Meto gives your AI coding assistants persistent developer identity, tech stack directives, and architectural memory across all editors.

---

## Features

- **Safe Rule Synchronization**: Synchronizes `.cursorrules`, `GEMINI.md`, `CLAUDE.md`, `.windsurfrules`, `AGENTS.md`, and `.github/copilot-instructions.md` with atomic writes, preserving all your custom rules.
- **1-Click MCP Auto-Configuration**: Auto-detects installed editors (Google Antigravity, Cursor, Claude Desktop, Windsurf, Roo Code / Cline) and configures the Meto Model Context Protocol (MCP) server.
- **Dynamic Diagnostics**: Audits project rules sync status, active framework, TypeScript config, and environment health.
- **Local & Cloud Stdio MCP Server**: Exposes developer identity tools (`get_meto_identity`, `get_workspace_health`, `remember_rule`) to any MCP-compliant agent.
- **Zero Dependencies**: Pure, lightweight Node.js standard library implementation.

---

## Quick Start

### 1. Initialize Rules in Your Workspace

Run in any repository root:

```bash
npx @metoai/cli init
```

This scans your dependencies, asks for your preferences (or auto-detects with `-y`), and generates unified rules files across all major AI editors.

### 2. Auto-Install MCP into Your IDEs

Auto-detect and configure your installed editors:

```bash
npx @metoai/cli setup-mcp
```

Or connect with your remote Meto account:

```bash
npx @metoai/cli setup-mcp --url https://meto.ai/api/mcp/<your-username> --token <your-mcp-token>
```

To remove Meto MCP configuration at any time:

```bash
npx @metoai/cli remove-mcp
```

### 3. Check Workspace AI Health

Verify that your project rules and configurations are in sync:

```bash
npx @metoai/cli health
```

### 4. Connect to Meto Cloud (Optional)

Authenticate your CLI session via device flow:

```bash
npx @metoai/cli login
npx @metoai/cli sync
```

---

## Commands

| Command | Description |
| :--- | :--- |
| `init` | Safely create and sync rule files across all editors (`.cursorrules`, `GEMINI.md`, `CLAUDE.md`, etc.). |
| `setup-mcp` | Auto-detect and configure Meto MCP into installed editors (Antigravity, Cursor, Claude, Windsurf). |
| `remove-mcp` | Remove Meto MCP from all detected editor configurations. |
| `health` | Audit workspace health, stack detection, and rules file synchronization status. |
| `mcp` | Run local Stdio MCP server for agent tools (`get_meto_identity`, `get_workspace_health`, `remember_rule`). |
| `login` | Authenticate with Meto Cloud via browser device flow. |
| `sync` | Fetch latest cloud directives and refresh workspace rule files. |

---

## License

MIT © [Meto AI](https://meto.ai)
