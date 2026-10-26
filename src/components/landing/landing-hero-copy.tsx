"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Fingerprint } from "lucide-react";
import { HeroMeta } from "@/components/landing/landing-hero-meta";

type LandingHeroCopyProps = {
  chatStarted?: boolean;
  isLoggedIn?: boolean;
  loggedInHref?: string;
  loggedInLabel?: string;
};

export function LandingHeroCopy({
  chatStarted = false,
  isLoggedIn = false,
  loggedInHref = "/dashboard",
  loggedInLabel = "Dashboard",
}: LandingHeroCopyProps) {
  const [copied, setCopied] = useState(false);

  if (chatStarted) return null;

  async function handleCopyCli() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText("npx meto init");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full">
      {/* 1. Hero Label: YOUR AI IDENTITY pill (blended with warm ambient glow) */}
      <div className="landing-animate-in mb-7 inline-flex items-center gap-2.5 rounded-full bg-white/70 dark:bg-black/40 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-orange-700 dark:text-orange-200 border border-orange-500/20 dark:border-orange-500/30 shadow-xs backdrop-blur-md transition-all hover:bg-white/90 dark:hover:bg-black/60">
        <Fingerprint className="h-3.5 w-3.5 text-[var(--primary)]" />
        <span>YOUR AI IDENTITY</span>
      </div>

      {/* 2. Headline with ambient light blending */}
      <h1 className="landing-animate-in w-full font-bold leading-[0.95] tracking-[-0.04em] text-[52px] sm:text-[64px] lg:text-[78px] xl:text-[84px]">
        {/* Mobile: 3 lines */}
        <div className="flex flex-col lg:hidden">
          <span className="block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-800 dark:from-white dark:via-white dark:to-[#f0e6df] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Every AI
          </span>
          <span className="block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-800 dark:from-white dark:via-white dark:to-[#f0e6df] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            should already
          </span>
          <span className="block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#d93800] via-[#ea4600] to-[#b32b00] dark:from-[#ff4d00] dark:via-[#ff6b2c] dark:to-[#ffa066] dark:drop-shadow-[0_0_24px_rgba(255,77,0,0.25)]">
            know you.
          </span>
        </div>
        {/* Desktop: 2 lines */}
        <div className="hidden lg:block">
          <span className="block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-800 dark:from-white dark:via-white dark:to-[#f0e6df] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Every AI should
          </span>
          <span className="block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#d93800] via-[#ea4600] to-[#b32b00] dark:from-[#ff4d00] dark:via-[#ff6b2c] dark:to-[#ffa066] dark:drop-shadow-[0_0_24px_rgba(255,77,0,0.25)]">
            already know you.
          </span>
        </div>
      </h1>

      {/* 3. Supporting Description (warm ambient tone) */}
      <div
        className="landing-animate-in mt-6 max-w-[540px]"
        style={{ animationDelay: "0.04s" }}
      >
        <p className="text-[17px] sm:text-[18px] leading-[1.55] text-neutral-700 dark:text-[#d6ccc5] font-normal text-balance">
          One identity profile for persistent memory and context across all your AI assistants.
        </p>
      </div>

      {/* 4. CTA Row: Fully responsive on mobile, tablet, and desktop */}
      <div
        className="landing-animate-in mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full max-w-[360px] sm:max-w-none"
        style={{ animationDelay: "0.08s" }}
      >
        {/* High-contrast anchor CTA button */}
        <Link
          href={isLoggedIn ? loggedInHref : "/auth/signup"}
          className="group relative flex h-[52px] sm:h-[54px] lg:h-[56px] w-full sm:w-[220px] lg:w-[225px] shrink-0 items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-6 text-[15px] font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.14)] dark:shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{isLoggedIn ? loggedInLabel : "Get started free"}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        {/* Frosted interactive Terminal Command Pill */}
        <div className="flex h-[52px] sm:h-[54px] lg:h-[56px] w-full sm:w-[270px] lg:w-[280px] shrink-0 items-center justify-center gap-2 sm:gap-3 rounded-xl border border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-[#0d1117]/85 px-3.5 sm:px-4 font-mono text-xs sm:text-[13px] lg:text-[13.5px] text-neutral-800 dark:text-gray-300 shadow-sm backdrop-blur-md transition-all hover:border-[var(--primary)]/50">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="font-bold text-[var(--primary)] font-mono">&gt;_</span>
            <span className="text-neutral-400 dark:text-gray-400 font-mono">$</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono whitespace-nowrap">npx meto init</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCli}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-black/[0.05] dark:bg-white/10 border border-black/[0.06] dark:border-white/10 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:text-gray-300 transition-all hover:bg-black/[0.09] dark:hover:bg-white/20 hover:text-black dark:hover:text-white cursor-pointer ml-2"
            aria-label="Copy CLI command to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-neutral-500 dark:text-gray-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5. Product Metadata: Data-driven, Lucide icons, 26–30px below CTA */}
      <HeroMeta className="landing-animate-in mt-7" />
    </div>
  );
}
