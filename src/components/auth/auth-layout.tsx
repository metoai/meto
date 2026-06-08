import Link from "next/link";
import { MetoMarkBadge } from "@/components/meto-mark";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="auth-hero-panel relative hidden min-h-dvh flex-col justify-between overflow-hidden p-8 lg:flex lg:p-12 xl:p-14">
        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-2.5 transition-opacity duration-150 hover:opacity-80"
        >
          <MetoMarkBadge size="md" />
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
            meto
          </span>
        </Link>

        <div className="relative z-10 max-w-[360px]">
          <p className="text-[14px] text-[var(--text-secondary)]">Tell Meto once</p>
          <h2 className="mt-3 text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--text)] xl:text-[2.25rem]">
            Your AI profile, ready for every conversation.
          </h2>
        </div>
      </aside>

      <main className="flex min-h-dvh flex-col overflow-y-auto bg-[var(--bg)] px-6 py-10 sm:px-12 sm:py-12 lg:px-16 lg:py-14 xl:px-20">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
            <MetoMarkBadge size="sm" />
            <span className="text-[14px] font-semibold tracking-tight text-[var(--text)]">
              meto
            </span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-center">{children}</div>
      </main>
    </div>
  );
}
