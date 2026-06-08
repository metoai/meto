import { MetoMarkBadge } from "@/components/meto-mark";
import { LANDING_OPENING } from "@/lib/landing-chat";

type MetoTypingDotsProps = {
  size?: "sm" | "md";
  className?: string;
};

/** Minimal typing indicator — no status text, premium and fast. */
export function MetoTypingDots({
  size = "md",
  className = "",
}: MetoTypingDotsProps) {
  const dot =
    size === "sm"
      ? "landing-typing-dot h-1 w-1 rounded-full bg-[var(--muted)]"
      : "landing-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]";

  return (
    <div
      className={`flex gap-1 py-0.5 ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label="Meto is typing"
    >
      <span className={dot} />
      <span className={dot} />
      <span className={dot} />
    </div>
  );
}

/** @deprecated Use MetoTypingDots */
export const LandingTypingDots = MetoTypingDots;

/** True while Meto is generating the latest assistant reply. */
export function isAssistantReplying(
  busy: boolean,
  messages: { id?: string; role: string }[],
  message: { id?: string; role: string }
) {
  if (!busy || message.role !== "assistant") return false;
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant") return false;
  if (message.id && last.id) return message.id === last.id;
  return message === last;
}

export function LandingOpeningMessage() {
  return (
    <div className="flex gap-3 text-left">
      <MetoMarkBadge />
      <div>
        <p className="mb-1 text-[11px] font-medium text-[var(--primary)]">Meto</p>
        <p className="text-sm leading-normal text-[var(--text)]">{LANDING_OPENING}</p>
      </div>
    </div>
  );
}
