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
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#integrations" },
] as const;

export function LandingHeroNav({
  isLoggedIn = false,
  loggedInHref = "/dashboard",
  loggedInLabel = "Dashboard",
}: LandingHeroNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-20 w-full">
      <div className="flex h-[72px] items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-2 sm:px-4">
        {/* Left: Meto Logo + Brand Mark */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-[var(--text)] transition-opacity hover:opacity-85"
        >
          <MetoMarkBadge size="sm" />
          <span className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--text)]">
            meto
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 lg:gap-10 md:flex" aria-label="Main navigation">
          {HERO_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14.5px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions (Theme, Log in, Get started free) */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <ThemeToggle compact />

          <span className="hidden h-4 w-px bg-[var(--border-subtle)] sm:block" aria-hidden="true" />

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
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
              className="hidden sm:inline-flex group h-10 sm:h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 sm:px-5 text-[14px] font-semibold text-white shadow-xs transition-all duration-150 hover:bg-[var(--primary-hover)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{loggedInLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden text-[14.5px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)] sm:block px-1"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="hidden sm:inline-flex group h-10 sm:h-[46px] items-center gap-2 rounded-xl bg-[var(--primary)] px-4 sm:px-6 text-[14px] sm:text-[14.5px] font-semibold text-white shadow-xs transition-all duration-150 hover:bg-[var(--primary-hover)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get started free</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Responsive Minimal Mobile Dropdown Drawer */}
      {mobileMenuOpen ? (
        <div className="absolute top-[76px] left-3 right-3 z-50 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 dark:bg-[#121212]/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {HERO_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-[var(--border-subtle)]" />
            {!isLoggedIn ? (
              <div className="flex flex-col gap-2.5 pt-1">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3.5 py-2 text-[14.5px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[14.5px] font-semibold text-white shadow-xs transition-transform active:scale-98"
                >
                  <span>Get started free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <Link
                href={loggedInHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[14.5px] font-semibold text-white shadow-xs transition-transform active:scale-98"
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
