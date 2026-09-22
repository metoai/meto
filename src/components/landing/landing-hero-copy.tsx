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
      {/* 1. Hero Label: YOUR AI IDENTITY pill (28–32px spacing to headline) */}
      <div className="landing-animate-in mb-7 inline-flex items-center gap-2.5 rounded-full bg-[var(--text)]/[0.03] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--text)]/70 ring-1 ring-inset ring-[var(--text)]/[0.08] backdrop-blur-sm transition-all hover:bg-[var(--text)]/[0.05]">
        <Fingerprint className="h-3.5 w-3.5 text-[var(--primary)]" />
        <span>YOUR AI IDENTITY</span>
      </div>

      <h1 className="landing-animate-in w-full font-bold leading-[0.95] tracking-[-0.04em] text-[52px] sm:text-[64px] lg:text-[78px] xl:text-[84px]">
        {/* Mobile: 3 lines */}
        <div className="flex flex-col lg:hidden">
          <span className="block text-[var(--text)] whitespace-nowrap">Every AI</span>
          <span className="block text-[var(--text)] whitespace-nowrap">should already</span>
          <span className="block text-[var(--primary)] whitespace-nowrap">know you.</span>
        </div>
        {/* Desktop: 2 lines */}
        <div className="hidden lg:block">
          <span className="block text-[var(--text)] whitespace-nowrap">
            Every AI should
          </span>
          <span className="block text-[var(--primary)] whitespace-nowrap">
            already know you.
          </span>
        </div>
      </h1>

      {/* 3. Short Supporting Description (H2 removed, concise description preserved) */}
      <div
        className="landing-animate-in mt-6 max-w-[540px]"
        style={{ animationDelay: "0.04s" }}
      >
        <p className="text-[17px] sm:text-[18px] leading-[1.55] text-[var(--text-secondary)] font-normal text-balance">
          One identity profile for persistent memory and context across all your AI assistants.
        </p>
      </div>

      {/* 4. CTA Row: Fully responsive on mobile, tablet, and desktop */}
      <div
        className="landing-animate-in mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full max-w-[360px] sm:max-w-none"
        style={{ animationDelay: "0.08s" }}
      >
        <Link
          href={isLoggedIn ? loggedInHref : "/auth/signup"}
          className="group relative flex h-[52px] sm:h-[54px] lg:h-[56px] w-full sm:w-[220px] lg:w-[225px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-[15px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--primary-hover)] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{isLoggedIn ? loggedInLabel : "Get started free"}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        {/* Quick Terminal Command Pill */}
        <div className="flex h-[52px] sm:h-[54px] lg:h-[56px] w-full sm:w-[270px] lg:w-[280px] shrink-0 items-center justify-center gap-2 sm:gap-3 rounded-xl border border-gray-800 bg-[#0d1117] px-3.5 sm:px-4 font-mono text-xs sm:text-[13px] lg:text-[13.5px] text-gray-300 shadow-sm backdrop-blur-md transition-all hover:border-[var(--primary)]/50">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="font-bold text-[var(--primary)] font-mono">&gt;_</span>
            <span className="text-gray-400 font-mono">$</span>
            <span className="font-semibold text-white font-mono whitespace-nowrap">npx meto init</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCli}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-gray-800 px-2.5 py-1 text-[11px] font-medium text-gray-300 transition-all hover:bg-gray-700 hover:text-white cursor-pointer ml-2"
            aria-label="Copy CLI command to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-gray-400" />
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
