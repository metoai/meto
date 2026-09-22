#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";

const METO_API_BASE = process.env.METO_API_URL || "https://meto.ai";
const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE || ".", ".meto");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const METO_START_MARKER = "# <!-- METO_MANAGED_START -->";
const METO_END_MARKER = "# <!-- METO_MANAGED_END -->";

// Color formatting helpers
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  orange: "\x1b[38;2;255;107;44m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  emerald: "\x1b[38;2;16;185;129m",
  sky: "\x1b[38;2;14;165;233m",
  yellow: "\x1b[33m",
};

function logHeader() {
  console.log(`\n${colors.orange}${colors.bold}⚡ METO IDENTITY ENGINE CLI${colors.reset} ${colors.dim}v1.1.3${colors.reset}\n`);
}

/**
 * Safe, atomic file writing using a temporary file in the same directory.
 * Prevents corrupted or truncated files if process is interrupted.
 */
function atomicWriteFileSync(filePath, content) {
  const targetDir = path.dirname(filePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2)}`;
  fs.writeFileSync(tempPath, content, "utf8");
  fs.renameSync(tempPath, filePath);
}

/**
 * Merges Meto-generated rules into an existing rule file without overwriting user custom rules.
 */
function mergeWithExistingRuleFile(targetPath, newMetoBlock) {
  const wrappedMetoBlock = `${METO_START_MARKER}\n${newMetoBlock.trim()}\n${METO_END_MARKER}`;

  if (!fs.existsSync(targetPath)) {
    return wrappedMetoBlock + "\n";
  }

  try {
    const existing = fs.readFileSync(targetPath, "utf8");

    const startIndex = existing.indexOf(METO_START_MARKER);
    const endIndex = existing.indexOf(METO_END_MARKER);

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      // Replace only the Meto managed section, preserve everything before and after!
      const before = existing.slice(0, startIndex);
      const after = existing.slice(endIndex + METO_END_MARKER.length);
      return before + wrappedMetoBlock + after;
    }

    // Existing file with no Meto markers:
    // Don't overwrite user rules! Keep existing content below the Meto block.
    if (existing.trim().length > 0) {
      return `${wrappedMetoBlock}\n\n# --- User Custom Rules (Preserved) ---\n${existing.trim()}\n`;
    }
  } catch {
    // If read fails, fallback to wrapped block
  }

  return wrappedMetoBlock + "\n";
}

function getConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    }
  } catch {
    // Ignore read errors
  }
  return {};
}

function saveConfig(data) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    const current = getConfig();
    atomicWriteFileSync(CONFIG_FILE, JSON.stringify({ ...current, ...data }, null, 2));
  } catch (err) {
    console.error(`${colors.gray}Warning: Could not save config to ${CONFIG_FILE}${colors.reset}`);
  }
}

// Project Stack Detection
function scanProject(cwd = process.cwd()) {
  const stack = [];
  let isTypeScript = false;
  let framework = "Generic JavaScript/Node";
  let hasEnv = fs.existsSync(path.join(cwd, ".env")) || fs.existsSync(path.join(cwd, ".env.local"));
  let hasEnvExample = fs.existsSync(path.join(cwd, ".env.example"));

  const pkgPath = path.join(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      if (deps.next) { framework = "Next.js"; stack.push("Next.js"); }
      else if (deps.react) { framework = "React"; stack.push("React"); }
      else if (deps.vue) { framework = "Vue"; stack.push("Vue"); }
      else if (deps.express) { framework = "Express"; stack.push("Express"); }
      else if (deps.fastify) { framework = "Fastify"; stack.push("Fastify"); }

      if (deps.typescript) { isTypeScript = true; stack.push("TypeScript"); }
      if (deps.tailwindcss) { stack.push("Tailwind CSS"); }
      if (deps["@supabase/supabase-js"]) { stack.push("Supabase"); }
      if (deps.prisma) { stack.push("Prisma"); }
      if (deps["drizzle-orm"]) { stack.push("Drizzle"); }
    } catch {
      // Ignore JSON parse error
    }
  } else if (fs.existsSync(path.join(cwd, "requirements.txt")) || fs.existsSync(path.join(cwd, "pyproject.toml"))) {
    framework = "Python App";
    stack.push("Python");
  } else if (fs.existsSync(path.join(cwd, "Cargo.toml"))) {
    framework = "Rust App";
    stack.push("Rust");
  } else if (fs.existsSync(path.join(cwd, "go.mod"))) {
    framework = "Go App";
    stack.push("Go");
  }

  return { cwd, framework, stack, isTypeScript, hasEnv, hasEnvExample };
}

