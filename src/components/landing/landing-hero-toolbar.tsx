const STEPS = ["Chat", "Build", "Share"] as const;

type LandingHeroToolbarProps = {
  chatStarted: boolean;
};

function StepConnector() {
  return (
    <span
      className="mx-0.5 h-px w-3 shrink-0 bg-[var(--border)] sm:mx-1 sm:w-4"
      aria-hidden
    />
  );
}

export function LandingHeroToolbar({ chatStarted }: LandingHeroToolbarProps) {
  const currentIndex = chatStarted ? 0 : 0;

  return (
    <div
      className="flex min-w-0 flex-col gap-1"
      aria-label="Onboarding steps — visual guide, not interactive"
    >
      <p className="font-mono-brand text-[9px] font-medium uppercase tracking-[0.1em] text-[var(--placeholder)] sm:text-[10px]">
        Your path
      </p>
      <ol className="flex list-none items-center p-0">
        {STEPS.map((step, index) => {
          const isCurrent = index === currentIndex;

          return (
            <li key={step} className="flex items-center">
              {index > 0 ? <StepConnector /> : null}
              <span
                className={`flex items-center gap-1.5 whitespace-nowrap font-mono-brand text-[10px] font-medium uppercase tracking-[0.08em] sm:text-[11px] ${
                  isCurrent ? "text-[var(--text)]" : "text-[var(--muted)]"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold leading-none sm:h-[18px] sm:w-[18px] sm:text-[10px] ${
                    isCurrent
                      ? "bg-[var(--primary-light)] text-[var(--primary)] ring-1 ring-[var(--accent-border)]"
                      : "bg-transparent text-[var(--placeholder)] ring-1 ring-[var(--border-subtle)]"
                  }`}
                >
                  {index + 1}
                </span>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
