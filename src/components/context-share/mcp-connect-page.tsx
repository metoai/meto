"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Cpu,
  ExternalLink,
  MessageSquare,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePortalDataOptional } from "@/components/portal/portal-data-context";
import { McpToolIcon } from "@/components/ui/mcp-tool-icon";
import { useMcpAccess } from "@/hooks/use-mcp-access";
import { AI_BRAND_ICON_CLASS } from "@/lib/ai-brand-icon";
import {
  AI_PLATFORM_ICONS,
  MCP_TOOL_ICONS,
  type McpToolId,
} from "@/lib/ai-platform-icons";
import { compileLocally } from "@/lib/compile-local";
import {
  MCP_TEST_PROMPT,
  buildAntigravityMcpJson,
  buildClaudeCodeCliCommand,
  buildClaudeDesktopMcpJson,
  buildCopilotInstructions,
  buildCopilotMcpJson,
  buildCursorMcpJson,
  buildMcpEndpointUrl,
  buildProjectMetoRules,
  buildVSCodeMcpJson,
  buildWindsurfMcpJson,
  buildZedMcpJson,
} from "@/lib/mcp-install";
import type { CompileFormat } from "@/lib/types";

type CopyKey = string;

type SetupModalData = {
  title: string;
  badge?: string;
  icon: React.ReactNode;
  steps: string[];
  snippet?: string;
  snippetTitle?: string;
  copyKey?: string;
  secondarySnippet?: string;
  secondarySnippetTitle?: string;
  secondaryCopyKey?: string;
};

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
    <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg)] text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)]/60 px-3 py-1.5 text-[11px] text-[var(--muted)]">
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
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="max-h-52 overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-[var(--text)]">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}

