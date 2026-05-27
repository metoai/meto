import Link from "next/link";

type MetoLogoProps = {
  href?: string;
  className?: string;
};

export function MetoLogo({ href = "/", className = "" }: MetoLogoProps) {
  const logo = (
    <span
      className={`text-2xl font-medium tracking-tight text-brand-primary ${className}`}
    >
      meto
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logo}
      </Link>
    );
  }

  return logo;
}
