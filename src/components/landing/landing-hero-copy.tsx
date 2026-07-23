
type LandingHeroCopyProps = {
  chatStarted: boolean;
};

export function LandingHeroCopy({ chatStarted }: LandingHeroCopyProps) {
  if (chatStarted) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="landing-animate-in mb-8 inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] shadow-sm backdrop-blur-sm">
        <span className="mr-2 flex h-2 w-2 rounded-full bg-[var(--primary)] opacity-80"></span>
        Identity infrastructure for AI-native people
      </div>

      <h1 className="landing-animate-in max-w-[900px] text-balance text-[3.25rem] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--text)] sm:text-[4.25rem] lg:text-[5rem]">
        Every AI should <br className="hidden sm:block" />
        <span className="text-[var(--text-secondary)]">already know you.</span>
      </h1>

      <p
        className="landing-animate-in mx-auto mt-6 max-w-[680px] text-[18px] leading-[1.6] text-[var(--muted)] sm:text-[20px]"
        style={{ animationDelay: "0.04s" }}
      >
        Stop starting from zero. Create one profile that gives every AI persistent context about who you are and what you're building.
      </p>

    </div>
  );
}
