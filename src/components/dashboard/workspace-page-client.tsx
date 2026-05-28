"use client";

import { SuccessToast } from "@/components/dashboard-shell";
import { DashboardEditor } from "@/components/dashboard/dashboard-editor";

export function WorkspacePageClient() {
  return (
    <>
      <SuccessToast />
      <div className="min-h-0 w-full flex-1 overflow-y-auto p-4 md:p-5">
        <div id="workspace" className="scroll-mt-16 w-full bg-[var(--bg)]">
          <DashboardEditor panel="share" embedded inline />
        </div>
      </div>
    </>
  );
}
