"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

type LandingSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Tighter vertical rhythm for dense visual sections */
  compact?: boolean;
};

export function LandingSection({
  id,
  children,
  className = "",
  compact = false,
}: LandingSectionProps) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`relative px-4 sm:px-6 ${
        compact ? "py-20 sm:py-24" : "py-24 sm:py-32"
      } ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-[1100px] landing-reveal ${
          inView ? "is-visible" : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
}

type LandingSectionIntroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
};

export function LandingSectionIntro({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: LandingSectionIntroProps) {
  const alignClass =
    align === "center"
      ? "mx-auto max-w-2xl text-center"
      : align === "right"
        ? "ml-auto max-w-xl text-right"
        : "max-w-xl text-left";

  const railClass =
    align === "left"
      ? "border-l border-[var(--border)] pl-5 sm:pl-6"
      : align === "right"
        ? "border-r border-[var(--border)] pr-5 sm:pr-6"
        : "";

  return (
    <div className={`${alignClass} ${railClass} ${className}`}>
      <p className="mb-4 font-mono-brand text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
        {eyebrow}
      </p>
      <h2 className="text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--text)] sm:text-[2.5rem] lg:text-[2.75rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-[16px] leading-[1.6] text-[var(--muted)] sm:text-[17px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** @deprecated Use LandingSectionIntro */
type LandingSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function LandingSectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: LandingSectionHeaderProps) {
  return (
    <LandingSectionIntro
      eyebrow={eyebrow ?? ""}
      title={title}
      subtitle={subtitle}
      align={align}
      className="mb-14 sm:mb-16"
    />
  );
}
