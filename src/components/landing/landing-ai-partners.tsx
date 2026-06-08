import { AI_BRAND_ICON_LANDING_CLASS } from "@/lib/ai-brand-icon";
import { AiPartnerLogos } from "@/components/ui/ai-partner-logos";

type LandingAiPartnersProps = {
  className?: string;
  align?: "start" | "center";
};

export function LandingAiPartners({
  className = "",
  align = "center",
}: LandingAiPartnersProps) {
  return (
    <AiPartnerLogos
      size={22}
      align={align}
      className={`gap-4 sm:gap-5 ${className}`}
      iconClassName={`h-[22px] w-[22px] ${AI_BRAND_ICON_LANDING_CLASS}`}
    />
  );
}
