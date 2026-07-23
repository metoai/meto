"use client";

import { ArrowRight } from "lucide-react";
import { NSection } from "@/components/n/n-section";

export function NFinalCta() {
  return (
    <NSection id="get-started" compact className="pb-32 sm:pb-48">
      <div className="mx-auto flex max-w-[800px] flex-col items-center justify-center text-center">
        <h2 className="text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--text)] sm:text-[3.5rem] lg:text-[4rem]">
          Stop starting from zero.
        </h2>
        
        <p className="mt-6 max-w-[500px] text-balance text-[17px] leading-[1.6] text-[var(--text-secondary)] sm:text-[19px]">
          Create your AI profile once and bring your workflow to every AI tool you use.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--text)] px-8 py-4 text-[15px] font-medium text-[var(--bg)] shadow-sm transition-transform active:scale-95"
            >
              Create your AI profile
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--surface)] px-8 py-4 text-[15px] font-medium text-[var(--text)] shadow-sm ring-1 ring-inset ring-[var(--border)] transition-transform active:scale-95"
            >
              View pricing
            </button>
          </div>
        </div>
      </div>
    </NSection>
  );
}
