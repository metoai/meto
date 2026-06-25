import Link from "next/link";
import { MetoMarkBadge } from "@/components/meto-mark";
import { LEGAL_LINKS } from "@/lib/legal-links";
import { LANDING_PAGE_NAV_LINKS } from "@/lib/marketing-nav";

type LandingPageFooterProps = {
  isLoggedIn?: boolean;
  loggedInHref?: string;
  loggedInLabel?: string;
};

const linkClassName =
  "text-[13px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]";

export function LandingPageFooter({
  isLoggedIn = false,
  loggedInHref = "/dashboard",
  loggedInLabel = "Dashboard",
}: LandingPageFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2.5 transition-opacity duration-150 hover:opacity-80"
          >
            <MetoMarkBadge size="sm" />
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--text)]">
              meto
            </span>
          </Link>

          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end"
            aria-label="Footer"
          >
            {LANDING_PAGE_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link href={loggedInHref} className={`${linkClassName} text-[var(--primary)] hover:text-[var(--primary-hover)]`}>
                {loggedInLabel}
              </Link>
            ) : null}
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 text-[12px] text-[var(--muted)]">
          © {year} Meto
        </p>
      </div>
    </footer>
  );
}
