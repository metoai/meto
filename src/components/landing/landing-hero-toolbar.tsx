const MODES = ["Chat", "Build", "Share"] as const;

type LandingHeroToolbarProps = {
  chatStarted: boolean;
};

export function LandingHeroToolbar({ chatStarted }: LandingHeroToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      {MODES.map((mode, index) => {
        const active = chatStarted ? mode === "Chat" : index === 0;
        return (
          <span
            key={mode}
            className={`rounded-md px-3 py-1.5 font-mono-brand text-[11px] font-medium uppercase tracking-[0.08em] transition-[color,background-color] duration-150 ${
              active
                ? "bg-[var(--surface)] text-[var(--text)]"
                : "text-[var(--muted)]"
            }`}
          >
            {mode}
          </span>
        );
      })}
    </div>
  );
}
