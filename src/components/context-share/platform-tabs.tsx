"use client";

import type { CompileFormat } from "@/lib/types";
import { PLATFORM_OPTIONS } from "@/lib/context-share/config";
import { AiPlatformIcon } from "@/components/ui/ai-platform-icon";

type PlatformTabsProps = {
  selectedFormat: CompileFormat;
  onSelect: (format: CompileFormat) => void;
};

export function PlatformTabs({ selectedFormat, onSelect }: PlatformTabsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[var(--muted)]">Paste into</p>
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="tablist"
        aria-label="AI platform format"
      >
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
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 transition-all duration-150 ease-in-out ${
                active
                  ? "border-[#C0E0D8] bg-[#F0FAF7] text-[#0F6E56] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
              }`}
            >
              <AiPlatformIcon format={platform.id} size={20} />
              <span className="text-[11px] font-medium">{platform.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] leading-relaxed text-[var(--muted)]">
        {PLATFORM_OPTIONS.find((p) => p.id === selectedFormat)?.hint}
      </p>
    </div>
  );
}
