import { MetoMarkBadge } from "@/components/meto-mark";

type LandingChatHeaderProps = {
  chatStarted: boolean;
};

export function LandingChatHeader({ chatStarted }: LandingChatHeaderProps) {
  if (chatStarted) {
    return (
      <div className="border-b border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <MetoMarkBadge size="sm" />
          <div className="min-w-0 text-left">
            <p className="text-[13px] font-medium text-[var(--text)]">Meto</p>
            <p className="text-[11px] text-[var(--muted)]">Learning from your answers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[var(--border)] bg-[var(--card)] px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <MetoMarkBadge size="sm" />
        <div className="min-w-0 text-left">
          <p className="text-[13px] font-medium text-[var(--text)]">
            Tell Meto about yourself
          </p>
          <p className="text-[11px] text-[var(--text-secondary)]">
            What do you do? What are you working on?
          </p>
        </div>
      </div>
    </div>
  );
}
