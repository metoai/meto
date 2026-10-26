"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { LandingSection } from "@/components/landing/landing-section";
import { useTheme } from "@/components/theme-provider";
import { Grainient } from "@/components/ui/grainient";

const CTA_DARK_PALETTE = ["#141414", "#230e06", "#9a3412", "#ff4d00", "#ffaa70"];
const CTA_LIGHT_PALETTE = ["#fdfaf7", "#fff7ed", "#ffedd5", "#fed7aa", "#ff6b2c"];

type LandingFinalCtaSectionProps = {
  onStartChat?: () => void;
};

export function LandingFinalCtaSection({ onStartChat }: LandingFinalCtaSectionProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

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
        <div className="landing-cta-card relative overflow-hidden">
          {/* Ambient Living Grainient WebGL Brand Canvas */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden !z-0 rounded-[inherit] opacity-75 dark:opacity-45"
            aria-hidden="true"
          >
            {mounted && (
              <Grainient
                colors={isLight ? CTA_LIGHT_PALETTE : CTA_DARK_PALETTE}
                lightMode={isLight}
                angle={120}
                flow={0.65}
                speed={0.35}
                silk={0.25}
                grainAmount={0.06}
                grainSize={1.1}
                softness={0.9}
                interactive={false}
                className="w-full h-full"
              />
            )}
          </div>

          {/* Smooth Living Motion Gradient Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            <div className="absolute -top-20 -right-20 w-[440px] h-[440px] rounded-full bg-gradient-to-br from-[var(--primary)]/15 via-[#ff7a3d]/8 to-transparent blur-3xl meto-motion-gradient-a" />
            <div className="absolute -bottom-24 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[var(--primary)]/12 via-[#ff9c5a]/6 to-transparent blur-3xl meto-motion-gradient-b" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-stretch">
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <div className="mb-6 flex items-center gap-2.5">
                <MetoMarkBadge size="sm" />
                <p className="landing-panel-label">Get started</p>
              </div>

              <h2 className="max-w-[14ch] text-balance text-[2rem] font-medium leading-[1.06] tracking-[-0.035em] text-[var(--text)] sm:text-[2.25rem] lg:text-[2.5rem]">
                The AI-native future has a memory.
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-[1.65] text-[var(--text-secondary)] sm:text-[17px]">
                Claim your AI identity. Build your context layer once and bring your entire workflow to every model, instantly.
              </p>
            </div>

            <div className="flex flex-col justify-center border-t border-[var(--landing-panel-border)] p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="mx-auto w-full max-w-sm lg:mx-0">
                <p className="mb-5 text-[14px] leading-relaxed text-[var(--text-secondary)]">
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