// Generate Rules File Content
function generateRulesContent(role, stackList, directives, projectName, customRules = []) {
  const stackStr = stackList.length > 0 ? stackList.join(", ") : "Modern Web Architecture";

  const hardcodedRules = [
    "Type Safety: Ensure clear types, interfaces, and strict checking where applicable.",
    "Clean Code: Prefer clean, modular, self-documenting code. Never swallow errors silently.",
    "Architecture: Respect project layout and established component/function patterns.",
  ];

  const userDirectiveLines = directives
    .split("\n")
    .map((d) => d.trim())
    .filter(Boolean);

  const allDirectives = [...userDirectiveLines];
  for (const rule of hardcodedRules) {
    const alreadyPresent = allDirectives.some(
      (d) => d.toLowerCase().includes(rule.split(":")[0].toLowerCase())
    );
    if (!alreadyPresent) allDirectives.push(rule);
  }

  const customRulesFormatted = customRules.length > 0
    ? customRules.map((r) => `- ${r}`).join("\n")
    : "- AI Memory: Use Meto context rules before assuming default framework templates.";

  return `# Meto AI Identity Rules
# Generated by Meto Identity Engine (https://meto.ai)
# Unified context profile for Cursor, Claude, Windsurf, Copilot & AI Coding Agents.

[ROLE]
Role: ${role}
Project: ${projectName}

[TECH STACK]
Active Stack: ${stackStr}

[DIRECTIVES & CODING GUIDELINES]
${allDirectives.map((d) => `- ${d}`).join("\n")}
${customRulesFormatted}
`;
}

// Universal Multi-IDE Rule File Generator: init
async function runInit(options = {}) {
  logHeader();
  const scan = scanProject();
  const folderName = path.basename(scan.cwd);
  const userConfig = getConfig();

  console.log(`${colors.cyan}🔍 Scanned Project:${colors.reset} ${colors.bold}${folderName}${colors.reset}`);
  console.log(`${colors.gray}Detected Stack:${colors.reset} ${scan.stack.join(", ") || "General Project"}\n`);

  let role = options.cloudProfile?.role || userConfig.identity?.role || "Senior Fullstack Engineer";
  let directives = options.cloudProfile?.directives || userConfig.identity?.directives || "Write clean, type-safe code. Prefer server components and functional patterns. Never swallow errors.";
  let stack = options.cloudProfile?.stack && options.cloudProfile.stack.length > 0 ? options.cloudProfile.stack : scan.stack;
  const customRules = userConfig.customRules || [];

  if (!options.yes && process.stdin.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q, defaultVal) => new Promise((res) => rl.question(`${q} ${colors.dim}(default: ${defaultVal})${colors.reset}: `, (ans) => res(ans.trim() || defaultVal)));

    console.log(`${colors.bold}Customize your Meto AI preferences:${colors.reset}`);
    role = await ask(`1. Primary Developer Role`, role);
    directives = await ask(`2. Key AI Directives/Rules`, directives);
    rl.close();
  } else {
    console.log(`${colors.dim}Using automatic detection defaults...${colors.reset}`);
  }

  const content = generateRulesContent(role, stack, directives, folderName, customRules);

  // Rule file definitions across all major AI editors
  const ruleTargets = [
    { name: ".cursorrules", path: path.join(scan.cwd, ".cursorrules") },
    { name: ".cursor/rules/meto.mdc", path: path.join(scan.cwd, ".cursor", "rules", "meto.mdc") },
    { name: "AGENTS.md", path: path.join(scan.cwd, "AGENTS.md") },
    { name: "CLAUDE.md", path: path.join(scan.cwd, "CLAUDE.md") },
    { name: ".windsurfrules", path: path.join(scan.cwd, ".windsurfrules") },
    { name: ".github/copilot-instructions.md", path: path.join(scan.cwd, ".github", "copilot-instructions.md") },
    { name: ".clinerules", path: path.join(scan.cwd, ".clinerules") },
  ];

  const filesCreated = [];
  ruleTargets.forEach((target) => {
    try {
      const mergedContent = mergeWithExistingRuleFile(target.path, content);
      atomicWriteFileSync(target.path, mergedContent);
      filesCreated.push(target.name);
    } catch {
      // Ignore individual file write failures
    }
  });

  console.log(`\n${colors.emerald}${colors.bold}✨ Success! Meto context synchronized safely across all IDEs:${colors.reset}`);
  filesCreated.forEach((f) => console.log(`   ${colors.green}✓${colors.reset} ${colors.bold}${f}${colors.reset} ${colors.dim}(preserved user custom rules)${colors.reset}`));

  console.log(`\n${colors.bold}💡 Next Step:${colors.reset}`);
  console.log(`   To auto-install Meto MCP into Cursor, Claude Desktop & Windsurf, run:`);
  console.log(`   ${colors.orange}npx @metoai/cli setup-mcp${colors.reset}\n`);
}

