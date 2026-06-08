import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type LandingHeroCopyProps = {
  chatStarted: boolean;
};

export function LandingHeroCopy({ chatStarted }: LandingHeroCopyProps) {
  if (chatStarted) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <Link
        href="#how-it-works"
        className="landing-animate-in landing-hover-link mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 transition-[border-color,background-color] duration-150 hover:border-[var(--accent-border)]"
      >
        <span className="font-mono-brand text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
          Free to start
        </span>
        <span className="hidden h-px w-4 bg-[var(--border)] sm:block" aria-hidden />
        <span className="text-[12px] text-[var(--text-secondary)]">
          No signup required
        </span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]">
          <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
        </span>
      </Link>

      <h1 className="landing-animate-in max-w-[720px] text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text)] sm:text-[3rem] lg:text-[3.5rem]">
        Never explain yourself{" "}
        <span className="text-[var(--primary)]">twice.</span>
      </h1>

      <p
        className="landing-animate-in mx-auto mt-5 max-w-[520px] text-[16px] leading-[1.55] text-[var(--text-secondary)] sm:text-[17px]"
        style={{ animationDelay: "0.06s" }}
      >
        Chat with Meto once. It builds a structured profile you can share with
        every AI, agent, and collaborator.
      </p>
    </div>
  );
}
