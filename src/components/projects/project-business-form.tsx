"use client";

import { useState } from "react";

export function ProjectBusinessForm({
  projectId,
  initialContent,
  onSaved,
}: {
  projectId: string;
  initialContent: string;
  onSaved: () => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/memories`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "business", content: content.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="landing-panel mb-4 space-y-3 p-4">
      <p className="landing-panel-label">Business context</p>
      <p className="text-xs text-[var(--muted)]">
        What problem does this solve? Who are the users? Only you can confirm this —
        AI cannot infer it.
      </p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder="Problem, users, business model, vision, goals…"
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={saving || !content.trim()}
        className="rounded-lg bg-[var(--text)] px-3 py-2 text-xs font-medium text-[var(--bg)] disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save business context"}
      </button>
    </form>
  );
}