// 1-Click MCP Auto-Installer: setup-mcp
async function runSetupMcp() {
  logHeader();
  console.log(`${colors.cyan}🔌 Auto-Detecting AI Editor Configurations...${colors.reset}\n`);

  const userHome = process.env.HOME || process.env.USERPROFILE || ".";
  const appData = process.env.APPDATA || path.join(userHome, "AppData", "Roaming");

  const ideConfigs = [
    {
      name: "Cursor",
      paths: [
        path.join(appData, "Cursor", "User", "globalStorage", "cursor.mcp", "mcp.json"),
        path.join(userHome, "Library", "Application Support", "Cursor", "User", "globalStorage", "cursor.mcp", "mcp.json"),
        path.join(userHome, ".config", "Cursor", "User", "globalStorage", "cursor.mcp", "mcp.json"),
      ],
    },
    {
      name: "Claude Desktop",
      paths: [
        path.join(appData, "Claude", "claude_desktop_config.json"),
        path.join(userHome, "Library", "Application Support", "Claude", "claude_desktop_config.json"),
        path.join(userHome, ".config", "Claude", "claude_desktop_config.json"),
      ],
    },
    {
      name: "Windsurf",
      paths: [
        path.join(appData, "Windsurf", "mcp.json"),
        path.join(userHome, "Library", "Application Support", "Windsurf", "mcp.json"),
        path.join(userHome, ".config", "Windsurf", "mcp.json"),
      ],
    },
    {
      name: "Roo Code / Cline",
      paths: [
        path.join(appData, "Code", "User", "globalStorage", "rooveteran.roo-cline", "settings", "mcp.json"),
        path.join(userHome, "Library", "Application Support", "Code", "User", "globalStorage", "rooveteran.roo-cline", "settings", "mcp.json"),
        path.join(userHome, ".config", "Code", "User", "globalStorage", "rooveteran.roo-cline", "settings", "mcp.json"),
      ],
    },
    {
      name: "Antigravity IDE",
      paths: [
        path.join(userHome, ".gemini", "antigravity-ide", "mcp_config.json"),
        path.join(userHome, "Library", "Application Support", "antigravity-ide", "mcp_config.json"),
        path.join(userHome, ".config", "antigravity-ide", "mcp_config.json"),
      ],
    },
  ];

  const metoServerConfig = {
    command: "npx",
    args: ["-y", "@metoai/cli", "mcp"],
  };

  let updatedCount = 0;

  for (const ide of ideConfigs) {
    let targetPath = ide.paths.find((p) => fs.existsSync(p));
    
    // If not existing, select primary path for OS
    if (!targetPath) {
      targetPath = ide.paths[0];
    }

    try {
      let configJson = { mcpServers: {} };
      if (fs.existsSync(targetPath)) {
        try {
          const raw = fs.readFileSync(targetPath, "utf8");
          configJson = JSON.parse(raw);
          if (!configJson.mcpServers) configJson.mcpServers = {};
        } catch {
          configJson = { mcpServers: {} };
        }
      }

      configJson.mcpServers.meto = metoServerConfig;
      atomicWriteFileSync(targetPath, JSON.stringify(configJson, null, 2));

      console.log(`   ${colors.green}✓${colors.reset} ${colors.bold}${ide.name}${colors.reset} Configured: ${colors.gray}${targetPath}${colors.reset}`);
      updatedCount++;
    } catch (err) {
      console.log(`   ${colors.gray}• ${ide.name}: Skipped (${err.message})${colors.reset}`);
    }
  }

  console.log(`\n${colors.emerald}${colors.bold}✨ Meto MCP Server successfully installed into ${updatedCount} AI Editor(s)!${colors.reset}`);
  console.log(`${colors.gray}Restart Cursor or Claude Desktop to activate Meto tools.${colors.reset}\n`);
}

