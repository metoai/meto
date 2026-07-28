
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Terminal, Check, Copy } from "lucide-react";

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

  function handleCopyCli() {
    void navigator.clipboard.writeText("npx meto init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center text-center">
      {/* Pill Badge */}
      <div className="landing-animate-in mb-6 inline-flex items-center rounded-full border border-[var(--accent-border)] bg-[var(--surface)]/90 px-3.5 py-1.5 text-xs font-medium text-[var(--text)] shadow-xs backdrop-blur-md">
        <span className="relative mr-2 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]"></span>
        </span>
        <span className="font-mono-brand text-[11px] uppercase tracking-wider text-[var(--muted)]">
          Identity Engine • Works with ChatGPT, Claude & Cursor
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="landing-animate-in max-w-[920px] text-balance text-[3.25rem] font-semibold leading-[1.04] tracking-[-0.035em] text-[var(--text)] sm:text-[4.5rem] lg:text-[5.5rem]">
        Every AI should <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-[var(--primary)] via-[#ff6b2c] to-[#ff9858] bg-clip-text text-transparent">
          already know you.
        </span>
      </h1>

      {/* Subheadline */}
      <p
        className="landing-animate-in mx-auto mt-5 max-w-[640px] text-[17px] leading-[1.6] text-[var(--text-secondary)] sm:text-[19px]"
        style={{ animationDelay: "0.04s" }}
      >
        Stop re-explaining your stack, role, and preferences. Build one unified context profile that gives every AI assistant persistent memory.
      </p>

      {/* Combined Action Row: Primary Button + Terminal Pill */}
      <div
        className="landing-animate-in mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-[560px]"
        style={{ animationDelay: "0.08s" }}
      >
        <Link
          href={isLoggedIn ? loggedInHref : "/auth/signup"}
          className="group relative flex h-12 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-7 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[var(--primary-hover)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{isLoggedIn ? loggedInLabel : "Get started free"}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        {/* Quick Terminal Command Pill */}
        <div className="flex h-12 w-full sm:w-auto items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[#0d1117] px-4 font-mono text-xs text-gray-300 shadow-md backdrop-blur-md transition-all hover:border-[var(--primary)]/50">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="text-gray-400">$</span>
            <span className="font-semibold text-white">npx meto init</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCli}
            className="flex items-center gap-1 rounded-md bg-gray-800 px-2.5 py-1 text-[11px] font-medium text-gray-300 transition-all hover:bg-gray-700 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-gray-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conversion Badges */}
      <div
        className="landing-animate-in mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-xs text-[var(--muted)]"
        style={{ animationDelay: "0.12s" }}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">✓</span> Free forever
        </span>
        <span className="hidden sm:inline text-[var(--border)]">•</span>
        <span className="flex items-center gap-1.5">
          <span className="text-[var(--primary)] font-bold">⚡</span> 30-second setup
        </span>
        <span className="hidden sm:inline text-[var(--border)]">•</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-sky-500" /> 100% Encrypted & private
        </span>
      </div>
    </div>
  );
}



