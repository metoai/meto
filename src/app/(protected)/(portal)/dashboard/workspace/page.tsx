import { Suspense } from "react";
import { WorkspacePageClient } from "@/components/dashboard/workspace-page-client";

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[var(--bg)]" />}>
      <WorkspacePageClient />
    </Suspense>
  );
}
