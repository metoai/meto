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

export const MCP_TEST_PROMPT =
  "Use my Meto MCP profile — summarize who I am, what I'm building, and my tech stack.";
