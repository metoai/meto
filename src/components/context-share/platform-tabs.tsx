"use client";

import type { CompileFormat } from "@/lib/types";
import { PLATFORM_OPTIONS } from "@/lib/context-share/config";
import { AiPlatformIcon } from "@/components/ui/ai-platform-icon";

type PlatformTabsProps = {
  selectedFormat: CompileFormat;
  onSelect: (format: CompileFormat) => void;
  workspaceLayout?: boolean;
};

export function PlatformTabs({
  selectedFormat,
  onSelect,
  workspaceLayout = false,
}: PlatformTabsProps) {
  if (workspaceLayout) {
    return (
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
          Text format
        </p>
        <div
          className="flex flex-wrap gap-1.5"
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
                aria-label={platform.label}
                className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors duration-150 ${
                  active
                    ? "border-[var(--primary)] text-[var(--text)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                }`}
              >
                <AiPlatformIcon format={platform.id} size={14} />
                <span className="text-[11px] font-medium">{platform.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[var(--muted)]">Paste into</p>
      <div
        className="grid grid-cols-4 gap-2"
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
              title={platform.label}
              aria-label={platform.label}
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 transition-all duration-150 ease-in-out ${
                active
                  ? "border-[var(--accent-border)] bg-[var(--primary-light)] text-[var(--primary)] shadow-[var(--shadow-sm)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
              }`}
            >
              <AiPlatformIcon
                format={platform.id}
                size={platform.iconOnly ? 22 : 20}
              />
              {!platform.iconOnly ? (
                <span className="text-[11px] font-medium">{platform.label}</span>
              ) : null}
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
