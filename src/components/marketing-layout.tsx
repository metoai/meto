"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MARKETING_NAV_OFFSET_PX,
  MarketingNavBar,
} from "@/components/marketing/marketing-nav-bar";
import { MARKETING_NAV_LINKS } from "@/lib/marketing-nav";
import { LEGAL_LINKS } from "@/lib/legal-links";
import { createClient } from "@/lib/supabase/client";

type MarketingLayoutProps = {
  children: React.ReactNode;
  showFooter?: boolean;
  /** Pricing and long pages read better top-aligned. */
  contentAlign?: "center" | "top";
};

export function MarketingLayout({
  children,
  showFooter = false,
  contentAlign = "center",
}: MarketingLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setIsLoggedIn(Boolean(user)))
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen text-[var(--text)]">
      <MarketingNavBar isLoggedIn={isLoggedIn} />

      <main
        className={`flex flex-col px-4 py-10 sm:px-6 sm:py-14 ${
          contentAlign === "top"
            ? "items-center"
            : "items-center justify-center py-8"
        }`}
        style={{ minHeight: `calc(100vh - ${MARKETING_NAV_OFFSET_PX}px)` }}
      >
        {children}
      </main>

      {showFooter ? (
        <footer className="border-t border-[var(--border)] bg-[var(--card)] px-4 py-8 sm:px-8">
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
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
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
