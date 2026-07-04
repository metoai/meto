"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SuccessToast } from "@/components/dashboard-shell";
import { ContextComposer } from "@/components/context-share/context-composer";
import { McpConnectPage } from "@/components/context-share/mcp-connect-page";
import { McpQuickConnectCard } from "@/components/context-share/mcp-quick-connect-card";
import { WorkspaceBanner } from "@/components/context-share/workspace-banner";
import { PortalPageShell } from "@/components/portal/portal-page-shell";
import { usePortalData } from "@/components/portal/portal-data-context";
import { isDeveloperWorkspace } from "@/lib/workspace-mode";
import { getSiteUrl } from "@/lib/public-profile";
import { getCopyStats, formatLastCopied } from "@/lib/copy-stats";

export function WorkspacePageClient() {
  const { loaded, profile, sections, displayName, refresh } = usePortalData();
  const isDev = isDeveloperWorkspace(profile);
  const [copyStats, setCopyStats] = useState({
    weekCount: 0,
    lastCopiedAt: null as string | null,
  });

  useEffect(() => {
    setCopyStats(getCopyStats());
  }, []);

  const contextSections = useMemo(
    () =>
      sections.map((s) => ({
        id: s.id,
        section_type: s.section_type,
        title: s.title,
        content: s.content,
        is_public: s.is_public,
      })),
    [sections]
  );

  const publicCount = useMemo(
    () => sections.filter((s) => s.is_public && s.content?.trim()).length,
    [sections]
  );

  const handleTogglePublic = useCallback(
    async (sectionId: string) => {
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return;

      const res = await fetch(`/api/profile/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: !section.is_public }),
      });

      if (res.ok) {
        await refresh();
      }
    },
    [sections, refresh]
  );

  const siteUrl = getSiteUrl();

  if (isDev) {
    return (
      <>
        <SuccessToast />
        <PortalPageShell>
          {loaded ? <McpConnectPage /> : <div className="skeleton h-48 w-full max-w-3xl rounded-xl" />}
        </PortalPageShell>
      </>
    );
  }

  return (
    <>
      <SuccessToast />
      <PortalPageShell flush>
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="shrink-0">
            <WorkspaceBanner />
          </div>

          {loaded ? (
            <>
              <div
                id="workspace"
                className="flex min-h-0 flex-1 flex-col scroll-mt-16 overflow-hidden"
              >
                <ContextComposer
                  sections={contextSections}
                  username={profile?.username ?? ""}
                  displayName={displayName}
                  siteUrl={siteUrl}
                  onToggleSectionPublic={(id) => void handleTogglePublic(id)}
                  embedded
                  workspaceLayout
                />
              </div>

              <details className="shrink-0 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/50 px-4 py-3 text-sm">
                <summary className="cursor-pointer font-medium text-[var(--text-secondary)]">
                  Advanced: MCP for coding tools
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Optional — most people paste context above. Developers can
                  connect Cursor or Claude via MCP.
                </p>
                <div className="mt-3">
                  <McpQuickConnectCard compact />
                </div>
              </details>

              <div className="shrink-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-[var(--muted)]">
                <span>
                  {publicCount} public section{publicCount === 1 ? "" : "s"} on
                  your profile
                </span>
                <span aria-hidden>·</span>
                <span>
                  Copied {copyStats.weekCount} time
                  {copyStats.weekCount === 1 ? "" : "s"} this week
                  {copyStats.lastCopiedAt
                    ? ` — last ${formatLastCopied(copyStats.lastCopiedAt)}`
                    : ""}
                </span>
              </div>
            </>
          ) : (
            <div className="skeleton min-h-[50vh] flex-1 rounded-xl" />
          )}
        </div>
      </PortalPageShell>
    </>
  );
}
