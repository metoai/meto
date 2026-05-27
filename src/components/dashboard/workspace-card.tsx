"use client";

import { DashboardEditor } from "@/components/dashboard/dashboard-editor";
import { UpdateContextCard } from "@/components/dashboard/update-context-card";

type WorkspaceCardProps = {
  editorKey: number;
  onApplied?: () => void;
};

export function WorkspaceCard({ editorKey, onApplied }: WorkspaceCardProps) {
  const sectionClass =
    "rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/80 p-4 sm:p-5";

  return (
    <div id="workspace" className="scroll-mt-16 w-full space-y-4">
      {/* Section A — Quick update (secondary) */}
      <section className={sectionClass}>
        <UpdateContextCard embedded workspace onApplied={onApplied} />
      </section>

      {/* Section B — Share with AI (primary) */}
      <section
        className={sectionClass}
        style={{ boxShadow: "var(--color-card-shadow)" }}
      >
        <div className="mb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Share with AI
          </p>
          <h2 className="mt-1 text-sm font-semibold text-[var(--color-text)]">
            Share with AI
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            Choose what to include, then copy context for Claude, ChatGPT, or
            Gemini.
          </p>
        </div>
        <DashboardEditor
          key={`share-${editorKey}`}
          panel="share"
          embedded
          inline
        />
      </section>
    </div>
  );
}