// Live Dynamic Workspace Diagnostic: health
function runHealth() {
  logHeader();
  const scan = scanProject();
  const folderName = path.basename(scan.cwd);

  console.log(`${colors.bold}📊 Workspace AI Health Diagnostic:${colors.reset} ${colors.cyan}${folderName}${colors.reset}\n`);

  const ruleFiles = [
    ".cursorrules",
    ".cursor/rules/meto.mdc",
    "AGENTS.md",
    "CLAUDE.md",
    ".windsurfrules",
    ".github/copilot-instructions.md",
    ".clinerules",
  ];

  let syncedCount = 0;
  console.log(`${colors.bold}1. AI Rule Files Sync Status:${colors.reset}`);
  ruleFiles.forEach((file) => {
    const exists = fs.existsSync(path.join(scan.cwd, file));
    if (exists) {
      syncedCount++;
      console.log(`   ${colors.green}✓${colors.reset} ${file}`);
    } else {
      console.log(`   ${colors.gray}✗ ${file} (missing - run 'npx meto init')${colors.reset}`);
    }
  });

  console.log(`\n${colors.bold}2. Environment & Project Health:${colors.reset}`);
  console.log(`   Framework: ${colors.sky}${scan.framework}${colors.reset}`);
  console.log(`   Tech Stack: ${colors.sky}${scan.stack.join(", ") || "Generic"}${colors.reset}`);
  console.log(`   TypeScript: ${scan.isTypeScript ? colors.green + "Yes" : colors.gray + "No"}${colors.reset}`);
  console.log(`   Environment (.env): ${scan.hasEnv ? colors.green + "Present" : colors.yellow + "Missing"}${colors.reset}`);

  console.log(`\n${colors.bold}Overall Status:${colors.reset} ${syncedCount === ruleFiles.length ? colors.emerald + "Fully Synchronized (100%)" : colors.yellow + `Partially Synchronized (${syncedCount}/${ruleFiles.length})`}${colors.reset}\n`);
}

