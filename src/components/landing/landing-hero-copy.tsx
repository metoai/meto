import Link from "next/link";
import { ArrowRight } from "lucide-react";

type LandingHeroCopyProps = {
  chatStarted: boolean;
};

export function LandingHeroCopy({ chatStarted }: LandingHeroCopyProps) {
  if (chatStarted) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <p
        className="landing-animate-in mb-5 font-mono-brand text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--primary)]"
      >
        Structured context for every AI
      </p>

      <h1 className="landing-animate-in max-w-[800px] text-balance text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--text)] sm:text-[3.5rem] lg:text-[4rem]">
        One profile.<br />
        <span className="text-[var(--primary)]">Perfect AI context everywhere.</span>
      </h1>

      <p
        className="landing-animate-in mx-auto mt-6 max-w-[640px] text-[17px] leading-[1.6] text-[var(--text-secondary)] sm:text-[19px]"
        style={{ animationDelay: "0.04s" }}
      >
        Stop repeating yourself to Claude, ChatGPT, and Cursor. Build your Meto profile once and give every AI instant, accurate memory about you and your projects.
      </p>

      <div
        className="landing-animate-in mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row"
        style={{ animationDelay: "0.06s" }}
      >
        <Link
          href="/auth/signup"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[var(--primary-hover)] active:scale-95 sm:w-auto"
        >
          Get started for free
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
        <Link
          href="#how-it-works"
          className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-[15px] font-medium text-[var(--text)] transition-[border-color,background-color] duration-150 hover:border-[var(--accent-border)] hover:bg-[var(--surface)] sm:w-auto"
        >
          See how it works
        </Link>
      </div>

      <p
        className="landing-animate-in mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-[var(--muted)]"
        style={{ animationDelay: "0.08s" }}
      >
        <span>No credit card</span>
        <span className="text-[var(--placeholder)]" aria-hidden>
          ·
        </span>
        <span>2 min setup</span>
        <span className="text-[var(--placeholder)]" aria-hidden>
          ·
        </span>
        <span>Works with Claude, Cursor & ChatGPT</span>
      </p>
    </div>
  );
}
