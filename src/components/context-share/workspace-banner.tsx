"use client";

import { MetoMark } from "@/components/meto-mark";
import { WORKSPACE_COPY } from "@/lib/workspace-content";

export function WorkspaceBanner() {
  return (
    <div className="brand-spot brand-surface relative mb-4 overflow-hidden rounded-xl border">
      <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="min-w-0">
          <p className="text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--text)] sm:text-[26px]">
            {WORKSPACE_COPY.bannerTitle}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-sm">
            {WORKSPACE_COPY.bannerBody}
          </p>
        </div>

        <div className="flex shrink-0 items-center self-center">
          <MetoMark size="xl" />
        </div>
      </div>
    </div>
  );
}
