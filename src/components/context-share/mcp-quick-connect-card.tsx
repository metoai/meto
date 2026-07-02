"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type McpAccessPayload = {
  username: string;
  hasToken: boolean;
  token: string | null;
  endpointUrl: string | null;
  cursorConfig: string | null;
  claudeDesktopConfig: string | null;
  lastUsedAt: string | null;
  updatedAt: string;
};

type McpQuickConnectCardProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

type CopyKey = "endpoint" | "cursor" | "claude" | "token";
type AssistantTarget = "cursor" | "claude" | "chatgpt" | "deepseek" | "other";

const ASSISTANT_OPTIONS: Array<{ id: AssistantTarget; label: string; mcp: boolean }> = [
  { id: "cursor", label: "Cursor", mcp: true },
  { id: "claude", label: "Claude", mcp: true },
  { id: "chatgpt", label: "ChatGPT", mcp: false },
  { id: "deepseek", label: "DeepSeek", mcp: false },
  { id: "other", label: "Other AI/agent", mcp: false },
];

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "Never";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Unknown";
  const deltaMs = Date.now() - then;
  const minutes = Math.floor(deltaMs / (60 * 1000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function buildFallbackPrompt(username: string) {
  if (!username) return "";
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://www.metoai.site";
  const url = `${origin}/api/public/profile/${username}/context?preset=all&format=universal`;
  return [
    "Fetch this URL and use it as my context before answering:",
    url,
    "Do not rely on assumptions. Use this profile data directly.",
  ].join("\n");
}

export function McpQuickConnectCard({
  title = "Connect via MCP (recommended)",
  description = "Skip copy-paste. Connect Claude and Cursor directly to your live Meto profile context.",
  compact = false,
}: McpQuickConnectCardProps) {
  const [data, setData] = useState<McpAccessPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [selectedAssistant, setSelectedAssistant] =
    useState<AssistantTarget>("cursor");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/mcp-access");
      const payload = (await res.json()) as McpAccessPayload & { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to load MCP settings.");
      }
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load MCP settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const tokenPreview = useMemo(() => {
    if (!data?.token) return "";
    if (data.token.length <= 14) return data.token;
    return `${data.token.slice(0, 8)}…${data.token.slice(-6)}`;
  }, [data?.token]);

  const health = useMemo(() => {
    if (!data?.hasToken) {
      return { label: "Not connected", tone: "text-[var(--muted)]" };
    }
    if (data.lastUsedAt) {
      return { label: "Connected", tone: "text-emerald-600 dark:text-emerald-400" };
    }
    return { label: "Ready to connect", tone: "text-amber-600 dark:text-amber-400" };
  }, [data?.hasToken, data?.lastUsedAt]);

  const fallbackPrompt = useMemo(
    () => buildFallbackPrompt(data?.username ?? ""),
    [data?.username]
  );

  async function copyText(value: string | null, key: CopyKey) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 1500);
  }

  async function rotateToken() {
    setWorking(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/mcp-access", { method: "POST" });
      const payload = (await res.json()) as McpAccessPayload & { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to generate token.");
      }
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate token.");
    } finally {
      setWorking(false);
    }
  }

  async function revokeToken() {
    setWorking(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/mcp-access", { method: "DELETE" });
      const payload = (await res.json()) as McpAccessPayload & { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to revoke token.");
      }
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke token.");
    } finally {
      setWorking(false);
    }
  }

  if (loading) {
    return <div className="skeleton h-48 rounded-xl" />;
  }

  return (
    <div className="landing-panel p-4 sm:p-5">
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>

      <div className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Interop health
          </p>
          <span className={`text-xs font-medium ${health.tone}`}>{health.label}</span>
        </div>
        <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
          Last MCP sync: {formatRelativeTime(data?.lastUsedAt ?? null)}
        </p>
      </div>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
          {error}
        </p>
      ) : null}

      {!data?.username ? (
        <p className="mt-3 text-xs text-[var(--muted)]">
          Set a username in Settings first, then generate your MCP token.
        </p>
      ) : null}

      <div className={`mt-3 space-y-3 ${compact ? "" : "md:space-y-3.5"}`}>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Handoff wizard
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
            Choose your target AI. MCP is preferred when supported.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ASSISTANT_OPTIONS.map((option) => {
              const active = selectedAssistant === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedAssistant(option.id)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                  }`}
                >
                  {option.label}
                  {option.mcp ? " (MCP)" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
            MCP endpoint
          </p>
          <p className="mt-1 break-all font-mono-brand text-[11px] text-[var(--text-secondary)]">
            {data?.endpointUrl ?? "—"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyText(data?.endpointUrl ?? null, "endpoint")}
              disabled={!data?.endpointUrl}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] disabled:opacity-40"
            >
              {copied === "endpoint" ? "Copied endpoint" : "Copy endpoint"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              Access token
            </p>
            <button
              type="button"
              onClick={() => void rotateToken()}
              disabled={working || !data?.username}
              className="rounded-md bg-[var(--primary)] px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-40"
            >
              {data?.hasToken ? "Rotate token" : "Generate token"}
            </button>
          </div>
          <p className="mt-1 font-mono-brand text-[11px] text-[var(--text-secondary)]">
            {data?.hasToken ? tokenPreview : "No token generated yet."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyText(data?.token ?? null, "token")}
              disabled={!data?.token}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] disabled:opacity-40"
            >
              {copied === "token" ? "Copied token" : "Copy token"}
            </button>
            <button
              type="button"
              onClick={() => void revokeToken()}
              disabled={working || !data?.hasToken}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] disabled:opacity-40"
            >
              Revoke
            </button>
          </div>
        </div>

        {selectedAssistant === "cursor" || selectedAssistant === "claude" ? (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {selectedAssistant === "cursor"
                ? "Cursor setup (MCP)"
                : "Claude setup (MCP remote)"}
            </p>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Step 1: generate token. Step 2: copy config. Step 3: restart client and test.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedAssistant === "cursor" ? (
                <button
                  type="button"
                  onClick={() => void copyText(data?.cursorConfig ?? null, "cursor")}
                  disabled={!data?.cursorConfig}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] disabled:opacity-40"
                >
                  {copied === "cursor"
                    ? "Copied Cursor config"
                    : "Copy Cursor config"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void copyText(data?.claudeDesktopConfig ?? null, "claude")}
                  disabled={!data?.claudeDesktopConfig}
                  className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] disabled:opacity-40"
                >
                  {copied === "claude"
                    ? "Copied Claude config"
                    : "Copy Claude config"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              Fallback handoff ({ASSISTANT_OPTIONS.find((o) => o.id === selectedAssistant)?.label})
            </p>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
              This target may not support MCP directly. Use your portable profile prompt.
            </p>
            <pre className="mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-2.5 py-2 font-mono-brand text-[11px] text-[var(--text-secondary)]">
              {fallbackPrompt || "Set a username to generate a fallback prompt."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
