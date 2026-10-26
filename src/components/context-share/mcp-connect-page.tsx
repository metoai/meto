"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Copy, Terminal } from "lucide-react";
import { useMemo, useState } from "react";
import { usePortalDataOptional } from "@/components/portal/portal-data-context";
import { McpToolIcon } from "@/components/ui/mcp-tool-icon";
import { useMcpAccess } from "@/hooks/use-mcp-access";
import { MCP_TOOL_ICONS, type McpToolId } from "@/lib/ai-platform-icons";
import {
  MCP_TEST_PROMPT,
  buildClaudeCodeCliCommand,
  buildClaudeDesktopMcpJson,
  buildCursorMcpJson,
  buildMcpEndpointUrl,
  buildVSCodeMcpJson,
  buildWindsurfMcpJson,
  buildZedMcpJson,
} from "@/lib/mcp-install";

type CopyKey =
  | McpToolId
  | `${McpToolId}-snippet`
  | "config"
  | "test"
  | "token";

function StatusPill({
  label,
  detail,
  tone,
}: {
  label: string;
  detail: string;
  tone: "muted" | "ready" | "success";
}) {
  const dot =
    tone === "success"
      ? "bg-emerald-500"
      : tone === "ready"
        ? "bg-amber-500"
        : "bg-[var(--muted)]";
  const text =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-[var(--text-secondary)]";

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
      <span className={`text-xs font-medium ${text}`}>{label}</span>
      <span className="text-xs text-[var(--muted)]">· {detail}</span>
    </div>
  );
}

function SnippetBox({
  title,
  snippet,
  onCopy,
  copied,
}: {
  title: string;
  snippet: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="mt-2.5 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--card)] px-3 py-1.5 text-[11px] text-[var(--muted)]">
        <span className="font-mono-brand truncate">{title}</span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex shrink-0 items-center gap-1 font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy snippet
            </>
          )}
        </button>
      </div>
      <pre className="max-h-48 overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-[var(--text)]">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}

