"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SuccessToast } from "@/components/dashboard-shell";
import { ContextComposer } from "@/components/context-share/context-composer";
import { WorkspaceBanner } from "@/components/context-share/workspace-banner";
import { PortalPageShell } from "@/components/portal/portal-page-shell";
import { usePortalData } from "@/components/portal/portal-data-context";
import { getSiteUrl } from "@/lib/public-profile";
import { getCopyStats, formatLastCopied } from "@/lib/copy-stats";

export function WorkspacePageClient() {
  const { loaded, profile, sections, displayName, refresh } = usePortalData();
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

  return (
    <>
      <SuccessToast />
      <PortalPageShell>
        <WorkspaceBanner />

        {loaded ? (
          <>
            <div
              id="workspace"
              className="scroll-mt-16 rounded-xl border border-black/[0.08] bg-[#FAFAF8] p-3 md:p-4"
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

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-[#9B9B93]">
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
          <div className="skeleton h-64 rounded-xl" />
        )}
      </PortalPageShell>
    </>
  );
}
