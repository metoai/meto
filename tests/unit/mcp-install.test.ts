import { describe, it, expect } from "vitest";
import {
  MCP_SERVER_NAME,
  buildAntigravityMcpJson,
  buildClaudeCodeCliCommand,
  buildClaudeDesktopMcpConfig,
  buildClaudeDesktopMcpJson,
  buildCopilotInstructions,
  buildCopilotMcpJson,
  buildCursorInstallLinks,
  buildCursorMcpJson,
  buildMcpEndpointUrl,
  buildVSCodeMcpJson,
  buildWindsurfMcpJson,
  buildZedMcpJson,
} from "@/lib/mcp-install";
import { MCP_TOOL_ICONS } from "@/lib/ai-platform-icons";

describe("mcp-install builders", () => {
  const siteUrl = "https://meto.ai";
  const username = "alazar";
  const token = "meto_tok_test123456";
  const endpoint = buildMcpEndpointUrl(siteUrl, username);

  it("builds the correct endpoint URL", () => {
    expect(endpoint).toBe("https://meto.ai/api/mcp/alazar");
  });

  it("builds cursor configuration", () => {
    const jsonStr = buildCursorMcpJson(endpoint, token);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.mcpServers[MCP_SERVER_NAME]).toBeDefined();
    expect(parsed.mcpServers[MCP_SERVER_NAME].url).toBe(endpoint);
    expect(parsed.mcpServers[MCP_SERVER_NAME].headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("builds claude desktop configuration", () => {
    const jsonStr = buildClaudeDesktopMcpJson(endpoint, token);
    const parsed = JSON.parse(jsonStr);
    const server = parsed.mcpServers[MCP_SERVER_NAME];
    expect(server.command).toBe("npx");
    expect(server.args).toContain("-y");
    expect(server.args).toContain("mcp-remote");
    expect(server.args).toContain(endpoint);
    expect(server.args).toContain(`Authorization: Bearer ${token}`);
  });

  it("builds windsurf and vscode configurations", () => {
    const windsurfJson = buildWindsurfMcpJson(endpoint, token);
    const vscodeJson = buildVSCodeMcpJson(endpoint, token);
    expect(windsurfJson).toBe(buildClaudeDesktopMcpJson(endpoint, token));
    expect(vscodeJson).toBe(buildClaudeDesktopMcpJson(endpoint, token));
  });

  it("builds antigravity configuration", () => {
    const antigravityJson = buildAntigravityMcpJson(endpoint, token);
    const parsed = JSON.parse(antigravityJson);
    expect(parsed.mcpServers[MCP_SERVER_NAME]).toBeDefined();
    expect(parsed.mcpServers[MCP_SERVER_NAME].command).toBe("npx");
  });

  it("builds copilot chat configuration and instructions", () => {
    const copilotJson = buildCopilotMcpJson(endpoint, token);
    const parsed = JSON.parse(copilotJson);
    expect(parsed["github.copilot.chat.mcpServers"][MCP_SERVER_NAME]).toBeDefined();

    const instructions = buildCopilotInstructions(endpoint, token, "Custom instructions");
    expect(instructions).toContain("Custom instructions");
    expect(instructions).toContain(endpoint);
    expect(instructions).toContain(token);
  });

  it("builds zed context server configuration", () => {
    const zedJson = buildZedMcpJson(endpoint, token);
    const parsed = JSON.parse(zedJson);
    expect(parsed.context_servers[MCP_SERVER_NAME]).toBeDefined();
    expect(parsed.context_servers[MCP_SERVER_NAME].command.path).toBe("npx");
    expect(parsed.context_servers[MCP_SERVER_NAME].command.args).toContain("mcp-remote");
  });

  it("builds claude code CLI command", () => {
    const cmd = buildClaudeCodeCliCommand(endpoint, token);
    expect(cmd).toContain("claude mcp add meto -- npx -y mcp-remote");
    expect(cmd).toContain(endpoint);
    expect(cmd).toContain(`Authorization: Bearer ${token}`);
  });

  it("builds cursor deep link", () => {
    const links = buildCursorInstallLinks(endpoint, token);
    expect(links.deeplink).toContain("cursor://anysphere.cursor-deeplink/mcp/install");
    expect(links.webInstall).toContain("https://cursor.com/en/install-mcp");
  });

  it("defines all supported MCP tools in MCP_TOOL_ICONS", () => {
    const expected = [
      "cursor",
      "windsurf",
      "claude",
      "vscode",
      "antigravity",
      "copilot",
      "zed",
      "terminal",
    ];
    expected.forEach((key) => {
      expect(key in MCP_TOOL_ICONS).toBe(true);
      expect(MCP_TOOL_ICONS[key as keyof typeof MCP_TOOL_ICONS].label).toBeTruthy();
      expect(MCP_TOOL_ICONS[key as keyof typeof MCP_TOOL_ICONS].url).toBeTruthy();
    });
  });
});