function IntegrationRow({
  tool,
  action,
  actionLabel,
  working,
  done,
  expanded,
  onToggleExpand,
  children,
}: {
  tool: McpToolId;
  action: () => void;
  actionLabel: string;
  working?: boolean;
  done?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
  children?: React.ReactNode;
}) {
  const meta = MCP_TOOL_ICONS[tool];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] transition-colors hover:border-[var(--border)]">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]">
          <McpToolIcon tool={tool} size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--text)]">{meta.label}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{meta.hint}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={action}
            disabled={working}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--text)] px-3 py-1.5 text-xs font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-50 sm:px-3.5 sm:py-2"
          >
            {done ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied
              </>
            ) : working ? (
              "…"
            ) : (
              <>
                {actionLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
          {children ? (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={`Toggle setup steps for ${meta.label}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--muted)] transition-colors hover:border-[var(--border)] hover:text-[var(--text)]"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : null}
        </div>
      </div>
      {expanded && children ? (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface)]/40 px-4 py-3.5 sm:px-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function McpConnectPage() {
  const portal = usePortalDataOptional();
  const portalUsername = portal?.profile?.username?.trim() || "";
  const { data, loading, working, error, status, ensureToken, addToCursor, revokeToken } =
    useMcpAccess(portalUsername);

  const effectiveUsername = data?.username || portalUsername;
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});

  const origin = typeof window !== "undefined" ? window.location.origin : "https://meto.ai";
  const endpointUrl =
    data?.endpointUrl ||
    (effectiveUsername ? buildMcpEndpointUrl(origin, effectiveUsername) : "");
  const activeToken = data?.token || "YOUR_TOKEN";

  const cursorSnippet = useMemo(
    () => (endpointUrl ? buildCursorMcpJson(endpointUrl, activeToken) : ""),
    [endpointUrl, activeToken]
  );
  const windsurfSnippet = useMemo(
    () => (endpointUrl ? buildWindsurfMcpJson(endpointUrl, activeToken) : ""),
    [endpointUrl, activeToken]
  );
  const claudeSnippet = useMemo(
    () => (endpointUrl ? buildClaudeDesktopMcpJson(endpointUrl, activeToken) : ""),
    [endpointUrl, activeToken]
  );
  const vscodeSnippet = useMemo(
    () => (endpointUrl ? buildVSCodeMcpJson(endpointUrl, activeToken) : ""),
    [endpointUrl, activeToken]
  );
  const zedSnippet = useMemo(
    () => (endpointUrl ? buildZedMcpJson(endpointUrl, activeToken) : ""),
    [endpointUrl, activeToken]
  );
  const terminalSnippet = useMemo(
    () => (endpointUrl ? buildClaudeCodeCliCommand(endpointUrl, activeToken) : ""),
    [endpointUrl, activeToken]
  );

  async function copyText(value: string | null, key: CopyKey) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 1800);
  }

  function toggleExpand(tool: McpToolId) {
    setExpandedTools((prev) => ({ ...prev, [tool]: !prev[tool] }));
  }

  async function handleCopyToolConfig(tool: McpToolId, snippet: string) {
    const payload = await ensureToken();
    const token = payload?.token || data?.token || activeToken;
    const url = payload?.endpointUrl || endpointUrl;

    let text = snippet;
    if (token && url) {
      if (tool === "cursor") text = buildCursorMcpJson(url, token);
      else if (tool === "windsurf") text = buildWindsurfMcpJson(url, token);
      else if (tool === "claude") text = buildClaudeDesktopMcpJson(url, token);
      else if (tool === "vscode") text = buildVSCodeMcpJson(url, token);
      else if (tool === "zed") text = buildZedMcpJson(url, token);
      else if (tool === "terminal") text = buildClaudeCodeCliCommand(url, token);
    }

    await copyText(text, tool);
    setExpandedTools((prev) => ({ ...prev, [tool]: true }));
  }

  if (loading && !effectiveUsername) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-14 w-full max-w-md rounded-lg" />
        <div className="skeleton h-20 w-full rounded-xl" />
        <div className="skeleton h-20 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-[var(--text)] md:text-2xl">
            MCP
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            Your live profile context inside Cursor, Windsurf, Claude, VS Code, and Zed.
          </p>
        </div>
        <StatusPill
          label={status.label}
          detail={status.detail}
          tone={status.tone}
        />
      </div>

      {!effectiveUsername ? (
        <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--primary-light)] px-5 py-5">
          <p className="text-sm font-medium text-[var(--text)]">
            Claim a username to enable MCP
          </p>
          <p className="mt-1 max-w-md text-sm text-[var(--text-secondary)]">
            Your endpoint is tied to your handle — e.g.{" "}
            <span className="font-mono-brand text-xs">/api/mcp/you</span>
          </p>
          <Link
            href="/settings"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
          >
            Open Settings
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {error ? (
            <p className="rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <div className="space-y-3">
            {/* Cursor */}
            <IntegrationRow
              tool="cursor"
              action={() => void addToCursor()}
              actionLabel="Connect"
              working={working}
              expanded={Boolean(expandedTools.cursor)}
              onToggleExpand={() => toggleExpand("cursor")}
            >
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <li>
                  Click <strong className="text-[var(--text)] font-medium">Connect</strong> for one-click installation into Cursor.
                </li>
                <li>
                  Or open Cursor → <span className="font-mono-brand text-[var(--text)]">Settings → Features → MCP</span> and paste:
                </li>
              </ol>
              <SnippetBox
                title=".cursor/mcp.json"
                snippet={cursorSnippet}
                onCopy={() => void copyText(cursorSnippet, "cursor-snippet")}
                copied={copied === "cursor-snippet"}
              />
            </IntegrationRow>

            {/* Windsurf */}
            <IntegrationRow
              tool="windsurf"
              action={() => void handleCopyToolConfig("windsurf", windsurfSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "windsurf"}
              expanded={Boolean(expandedTools.windsurf)}
              onToggleExpand={() => toggleExpand("windsurf")}
            >
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <li>
                  In Windsurf, press <kbd className="rounded border border-[var(--border)] px-1 py-0.5 font-mono text-[10px]">Cmd/Ctrl + Shift + P</kbd> → select{" "}
                  <strong className="text-[var(--text)] font-medium">Windsurf: Open MCP Config</strong> (or edit <code className="font-mono-brand text-[var(--text)]">~/.codeium/windsurf/mcp_config.json</code>).
                </li>
                <li>
                  Paste under <code className="font-mono-brand text-[var(--text)]">mcpServers</code>.
                </li>
                <li>
                  Cascade will immediately connect to your live Meto profile.
                </li>
              </ol>
              <SnippetBox
                title="~/.codeium/windsurf/mcp_config.json"
                snippet={windsurfSnippet}
                onCopy={() => void copyText(windsurfSnippet, "windsurf-snippet")}
                copied={copied === "windsurf-snippet"}
              />
            </IntegrationRow>

            {/* Claude Desktop */}
            <IntegrationRow
              tool="claude"
              action={() => void handleCopyToolConfig("claude", claudeSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "claude"}
              expanded={Boolean(expandedTools.claude)}
              onToggleExpand={() => toggleExpand("claude")}
            >
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <li>Claude Desktop → Settings → Developer → Edit Config.</li>
                <li>
                  Paste under <code className="font-mono-brand text-[var(--text)]">mcpServers</code> in <code className="font-mono-brand text-[var(--text)]">claude_desktop_config.json</code>.
                </li>
                <li>Restart Claude Desktop to load your context.</li>
              </ol>
              <SnippetBox
                title="claude_desktop_config.json"
                snippet={claudeSnippet}
                onCopy={() => void copyText(claudeSnippet, "claude-snippet")}
                copied={copied === "claude-snippet"}
              />
            </IntegrationRow>

            {/* VS Code */}
            <IntegrationRow
              tool="vscode"
              action={() => void handleCopyToolConfig("vscode", vscodeSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "vscode"}
              expanded={Boolean(expandedTools.vscode)}
              onToggleExpand={() => toggleExpand("vscode")}
            >
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <li>
                  In VS Code, open your AI extension: <strong className="text-[var(--text)] font-medium">Cline</strong>, <strong className="text-[var(--text)] font-medium">Roo Code</strong>, or <strong className="text-[var(--text)] font-medium">Continue</strong>.
                </li>
                <li>
                  Open <span className="font-mono-brand text-[var(--text)]">MCP Servers</span> settings (or edit <code className="font-mono-brand text-[var(--text)]">cline_mcp_settings.json</code>).
                </li>
                <li>
                  Paste under <code className="font-mono-brand text-[var(--text)]">mcpServers</code>.
                </li>
              </ol>
              <SnippetBox
                title="cline_mcp_settings.json"
                snippet={vscodeSnippet}
                onCopy={() => void copyText(vscodeSnippet, "vscode-snippet")}
                copied={copied === "vscode-snippet"}
              />
            </IntegrationRow>

            {/* Zed */}
            <IntegrationRow
              tool="zed"
              action={() => void handleCopyToolConfig("zed", zedSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "zed"}
              expanded={Boolean(expandedTools.zed)}
              onToggleExpand={() => toggleExpand("zed")}
            >
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <li>
                  In Zed, open Settings via <kbd className="rounded border border-[var(--border)] px-1 py-0.5 font-mono text-[10px]">Cmd/Ctrl + ,</kbd> (or edit <code className="font-mono-brand text-[var(--text)]">~/.config/zed/settings.json</code>).
                </li>
                <li>
                  Add under the top-level <code className="font-mono-brand text-[var(--text)]">context_servers</code> object.
                </li>
                <li>
                  Zed Assistant Panel will now have access to your live profile.
                </li>
              </ol>
              <SnippetBox
                title="~/.config/zed/settings.json"
                snippet={zedSnippet}
                onCopy={() => void copyText(zedSnippet, "zed-snippet")}
                copied={copied === "zed-snippet"}
              />
            </IntegrationRow>

            {/* CLI & Claude Code */}
            <IntegrationRow
              tool="terminal"
              action={() => void handleCopyToolConfig("terminal", terminalSnippet)}
              actionLabel="Copy command"
              working={working}
              done={copied === "terminal"}
              expanded={Boolean(expandedTools.terminal)}
              onToggleExpand={() => toggleExpand("terminal")}
            >
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <li>Run the one-line command in your terminal.</li>
                <li>
                  In Claude Code, type <code className="font-mono-brand text-[var(--text)]">/mcp</code> or run <code className="font-mono-brand text-[var(--text)]">claude mcp list</code> to verify.
                </li>
              </ol>
              <SnippetBox
                title="Terminal Command"
                snippet={terminalSnippet}
                onCopy={() => void copyText(terminalSnippet, "terminal-snippet")}
                copied={copied === "terminal-snippet"}
              />
            </IntegrationRow>
          </div>

          {data?.hasToken ? (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/60 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--text-secondary)]">
                    Verify in Agent chat
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">
                    {MCP_TEST_PROMPT}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyText(MCP_TEST_PROMPT, "test")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
                >
                  {copied === "test" ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied === "test" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
            <Link
              href="/dashboard/projects"
              className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--text-secondary)]"
            >
              Per-repo context in{" "}
              <span className="font-medium text-[var(--text-secondary)]">
                Projects
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setAdvancedOpen((open) => !open)}
              className="inline-flex items-center gap-1 text-xs text-[var(--muted)] transition-colors hover:text-[var(--text-secondary)]"
            >
              Advanced
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  advancedOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {advancedOpen ? (
            <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] px-4 py-4 text-xs text-[var(--text-secondary)] sm:px-5">
              <div>
                <p className="text-[var(--muted)]">Endpoint</p>
                <p className="mt-1 break-all font-mono-brand text-[var(--text)]">
                  {endpointUrl || "—"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void ensureToken().then((p) => copyText(p?.token ?? null, "token"))
                  }
                  disabled={working}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1.5 hover:text-[var(--text)] disabled:opacity-40"
                >
                  {copied === "token" ? "Copied token" : "Copy token"}
                </button>
                <button
                  type="button"
                  onClick={() => void copyText(cursorSnippet, "config")}
                  disabled={!cursorSnippet}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1.5 hover:text-[var(--text)] disabled:opacity-40"
                >
                  {copied === "config" ? "Copied JSON" : "Copy generic mcp.json"}
                </button>
                <button
                  type="button"
                  onClick={() => void revokeToken()}
                  disabled={working || !data?.hasToken}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1.5 hover:text-[var(--text)] disabled:opacity-40"
                >
                  Revoke token
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
