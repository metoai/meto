"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { SuccessToast } from "@/components/dashboard-shell";
import { UpdateUpgradeWall } from "@/components/billing/update-upgrade-wall";
import { QuickUpdateChat } from "@/components/dashboard/quick-update-chat";
import { usePortalData } from "@/components/portal/portal-data-context";
import { useQuickUpdateSidebarOptional } from "@/components/portal/quick-update-sidebar-context";
import {
  getWorkspaceMode,
  isDeveloperWorkspace,
} from "@/lib/workspace-mode";
import {
  buildGapFixIntentFromSession,
  readAllGapFixItems,
  readGapFixSession,
  type GapFixIntent,
} from "@/lib/context-score-actions";
import { friendlySectionTitle } from "@/lib/section-display";

export function UpdatePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { displayName, refresh, profile } = usePortalData();
  const sidebar = useQuickUpdateSidebarOptional();
  const isDev = isDeveloperWorkspace(profile);
  const workspaceMode = getWorkspaceMode(profile);

  const fromContextScore = searchParams.get("from") === "context-score";
  const mode = searchParams.get("mode") === "all" ? "all" : "single";
  const fixSection = searchParams.get("section");
  const fixInsight = searchParams.get("insight") ?? "";

  const gapFix = useMemo((): GapFixIntent | null => {
    if (isDev || !fromContextScore) return null;

    const session = readGapFixSession();
    if (mode === "all" && session?.queue.length) {
      const current = session.queue[0];
      return {
        mode: "all",
        sectionType: current.sectionType,
        insight: current.insight,
        title: current.title,
        queue: session.queue,
        queueIndex: 0,
        totalCount: readAllGapFixItems().length || session.queue.length,
      };
    }

    if (fixSection) {
      const fromSession = buildGapFixIntentFromSession(fixSection, fixInsight);
      if (fromSession) return fromSession;

      return {
        mode: "single",
        sectionType: fixSection,
        insight: fixInsight,
        title: friendlySectionTitle(fixSection),
        queue: [
          {
            sectionType: fixSection,
            insight: fixInsight,
            title: friendlySectionTitle(fixSection),
          },
        ],
        queueIndex: 0,
        totalCount: 1,
      };
    }

    return null;
  }, [fixInsight, fixSection, fromContextScore, isDev, mode]);

  useEffect(() => {
    sidebar?.registerOnProfileUpdated(() => {
      void refresh();
    });
    return () => sidebar?.registerOnProfileUpdated(null);
  }, [sidebar, refresh]);

  return (
    <>
      <SuccessToast />
      <UpdateUpgradeWall>
        <div className="flex min-h-0 flex-1 flex-col">
          <QuickUpdateChat
            key={workspaceMode}
            variant="full"
            displayName={displayName}
            workspaceMode={workspaceMode}
            gapFix={gapFix}
            onApplied={({ finishedAll }) => {
              void refresh();
              if (finishedAll) {
                router.push(isDev ? "/dashboard/projects" : "/dashboard/fixes");
              }
            }}
          />
        </div>
      </UpdateUpgradeWall>
    </>
  );
}
