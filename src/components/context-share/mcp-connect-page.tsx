"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";
import { McpToolIcon } from "@/components/ui/mcp-tool-icon";
import { useMcpAccess } from "@/hooks/use-mcp-access";
import { MCP_TOOL_ICONS } from "@/lib/ai-platform-icons";
import { MCP_TEST_PROMPT } from "@/lib/mcp-install";

type CopyKey = "claude" | "config" | "test" | "token";

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

function IntegrationRow({
  tool,
  action,
  actionLabel,
  working,
  done,
  children,
}: {
  tool: keyof typeof MCP_TOOL_ICONS;
  action: () => void;
  actionLabel: string;
  working?: boolean;
  done?: boolean;
  children?: React.ReactNode;
}) {
  const meta = MCP_TOOL_ICONS[tool];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] transition-colors hover:border-[var(--border)]">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]">
          <McpToolIcon tool={tool} size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--text)]">{meta.label}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{meta.hint}</p>
        </div>
        <button
          type="button"
          onClick={action}
          disabled={working}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--text)] px-3.5 py-2 text-xs font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {done ? (
            <>
              <Check className="h-3.5 w-3.5" />
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
      </div>
      {children ? (
        <div className="border-t border-[var(--border-subtle)] px-4 py-3 sm:px-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function McpConnectPage() {
  const { data, loading, working, error, status, ensureToken, addToCursor, revokeToken } =
    useMcpAccess();
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [claudeStepsOpen, setClaudeStepsOpen] = useState(false);

  async function copyText(value: string | null, key: CopyKey) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 1500);
  }

  async function handleClaudeSetup() {
    const payload = await ensureToken();
    if (!payload?.claudeDesktopConfig) return;
    await copyText(payload.claudeDesktopConfig, "claude");
    setClaudeStepsOpen(true);
  }

  if (loading) {
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
            Your live profile context inside Cursor and Claude.
          </p>
        </div>
        <StatusPill
          label={status.label}
          detail={status.detail}
          tone={status.tone}
        />
      </div>

      {!data?.username ? (
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
            <IntegrationRow
              tool="cursor"
              action={() => void addToCursor()}
              actionLabel="Connect"
              working={working}
            />

            <IntegrationRow
              tool="claude"
              action={() => void handleClaudeSetup()}
              actionLabel="Copy config"
              working={working}
              done={copied === "claude"}
            >
              {claudeStepsOpen ? (
                <ol className="space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  <li>Claude Desktop → Settings → Developer → Edit Config</li>
                  <li>
                    Paste under{" "}
                    <code className="font-mono-brand text-[var(--text)]">
                      mcpServers
                    </code>
                  </li>
                  <li>Restart Claude Desktop</li>
                </ol>
              ) : null}
            </IntegrationRow>
          </div>

          {data.hasToken ? (
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
                  {data.endpointUrl ?? "—"}
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
                  onClick={() => void copyText(data.cursorConfig, "config")}
                  disabled={!data.cursorConfig}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1.5 hover:text-[var(--text)] disabled:opacity-40"
                >
                  {copied === "config" ? "Copied JSON" : "Copy mcp.json"}
                </button>
                <button
                  type="button"
                  onClick={() => void revokeToken()}
                  disabled={working || !data.hasToken}
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
