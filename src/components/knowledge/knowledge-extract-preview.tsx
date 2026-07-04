"use client";

import type { NewKnowledgeObject } from "@/lib/knowledge/types";

type KnowledgeExtractPreviewProps = {
  memories: NewKnowledgeObject[];
  onDismiss?: () => void;
};

export function KnowledgeExtractPreview({
  memories,
  onDismiss,
}: KnowledgeExtractPreviewProps) {
  if (memories.length === 0) return null;

  return (
    <div className="landing-panel border-[var(--accent-border)] bg-[var(--primary-light)]/40 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--text)]">
            Extracted memories
          </p>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            V2 shadow layer — review what Meto understood before saving.
          </p>
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
          >
            Dismiss
          </button>
        ) : null}
      </div>
      <ul className="space-y-2">
        {memories.map((memory) => (
          <li
            key={`${memory.type}-${memory.title}`}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2"
          >
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <span className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-medium uppercase tracking-wide">
                {memory.type}
              </span>
              <span>{memory.title}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text)]">
              {memory.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
