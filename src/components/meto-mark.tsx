import { brandAssets } from "@/lib/brand";

const MARK_SIZES = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-9 w-9",
  "2xl": "h-12 w-12",
} as const;

const BADGE_SIZES = {
  sm: { box: "h-5 w-5", icon: "h-[11px] w-[11px]" },
  md: { box: "h-7 w-7", icon: "h-4 w-4" },
  lg: { box: "h-9 w-9", icon: "h-5 w-5" },
  auth: { box: "h-10 w-10 sm:h-11 sm:w-11", icon: "h-[18px] w-[18px] sm:h-5 sm:w-5" },
} as const;

export type MetoMarkSize = keyof typeof MARK_SIZES;
export type MetoMarkBadgeSize = keyof typeof BADGE_SIZES;

type MetoMarkProps = {
  size?: MetoMarkSize;
  className?: string;
};

export function MetoMark({ size = "md", className = "" }: MetoMarkProps) {
  return (
    <span
      aria-hidden
      className={`${MARK_SIZES[size]} block shrink-0 bg-[var(--primary)] ${className}`}
      style={{
        WebkitMaskImage: `url(${brandAssets.logoIcon})`,
        maskImage: `url(${brandAssets.logoIcon})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

type MetoMarkBadgeProps = {
  size?: MetoMarkBadgeSize;
  className?: string;
};

/** Brand mark on primary accent — used in nav, chat avatars, and landing */
export function MetoMarkBadge({ size = "md", className = "" }: MetoMarkBadgeProps) {
  const { box, icon } = BADGE_SIZES[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--primary)] ${box} ${className}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brandAssets.logoIcon}
        alt=""
        className={`${icon} object-contain brightness-0 invert`}
      />
    </span>
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
      <MetoMarkBadge size="md" />
    </div>
  );
}
