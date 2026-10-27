/** Cursor / Claude MCP install helpers — shared by API and dashboard UI */

export const MCP_SERVER_NAME = "meto";

export type CursorMcpServerConfig = {
  url: string;
  headers: Record<string, string>;
};

export type ClaudeMcpServerConfig = {
  command: string;
  args: string[];
};

export function buildMcpEndpointUrl(siteUrl: string, username: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/api/mcp/${username.trim().toLowerCase()}`;
}

export function buildCursorMcpServerConfig(
  endpointUrl: string,
  token: string
): CursorMcpServerConfig {
  return {
    url: endpointUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function buildCursorMcpJson(
  endpointUrl: string,
  token: string
): string {
  return JSON.stringify(
    {
      mcpServers: {
        [MCP_SERVER_NAME]: buildCursorMcpServerConfig(endpointUrl, token),
      },
    },
    null,
    2
  );
}

export function buildClaudeDesktopMcpConfig(
  endpointUrl: string,
  token: string
): ClaudeMcpServerConfig {
  return {
    command: "npx",
    args: [
      "-y",
      "mcp-remote",
      endpointUrl,
      "--header",
      `Authorization: Bearer ${token}`,
    ],
  };
}

export function buildClaudeDesktopMcpJson(
  endpointUrl: string,
  token: string
): string {
  return JSON.stringify(
    {
      mcpServers: {
        [MCP_SERVER_NAME]: buildClaudeDesktopMcpConfig(endpointUrl, token),
      },
    },
    null,
    2
  );
}

function toBase64(json: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(json)));
}

/** Inner server config for Cursor install links (not wrapped in mcpServers). */
export function buildCursorInstallConfig(
  endpointUrl: string,
  token: string
): CursorMcpServerConfig {
  return buildCursorMcpServerConfig(endpointUrl, token);
}

export function buildCursorInstallLinks(
  endpointUrl: string,
  token: string,
  serverName = MCP_SERVER_NAME
) {
  const config = buildCursorInstallConfig(endpointUrl, token);
  const json = JSON.stringify(config);
  const base64 = toBase64(json);
  const encodedConfig = encodeURIComponent(base64);
  const encodedName = encodeURIComponent(serverName);

  return {
    config,
    deeplink: `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodedName}&config=${encodedConfig}`,
    webInstall: `https://cursor.com/en/install-mcp?name=${encodedName}&config=${encodedConfig}`,
  };
}

export function buildWindsurfMcpJson(
  endpointUrl: string,
  token: string
): string {
  return buildClaudeDesktopMcpJson(endpointUrl, token);
}

export function buildVSCodeMcpJson(
  endpointUrl: string,
  token: string
): string {
  return buildClaudeDesktopMcpJson(endpointUrl, token);
}

export function buildZedMcpJson(
  endpointUrl: string,
  token: string
): string {
  return JSON.stringify(
    {
      context_servers: {
        [MCP_SERVER_NAME]: {
          command: {
            path: "npx",
            args: [
              "-y",
              "mcp-remote",
              endpointUrl,
              "--header",
              `Authorization: Bearer ${token}`,
            ],
          },
        },
      },
    },
    null,
    2
  );
}

export function buildClaudeCodeCliCommand(
  endpointUrl: string,
  token: string
): string {
  return `claude mcp add ${MCP_SERVER_NAME} -- npx -y mcp-remote ${endpointUrl} --header "Authorization: Bearer ${token}"`;
}

export function buildAntigravityMcpJson(
  endpointUrl: string,
  token: string
): string {
  return buildClaudeDesktopMcpJson(endpointUrl, token);
}

export function buildCopilotMcpJson(
  endpointUrl: string,
  token: string
): string {
  return JSON.stringify(
    {
      "github.copilot.chat.mcpServers": {
        [MCP_SERVER_NAME]: buildClaudeDesktopMcpConfig(endpointUrl, token),
      },
    },
    null,
    2
  );
}

export function buildCopilotInstructions(
  endpointUrl: string,
  token: string,
  summary?: string
): string {
  return [
    `# Meto Developer Context Instructions`,
    ``,
    `Use these directives, profile preferences, and architectural rules on all code suggestions:`,
    ``,
    summary ? summary : `- Always adhere to my verified tech stack and codebase standards.`,
    ``,
    `Live Meto Context URL: ${endpointUrl}`,
    `Authorization: Bearer ${token}`,
  ].join("\n");
}

export const MCP_TEST_PROMPT =
  "Use my Meto MCP profile — summarize who I am, what I'm building, and my tech stack.";

export type EditorTarget = "cursor" | "claude" | "windsurf" | "antigravity" | "copilot";

export type ProjectRuleResult = {
  filename: string;
  editor: EditorTarget;
  content: string;
};

export function buildProjectMetoRules(options: {
  username?: string;
  projectSlug?: string;
  projectName?: string;
  editor?: EditorTarget;
}): ProjectRuleResult {
  const { projectSlug, editor = "cursor" } = options;
  const slugArg = projectSlug ? ` with project_slug="${projectSlug}"` : "";
  const projectRef = projectSlug
    ? `\n   - For project architecture and active sprint directives, consult \`profile://project/${projectSlug}/today\`.`
    : "";

  let filename = ".cursor/rules/meto.mdc";
  if (editor === "claude") filename = "CLAUDE.md";
  if (editor === "windsurf") filename = ".windsurfrules";
  if (editor === "antigravity") filename = "GEMINI.md";
  if (editor === "copilot") filename = ".github/copilot-instructions.md";

  const isMdc = editor === "cursor";
  const mdcHeader = isMdc
    ? [
        `---`,
        `description: Meto AI Context Protocol, Proactive Memory Recall & Decision Sync`,
        `globs: *`,
        `alwaysApply: true`,
        `---`,
        ``,
      ].join("\n")
    : "";

  const content = [
    mdcHeader,
    `# Meto AI Protocol & Developer Directives`,
    ``,
    `You are connected to Meto via Model Context Protocol (MCP).`,
    ``,
    `## Directives`,
    `1. **Context & Working Style**:`,
    `   - Consult Meto MCP (\`profile://handoff\`) for verified working style, seniority, and general preferences.${projectRef}`,
    ``,
    `2. **Suggestions & Recommendations**:`,
    `   - When the user asks for suggestions on libraries, architecture, database design, or patterns, call the \`recall_meto_context\` MCP tool${slugArg} to check if the user has previously vetted or decided on this pattern.`,
    `   - If prior experience or preferences exist in Meto, respect them. If not, suggest modern patterns tailored to the verified stack.`,
    ``,
    `3. **Autonomous Memory Sync**:`,
    `   - Whenever an architectural decision (ADR) is finalized, a new dependency is installed, or coding conventions change, call \`update_meto_profile\`${slugArg} to record the decision in Meto so all future sessions and tools stay in sync.`,
  ].join("\n");

  return {
    filename,
    editor,
    content,
  };
}
