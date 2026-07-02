"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type McpAccessPayload = {
  username: string;
  hasToken: boolean;
  token: string | null;
  endpointUrl: string | null;
  cursorConfig: string | null;
  claudeDesktopConfig: string | null;
  updatedAt: string;
};

type McpQuickConnectCardProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

type CopyKey = "endpoint" | "cursor" | "claude" | "token";

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

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
            One-click client setup
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
            Copy ready configs for Cursor and Claude Desktop.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyText(data?.cursorConfig ?? null, "cursor")}
              disabled={!data?.cursorConfig}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] disabled:opacity-40"
            >
              {copied === "cursor" ? "Copied Cursor config" : "Copy Cursor config"}
            </button>
            <button
              type="button"
              onClick={() => void copyText(data?.claudeDesktopConfig ?? null, "claude")}
              disabled={!data?.claudeDesktopConfig}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] disabled:opacity-40"
            >
              {copied === "claude" ? "Copied Claude config" : "Copy Claude config"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
