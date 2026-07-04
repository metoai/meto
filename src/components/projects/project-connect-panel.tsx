"use client";

import Link from "next/link";
import { McpToolIcon } from "@/components/ui/mcp-tool-icon";
import {
  formatMcpRelativeTime,
  useMcpAccess,
} from "@/hooks/use-mcp-access";
import { MCP_TOOL_ICONS } from "@/lib/ai-platform-icons";

const AI_TOOLS = [
  { id: "cursor" as const, mcp: true },
  { id: "claude" as const, mcp: true },
  { id: "chatgpt", label: "Codex / VS Code", mcp: false },
  { id: "gemini", label: "Gemini CLI", mcp: false },
];

export function ProjectConnectPanel({ projectSlug }: { projectSlug: string }) {
  const { data, status } = useMcpAccess();

  return (
    <div className="space-y-4">
      <section className="landing-panel p-4">
        <p className="landing-panel-label mb-3">AI connections</p>
        <ul className="space-y-2">
          {AI_TOOLS.map((tool) => {
            const isMcp = tool.mcp && tool.id in MCP_TOOL_ICONS;
            const meta = isMcp
              ? MCP_TOOL_ICONS[tool.id as keyof typeof MCP_TOOL_ICONS]
              : null;
            const label =
              meta?.label ?? ("label" in tool ? tool.label : tool.id);

            return (
              <li
                key={tool.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2.5"
              >
                {isMcp ? (
                  <McpToolIcon tool={tool.id as keyof typeof MCP_TOOL_ICONS} size={20} />
                ) : (
                  <div className="h-5 w-5 rounded bg-[var(--surface)]" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text)]">{label}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {isMcp && data?.hasToken
                      ? `Last sync ${formatMcpRelativeTime(data.lastUsedAt)} · ${projectSlug}`
                      : isMcp
                        ? "Not connected"
                        : "Copy today's context manually"}
                  </p>
                </div>
                {isMcp ? (
                  <span
                    className={`text-xs ${
                      status.tone === "success"
                        ? "text-emerald-600"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {status.label}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="landing-panel p-4">
        <p className="landing-panel-label mb-2">MCP resources</p>
        <ul className="space-y-1 font-mono text-xs text-[var(--text-secondary)]">
          <li>profile://project/{projectSlug}</li>
          <li>profile://project/{projectSlug}/today</li>
        </ul>
        <Link
          href="/dashboard/workspace"
          className="mt-3 inline-block text-xs font-medium text-[var(--primary)] hover:underline"
        >
          Open MCP connect →
        </Link>
      </section>
    </div>
  );
}
