"use client";

import { DashboardEditor } from "@/components/dashboard/dashboard-editor";

type WorkspaceCardProps = {
  editorKey: number;
};

export function WorkspaceCard({ editorKey }: WorkspaceCardProps) {
  return (
    <div id="workspace" className="scroll-mt-16 w-full bg-[var(--bg)]">
      <DashboardEditor
        key={`share-${editorKey}`}
        panel="share"
        embedded
        inline
      />
    </div>
  );
}
