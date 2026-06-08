"use client";

import type { ContextPresetId } from "@/lib/context-templates";
import { INTENT_PRESETS } from "@/lib/context-share/config";

type IntentGridProps = {
  selectedPreset: ContextPresetId;
  onSelect: (preset: Exclude<ContextPresetId, "custom">) => void;
  workspaceLayout?: boolean;
};

export function IntentGrid({
  selectedPreset,
  onSelect,
  workspaceLayout = false,
}: IntentGridProps) {
  if (workspaceLayout) {
    return (
      <div className="space-y-2">
        <p className="landing-panel-label">Scenario</p>
        <div className="flex flex-wrap gap-1.5">
          {INTENT_PRESETS.map((preset) => {
            const active = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelect(preset.id)}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                  active
                    ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--text)]"
                    : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--text)]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          {selectedPreset === "custom" ? (
            <span className="shrink-0 rounded-lg border border-dashed border-[var(--primary)] px-3 py-1.5 text-[12px] font-medium text-[var(--primary)]">
              Custom
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="landing-panel-label">Start from a scenario</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {INTENT_PRESETS.map((preset) => {
          const active = selectedPreset === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.id)}
              className={`cursor-pointer rounded-[10px] border px-3.5 py-2.5 text-left transition-[border-color,background-color] duration-150 ease-in-out ${
                active
                  ? "border-[var(--primary)] bg-[var(--primary-light)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent-border)]"
              }`}
            >
              <span className="block text-[13px] font-medium text-[var(--text)]">
                {preset.label}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-[var(--muted)]">
                {preset.description}
              </span>
            </button>
          );
        })}
        {selectedPreset === "custom" ? (
          <div className="flex items-center rounded-[10px] border border-dashed border-[var(--primary)] bg-[var(--primary-light)] px-3.5 py-2.5">
            <span className="text-[13px] font-medium text-[var(--primary)]">
              Custom mix
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
