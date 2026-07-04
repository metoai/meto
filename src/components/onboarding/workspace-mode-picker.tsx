"use client";

import { Code2, UserRound } from "lucide-react";
import type { WorkspaceMode } from "@/lib/workspace-mode";
import { WORKSPACE_MODE_COPY } from "@/lib/workspace-mode";

type WorkspaceModePickerProps = {
  onSelect: (mode: WorkspaceMode) => void;
  saving?: boolean;
};

export function WorkspaceModePicker({
  onSelect,
  saving = false,
}: WorkspaceModePickerProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
          How will you use Meto?
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
          You can switch anytime in Settings. This shapes your dashboard and workspace.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {(["personal", "developer"] as const).map((mode) => {
          const copy = WORKSPACE_MODE_COPY[mode];
          const Icon = mode === "developer" ? Code2 : UserRound;

          return (
            <button
              key={mode}
              type="button"
              disabled={saving}
              onClick={() => onSelect(mode)}
              className="landing-panel group flex h-full flex-col items-start p-5 text-left transition-[border-color,box-shadow] duration-150 hover:border-[var(--accent-border)] disabled:opacity-60"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="text-base font-medium text-[var(--text)]">
                {copy.title}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {copy.description}
              </span>
              <span className="mt-4 text-sm font-medium text-[var(--primary)]">
                {saving ? "Saving…" : copy.cta}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
