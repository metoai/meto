"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { SmartQuestion } from "@/lib/projects/smart-questions";

export function ProjectSmartQuestions({
  projectId,
  questions,
  onAnswered,
}: {
  projectId: string;
  questions: SmartQuestion[];
  onAnswered: () => void;
}) {
  const [working, setWorking] = useState<string | null>(null);

  if (!questions.length) return null;

  async function handleConfirm(q: SmartQuestion) {
    setWorking(q.id);
    try {
      const res = await fetch(`/api/projects/${projectId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: q.id,
          action: q.action,
          answer: q.suggestedAnswer ?? "Confirmed.",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      onAnswered();
    } finally {
      setWorking(null);
    }
  }

  return (
    <section className="landing-panel p-4">
      <p className="landing-panel-label mb-3">Smart questions</p>
      <ul className="space-y-3">
        {questions.map((q) => (
          <li
            key={q.id}
            className="rounded-lg border border-[var(--accent-border)] bg-[var(--primary-light)]/30 p-3"
          >
            <p className="text-sm font-medium text-[var(--text)]">{q.question}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{q.reason}</p>
            {q.suggestedAnswer ? (
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Suggested: {q.suggestedAnswer}
              </p>
            ) : null}
            <button
              type="button"
              disabled={working === q.id}
              onClick={() => void handleConfirm(q)}
              className="mt-2 text-xs font-medium text-[var(--primary)] hover:underline disabled:opacity-50"
            >
              {working === q.id ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving…
                </span>
              ) : (
                "Yes, update memory"
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
