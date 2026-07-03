import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/legal-links";

type LandingHeroFooterProps = {
  isLoggedIn?: boolean;
};

export function LandingHeroFooter({ isLoggedIn = false }: LandingHeroFooterProps) {
  return (
    <div className="shrink-0 space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
        <Link
          href="/pricing"
          className="px-2 py-1 text-[13px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]"
        >
          Pricing
        </Link>
        <span className="text-[var(--placeholder)]" aria-hidden>
          ·
        </span>
        {isLoggedIn ? (
          <Link
            href="/dashboard"
            className="px-2 py-1 text-[13px] font-medium text-[var(--primary)] transition-colors duration-150 hover:text-[var(--primary-hover)]"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="px-2 py-1 text-[13px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]"
            >
              Log in
            </Link>
            <span className="text-[var(--placeholder)]" aria-hidden>
              ·
            </span>
            <Link
              href="/auth/signup"
              className="px-2 py-1 text-[13px] font-medium text-[var(--primary)] transition-colors duration-150 hover:text-[var(--primary-hover)]"
            >
              Get started free
            </Link>
          </>
        )}
      </div>

      <nav
        className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1"
        aria-label="Legal"
      >
        {LEGAL_LINKS.map((link, index) => (
          <span key={link.href} className="inline-flex items-center gap-1">
            {index > 0 ? (
              <span className="text-[var(--placeholder)]" aria-hidden>
                ·
              </span>
            ) : null}
            <Link
              href={link.href}
              className="px-1 py-0.5 text-[11px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--text-secondary)] sm:text-[12px]"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}
