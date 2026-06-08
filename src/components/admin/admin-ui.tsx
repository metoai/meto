"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { Plan } from "@/lib/entitlements";

export function AdminPageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-h-0 w-full flex-1 overflow-y-auto ${className}`}>
      <div className="w-full px-4 py-5 sm:px-6 md:px-8 md:py-7 lg:px-10">
        {children}
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-medium tracking-tight text-[var(--text)] sm:text-2xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: string;
}) {
  return (
    <div className="landing-panel p-4 sm:p-5">
      <p className="landing-panel-label">{label}</p>
      <p className="mt-2 font-mono-brand text-2xl font-semibold tabular-nums tracking-tight text-[var(--text)] sm:text-3xl">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-[12px] text-[var(--muted)]">{hint}</p>
      ) : null}
      {trend ? (
        <p className="mt-1 text-[11px] font-medium text-[var(--primary)]">{trend}</p>
      ) : null}
    </div>
  );
}

const PLAN_STYLES: Record<Plan, string> = {
  trial: "bg-[#FFF7ED] text-[#C2410C] dark:bg-[#2A1508] dark:text-[#FF8A4C]",
  free: "bg-[var(--surface)] text-[var(--text-secondary)]",
  pro: "bg-[var(--primary-light)] text-[var(--primary)]",
};

export function PlanBadge({ plan }: { plan: Plan }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] ${PLAN_STYLES[plan]}`}
    >
      {plan}
    </span>
  );
}

export function AdminTable({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`landing-panel overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface)]/50 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
        {children}
      </tr>
    </thead>
  );
}

export function AdminTh({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-medium ${className}`}>{children}</th>;
}

export function AdminTd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-[13px] text-[var(--text-secondary)] ${className}`}>
      {children}
    </td>
  );
}

export function UserLink({
  id,
  username,
  displayName,
  email,
}: {
  id: string;
  username: string | null;
  displayName: string | null;
  email: string;
}) {
  const primary = displayName || username || email.split("@")[0];

  return (
    <Link
      href={`/admin/users/${id}`}
      className="group block min-w-0"
    >
      <p className="truncate font-medium text-[var(--text)] transition-colors group-hover:text-[var(--primary)]">
        {primary}
      </p>
      {username ? (
        <p className="truncate text-[11px] text-[var(--muted)]">@{username}</p>
      ) : (
        <p className="truncate text-[11px] text-[var(--muted)]">{email}</p>
      )}
    </Link>
  );
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="landing-panel flex flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-sm font-medium text-[var(--text)]">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-[13px] text-[var(--muted)]">{description}</p>
      ) : null}
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
}) {
  const styles = {
    primary:
      "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-50",
    secondary:
      "bg-[var(--surface)] text-[var(--text)] ring-1 ring-[var(--border-subtle)] hover:bg-[var(--card)] disabled:opacity-50",
    danger:
      "bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] disabled:opacity-50 dark:bg-[#3B1212] dark:text-[#FCA5A5]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-[13px] text-[var(--text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] ${className}`}
    />
  );
}

export function AdminTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full resize-y rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-[13px] leading-relaxed text-[var(--text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] ${className}`}
    />
  );
}

export function AdminFieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[12px] font-medium text-[var(--text-secondary)]">
      {children}
    </label>
  );
}

export function AdminTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[var(--border-subtle)] pb-px">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-t-lg px-3 py-2 text-[13px] font-medium transition-colors ${
            active === tab.id
              ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
              : "text-[var(--muted)] hover:text-[var(--text-secondary)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AdminSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-[13px] text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
