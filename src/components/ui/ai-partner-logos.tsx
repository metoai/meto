import { AI_BRAND_ICON_CLASS } from "@/lib/ai-brand-icon";
import { SUPPORTED_AI_PARTNERS } from "@/lib/ai-platform-icons";

type AiPartnerLogosProps = {
  size?: number;
  className?: string;
  iconClassName?: string;
  align?: "start" | "center";
};

export function AiPartnerLogos({
  size = 18,
  className = "",
  iconClassName = "",
  align = "start",
}: AiPartnerLogosProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`}
      aria-label={SUPPORTED_AI_PARTNERS.map((p) => p.label).join(", ")}
    >
      {SUPPORTED_AI_PARTNERS.map((partner) => (
        <div
          key={partner.id}
          className="flex shrink-0 items-center gap-1.5"
          title={partner.label}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.url}
            alt=""
            aria-hidden={partner.showLabel}
            width={size}
            height={size}
            className={`${AI_BRAND_ICON_CLASS} shrink-0 object-contain ${iconClassName}`}
            loading="lazy"
            decoding="async"
          />
          {partner.showLabel ? (
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
              {partner.label}
            </span>
          ) : (
            <span className="sr-only">{partner.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
