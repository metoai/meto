import { AI_BRAND_ICON_LANDING_CLASS } from "@/lib/ai-brand-icon";
import { SUPPORTED_AI_PARTNERS } from "@/lib/ai-platform-icons";

export function LandingHeroPartners() {
  return (
    <div className="landing-animate-in mt-7 w-full sm:mt-8" style={{ animationDelay: "0.15s" }}>
      <div className="flex flex-col items-center gap-3.5 pt-4 sm:pt-5 border-t border-[var(--border-subtle)]/60">
        <div className="flex items-center gap-2">
          <p className="font-mono-brand text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Integrates with your favorite AI tools
          </p>
        </div>

        <ul className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
          {SUPPORTED_AI_PARTNERS.map((partner) => (
            <li
              key={partner.id}
              className="group flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-2 py-1 transition-all duration-200 hover:border-[var(--border-subtle)] hover:bg-[var(--surface)]/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.url}
                alt={partner.label}
                width={18}
                height={18}
                title={partner.label}
                className={`h-4 w-4 object-contain transition-transform duration-200 group-hover:scale-110 sm:h-4.5 sm:w-4.5 ${AI_BRAND_ICON_LANDING_CLASS}`}
                loading="lazy"
                decoding="async"
              />
              <span className="text-[12px] font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text)]">
                {partner.label}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 mt-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Trusted by 12,000+ engineers, designers, & founders</span>
        </p>
      </div>
    </div>
  );
}

