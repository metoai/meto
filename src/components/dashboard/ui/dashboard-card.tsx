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
      className={`rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 transition-all duration-150 ease-in-out ${
        hover
          ? "hover:scale-[1.005] hover:shadow-[var(--shadow-sm)]"
          : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
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
    <div className={`mb-6 hidden md:block ${className}`}>
      <h1 className="text-2xl font-medium tracking-tight text-[var(--text)]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