function IntegrationCard({
  tool,
  badge,
  action,
  actionLabel,
  working,
  done,
  onOpenSetup,
}: {
  tool: McpToolId;
  badge?: string;
  action: () => void;
  actionLabel: string;
  working?: boolean;
  done?: boolean;
  onOpenSetup: () => void;
}) {
  const meta = MCP_TOOL_ICONS[tool];

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 transition-all duration-150 hover:border-[var(--border)] hover:shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] transition-colors group-hover:border-[var(--border)]">
            <McpToolIcon tool={tool} size={20} />
          </div>
          {badge ? (
            <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface)]/80 px-2 py-0.5 text-[10px] font-mono text-[var(--muted)]">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-semibold tracking-tight text-[var(--text)]">
            {meta.label}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] line-clamp-2 min-h-[2.5rem]">
            {meta.hint}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]/70">
        <button
          type="button"
          onClick={action}
          disabled={working}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium py-1.5 transition-all ${
            actionLabel === "Connect"
              ? "bg-[var(--text)] text-[var(--bg)] hover:opacity-90 disabled:opacity-50 shadow-xs"
              : "border border-[var(--border-subtle)] bg-[var(--surface)]/80 hover:bg-[var(--surface)] hover:border-[var(--border)] text-[var(--text)]"
          }`}
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
              {actionLabel === "Connect" ? (
                <ArrowRight className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3 w-3 text-[var(--muted)]" />
              )}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSetup}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]/40 px-2.5 py-1.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] hover:border-[var(--border)]"
          title={`Setup guide for ${meta.label}`}
        >
          Setup
        </button>
      </div>
    </div>
  );
}

function ChatAiCard({
  format,
  label,
  badge,
  hint,
  onCopy,
  copied,
  onOpenSetup,
}: {
  format: CompileFormat;
  label: string;
  badge?: string;
  hint: string;
  onCopy: () => void;
  copied: boolean;
  onOpenSetup: () => void;
}) {
  const iconConfig = AI_PLATFORM_ICONS[format];

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 transition-all duration-150 hover:border-[var(--border)] hover:shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] transition-colors group-hover:border-[var(--border)]">
            {iconConfig?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconConfig.url}
                alt=""
                aria-hidden
                width={20}
                height={20}
                className={`${AI_BRAND_ICON_CLASS} shrink-0 object-contain`}
                loading="lazy"
              />
            ) : (
              <MessageSquare className="h-5 w-5 text-[var(--muted)]" />
            )}
          </div>
          {badge ? (
            <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface)]/80 px-2 py-0.5 text-[10px] font-mono text-[var(--muted)]">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-semibold tracking-tight text-[var(--text)]">
            {label}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] line-clamp-2 min-h-[2.5rem]">
            {hint}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]/70">
        <button
          type="button"
          onClick={onCopy}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]/80 hover:bg-[var(--surface)] hover:border-[var(--border)] text-[var(--text)] py-1.5 text-xs font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              Copy prompt
              <Copy className="h-3 w-3 text-[var(--muted)]" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSetup}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]/40 px-2.5 py-1.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] hover:border-[var(--border)]"
          title={`Setup guide for ${label}`}
        >
          Setup
        </button>
      </div>
    </div>
  );
}

export function McpConnectPage() {
  const portal = usePortalDataOptional();
  const portalUsername = portal?.profile?.username?.trim() || "";
  const { data, loading, working, error, status, ensureToken, addToCursor, revokeToken } =
    useMcpAccess(portalUsername);

  const effectiveUsername = data?.username || portalUsername;
  const [activeCategory, setActiveCategory] = useState<"ide" | "chat">("ide");
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<SetupModalData | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://meto.ai";
  const endpointUrl =
    data?.endpointUrl ||
    (effectiveUsername ? buildMcpEndpointUrl(origin, effectiveUsername) : "");
  const activeToken = data?.token || "YOUR_TOKEN";

  // IDE / MCP Snippets
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
  const antigravitySnippet = useMemo(
    () => (endpointUrl ? buildAntigravityMcpJson(endpointUrl, activeToken) : ""),
    [endpointUrl, activeToken]
  );
  const copilotSnippet = useMemo(
    () => (endpointUrl ? buildCopilotMcpJson(endpointUrl, activeToken) : ""),
    [endpointUrl, activeToken]
  );
  const copilotInstructionsSnippet = useMemo(
    () => (endpointUrl ? buildCopilotInstructions(endpointUrl, activeToken) : ""),
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

  const cursorRulesSnippet = useMemo(
    () => buildProjectMetoRules({ editor: "cursor" }).content,
    []
  );
  const windsurfRulesSnippet = useMemo(
    () => buildProjectMetoRules({ editor: "windsurf" }).content,
    []
  );
  const claudeRulesSnippet = useMemo(
    () => buildProjectMetoRules({ editor: "claude" }).content,
    []
  );
  const antigravityRulesSnippet = useMemo(
    () => buildProjectMetoRules({ editor: "antigravity" }).content,
    []
  );

  // Chat AI Tailored Prompts
  const sections = portal?.sections || [];

  const chatPrompts = useMemo(() => {
    const list: Record<CompileFormat, string> = {
      universal: compileLocally("universal", sections),
      chatgpt: compileLocally("chatgpt", sections),
      claude: compileLocally("claude", sections),
      gemini: compileLocally("gemini", sections),
      deepseek: compileLocally("deepseek", sections),
      grok: compileLocally("grok", sections),
      kimi: compileLocally("kimi", sections),
      qwen: compileLocally("qwen", sections),
    };
    return list;
  }, [sections]);

  async function copyText(text: string | null | undefined, key: CopyKey) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((prev) => (prev === key ? null : prev)), 2200);
    } catch {
      /* ignore */
    }
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
      else if (tool === "antigravity") text = buildAntigravityMcpJson(url, token);
      else if (tool === "copilot") text = buildCopilotMcpJson(url, token);
      else if (tool === "zed") text = buildZedMcpJson(url, token);
      else if (tool === "terminal") text = buildClaudeCodeCliCommand(url, token);
    }

    await copyText(text, tool);
  }

  async function handleCopyChatPrompt(format: CompileFormat, prompt: string) {
    await copyText(prompt, `chat-${format}`);
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
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-[var(--text)] md:text-2xl">
            Integrations & MCP
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            Connect your live context to IDEs, coding agents, and chat models.
          </p>
        </div>
        <StatusPill
          label={status.label}
          detail={status.detail}
          tone={status.tone}
        />
      </div>

      {/* Category Tabs */}
      <div className="inline-flex items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/60 p-1">
        <button
          type="button"
          onClick={() => setActiveCategory("ide")}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
            activeCategory === "ide"
              ? "bg-[var(--card)] text-[var(--text)] shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text)]"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>IDEs & Coding Agents</span>
          <span className="rounded-full bg-[var(--surface)] border border-[var(--border-subtle)]/70 px-1.5 py-0.2 text-[10px] text-[var(--muted)] font-mono">
            8
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory("chat")}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
            activeCategory === "chat"
              ? "bg-[var(--card)] text-[var(--text)] shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text)]"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Chat AIs & Web Models</span>
          <span className="rounded-full bg-[var(--surface)] border border-[var(--border-subtle)]/70 px-1.5 py-0.2 text-[10px] text-[var(--muted)] font-mono">
            7
          </span>
        </button>
      </div>

      {!effectiveUsername ? (
        <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--primary-light)] px-5 py-5">
          <p className="text-sm font-medium text-[var(--text)]">
            Claim a username to enable integrations
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
      ) : activeCategory === "ide" ? (
        /* IDE & MCP Category */
        <div className="space-y-6">
          {error ? (
            <p className="rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          {/* 3 cards per row grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Cursor */}
            <IntegrationCard
              tool="cursor"
              badge="1-Click / SSE"
              action={() => void addToCursor()}
              actionLabel="Connect"
              working={working}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Cursor Setup",
                  badge: "1-Click / SSE",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <McpToolIcon tool="cursor" size={22} />
                    </div>
                  ),
                  steps: [
                    "Click Connect on the card for instant 1-click installation into Cursor.",
                    "Or open Cursor → Settings → Features → MCP.",
                    "Add new server with the configuration snippet below.",
                  ],
                  snippet: cursorSnippet,
                  snippetTitle: ".cursor/mcp.json",
                  copyKey: "cursor-snippet",
                  secondarySnippet: cursorRulesSnippet,
                  secondarySnippetTitle: ".cursor/rules/meto.mdc (Auto-Directives & Recall)",
                  secondaryCopyKey: "cursor-rules",
                })
              }
            />

            {/* Windsurf */}
            <IntegrationCard
              tool="windsurf"
              badge="Direct SSE"
              action={() => void handleCopyToolConfig("windsurf", windsurfSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "windsurf"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Windsurf Setup",
                  badge: "Direct SSE",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <McpToolIcon tool="windsurf" size={22} />
                    </div>
                  ),
                  steps: [
                    "In Windsurf, press Cmd/Ctrl + Shift + P → select 'Windsurf: Open MCP Config' (or edit ~/.codeium/windsurf/mcp_config.json).",
                    "Paste under the 'mcpServers' key.",
                    "Cascade will immediately connect to your live Meto profile.",
                  ],
                  snippet: windsurfSnippet,
                  snippetTitle: "~/.codeium/windsurf/mcp_config.json",
                  copyKey: "windsurf-snippet",
                  secondarySnippet: windsurfRulesSnippet,
                  secondarySnippetTitle: ".windsurfrules (Auto-Directives & Recall)",
                  secondaryCopyKey: "windsurf-rules",
                })
              }
            />

            {/* Claude Desktop */}
            <IntegrationCard
              tool="claude"
              badge="Stdio Proxy"
              action={() => void handleCopyToolConfig("claude", claudeSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "claude"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Claude Desktop Setup",
                  badge: "Stdio Proxy",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <McpToolIcon tool="claude" size={22} />
                    </div>
                  ),
                  steps: [
                    "Open Claude Desktop → Settings → Developer → Edit Config.",
                    "Paste under 'mcpServers' in claude_desktop_config.json.",
                    "Restart Claude Desktop to load your profile.",
                  ],
                  snippet: claudeSnippet,
                  snippetTitle: "claude_desktop_config.json",
                  copyKey: "claude-snippet",
                  secondarySnippet: claudeRulesSnippet,
                  secondarySnippetTitle: "CLAUDE.md (Auto-Directives & Recall)",
                  secondaryCopyKey: "claude-rules",
                })
              }
            />

            {/* VS Code */}
            <IntegrationCard
              tool="vscode"
              badge="Extension"
              action={() => void handleCopyToolConfig("vscode", vscodeSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "vscode"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "VS Code Setup",
                  badge: "Cline / Roo / Continue",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <McpToolIcon tool="vscode" size={22} />
                    </div>
                  ),
                  steps: [
                    "In VS Code, open your AI extension: Cline, Roo Code, or Continue.",
                    "Open MCP Servers settings (or edit cline_mcp_settings.json).",
                    "Paste under 'mcpServers'.",
                  ],
                  snippet: vscodeSnippet,
                  snippetTitle: "cline_mcp_settings.json",
                  copyKey: "vscode-snippet",
                })
              }
            />

            {/* Antigravity */}
            <IntegrationCard
              tool="antigravity"
              badge="Native MCP"
              action={() => void handleCopyToolConfig("antigravity", antigravitySnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "antigravity"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Google Antigravity Setup",
                  badge: "Native MCP",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <McpToolIcon tool="antigravity" size={22} />
                    </div>
                  ),
                  steps: [
                    "In Google Antigravity, add meto to your MCP servers in ~/.gemini/config/mcp_config.json.",
                    "Paste the stdio configuration below.",
                    "Antigravity subagents and planners will automatically pull your verified directives and stack.",
                  ],
                  snippet: antigravitySnippet,
                  snippetTitle: "~/.gemini/config/mcp_config.json",
                  copyKey: "antigravity-snippet",
                  secondarySnippet: antigravityRulesSnippet,
                  secondarySnippetTitle: "GEMINI.md (Auto-Directives & Recall)",
                  secondaryCopyKey: "antigravity-rules",
                })
              }
            />

            {/* GitHub Copilot & Codex */}
            <IntegrationCard
              tool="copilot"
              badge="Chat & Rules"
              action={() => void handleCopyToolConfig("copilot", copilotSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "copilot"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "GitHub Copilot & Codex Setup",
                  badge: "Chat & Rules",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <McpToolIcon tool="copilot" size={22} />
                    </div>
                  ),
                  steps: [
                    "Option A (Copilot Chat MCP): In VS Code Settings (settings.json), add under github.copilot.chat.mcpServers.",
                    "Option B (Copilot Repo Instructions): Create a file at .github/copilot-instructions.md in your project root.",
                  ],
                  snippet: copilotSnippet,
                  snippetTitle: "settings.json (Copilot Chat MCP)",
                  copyKey: "copilot-snippet",
                  secondarySnippet: copilotInstructionsSnippet,
                  secondarySnippetTitle: ".github/copilot-instructions.md (Repo Instructions)",
                  secondaryCopyKey: "copilot-md-snippet",
                })
              }
            />

            {/* Zed */}
            <IntegrationCard
              tool="zed"
              badge="Settings JSON"
              action={() => void handleCopyToolConfig("zed", zedSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "zed"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Zed Setup",
                  badge: "Settings JSON",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <McpToolIcon tool="zed" size={22} />
                    </div>
                  ),
                  steps: [
                    "In Zed, open Settings via Cmd/Ctrl + , (or edit ~/.config/zed/settings.json).",
                    "Add under the top-level 'context_servers' object.",
                    "Zed Assistant Panel will now have access to your live profile.",
                  ],
                  snippet: zedSnippet,
                  snippetTitle: "~/.config/zed/settings.json",
                  copyKey: "zed-snippet",
                })
              }
            />

            {/* CLI & Claude Code */}
            <IntegrationCard
              tool="terminal"
              badge="CLI"
              action={() => void handleCopyToolConfig("terminal", terminalSnippet)}
              actionLabel="Copy command"
              working={working}
              done={copied === "terminal"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Claude Code CLI Setup",
                  badge: "CLI",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <McpToolIcon tool="terminal" size={22} />
                    </div>
                  ),
                  steps: [
                    "Run the one-line command in your terminal.",
                    "In Claude Code, type /mcp or run 'claude mcp list' to verify.",
                  ],
                  snippet: terminalSnippet,
                  snippetTitle: "Terminal Command",
                  copyKey: "terminal-snippet",
                })
              }
            />
          </div>

          {data?.hasToken ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-3.5 sm:px-4 text-xs shadow-xs">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <p className="font-medium text-[var(--text)]">Verify in Agent Chat</p>
                </div>
                <p className="mt-1 font-mono text-[11px] text-[var(--text-secondary)] truncate">
                  {MCP_TEST_PROMPT}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void copyText(MCP_TEST_PROMPT, "test")}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface)]/80"
              >
                {copied === "test" ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy prompt
                  </>
                )}
              </button>
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
      ) : (
        /* Chat AIs & Web Models Category */
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/50 p-3.5 sm:p-4 text-xs text-[var(--text-secondary)] leading-relaxed">
            <p>
              For web and chat interfaces without MCP, copy your compiled persona prompt and paste it into the AI&apos;s <strong className="text-[var(--text)]">Custom Instructions</strong>, <strong className="text-[var(--text)]">System Prompt</strong>, or <strong className="text-[var(--text)]">Custom Gems/GPTs</strong>.
            </p>
          </div>

          {/* 3 cards per row grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ChatGPT */}
            <ChatAiCard
              format="chatgpt"
              label="ChatGPT"
              badge="Custom Instructions"
              hint="Custom Instructions & GPTs"
              onCopy={() => void handleCopyChatPrompt("chatgpt", chatPrompts.chatgpt)}
              copied={copied === "chat-chatgpt"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "ChatGPT Setup",
                  badge: "Custom Instructions",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <img
                        src={AI_PLATFORM_ICONS.chatgpt.url}
                        alt=""
                        width={22}
                        height={22}
                        className={`${AI_BRAND_ICON_CLASS} object-contain`}
                      />
                    </div>
                  ),
                  steps: [
                    "In ChatGPT, click your profile avatar (bottom-left) → Settings → Personalization.",
                    "Open Custom Instructions ('What would you like ChatGPT to know about you to provide better responses?').",
                    "Paste your compiled Meto profile prompt below.",
                  ],
                  snippet: chatPrompts.chatgpt,
                  snippetTitle: "ChatGPT Tailored Prompt",
                  copyKey: "chat-chatgpt",
                })
              }
            />

            {/* Claude.ai */}
            <ChatAiCard
              format="claude"
              label="Claude.ai"
              badge="Projects"
              hint="Projects & Custom Instructions"
              onCopy={() => void handleCopyChatPrompt("claude", chatPrompts.claude)}
              copied={copied === "chat-claude"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Claude.ai Setup",
                  badge: "Projects",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <img
                        src={AI_PLATFORM_ICONS.claude.url}
                        alt=""
                        width={22}
                        height={22}
                        className={`${AI_BRAND_ICON_CLASS} object-contain`}
                      />
                    </div>
                  ),
                  steps: [
                    "In Claude.ai, open your Project (or click Projects in the left sidebar).",
                    "Click Set Project Instructions (or add as Project Knowledge document).",
                    "Paste your compiled context prompt below.",
                  ],
                  snippet: chatPrompts.claude,
                  snippetTitle: "Claude.ai Tailored Prompt",
                  copyKey: "chat-claude",
                })
              }
            />

            {/* Google Gemini */}
            <ChatAiCard
              format="gemini"
              label="Google Gemini"
              badge="Custom Gems"
              hint="Custom Gems & AI Studio"
              onCopy={() => void handleCopyChatPrompt("gemini", chatPrompts.gemini)}
              copied={copied === "chat-gemini"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Google Gemini Setup",
                  badge: "Custom Gems",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <img
                        src={AI_PLATFORM_ICONS.gemini.url}
                        alt=""
                        width={22}
                        height={22}
                        className={`${AI_BRAND_ICON_CLASS} object-contain`}
                      />
                    </div>
                  ),
                  steps: [
                    "In Google Gemini, open Gems manager (or System instructions in Google AI Studio).",
                    "Create a new custom Gem or add to conversation instructions.",
                    "Paste your compiled context prompt below.",
                  ],
                  snippet: chatPrompts.gemini,
                  snippetTitle: "Gemini Tailored Prompt",
                  copyKey: "chat-gemini",
                })
              }
            />

            {/* DeepSeek */}
            <ChatAiCard
              format="deepseek"
              label="DeepSeek"
              badge="System Prompt"
              hint="System Prompt & Reasoning Persona"
              onCopy={() => void handleCopyChatPrompt("deepseek", chatPrompts.deepseek)}
              copied={copied === "chat-deepseek"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "DeepSeek Setup",
                  badge: "System Prompt",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <img
                        src={AI_PLATFORM_ICONS.deepseek.url}
                        alt=""
                        width={22}
                        height={22}
                        className={`${AI_BRAND_ICON_CLASS} object-contain`}
                      />
                    </div>
                  ),
                  steps: [
                    "In DeepSeek Chat or API clients, paste into the System Prompt or conversation opening.",
                    "DeepSeek will apply your preferred architectural patterns and stack to all reasoning steps.",
                  ],
                  snippet: chatPrompts.deepseek,
                  snippetTitle: "DeepSeek Tailored Prompt",
                  copyKey: "chat-deepseek",
                })
              }
            />

            {/* Grok */}
            <ChatAiCard
              format="grok"
              label="Grok"
              badge="System Prompt"
              hint="Conversation Context & Preferences"
              onCopy={() => void handleCopyChatPrompt("grok", chatPrompts.grok)}
              copied={copied === "chat-grok"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Grok Setup",
                  badge: "System Prompt",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <img
                        src={AI_PLATFORM_ICONS.grok.url}
                        alt=""
                        width={22}
                        height={22}
                        className={`${AI_BRAND_ICON_CLASS} object-contain`}
                      />
                    </div>
                  ),
                  steps: [
                    "In Grok on X, paste the prompt snippet into your chat context or Custom Instructions.",
                    "Grok will personalize technical answers and code to your workflow.",
                  ],
                  snippet: chatPrompts.grok,
                  snippetTitle: "Grok Tailored Prompt",
                  copyKey: "chat-grok",
                })
              }
            />

            {/* Moonshot (Kimi) */}
            <ChatAiCard
              format="kimi"
              label="Moonshot (Kimi)"
              badge="Kimi+ Prompt"
              hint="Kimi+ Context & Prompt"
              onCopy={() => void handleCopyChatPrompt("kimi", chatPrompts.kimi)}
              copied={copied === "chat-kimi"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Moonshot (Kimi) Setup",
                  badge: "Kimi+ Prompt",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <img
                        src={AI_PLATFORM_ICONS.kimi.url}
                        alt=""
                        width={22}
                        height={22}
                        className={`${AI_BRAND_ICON_CLASS} object-contain`}
                      />
                    </div>
                  ),
                  steps: [
                    "In Kimi Chat, paste into your custom prompt or agent instructions.",
                    "Kimi will personalize responses according to your tech stack directives.",
                  ],
                  snippet: chatPrompts.kimi,
                  snippetTitle: "Kimi Tailored Prompt",
                  copyKey: "chat-kimi",
                })
              }
            />

            {/* Qwen */}
            <ChatAiCard
              format="qwen"
              label="Qwen"
              badge="System Prompt"
              hint="Tongyi Qianwen & Assistant Instructions"
              onCopy={() => void handleCopyChatPrompt("qwen", chatPrompts.qwen)}
              copied={copied === "chat-qwen"}
              onOpenSetup={() =>
                setActiveModal({
                  title: "Qwen Setup",
                  badge: "System Prompt",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                      <img
                        src={AI_PLATFORM_ICONS.qwen.url}
                        alt=""
                        width={22}
                        height={22}
                        className={`${AI_BRAND_ICON_CLASS} object-contain`}
                      />
                    </div>
                  ),
                  steps: [
                    "In Tongyi Qianwen or Qwen API clients, paste into the system prompt.",
                    "Qwen will adapt to your coding standards.",
                  ],
                  snippet: chatPrompts.qwen,
                  snippetTitle: "Qwen Tailored Prompt",
                  copyKey: "chat-qwen",
                })
              }
            />
          </div>

          {/* Public Profile Link card for Web Browsing AIs */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">
                  Live Public Context Link
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  For AIs with web browsing (ChatGPT Plus, Gemini, Perplexity), share your live profile link:
                </p>
                <p className="mt-1.5 font-mono-brand text-xs text-[var(--text)]">
                  {origin}/profile/{effectiveUsername}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void copyText(`${origin}/profile/${effectiveUsername}`, "profile-link")
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
                >
                  {copied === "profile-link" ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      Copied link
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy link
                    </>
                  )}
                </button>
                <Link
                  href={`/profile/${effectiveUsername}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  View
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Guide Modal */}
      {activeModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {activeModal.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--text)]">
                      {activeModal.title}
                    </h3>
                    {activeModal.badge ? (
                      <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-mono text-[var(--muted)]">
                        {activeModal.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Setup Instructions & Configuration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Steps */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-[var(--text)]">Instructions:</p>
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                {activeModal.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--muted)]">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Snippet */}
            {activeModal.snippet ? (
              <SnippetBox
                title={activeModal.snippetTitle || "Configuration Snippet"}
                snippet={activeModal.snippet}
                onCopy={() => void copyText(activeModal.snippet, activeModal.copyKey || "modal-snippet")}
                copied={copied === (activeModal.copyKey || "modal-snippet")}
              />
            ) : null}

            {/* Secondary Snippet */}
            {activeModal.secondarySnippet ? (
              <SnippetBox
                title={activeModal.secondarySnippetTitle || "Additional Instructions"}
                snippet={activeModal.secondarySnippet}
                onCopy={() =>
                  void copyText(
                    activeModal.secondarySnippet,
                    activeModal.secondaryCopyKey || "modal-sec-snippet"
                  )
                }
                copied={copied === (activeModal.secondaryCopyKey || "modal-sec-snippet")}
              />
            ) : null}

            {/* Footer */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-[var(--border-subtle)] pt-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface)]/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
