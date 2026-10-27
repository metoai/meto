"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";

type LandingHeroNavProps = {
  isLoggedIn?: boolean;
  loggedInHref?: string;
  loggedInLabel?: string;
};

const HERO_NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Context Score", href: "#context-score" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "#pricing" },
] as const;

export function LandingHeroNav({
  isLoggedIn = false,
  loggedInHref = "/dashboard",
  loggedInLabel = "Dashboard",
}: LandingHeroNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-20 w-full backdrop-blur-md bg-white/[0.02] dark:bg-black/[0.05]">
      <div className="flex h-[72px] items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] px-2 sm:px-4">
        {/* Left: Meto Logo + Brand Mark */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-neutral-900 dark:text-white transition-opacity hover:opacity-85 active:scale-[0.98] transition-transform duration-150"
        >
          <MetoMarkBadge size="sm" />
          <span className="text-[16px] font-semibold tracking-[-0.02em] text-neutral-950 dark:text-white">
            meto
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-1 sm:gap-2 md:flex"
          aria-label="Main navigation"
        >
          {HERO_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] transition-colors duration-150 active:scale-[0.97] whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions (Theme, Log in, Get started free) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle compact />

          <span
            className="hidden h-4 w-px bg-black/[0.08] dark:bg-white/[0.12] sm:block"
            aria-hidden="true"
          />

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] active:scale-[0.95] md:hidden transition-all duration-150"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>

          {isLoggedIn ? (
            <Link
              href={loggedInHref}
              className="hidden sm:inline-flex group h-10 sm:h-11 items-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-4 sm:px-5 text-[14px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <span>{loggedInLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden text-[14px] font-medium text-neutral-700 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] rounded-full px-3 py-1.5 transition-colors duration-150 active:scale-[0.97] sm:block"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="hidden sm:inline-flex group h-10 sm:h-11 items-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-4 sm:px-5 text-[14px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <span>Get started free</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Responsive Minimal Mobile Drawer */}
      {mobileMenuOpen ? (
        <div className="absolute top-[76px] left-3 right-3 z-50 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl p-4 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {HERO_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] active:scale-[0.98] transition-all"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-black/[0.06] dark:bg-white/[0.08]" />

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2.5 pt-1">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3.5 py-2 text-[14.5px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] active:scale-[0.98] transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 px-4 text-[14.5px] font-semibold shadow-xs transition-transform active:scale-[0.98]"
                >
                  <span>Get started free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <Link
                href={loggedInHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 px-4 text-[14.5px] font-semibold shadow-xs transition-transform active:scale-[0.98]"
              >
                <span>{loggedInLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
