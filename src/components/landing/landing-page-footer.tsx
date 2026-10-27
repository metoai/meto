import Link from "next/link";
import { MetoMarkBadge } from "@/components/meto-mark";
import { LEGAL_LINKS } from "@/lib/legal-links";
import { LANDING_PAGE_NAV_LINKS, SOLUTIONS_NAV_LINKS } from "@/lib/marketing-nav";

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
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2.5 transition-opacity duration-150 hover:opacity-80"
            >
              <MetoMarkBadge size="sm" />
              <span className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--text)]">
                meto
              </span>
            </Link>
            <p className="max-w-xs text-xs text-[var(--muted)] leading-relaxed">
              Universal AI context and persistent memory protocol for software engineers.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-medium">
                Solutions
              </span>
              <nav className="flex flex-col gap-2" aria-label="Solutions">
                {SOLUTIONS_NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-medium">
                Product
              </span>
              <nav className="flex flex-col gap-2" aria-label="Product">
                {LANDING_PAGE_NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-medium">
                Legal
              </span>
              <nav className="flex flex-col gap-2" aria-label="Legal">
                {isLoggedIn ? (
                  <Link
                    href={loggedInHref}
                    className={`${linkClassName} text-[var(--primary)] hover:text-[var(--primary-hover)]`}
                  >
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
          </div>
        </div>

        <p className="mt-8 text-[12px] text-[var(--muted)]">
          © {year} Meto
        </p>
      </div>
    </footer>
  );
}
