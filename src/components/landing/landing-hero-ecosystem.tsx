export function LandingHeroEcosystem() {
  const logos = [
    "ChatGPT", "Claude", "Gemini", "Cursor", "Copilot", "Perplexity", "DeepSeek"
  ];

  return (
    <div className="landing-animate-in mx-auto mt-20 flex w-full max-w-[1000px] flex-col items-center gap-8" style={{ animationDelay: "0.2s" }}>
      <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--muted)] uppercase">
        Meto sits underneath the entire AI ecosystem
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-50 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100">
        {logos.map((logo) => (
          <span key={logo} className="text-xl font-bold tracking-tight text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
