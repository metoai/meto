"use client";

import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "section";
};

export function DashboardCard({
  children,
  className = "",
  hover = true,
  as: Tag = "div",
}: DashboardCardProps) {
  return (
    <Tag
      className={`rounded-xl border border-black/[0.08] bg-white p-5 transition-all duration-150 ease-in-out ${
        hover
          ? "hover:scale-[1.005] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#9B9B93]">
      {children}
    </p>
  );
}

export function PageHeader({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-medium tracking-tight text-[#1A1A18]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-sm leading-relaxed text-[#6B6B63]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
