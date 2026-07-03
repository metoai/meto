import { MessageSquareOff, Sparkles } from "lucide-react";

export function LandingHeroProof() {
  return (
    <div
      className="landing-animate-in grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5"
      style={{ animationDelay: "0.08s" }}
    >
      <div className="rounded-xl border border-[var(--border-hover)] bg-[var(--surface)]/70 p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--muted)]">
            <MessageSquareOff className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
            Without Meto
          </p>
        </div>
        <ul className="space-y-2 text-[13px] leading-snug text-[var(--text-secondary)]">
          <li className="flex gap-2">
            <span className="text-[var(--placeholder)]" aria-hidden>
              —
            </span>
            Re-explain your stack every session
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--placeholder)]" aria-hidden>
              —
            </span>
            Context lost between tools
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--placeholder)]" aria-hidden>
              —
            </span>
            Agents start from zero
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--card)] p-4 text-left shadow-[var(--shadow-sm)]">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--accent-border)] bg-[var(--primary-light)] text-[var(--primary)]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--primary)]">
            With Meto
          </p>
        </div>
        <ul className="space-y-2 text-[13px] leading-snug text-[var(--text)]">
          <li className="flex gap-2">
            <span className="text-[var(--primary)]" aria-hidden>
              ✓
            </span>
            One profile, every AI
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--primary)]" aria-hidden>
              ✓
            </span>
            MCP + share link handoff
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--primary)]" aria-hidden>
              ✓
            </span>
            Agents pick up where you left off
          </li>
        </ul>
      </div>
    </div>
  );
}
