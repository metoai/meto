"use client";

import Link from "next/link";
import { useState } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { MARKETING_NAV_LINKS } from "@/lib/marketing-nav";

/** Aligns with landing hero column. */
export const MARKETING_CONTENT_MAX_CLASS = "max-w-[540px]";
export const LANDING_NAV_MAX_CLASS = "max-w-[1200px]";

/** Total vertical space used by the floating nav (padding + pill). */
export const MARKETING_NAV_OFFSET_PX = 72;

type MarketingNavBarProps = {
  isLoggedIn?: boolean;
  className?: string;
  variant?: "default" | "wide";
};

export function MarketingNavBar({
  isLoggedIn = false,
  className = "",
  variant = "default",
}: MarketingNavBarProps) {
  const maxWidthClass =
    variant === "wide" ? LANDING_NAV_MAX_CLASS : MARKETING_CONTENT_MAX_CLASS;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`landing-animate-in relative z-50 flex justify-center px-5 pb-2 pt-4 ${className}`}
    >
      <div className={`w-full ${maxWidthClass}`}>
        <div className="flex h-11 items-center justify-between gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--card)]/75 px-2.5 shadow-[var(--shadow-md)] backdrop-blur-xl backdrop-saturate-150 sm:gap-3 sm:px-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 pl-0.5 sm:pl-1"
          >
            <MetoMarkBadge size="sm" />
            <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
              meto
            </span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 md:flex"
            aria-label="Main"
          >
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--border-subtle)] hover:text-[var(--text)]"
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
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--border-subtle)] hover:text-[var(--text)] md:hidden"
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
                href="/dashboard"
                className="rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[var(--primary-hover)] sm:px-4"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden rounded-full px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--border-subtle)] hover:text-[var(--text)] sm:block sm:px-3.5"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[var(--primary-hover)] sm:px-4"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            className="mt-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)]/80 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--border-subtle)] hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn ? (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--border-subtle)] hover:text-[var(--text)] sm:hidden"
              >
                Log in
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
