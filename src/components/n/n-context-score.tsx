"use client";

import { NSection, NSectionIntro } from "@/components/n/n-section";

export function NContextScore() {
  return (
    <NSection id="context-score" compact>
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          {/* Subtle representation of a score/dashboard */}
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
              <div>
                <p className="text-[14px] text-[var(--muted)]">Profile Completeness</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[3rem] font-medium leading-none text-[var(--text)]">84</span>
                  <span className="text-[18px] text-[var(--muted)]">/ 100</span>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full border-4 border-[var(--border)] border-r-[var(--primary)] border-t-[var(--primary)]" />
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[var(--text)]">Tech Stack</span>
                <span className="text-[14px] text-[var(--primary)]">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[var(--text)]">Current Projects</span>
                <span className="text-[14px] text-[var(--primary)]">100%</span>
              </div>
              <div className="flex items-center justify-between opacity-50">
                <span className="text-[14px] text-[var(--text)]">Brand Voice</span>
                <span className="text-[14px] text-[var(--muted)]">Missing</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <NSectionIntro
            eyebrow="Context Intelligence"
            title="See what your AI is missing"
            subtitle="Meto identifies weak or missing context and helps you improve continuity instantly. No gimmicks, just a clear index of your profile's strength."
            align="left"
          />
        </div>
      </div>
    </NSection>
  );
}
