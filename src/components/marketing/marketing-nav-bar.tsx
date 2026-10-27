"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  MARKETING_NAV_LINKS,
  SOLUTIONS_NAV_LINKS,
} from "@/lib/marketing-nav";

/** Aligns with landing hero and wider marketing content */
export const MARKETING_CONTENT_MAX_CLASS = "max-w-[780px]";
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
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);

  // Close solutions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        solutionsRef.current &&
        !solutionsRef.current.contains(event.target as Node)
      ) {
        setSolutionsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSolutionsOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className={`landing-animate-in relative z-50 flex justify-center px-4 pb-2 pt-4 ${className}`}
    >
      <div className={`w-full ${maxWidthClass}`}>
        <div className="flex h-11 items-center justify-between gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--card)]/80 px-3 shadow-[var(--shadow-md)] backdrop-blur-xl backdrop-saturate-150 sm:px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 pl-0.5 transition-opacity hover:opacity-85"
          >
            <MetoMarkBadge size="sm" />
            <span className="text-[15px] font-semibold tracking-tight text-neutral-950 dark:text-white">
              meto
            </span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {/* Solutions Dropdown */}
            <div
              ref={solutionsRef}
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setSolutionsOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 whitespace-nowrap ${
                  solutionsOpen
                    ? "text-neutral-950 dark:text-white bg-black/[0.05] dark:bg-white/[0.08]"
                    : "text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.04] dark:text-[#d6ccc5] dark:hover:text-white dark:hover:bg-white/[0.06]"
                }`}
                aria-expanded={solutionsOpen}
                aria-haspopup="true"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[var(--muted)] transition-transform duration-150 ${
                    solutionsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {solutionsOpen ? (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-72">
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)]/95 p-2 shadow-xl backdrop-blur-2xl ring-1 ring-black/[0.04] dark:ring-white/[0.05] animate-in fade-in zoom-in-95 duration-150">
                    <div className="space-y-0.5">
                      {SOLUTIONS_NAV_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSolutionsOpen(false)}
                          className="group block rounded-xl px-3 py-2 text-left transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.98]"
                        >
                          <div className="text-[13px] font-medium text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                            {item.label}
                          </div>
                          <p className="text-[11px] text-[var(--muted)] leading-tight mt-0.5">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Direct Links */}
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.04] dark:text-[#d6ccc5] dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors duration-150 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle compact />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-[#d6ccc5] dark:hover:text-white dark:hover:bg-white/[0.08] transition-colors duration-150 md:hidden"
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
                className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-3.5 py-1.5 text-[13px] font-medium shadow-xs transition-transform active:scale-[0.97] whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link
                  href="/auth/login"
                  className="rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.04] dark:text-[#d6ccc5] dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors duration-150 whitespace-nowrap"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-3.5 py-1.5 text-[13px] font-medium shadow-xs transition-transform active:scale-[0.97] whitespace-nowrap"
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
            className="mt-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)]/95 p-3 shadow-xl backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-150"
            aria-label="Mobile navigation"
          >
            <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
              Solutions
            </div>
            <div className="space-y-0.5 mb-2">
              {SOLUTIONS_NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  {item.label}
                  <span className="block text-[11px] text-[var(--muted)] font-normal">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>

            <div className="my-1.5 h-px bg-[var(--border-subtle)]" />

            <div className="space-y-0.5">
              {MARKETING_NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {!isLoggedIn ? (
              <>
                <div className="my-2 h-px bg-[var(--border-subtle)]" />
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] text-sm font-medium text-[var(--text)] transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-semibold text-white shadow-xs transition-transform active:scale-[0.98]"
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
