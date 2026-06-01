import { LANDING_AI_PARTNERS } from "@/lib/ai-platform-icons";

type LandingAiPartnersProps = {
  className?: string;
};

export function LandingAiPartners({ className = "" }: LandingAiPartnersProps) {
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-4 sm:gap-5 ${className}`}
      aria-label={LANDING_AI_PARTNERS.map((p) => p.label).join(", ")}
    >
      {LANDING_AI_PARTNERS.map((partner) => (
        <li key={partner.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.url}
            alt={partner.label}
            width={22}
            height={22}
            title={partner.label}
            className="h-[22px] w-[22px] shrink-0 object-contain opacity-45 grayscale transition-opacity duration-150 hover:opacity-70"
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
}
