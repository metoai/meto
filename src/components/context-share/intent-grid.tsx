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
  return (
    <div className={workspaceLayout ? "space-y-2" : "space-y-2"}>
      <p className="text-xs font-medium text-[var(--muted)]">
        {workspaceLayout ? "Start with a scenario" : "Start from a scenario"}
      </p>
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
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--border-hover)]"
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
