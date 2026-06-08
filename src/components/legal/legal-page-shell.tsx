import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/legal-links";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageShellProps = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPageShell({
  title,
  updated,
  intro,
  sections,
}: LegalPageShellProps) {
  return (
    <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--text)]">
      <header className="px-4 pt-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] transition-[border-color,background,color] duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          aria-label="Back to home"
        >
          <BackIcon />
        </Link>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8 pb-16 sm:px-8 sm:py-10">
        <h1 className="mb-2 text-[1.75rem] font-semibold tracking-[-0.02em] text-[var(--text)] sm:text-[2rem]">
          {title}
        </h1>
        <p className="mb-8 text-[13px] text-[var(--muted)]">Last updated {updated}</p>
        <p className="mb-10 text-[15px] leading-[1.65] text-[var(--text-secondary)]">
          {intro}
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-[15px] font-medium text-[var(--text)]">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[14px] leading-[1.65] text-[var(--text-secondary)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav
          className="mt-12 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--border)] pt-8 text-[13px] text-[var(--muted)]"
          aria-label="Legal"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-150 hover:text-[var(--text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
