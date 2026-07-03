import Link from "next/link";
import { ArrowRight } from "lucide-react";

type LandingHeroCopyProps = {
  chatStarted: boolean;
};

export function LandingHeroCopy({ chatStarted }: LandingHeroCopyProps) {
  if (chatStarted) return null;

  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <p
        className="landing-animate-in mb-5 font-mono-brand text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]"
      >
        Structured context for every AI
      </p>

      <h1 className="landing-animate-in max-w-[720px] text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text)] sm:text-[3rem] lg:text-[3.25rem]">
        Never explain yourself{" "}
        <span className="text-[var(--primary)]">twice.</span>
      </h1>

      <p
        className="landing-animate-in mx-auto mt-5 max-w-[580px] text-[16px] leading-[1.55] text-[var(--text-secondary)] sm:text-[17px] lg:mx-0"
        style={{ animationDelay: "0.04s" }}
      >
        Paste your bio or let Meto learn as you work. Give every AI instant
        memory via link or MCP.
      </p>

      <p
        className="landing-animate-in mt-3 text-[13px] font-medium text-[var(--text)]"
        style={{ animationDelay: "0.05s" }}
      >
        One conversation → Universal AI memory
      </p>

      <div
        className="landing-animate-in mt-7 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
        style={{ animationDelay: "0.06s" }}
      >
        <Link
          href="/auth/signup"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-[14px] font-medium text-white transition-[background-color] duration-150 hover:bg-[var(--primary-hover)] sm:w-auto"
        >
          Get started free
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
        <Link
          href="#how-it-works"
          className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-[14px] font-medium text-[var(--text)] transition-[border-color] duration-150 hover:border-[var(--accent-border)] sm:w-auto"
        >
          See how it works
        </Link>
      </div>

      <p
        className="landing-animate-in mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] text-[var(--muted)] lg:justify-start"
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
