"use client";

import type { CompileFormat } from "@/lib/types";
import { PLATFORM_OPTIONS } from "@/lib/context-share/config";

type PlatformTabsProps = {
  selectedFormat: CompileFormat;
  onSelect: (format: CompileFormat) => void;
};

export function PlatformTabs({ selectedFormat, onSelect }: PlatformTabsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[var(--muted)]">
        Output format
      </p>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="AI platform format">
        {PLATFORM_OPTIONS.map((platform) => {
          const active = selectedFormat === platform.id;
          return (
            <button
              key={platform.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(platform.id)}
              title={platform.hint}
              className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-[13px] transition-all duration-150 ease-in-out ${
                active
                  ? "border-[#C0E0D8] bg-[var(--primary-light)] text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
              }`}
            >
              {platform.label}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-[var(--muted)]">
        {PLATFORM_OPTIONS.find((p) => p.id === selectedFormat)?.hint}
      </p>
    </div>
  );
}
