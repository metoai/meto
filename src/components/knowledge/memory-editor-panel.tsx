"use client";

import { useEffect, useState } from "react";
import type { KnowledgeObject } from "@/lib/knowledge/types";

export function MemoryEditorPanel() {
  const [memories, setMemories] = useState<KnowledgeObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/knowledge");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load memories.");
        setMemories(data.memories ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">Loading memories…</p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (memories.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        No memories yet. Enable V2 flags and run a profile update or migration.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {memories.map((memory) => (
        <li
          key={memory.id}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] px-4 py-3"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            <span className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-medium uppercase">
              {memory.type}
            </span>
            <span className="font-medium text-[var(--text)]">{memory.title}</span>
            <span>· {memory.source}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {memory.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
