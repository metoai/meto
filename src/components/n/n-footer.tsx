"use client";

import Link from "next/link";
import { MetoMarkBadge } from "@/components/meto-mark";

const FOOTER_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/blog", label: "Blog" },
];

export function NFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] px-4 sm:px-6 md:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 py-12 md:flex-row">
        <Link href="/n" className="flex items-center gap-2.5">
          <MetoMarkBadge size="sm" />
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
            Meto
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-[13px] text-[var(--muted)]">
          © {new Date().getFullYear()} Meto. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
