"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { MARKETING_NAV_LINKS } from "@/lib/marketing-nav";
import { createClient } from "@/lib/supabase/client";

type MarketingLayoutProps = {
  children: React.ReactNode;
  showFooter?: boolean;
};

export function MarketingLayout({
  children,
  showFooter = false,
}: MarketingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setIsLoggedIn(Boolean(user)))
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-[var(--text)]">
      <header className="landing-animate-in border-b border-[var(--border)] bg-white px-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <MetoMarkBadge size="sm" />
            <span className="text-base font-medium text-[var(--text)]">meto</span>
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] lg:hidden"
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
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)] sm:block"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            className="mx-auto mb-4 max-w-6xl rounded-xl border border-[var(--border)] bg-white p-3 lg:hidden"
            aria-label="Mobile"
          >
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--surface)] hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4 py-8 sm:px-6">
        {children}
      </main>

      {showFooter ? (
        <footer className="border-t border-[var(--border)] bg-white px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--text-secondary)] sm:flex-row">
            <p>© {new Date().getFullYear()} Meto</p>
            <div className="flex flex-wrap justify-center gap-5">
              {MARKETING_NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-150 hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
