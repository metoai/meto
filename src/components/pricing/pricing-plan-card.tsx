function CheckIcon({ primary = false }: { primary?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${primary ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}
      aria-hidden
    >
      <path
        d="M3.5 8.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PricingPlanCardProps = {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: readonly string[];
  featured?: boolean;
  loading: boolean;
  onChoose: () => void;
};

export function PricingPlanCard({
  name,
  price,
  period,
  tagline,
  features,
  featured,
  loading,
  onChoose,
}: PricingPlanCardProps) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onChoose}
      className={`group landing-panel flex h-full w-full flex-col p-5 text-left transition-[border-color,box-shadow] duration-150 disabled:opacity-60 sm:p-6 ${
        featured
          ? "border-[var(--primary)] shadow-[0_0_0_1px_rgba(255,77,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,77,0,0.1)]"
          : "hover:border-[var(--landing-panel-border)]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-medium uppercase tracking-[0.07em] ${
              featured ? "text-[var(--primary)]" : "text-[var(--muted)]"
            }`}
          >
            {name}
          </p>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-[32px] font-semibold leading-none tracking-[-0.5px] text-[var(--text)] sm:text-[36px]">
              {price}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">{period}</span>
          </div>
        </div>
        {featured ? (
          <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--primary)]">
            Pro
          </span>
        ) : null}
      </div>

      <p className="mb-4 text-sm leading-snug text-[var(--text-secondary)]">{tagline}</p>

      <ul className="mb-5 flex-1 space-y-2">
        {features.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[13px] leading-snug text-[var(--text)]"
          >
            <CheckIcon primary={featured} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <span
        className={`flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-[background] duration-150 ${
          featured
            ? "bg-[var(--primary)] text-white group-hover:bg-[var(--primary-hover)]"
            : "border border-[var(--landing-panel-glass-border)] landing-panel-glass text-[var(--text)] group-hover:border-[var(--accent-border)]"
        }`}
      >
        {loading ? "Continuing…" : "Choose plan"}
      </span>
    </button>
  );
}
