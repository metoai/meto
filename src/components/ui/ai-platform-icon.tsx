import { Sparkles } from "lucide-react";
import type { CompileFormat } from "@/lib/types";
import { aiPlatformIconUrl, aiPlatformLabel } from "@/lib/ai-platform-icons";

type AiPlatformIconProps = {
  format: CompileFormat;
  size?: number;
  className?: string;
};

export function AiPlatformIcon({
  format,
  size = 16,
  className = "",
}: AiPlatformIconProps) {
  const src = aiPlatformIconUrl(format);
  const label = aiPlatformLabel(format);

  if (!src) {
    return (
      <Sparkles
        className={`shrink-0 text-[var(--muted)] ${className}`}
        style={{ width: size, height: size }}
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label}
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
