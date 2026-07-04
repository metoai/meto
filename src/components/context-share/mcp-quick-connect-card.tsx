"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { McpToolIcon } from "@/components/ui/mcp-tool-icon";
import { useMcpAccess } from "@/hooks/use-mcp-access";
import { MCP_TEST_PROMPT } from "@/lib/mcp-install";

type CopyKey = "claude" | "test";

/** Compact MCP connect — settings panel & personal workspace advanced */
export function McpQuickConnectCard({
  title = "MCP",
  description = "Connect Cursor or Claude to your live profile.",
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  const { data, loading, working, error, addToCursor, ensureToken } =
    useMcpAccess();
  const [copied, setCopied] = useState<CopyKey | null>(null);

  async function copyText(value: string | null, key: CopyKey) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 1500);
  }

  if (loading) {
    return <div className="skeleton h-32 rounded-xl" />;
  }

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
      <p className="text-sm font-medium text-[var(--text)]">{title}</p>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">{description}</p>

      {error ? (
        <p className="mt-3 text-xs text-red-600">{error}</p>
      ) : null}

      {!data?.username ? (
        <Link
          href="/settings"
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
        >
          Claim username in Settings
          <ArrowRight className="h-3 w-3" />
        </Link>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void addToCursor()}
            disabled={working}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--text)] px-3 py-2 text-xs font-medium text-[var(--bg)] disabled:opacity-50"
          >
            <McpToolIcon tool="cursor" size={14} />
            Connect Cursor
          </button>
          <button
            type="button"
            onClick={() =>
              void ensureToken().then((p) =>
                copyText(p?.claudeDesktopConfig ?? null, "claude")
              )
            }
            disabled={working}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)] disabled:opacity-50"
          >
            <McpToolIcon tool="claude" size={14} />
            {copied === "claude" ? "Copied" : "Claude config"}
          </button>
          {data.hasToken ? (
            <button
              type="button"
              onClick={() => void copyText(MCP_TEST_PROMPT, "test")}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-secondary)]"
            >
              {copied === "test" ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : null}
              Test prompt
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
