"use client";

import { useState } from "react";

export function ProjectDecisionForm({
  projectId,
  onSaved,
}: {
  projectId: string;
  onSaved: () => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/decisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, reason }),
      });
      if (!res.ok) throw new Error("Failed");
      setFrom("");
      setTo("");
      setReason("");
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="landing-panel space-y-3 p-4">
      <p className="landing-panel-label">Record a decision</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From (e.g. Firebase)"
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
        />
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To (e.g. Supabase)"
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
        />
      </div>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (cost, performance, migration…)"
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={saving || !from.trim() || !to.trim()}
        className="rounded-lg bg-[var(--text)] px-3 py-2 text-xs font-medium text-[var(--bg)] disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save decision"}
      </button>
    </form>
  );
}
