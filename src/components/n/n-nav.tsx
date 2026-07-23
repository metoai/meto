"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";

const NAV_LINKS = [
  { href: "#transformation", label: "How it works" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#continuous-sync", label: "Integrations" },
  { href: "#pricing", label: "Pricing" },
];

export function NNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--bg)]/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/n" className="flex items-center gap-2.5">
          <MetoMarkBadge size="sm" />
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
            Meto
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="hidden text-[14px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--text)] px-4 py-2 text-[14px] font-medium text-[var(--bg)] shadow-sm transition-transform active:scale-95"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
