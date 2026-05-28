"use client";

import { MetoMark } from "@/components/meto-mark";
import { WORKSPACE_COPY } from "@/lib/workspace-content";

export function WorkspaceBanner() {
  return (
    <div className="relative mb-4 overflow-hidden rounded-xl border border-[#E8E8E4]/90">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#F7FFFB] via-[#FAFAF8] to-[#F5F7FF]"
        aria-hidden
      />
      <div
        className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#0F6E56]/[0.09] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-10 -top-8 h-44 w-44 rounded-full bg-[#6366F1]/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/4 h-32 w-64 rounded-full bg-[#0F6E56]/[0.06] blur-2xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-10 right-1/4 h-28 w-40 rounded-full bg-[#818CF8]/[0.05] blur-2xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex items-start justify-between gap-4 px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="min-w-0">
          <p className="text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--text)] sm:text-[26px]">
            {WORKSPACE_COPY.bannerTitle}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-sm">
            Paste your Meto link into any AI and it reads exactly what you
            select below.
          </p>
        </div>

        <div className="flex shrink-0 items-center pt-1">
          <MetoMark className="h-11 w-11 sm:h-12 sm:w-12" />
        </div>
      </div>
    </div>
  );
}
