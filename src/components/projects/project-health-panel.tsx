"use client";

import type { RepoHealthReport } from "@/lib/projects/repo-health";

export function ProjectHealthPanel({ health }: { health: RepoHealthReport }) {
  const tone =
    health.score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : health.score >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <section className="landing-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="landing-panel-label">Repository health</p>
        <span className={`text-2xl font-semibold tabular-nums ${tone}`}>
          {health.score}
        </span>
      </div>
      {health.issues.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          Looking good — memory is in sync with the repo.
        </p>
      ) : (
        <ul className="space-y-2">
          {health.issues.map((issue) => (
            <li
              key={issue.id}
              className="rounded-lg border border-[var(--border-subtle)] px-3 py-2"
            >
              <p className="text-sm font-medium text-[var(--text)]">
                {issue.label}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                {issue.detail}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
