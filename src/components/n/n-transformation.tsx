"use client";

import { useState } from "react";
import { NSection } from "@/components/n/n-section";

export function NTransformation() {
  const [hovered, setHovered] = useState<"before" | "after" | null>(null);

  return (
    <NSection id="transformation" compact>
      <div className="mx-auto w-full max-w-[1000px]">
        <div className="grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm md:grid-cols-2">
          {/* Before */}
          <div
            className={`relative flex min-h-[400px] flex-col justify-between border-b border-[var(--border)] p-10 transition-opacity duration-500 md:border-b-0 md:border-r ${
              hovered === "after" ? "opacity-30" : "opacity-100"
            }`}
            onMouseEnter={() => setHovered("before")}
            onMouseLeave={() => setHovered(null)}
          >
            <div>
              <p className="font-mono-brand text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                Before Meto
              </p>
              <h3 className="mt-3 text-[1.5rem] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--text)]">
                Starting from zero
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
                Repeated explanations, fragmented context, and workflow interruption across every new chat.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="ml-auto w-[85%] rounded-2xl rounded-tr-sm bg-[var(--border)] p-4 text-[13px] text-[var(--text)] opacity-60">
                I'm a Next.js developer building an AI startup. I use Tailwind and prefer functional components. Can you help me...
              </div>
              <div className="w-[85%] rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--bg)] p-4 text-[13px] text-[var(--text-secondary)]">
                I can help with that. Since you didn't mention your routing setup, are you using App Router or Pages Router?
              </div>
            </div>
          </div>

          {/* After */}
          <div
            className={`relative flex min-h-[400px] flex-col justify-between p-10 transition-opacity duration-500 ${
              hovered === "before" ? "opacity-30" : "opacity-100"
            }`}
            onMouseEnter={() => setHovered("after")}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Soft highlight background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-b from-[var(--primary)]/5 to-transparent transition-opacity duration-500 ${
                hovered === "after" ? "opacity-100" : "opacity-0"
              }`}
            />

            <div className="relative z-10">
              <p className="font-mono-brand text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
                With Meto
              </p>
              <h3 className="mt-3 text-[1.5rem] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--text)]">
                Already understands you
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
                AI instantly knows your stack, projects, and preferences. Continuity across all your tools.
              </p>
            </div>

            <div className="relative z-10 mt-8 space-y-3">
              <div className="ml-auto w-[85%] rounded-2xl rounded-tr-sm bg-[var(--text)] p-4 text-[13px] text-[var(--bg)] shadow-md">
                Can you help me structure the new dashboard?
              </div>
              <div className="w-[85%] rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--bg)] p-4 text-[13px] text-[var(--text-secondary)] shadow-sm">
                Based on your Meto profile, I see you're using Next.js App Router and Tailwind. Let's create a server component layout that fits your existing 'soft-luxury' design system...
              </div>
            </div>
          </div>
        </div>
      </div>
    </NSection>
  );
}
