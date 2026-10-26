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
} from "lucide-react";
import { useMemo, useState } from "react";
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
  buildVSCodeMcpJson,
  buildWindsurfMcpJson,
  buildZedMcpJson,
} from "@/lib/mcp-install";
import type { CompileFormat } from "@/lib/types";

type CopyKey = string;

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
    <div className="mt-2.5 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg)] text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)]/50 px-3 py-1.5 text-[11px] text-[var(--muted)]">
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
      <pre className="max-h-48 overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-[var(--text)]">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}

function IntegrationRow({
  tool,
  badge,
  action,
  actionLabel,
  working,
  done,
  expanded,
  onToggleExpand,
  children,
}: {
  tool: McpToolId;
  badge?: string;
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
    <div className="group transition-colors hover:bg-[var(--surface)]/40">
      <div className="flex items-center gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]/80 transition-colors group-hover:border-[var(--border)]">
          <McpToolIcon tool={tool} size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-medium text-[var(--text)]">{meta.label}</p>
            {badge ? (
              <span className="hidden sm:inline-flex rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted)]">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-[var(--muted)] truncate">{meta.hint}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={action}
            disabled={working}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg text-xs font-medium transition-all ${
              actionLabel === "Connect"
                ? "bg-[var(--text)] text-[var(--bg)] px-3 py-1.5 hover:opacity-90 disabled:opacity-50 shadow-xs"
                : "border border-[var(--border-subtle)] bg-[var(--surface)]/70 hover:bg-[var(--surface)] hover:border-[var(--border)] text-[var(--text)] px-2.5 py-1.5"
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
                  <ArrowRight className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3 text-[var(--muted)]" />
                )}
              </>
            )}
          </button>
          {children ? (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={`Toggle setup steps for ${meta.label}`}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-150 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : null}
        </div>
      </div>
      {expanded && children ? (
        <div className="border-t border-[var(--border-subtle)]/70 bg-[var(--surface)]/25 px-4 py-3 sm:px-4 sm:py-3.5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function ChatAiRow({
  format,
  label,
  badge,
  hint,
  prompt,
  steps,
  onCopy,
  copied,
  expanded,
  onToggleExpand,
}: {
  format: CompileFormat;
  label: string;
  badge?: string;
  hint: string;
  prompt: string;
  steps: string[];
  onCopy: () => void;
  copied: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const iconConfig = AI_PLATFORM_ICONS[format];

  return (
    <div className="group transition-colors hover:bg-[var(--surface)]/40">
      <div className="flex items-center gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]/80 transition-colors group-hover:border-[var(--border)]">
          {iconConfig?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={iconConfig.url}
              alt=""
              aria-hidden
              width={18}
              height={18}
              className={`${AI_BRAND_ICON_CLASS} shrink-0 object-contain`}
              loading="lazy"
            />
          ) : (
            <MessageSquare className="h-4 w-4 text-[var(--muted)]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-medium text-[var(--text)]">{label}</p>
            {badge ? (
              <span className="hidden sm:inline-flex rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted)]">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-[var(--muted)] truncate">{hint}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]/70 hover:bg-[var(--surface)] hover:border-[var(--border)] text-[var(--text)] px-2.5 py-1.5 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
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
            onClick={onToggleExpand}
            aria-label={`Toggle setup instructions for ${label}`}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-150 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
      {expanded ? (
        <div className="border-t border-[var(--border-subtle)]/70 bg-[var(--surface)]/25 px-4 py-3 sm:px-4 sm:py-3.5">
          <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--muted)]">
                  {idx + 1}
                </span>
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
          <SnippetBox
            title={`${label} Tailored Prompt`}
            snippet={prompt}
            onCopy={onCopy}
            copied={copied}
          />
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
  const [activeCategory, setActiveCategory] = useState<"ide" | "chat">("ide");
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});

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

  // Chat AI Tailored Prompts
  const chatPrompts = useMemo(() => {
    const sectionsList =
      portal?.sections && portal.sections.length > 0
        ? portal.sections.map((s) => ({
            title: s.title || s.section_type,
            content: s.content,
          }))
        : [
            {
              title: "Persona",
              content: `${portal?.displayName || effectiveUsername || "Developer"}: Software engineer focused on clean architecture, type safety, and maintainable code.`,
            },
          ];

    return {
      chatgpt: compileLocally("chatgpt", sectionsList),
      claude: compileLocally("claude", sectionsList),
      gemini: compileLocally("gemini", sectionsList),
      deepseek: compileLocally("deepseek", sectionsList),
      grok: compileLocally("grok", sectionsList),
      kimi: compileLocally("kimi", sectionsList),
      qwen: compileLocally("qwen", sectionsList),
    };
  }, [portal?.sections, portal?.displayName, effectiveUsername]);

  async function copyText(value: string | null, key: CopyKey) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 1800);
  }

  function toggleExpand(key: string) {
    setExpandedTools((prev) => ({ ...prev, [key]: !prev[key] }));
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
    setExpandedTools((prev) => ({ ...prev, [tool]: true }));
  }

  async function handleCopyChatPrompt(format: CompileFormat, prompt: string) {
    await copyText(prompt, `chat-${format}`);
    setExpandedTools((prev) => ({ ...prev, [`chat-${format}`]: true }));
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
    <div className="w-full max-w-4xl space-y-5">
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
        <div className="space-y-5">
          {error ? (
            <p className="rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] divide-y divide-[var(--border-subtle)] shadow-xs">
            {/* Cursor */}
            <IntegrationRow
              tool="cursor"
              badge="1-Click / SSE"
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
              badge="Direct SSE"
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
              badge="Stdio Proxy"
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
              badge="Extension / JSON"
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

            {/* Antigravity */}
            <IntegrationRow
              tool="antigravity"
              badge="Native MCP"
              action={() => void handleCopyToolConfig("antigravity", antigravitySnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "antigravity"}
              expanded={Boolean(expandedTools.antigravity)}
              onToggleExpand={() => toggleExpand("antigravity")}
            >
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <li>
                  In Google Antigravity, add <code className="font-mono-brand text-[var(--text)]">meto</code> to your MCP servers in <code className="font-mono-brand text-[var(--text)]">~/.gemini/antigravity/mcp/</code> or agy CLI settings.
                </li>
                <li>
                  Paste the stdio configuration below.
                </li>
                <li>
                  Antigravity subagents and planners will automatically pull your verified directives and stack.
                </li>
              </ol>
              <SnippetBox
                title="Antigravity MCP Configuration"
                snippet={antigravitySnippet}
                onCopy={() => void copyText(antigravitySnippet, "antigravity-snippet")}
                copied={copied === "antigravity-snippet"}
              />
            </IntegrationRow>

            {/* GitHub Copilot & Codex */}
            <IntegrationRow
              tool="copilot"
              badge="Chat & Rules"
              action={() => void handleCopyToolConfig("copilot", copilotSnippet)}
              actionLabel="Copy config"
              working={working}
              done={copied === "copilot"}
              expanded={Boolean(expandedTools.copilot)}
              onToggleExpand={() => toggleExpand("copilot")}
            >
              <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <li>
                  <strong className="text-[var(--text)] font-medium">Option A (Copilot Chat MCP):</strong> In VS Code Settings (<code className="font-mono-brand text-[var(--text)]">settings.json</code>), add under <code className="font-mono-brand text-[var(--text)]">github.copilot.chat.mcpServers</code>.
                </li>
                <li>
                  <strong className="text-[var(--text)] font-medium">Option B (Copilot Repo Instructions):</strong> Create a file at <code className="font-mono-brand text-[var(--text)]">.github/copilot-instructions.md</code> in your project root.
                </li>
              </ol>
              <SnippetBox
                title="settings.json (Copilot Chat MCP)"
                snippet={copilotSnippet}
                onCopy={() => void copyText(copilotSnippet, "copilot-snippet")}
                copied={copied === "copilot-snippet"}
              />
              <SnippetBox
                title=".github/copilot-instructions.md (Repo Instructions)"
                snippet={copilotInstructionsSnippet}
                onCopy={() => void copyText(copilotInstructionsSnippet, "copilot-md-snippet")}
                copied={copied === "copilot-md-snippet"}
              />
            </IntegrationRow>

            {/* Zed */}
            <IntegrationRow
              tool="zed"
              badge="Settings JSON"
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
              badge="CLI"
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
        <div className="space-y-5">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/50 p-3.5 sm:p-4 text-xs text-[var(--text-secondary)] leading-relaxed">
            <p>
              For web and chat interfaces without MCP, copy your compiled persona prompt and paste it into the AI&apos;s <strong className="text-[var(--text)]">Custom Instructions</strong>, <strong className="text-[var(--text)]">System Prompt</strong>, or <strong className="text-[var(--text)]">Custom Gems/GPTs</strong>.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] divide-y divide-[var(--border-subtle)] shadow-xs">
            {/* ChatGPT */}
            <ChatAiRow
              format="chatgpt"
              label="ChatGPT"
              badge="Custom Instructions"
              hint="Custom Instructions & GPTs"
              prompt={chatPrompts.chatgpt}
              steps={[
                "In ChatGPT, click your profile avatar (bottom-left) → Settings → Personalization.",
                "Open Custom Instructions ('What would you like ChatGPT to know about you to provide better responses?').",
                "Paste your compiled Meto profile prompt below.",
              ]}
              onCopy={() => void handleCopyChatPrompt("chatgpt", chatPrompts.chatgpt)}
              copied={copied === "chat-chatgpt"}
              expanded={Boolean(expandedTools["chat-chatgpt"])}
              onToggleExpand={() => toggleExpand("chat-chatgpt")}
            />

            {/* Claude.ai */}
            <ChatAiRow
              format="claude"
              label="Claude.ai"
              badge="Projects"
              hint="Projects & Custom Instructions"
              prompt={chatPrompts.claude}
              steps={[
                "In Claude.ai, open your Project (or click Projects in the left sidebar).",
                "Click Set Project Instructions (or add as Project Knowledge document).",
                "Paste your compiled context prompt below.",
              ]}
              onCopy={() => void handleCopyChatPrompt("claude", chatPrompts.claude)}
              copied={copied === "chat-claude"}
              expanded={Boolean(expandedTools["chat-claude"])}
              onToggleExpand={() => toggleExpand("chat-claude")}
            />

            {/* Google Gemini */}
            <ChatAiRow
              format="gemini"
              label="Google Gemini"
              badge="Custom Gems"
              hint="Custom Gems & AI Studio"
              prompt={chatPrompts.gemini}
              steps={[
                "In Google Gemini, open Gems manager (or System instructions in Google AI Studio).",
                "Create a new custom Gem or add to conversation instructions.",
                "Paste your compiled context prompt below.",
              ]}
              onCopy={() => void handleCopyChatPrompt("gemini", chatPrompts.gemini)}
              copied={copied === "chat-gemini"}
              expanded={Boolean(expandedTools["chat-gemini"])}
              onToggleExpand={() => toggleExpand("chat-gemini")}
            />

            {/* DeepSeek */}
            <ChatAiRow
              format="deepseek"
              label="DeepSeek"
              badge="System Prompt"
              hint="System Prompt & Reasoning Persona"
              prompt={chatPrompts.deepseek}
              steps={[
                "In DeepSeek Chat or API clients, paste into the System Prompt or conversation opening.",
                "DeepSeek will apply your preferred architectural patterns and stack to all reasoning steps.",
              ]}
              onCopy={() => void handleCopyChatPrompt("deepseek", chatPrompts.deepseek)}
              copied={copied === "chat-deepseek"}
              expanded={Boolean(expandedTools["chat-deepseek"])}
              onToggleExpand={() => toggleExpand("chat-deepseek")}
            />

            {/* Grok */}
            <ChatAiRow
              format="grok"
              label="Grok"
              badge="System Prompt"
              hint="Conversation Context & Preferences"
              prompt={chatPrompts.grok}
              steps={[
                "In Grok on X, paste the prompt snippet into your chat context or Custom Instructions.",
                "Grok will personalize technical answers and code to your workflow.",
              ]}
              onCopy={() => void handleCopyChatPrompt("grok", chatPrompts.grok)}
              copied={copied === "chat-grok"}
              expanded={Boolean(expandedTools["chat-grok"])}
              onToggleExpand={() => toggleExpand("chat-grok")}
            />

            {/* Moonshot (Kimi) */}
            <ChatAiRow
              format="kimi"
              label="Moonshot (Kimi)"
              badge="Kimi+ Prompt"
              hint="Kimi+ Context & Prompt"
              prompt={chatPrompts.kimi}
              steps={[
                "In Kimi Chat, paste into your custom prompt or agent instructions.",
                "Kimi will personalize responses according to your tech stack directives.",
              ]}
              onCopy={() => void handleCopyChatPrompt("kimi", chatPrompts.kimi)}
              copied={copied === "chat-kimi"}
              expanded={Boolean(expandedTools["chat-kimi"])}
              onToggleExpand={() => toggleExpand("chat-kimi")}
            />

            {/* Qwen */}
            <ChatAiRow
              format="qwen"
              label="Qwen"
              badge="System Prompt"
              hint="Tongyi Qianwen & Assistant Instructions"
              prompt={chatPrompts.qwen}
              steps={[
                "In Tongyi Qianwen or Qwen API clients, paste into the system prompt.",
                "Qwen will adapt to your coding standards.",
              ]}
              onCopy={() => void handleCopyChatPrompt("qwen", chatPrompts.qwen)}
              copied={copied === "chat-qwen"}
              expanded={Boolean(expandedTools["chat-qwen"])}
              onToggleExpand={() => toggleExpand("chat-qwen")}
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
    </div>
  );
}
