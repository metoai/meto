"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { SOLUTIONS_NAV_LINKS } from "@/lib/marketing-nav";

type LandingHeroNavProps = {
  isLoggedIn?: boolean;
  loggedInHref?: string;
  loggedInLabel?: string;
};

const HERO_NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "#pricing" },
] as const;

export function LandingHeroNav({
  isLoggedIn = false,
  loggedInHref = "/dashboard",
  loggedInLabel = "Dashboard",
}: LandingHeroNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);

  // Close solutions dropdown when clicking outside or pressing Escape
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
    <header className="relative z-20 w-full">
      <div className="flex h-[72px] items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] px-2 sm:px-4">
        {/* Left: Meto Logo + Brand Mark */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-neutral-900 dark:text-white transition-opacity hover:opacity-85"
        >
          <MetoMarkBadge size="sm" />
          <span className="text-[16px] font-semibold tracking-[-0.02em] text-neutral-950 dark:text-white">
            meto
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-7 lg:gap-9 md:flex"
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
              className={`inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors duration-150 ${
                solutionsOpen
                  ? "text-neutral-950 dark:text-white"
                  : "text-neutral-700 hover:text-neutral-950 dark:text-[#d6ccc5] dark:hover:text-white"
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
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-72">
                <div className="rounded-2xl border border-[var(--border)] bg-white dark:bg-[#141414] p-2 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-150">
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
          {HERO_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-neutral-700 hover:text-neutral-950 dark:text-[#d6ccc5] dark:hover:text-white transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions (Theme, Log in, Get started free) */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <ThemeToggle compact />

          <span
            className="hidden h-4 w-px bg-black/[0.08] dark:bg-white/[0.12] sm:block"
            aria-hidden="true"
          />

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-[#d6ccc5] dark:hover:text-white dark:hover:bg-white/10 md:hidden transition-colors"
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
              className="hidden sm:inline-flex group h-10 sm:h-11 items-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-4 sm:px-5 text-[14px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{loggedInLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden text-[14px] font-medium text-neutral-700 hover:text-neutral-950 dark:text-[#d6ccc5] dark:hover:text-white transition-colors duration-150 sm:block px-1"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="hidden sm:inline-flex group h-10 sm:h-11 items-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 px-4 sm:px-5 text-[14px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
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
        <div className="absolute top-[76px] left-3 right-3 z-50 rounded-2xl border border-[var(--border)] bg-white dark:bg-[#141414] p-4 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <div className="px-3.5 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
              Solutions
            </div>
            <div className="space-y-0.5 mb-2">
              {SOLUTIONS_NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3.5 py-2 text-[14px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.04] dark:text-[#d6ccc5] dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors"
                >
                  <span className="block text-[var(--text)] font-semibold">
                    {item.label}
                  </span>
                  <span className="block text-[11px] text-[var(--muted)] font-normal">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>

            <div className="my-1.5 h-px bg-[var(--border-subtle)]" />

            {HERO_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.04] dark:text-[#d6ccc5] dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors"
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
                  className="rounded-xl px-3.5 py-2 text-[14.5px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.04] dark:text-[#d6ccc5] dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 px-4 text-[14.5px] font-semibold shadow-xs transition-transform active:scale-98"
                >
                  <span>Get started free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <Link
                href={loggedInHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 px-4 text-[14.5px] font-semibold shadow-xs transition-transform active:scale-98"
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
