import Link from "next/link";
import { brandAssets, type LogoHorizontalVariant } from "@/lib/brand";

const LOGO_SIZES = {
  sm: "h-[22px]",
  md: "h-6",
  lg: "h-7",
} as const;

export type MetoLogoSize = keyof typeof LOGO_SIZES;

type MetoLogoProps = {
  href?: string;
  className?: string;
  size?: MetoLogoSize;
  variant?: LogoHorizontalVariant;
};

const horizontalLogoSrc: Record<LogoHorizontalVariant, string> = {
  white: brandAssets.logoHorizontalWhite,
  green: brandAssets.logoHorizontalGreen,
};

export function MetoLogoImage({
  size = "md",
  className = "",
  variant = "white",
}: {
  size?: MetoLogoSize;
  className?: string;
  variant?: LogoHorizontalVariant;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={horizontalLogoSrc[variant]}
      alt="Meto"
      className={`${LOGO_SIZES[size]} w-auto max-w-[9.5rem] shrink-0 object-contain object-left ${className}`}
    />
  );
}

export function MetoLogo({
  href = "/",
  size = "md",
  className = "",
  variant = "white",
}: MetoLogoProps) {
  const logo = (
    <MetoLogoImage size={size} className={className} variant={variant} />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center leading-none">
        {logo}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center leading-none">{logo}</span>;
}
