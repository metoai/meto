"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MetoMark } from "@/components/meto-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "How it works", href: "/#chat" },
  { label: "Examples", href: "/profile/dibo" },
  { label: "Pricing", href: "/pricing" },
];

type MarketingLayoutProps = {
  children: React.ReactNode;
  showFooter?: boolean;
  authPage?: "login" | "signup";
};

export function MarketingLayout({
  children,
  showFooter = false,
  authPage,
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
    <div className="relative min-h-screen text-[var(--color-text)]">
      <div className="landing-mesh" aria-hidden>
        <div className="landing-mesh-blob" />
      </div>

      <header className="landing-animate-in relative z-20 px-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-5">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <MetoMark />
            <span className="text-lg font-semibold tracking-tight text-[var(--color-text)]">
              meto
            </span>
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] lg:hidden"
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
                className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                {authPage !== "login" ? (
                  <Link
                    href="/auth/login"
                    className="hidden text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] sm:block"
                  >
                    Log in
                  </Link>
                ) : null}
                {authPage !== "signup" ? (
                  <Link
                    href="/auth/signup"
                    className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]"
                  >
                    Get started
                  </Link>
                ) : null}
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            className="mx-auto mb-4 max-w-6xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 lg:hidden"
            aria-label="Mobile"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-4 py-8 sm:px-6">
        {children}
      </main>

      {showFooter ? (
        <footer className="relative z-10 border-t border-[var(--color-border)] px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--color-muted)] sm:flex-row">
            <p>© {new Date().getFullYear()} Meto</p>
            <div className="flex flex-wrap justify-center gap-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-[var(--color-accent)]"
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
