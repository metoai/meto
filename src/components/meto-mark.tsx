import { brandAssets } from "@/lib/brand";

const MARK_SIZES = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-9 w-9",
  "2xl": "h-12 w-12",
} as const;

export type MetoMarkSize = keyof typeof MARK_SIZES;

type MetoMarkProps = {
  size?: MetoMarkSize;
  className?: string;
};

export function MetoMark({ size = "md", className = "" }: MetoMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brandAssets.logoIcon}
      alt=""
      aria-hidden
      className={`${MARK_SIZES[size]} block shrink-0 object-contain object-center ${className}`}
    />
  );
}

type MetoChatAvatarProps = {
  /** Use when the message has no "Meto" label row above it */
  compact?: boolean;
  className?: string;
};

/** Fixed-width chat avatar column for consistent alignment with message text */
export function MetoChatAvatar({ compact = false, className = "" }: MetoChatAvatarProps) {
  return (
    <div
      className={`flex w-8 shrink-0 justify-center ${compact ? "pt-1" : "pt-0.5"} ${className}`}
    >
      <MetoMark size="md" />
    </div>
  );
}