// MCP Stdio Server Handler with Dynamic Workspace & Memory Tools
function runMcpServer() {
  const config = getConfig();
  const identity = config.identity || {
    role: "Fullstack Engineer",
    directives: "Write clean, type-safe code. Preserve modular patterns.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
  };

  process.stdin.on("data", (data) => {
    try {
      const lines = data.toString().split("\n").filter(Boolean);
      for (const line of lines) {
        const req = JSON.parse(line);
        if (req.method === "initialize") {
          const res = {
            jsonrpc: "2.0",
            id: req.id,
            result: {
              protocolVersion: "2024-11-05",
              capabilities: { tools: {} },
              serverInfo: { name: "meto-mcp-server", version: "1.1.3" },
            },
          };
          process.stdout.write(JSON.stringify(res) + "\n");
        } else if (req.method === "tools/list") {
          const res = {
            jsonrpc: "2.0",
            id: req.id,
            result: {
              tools: [
                {
                  name: "get_meto_identity",
                  description: "Get user's Meto profile, preferences, stack, and coding guidelines.",
                  inputSchema: { type: "object", properties: {} },
                },
                {
                  name: "get_workspace_health",
                  description: "Get live workspace diagnostic report including active stack, env setup, and rules status.",
                  inputSchema: { type: "object", properties: {} },
                },
                {
                  name: "remember_rule",
                  description: "Save a new coding directive or preference learned from user interaction into Meto profile.",
                  inputSchema: {
                    type: "object",
                    properties: {
                      rule: { type: "string", description: "The coding rule or preference learned." },
                      category: { type: "string", description: "Optional rule category (e.g. style, architecture)." },
                    },
                    required: ["rule"],
                  },
                },
              ],
            },
          };
          process.stdout.write(JSON.stringify(res) + "\n");
        } else if (req.method === "tools/call") {
          let outputText = "";

          if (req.params.name === "get_meto_identity") {
            outputText = JSON.stringify({
              status: "success",
              identity,
              customRules: config.customRules || [],
              message: "User Meto identity profile loaded successfully.",
            });
          } else if (req.params.name === "get_workspace_health") {
            const scan = scanProject();
            outputText = JSON.stringify({
              status: "success",
              workspace: scan,
              syncedAt: new Date().toISOString(),
            });
          } else if (req.params.name === "remember_rule") {
            const rule = req.params.arguments?.rule;
            if (rule) {
              const currentCustom = config.customRules || [];
              if (!currentCustom.includes(rule)) {
                currentCustom.push(rule);
                saveConfig({ customRules: currentCustom });
              }
              outputText = JSON.stringify({
                status: "success",
                message: `Rule saved to Meto memory: "${rule}"`,
              });
            } else {
              outputText = JSON.stringify({ status: "error", message: "Missing rule string." });
            }
          }

          const res = {
            jsonrpc: "2.0",
            id: req.id,
            result: {
              content: [{ type: "text", text: outputText }],
            },
          };
          process.stdout.write(JSON.stringify(res) + "\n");
        }
      }
    } catch {
      // Ignore JSON parse errors in MCP pipe
    }
  });
}

// Login Device Authentication Flow with Polling
async function runLogin() {
  logHeader();
  console.log(`${colors.cyan}Connecting to Meto Cloud Auth...${colors.reset}\n`);

  try {
    const res = await fetch(`${METO_API_BASE}/api/cli/auth`, { method: "POST" });
    if (!res.ok) {
      throw new Error(`Failed to initialize session (${res.status})`);
    }

    const data = await res.json();
    const { device_code, verification_uri, interval = 2, expires_in = 600 } = data;

    console.log(`Please visit the following URL to authenticate your CLI session:`);
    console.log(`👉 ${colors.orange}${colors.bold}${verification_uri}${colors.reset}\n`);
    console.log(`Device Code: ${colors.bold}${device_code}${colors.reset}\n`);

    // Attempt to open browser automatically
    try {
      const openCmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
      const { exec } = await import("child_process");
      exec(`${openCmd} "${verification_uri}"`);
    } catch {
      // Non-fatal
    }

    console.log(`${colors.dim}Waiting for authorization in browser... (Press Ctrl+C to cancel)${colors.reset}`);

    const startTime = Date.now();
    const maxWaitMs = expires_in * 1000;

    while (Date.now() - startTime < maxWaitMs) {
      await new Promise((r) => setTimeout(r, interval * 1000));

      const pollRes = await fetch(`${METO_API_BASE}/api/cli/auth?code=${device_code}`);
      if (pollRes.ok) {
        const pollData = await pollRes.json();
        if (pollData.status === "approved" && pollData.token) {
          saveConfig({
            token: pollData.token,
            username: pollData.username,
            authStatus: "authenticated",
            updatedAt: new Date().toISOString(),
          });

          console.log(`\n${colors.emerald}${colors.bold}✨ Successfully authenticated as @${pollData.username}!${colors.reset}\n`);
          console.log(`${colors.cyan}Synchronizing cloud identity to local workspace...${colors.reset}`);
          await runSync();
          return;
        } else if (pollData.status === "expired") {
          console.log(`\n${colors.yellow}Session expired. Please run 'npx meto login' again.${colors.reset}\n`);
          return;
        }
      }
    }

    console.log(`\n${colors.yellow}Authentication timed out.${colors.reset}\n`);
  } catch (err) {
    console.error(`\n${colors.gray}Could not reach Meto Cloud: ${err.message}${colors.reset}`);
    console.log(`${colors.dim}You can still use Meto offline by running: npx meto init${colors.reset}\n`);
  }
}

