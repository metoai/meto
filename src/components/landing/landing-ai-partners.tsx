import { LANDING_AI_PARTNERS } from "@/lib/ai-platform-icons";

type LandingAiPartnersProps = {
  className?: string;
};

export function LandingAiPartners({ className = "" }: LandingAiPartnersProps) {
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 ${className}`}
      aria-label={LANDING_AI_PARTNERS.map((p) => p.label).join(", ")}
    >
      {LANDING_AI_PARTNERS.map((partner) => (
        <li key={partner.id}>
          <span
            title={partner.label}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F6E56] shadow-[0_1px_2px_rgba(15,110,86,0.2)] transition-colors duration-150 hover:bg-[#1D9E75]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partner.url}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 shrink-0 object-contain brightness-0 invert"
              loading="lazy"
              decoding="async"
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
