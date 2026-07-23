"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

type NSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Tighter vertical rhythm for dense visual sections */
  compact?: boolean;
};

export function NSection({
  id,
  children,
  className = "",
  compact = false,
}: NSectionProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative px-4 sm:px-6 md:px-8 lg:px-12 ${
        compact ? "py-24 sm:py-32" : "py-32 sm:py-48"
      } ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-[1200px] transition-all duration-1000 ease-out ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

type NSectionIntroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
};

export function NSectionIntro({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: NSectionIntroProps) {
  const alignClass =
    align === "center"
      ? "mx-auto text-center items-center"
      : align === "right"
        ? "ml-auto text-right items-end"
        : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      <p className="mb-4 font-mono-brand text-[12px] font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
        {eyebrow}
      </p>
      <h2 className="max-w-[18ch] text-balance text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--text)] sm:text-[2.5rem] lg:text-[3rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 max-w-[50ch] text-balance text-[16px] leading-[1.6] text-[var(--text-secondary)] sm:text-[18px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
