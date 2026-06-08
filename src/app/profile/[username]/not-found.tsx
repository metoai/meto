import Link from "next/link";
import { LandingPageFooter } from "@/components/landing/landing-page-footer";
import { MetoLogo } from "@/components/meto-logo";

export default function ProfileNotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <div className="landing-hero-bg" aria-hidden />

      <header className="relative z-10 border-b border-[var(--border-subtle)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl px-4 py-4 sm:px-6">
          <MetoLogo size="lg" />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="landing-panel brand-spot w-full max-w-md p-10 text-center">
          <p className="landing-panel-label">404</p>
          <h1 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[var(--text)]">
            Profile not found
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            This username doesn&apos;t exist or hasn&apos;t been claimed yet.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex rounded-full bg-[var(--primary)] px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              Go home
            </Link>
            <Link
              href="/auth/signup"
              className="landing-hover-link text-[13px] text-[var(--text-secondary)]"
            >
              Claim a username
            </Link>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
