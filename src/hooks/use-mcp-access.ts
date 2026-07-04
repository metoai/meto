"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type McpAccessPayload = {
  username: string;
  hasToken: boolean;
  token: string | null;
  endpointUrl: string | null;
  cursorConfig: string | null;
  cursorInstallUrl: string | null;
  cursorDeeplink: string | null;
  claudeDesktopConfig: string | null;
  lastUsedAt: string | null;
  updatedAt: string;
};

export function formatMcpRelativeTime(iso: string | null): string {
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

export function useMcpAccess() {
  const [data, setData] = useState<McpAccessPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const status = useMemo(() => {
    if (!data?.hasToken) {
      return {
        label: "Not connected",
        detail: "Connect an editor below",
        tone: "muted" as const,
      };
    }
    if (data.lastUsedAt) {
      return {
        label: "Connected",
        detail: `Synced ${formatMcpRelativeTime(data.lastUsedAt)}`,
        tone: "success" as const,
      };
    }
    return {
      label: "Ready",
      detail: "Install in your editor",
      tone: "ready" as const,
    };
  }, [data?.hasToken, data?.lastUsedAt]);

  const ensureToken = useCallback(async (): Promise<McpAccessPayload | null> => {
    if (data?.hasToken && data.token) return data;
    setWorking(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/mcp-access", { method: "POST" });
      const payload = (await res.json()) as McpAccessPayload & { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to generate token.");
      }
      setData(payload);
      return payload;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate token.");
      return null;
    } finally {
      setWorking(false);
    }
  }, [data]);

  const addToCursor = useCallback(async () => {
    const payload = await ensureToken();
    const installUrl = payload?.cursorInstallUrl ?? payload?.cursorDeeplink;
    if (!installUrl) return;
    window.location.href = installUrl;
  }, [ensureToken]);

  const revokeToken = useCallback(async () => {
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
  }, []);

  return {
    data,
    loading,
    working,
    error,
    status,
    load,
    ensureToken,
    addToCursor,
    revokeToken,
  };
}
