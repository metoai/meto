import Link from "next/link";

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

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative z-[1] flex h-full min-h-0 flex-col overflow-hidden text-[var(--text)]">
      <header className="shrink-0 px-4 pb-1 pt-4 sm:pt-5">
        <Link
          href="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] transition-[border-color,background,color] duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          aria-label="Back to home"
        >
          <BackIcon />
        </Link>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto px-4 py-3">
        <div className="my-auto flex w-full max-w-[400px] justify-center">
          {children}
        </div>
      </main>

      <footer className="shrink-0 px-4 pb-4 text-center sm:pb-5">
        <p className="text-[10px] leading-snug text-[var(--placeholder)]">
          Encrypted in transit · Your profile stays yours
        </p>
      </footer>
    </div>
  );
}