// Cloud-Backed Identity Synchronization
async function runSync() {
  logHeader();
  console.log(`${colors.cyan}⚡ Meto Identity Sync${colors.reset}\n`);

  const config = getConfig();
  let cloudProfile = null;

  if (config.token) {
    try {
      console.log(`${colors.dim}Fetching latest cloud identity from meto.ai...${colors.reset}`);
      const res = await fetch(`${METO_API_BASE}/api/cli/sync`, {
        headers: {
          Authorization: `Bearer ${config.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.profile) {
          cloudProfile = data.profile;
          saveConfig({
            identity: {
              role: data.profile.role,
              stack: data.profile.stack,
              directives: data.profile.directives,
            },
            username: data.username,
            updatedAt: new Date().toISOString(),
          });
          console.log(`${colors.green}✓ Synchronized with @${data.username}'s cloud profile.${colors.reset}\n`);
        }
      } else {
        console.log(`${colors.gray}Notice: Cloud token invalid or expired. Run 'npx meto login' to re-authenticate.${colors.reset}\n`);
      }
    } catch {
      console.log(`${colors.gray}Notice: Cloud unreachable. Proceeding with locally cached identity...${colors.reset}\n`);
    }
  } else {
    console.log(`${colors.dim}Tip: Connect to your cloud profile with: ${colors.orange}npx @metoai/cli login${colors.reset}\n`);
  }

  // Refresh all rule files with atomic writes and preservation
  await runInit({ yes: true, cloudProfile });
  console.log(`\n${colors.emerald}${colors.bold}✓ All IDE rule files refreshed safely without overwriting custom rules.${colors.reset}\n`);
}

// Main CLI Entry Point
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "init";
  const options = { yes: args.includes("-y") || args.includes("--yes") };

  switch (command) {
    case "init":
      await runInit(options);
      break;
    case "setup-mcp":
      await runSetupMcp();
      break;
    case "health":
      runHealth();
      break;
    case "mcp":
      runMcpServer();
      break;
    case "login":
      await runLogin();
      break;
    case "sync":
      await runSync();
      break;
    case "help":
    case "--help":
    case "-h":
      logHeader();
      console.log(`Usage: npx @metoai/cli [command]\n`);
      console.log(`Commands:`);
      console.log(`  init       Synchronize rules across all IDEs safely (.cursorrules, AGENTS.md, etc.)`);
      console.log(`  setup-mcp  Auto-detect and install Meto MCP into Cursor, Claude Desktop & Windsurf`);
      console.log(`  health     Run workspace diagnostic & rule synchronization audit`);
      console.log(`  mcp        Start Meto Stdio MCP Server for Cursor, Claude & AI Coding Agents`);
      console.log(`  login      Authenticate CLI with your meto.ai cloud account via device code`);
      console.log(`  sync       Fetch latest cloud identity and safely refresh IDE rule files\n`);
      break;
    default:
      await runInit(options);
      break;
  }
}

main().catch((err) => {
  console.error("CLI Error:", err);
  process.exit(1);
});
