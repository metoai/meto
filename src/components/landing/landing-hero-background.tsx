export function LandingHeroBackground() {
  return (
    <div className="landing-hero-bg pointer-events-none select-none overflow-hidden" aria-hidden>
      {/* 1. Subtle Dot Matrix Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] opacity-25 dark:bg-[radial-gradient(#333333_1px,transparent_1px)] dark:opacity-30 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 2. Abstract subtle curved orange shape entering from bottom-left corner */}
      <div className="absolute -bottom-32 -left-32 w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-[var(--primary)]/12 via-[var(--primary)]/5 to-transparent blur-3xl opacity-60 dark:opacity-30" />
    </div>
  );
}
