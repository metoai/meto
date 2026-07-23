"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { LandingSection } from "@/components/landing/landing-section";

type LandingFinalCtaSectionProps = {
  onStartChat?: () => void;
};

export function LandingFinalCtaSection({ onStartChat }: LandingFinalCtaSectionProps) {
  const primaryClassName =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--text)] px-6 py-3.5 text-[15px] font-medium text-[var(--bg)] shadow-[var(--shadow-sm)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.99] sm:w-auto";

  const primaryContent = (
    <>
      Create your AI identity
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </>
  );

  return (
    <LandingSection id="get-started" compact>
      <div className="landing-stagger-item w-full">
        <div className="landing-cta-card">
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-stretch">
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <div className="mb-6 flex items-center gap-2.5">
                <MetoMarkBadge size="sm" />
                <p className="landing-panel-label">Get started</p>
              </div>

              <h2 className="max-w-[14ch] text-balance text-[2rem] font-medium leading-[1.06] tracking-[-0.035em] text-[var(--text)] sm:text-[2.25rem] lg:text-[2.5rem]">
                The AI-native future has a memory.
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-[1.65] text-[var(--muted)] sm:text-[17px]">
                Claim your AI identity. Build your context layer once and bring your entire workflow to every model, instantly.
              </p>
            </div>

            <div className="flex flex-col justify-center border-t border-[var(--landing-panel-border)] p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="mx-auto w-full max-w-sm lg:mx-0">
                <p className="mb-5 text-[14px] leading-relaxed text-[var(--muted)]">
                  Free for individuals. Connect via MCP in 10 seconds.
                </p>

                <div className="flex flex-col gap-3">
                  {onStartChat ? (
                    <button type="button" onClick={onStartChat} className={primaryClassName}>
                      {primaryContent}
                    </button>
                  ) : (
                    <Link href="#chat" className={primaryClassName}>
                      {primaryContent}
                    </Link>
                  )}

                  <Link
                    href="/pricing"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-[14px] font-medium text-[var(--text)] transition-[border-color,background-color] duration-150 hover:border-[var(--accent-border)] sm:w-auto"
                  >
                    View pricing
                  </Link>
                </div>

                <p className="mt-5 text-center text-[12px] text-[var(--muted)] lg:text-left">
                  Free plan available · Upgrade when you need AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
