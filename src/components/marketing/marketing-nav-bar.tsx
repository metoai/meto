"use client";

import Link from "next/link";
import { useState } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { MARKETING_NAV_LINKS } from "@/lib/marketing-nav";

/** Aligns with landing hero and wider marketing content */
export const MARKETING_CONTENT_MAX_CLASS = "max-w-[720px]";
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
      className={`landing-animate-in relative z-50 flex justify-center px-4 pb-2 pt-4 ${className}`}
    >
      <div className={`w-full ${maxWidthClass}`}>
        <div className="flex h-11 items-center justify-between gap-3 rounded-full border border-black/[0.08] dark:border-white/10 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-xl shadow-lg shadow-black/[0.03] dark:shadow-black/20 px-3 sm:px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 pl-0.5 text-neutral-950 dark:text-white transition-opacity hover:opacity-85 active:scale-[0.97] transition-transform duration-150"
          >
            <MetoMarkBadge size="sm" />
            <span className="text-[15px] font-semibold tracking-tight text-neutral-950 dark:text-white">
              meto
            </span>
          </Link>

          {/* Center: Desktop Direct Links */}
          <nav
            className="hidden items-center gap-1 sm:gap-1.5 md:flex"
            aria-label="Main navigation"
          >
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-[13.5px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] transition-all duration-150 active:scale-[0.97] whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle compact />

            <span
              className="hidden h-3.5 w-px bg-black/[0.08] dark:bg-white/[0.12] sm:block"
              aria-hidden="true"
            />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] active:scale-[0.97] transition-all duration-150 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
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

            {/* Auth Actions */}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-3.5 py-1.5 text-[13px] font-medium shadow-xs transition-all duration-150 active:scale-[0.97] whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link
                  href="/auth/login"
                  className="rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] transition-all duration-150 active:scale-[0.97] whitespace-nowrap"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-3.5 py-1.5 text-[13px] font-medium shadow-xs transition-all duration-150 active:scale-[0.97] whitespace-nowrap"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen ? (
          <nav
            className="mt-2 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl p-3 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-150"
            aria-label="Mobile navigation"
          >
            <div className="space-y-0.5">
              {MARKETING_NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] active:scale-[0.97] transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {!isLoggedIn ? (
              <>
                <div className="my-2 h-px bg-black/[0.08] dark:bg-white/[0.12]" />
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 items-center justify-center rounded-xl border border-black/[0.08] dark:border-white/[0.12] text-sm font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] transition-all duration-150 active:scale-[0.97]"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 items-center justify-center rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 text-sm font-semibold shadow-xs transition-all duration-150 active:scale-[0.97]"
                  >
                    Get started
                  </Link>
                </div>
              </>
            ) : null}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
