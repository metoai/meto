"use client";

import Link from "next/link";
import { useState } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LANDING_PAGE_NAV_LINKS } from "@/lib/marketing-nav";

type LandingHeroNavProps = {
  isLoggedIn?: boolean;
  loggedInHref?: string;
  loggedInLabel?: string;
};

export function LandingHeroNav({
  isLoggedIn = false,
  loggedInHref = "/dashboard",
  loggedInLabel = "Dashboard",
}: LandingHeroNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-20 w-full">
      <div className="flex h-14 items-center justify-between gap-3 border-b border-[var(--border-subtle)] sm:h-16">
        <Link
          href="/"
          className="landing-hover-link flex shrink-0 items-center gap-2 text-[var(--text)]"
        >
          <MetoMarkBadge size="sm" />
          <span className="font-mono-brand text-[14px] font-medium tracking-tight">
            meto
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
          {LANDING_PAGE_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="landing-hover-link-muted rounded-md px-3 py-1.5 font-mono-brand text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle compact />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="landing-hover-link flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              {mobileMenuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>

          {isLoggedIn ? (
            <Link
              href={loggedInHref}
              className="landing-hover-link rounded-md border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--text)] transition-[border-color] duration-150 hover:border-[var(--accent-border)] sm:px-4"
            >
              {loggedInLabel}
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="landing-hover-link-muted hidden rounded-md px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] sm:block"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="landing-hover-link rounded-md border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--text)] transition-[border-color] duration-150 hover:border-[var(--accent-border)] sm:px-4"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav
          className="border-b border-[var(--border-subtle)] py-2 md:hidden"
          aria-label="Mobile"
        >
          {LANDING_PAGE_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="landing-hover-link-muted block rounded-md px-2 py-2.5 font-mono-brand text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]"
            >
              {link.label}
            </Link>
          ))}
          {!isLoggedIn ? (
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="landing-hover-link-muted block rounded-md px-2 py-2.5 text-sm font-medium text-[var(--text-secondary)] sm:hidden"
            >
              Log in
            </Link>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
