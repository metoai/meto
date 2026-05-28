"use client";

import { SuccessToast } from "@/components/dashboard-shell";
import { DashboardEditor } from "@/components/dashboard/dashboard-editor";

export function ProfilePageClient() {
  return (
    <>
      <SuccessToast />
      <div className="min-h-0 w-full flex-1 overflow-y-auto p-4 md:p-5">
        <DashboardEditor panel="profile" embedded />
      </div>
    </>
  );
}
