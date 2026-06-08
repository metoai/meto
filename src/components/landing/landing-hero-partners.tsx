import { AI_BRAND_ICON_LANDING_CLASS } from "@/lib/ai-brand-icon";
import { SUPPORTED_AI_PARTNERS } from "@/lib/ai-platform-icons";

export function LandingHeroPartners() {
  return (
    <div className="landing-animate-in mt-8 w-full sm:mt-10" style={{ animationDelay: "0.15s" }}>
      <div className="flex flex-col items-center gap-4 pt-6 sm:pt-8">
        <p className="landing-panel-label">Works with</p>

        <ul className="flex w-full flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:gap-x-9">
          {SUPPORTED_AI_PARTNERS.map((partner) => (
            <li key={partner.id} className="flex shrink-0 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.url}
                alt={partner.label}
                width={20}
                height={20}
                title={partner.label}
                className={`h-5 w-5 object-contain ${AI_BRAND_ICON_LANDING_CLASS}`}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
