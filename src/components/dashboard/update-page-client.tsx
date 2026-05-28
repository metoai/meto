"use client";

import { useEffect } from "react";
import { SuccessToast } from "@/components/dashboard-shell";
import { QuickUpdateChat } from "@/components/dashboard/quick-update-chat";
import { usePortalData } from "@/components/portal/portal-data-context";
import { useQuickUpdateSidebarOptional } from "@/components/portal/quick-update-sidebar-context";

export function UpdatePageClient() {
  const { displayName, refresh } = usePortalData();
  const sidebar = useQuickUpdateSidebarOptional();

  useEffect(() => {
    sidebar?.registerOnProfileUpdated(() => {
      void refresh();
    });
    return () => sidebar?.registerOnProfileUpdated(null);
  }, [sidebar, refresh]);

  return (
    <>
      <SuccessToast />
      <div className="flex min-h-0 flex-1 flex-col">
        <QuickUpdateChat
          variant="full"
          displayName={displayName}
          onApplied={() => void refresh()}
        />
      </div>
    </>
  );
}
