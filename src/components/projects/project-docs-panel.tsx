"use client";

import { Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { GeneratedDoc } from "@/lib/projects/doc-generator";

export function ProjectDocsPanel({ projectId }: { projectId: string }) {
  const [docs, setDocs] = useState<GeneratedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("readme");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/docs`);
    const data = await res.json();
    if (res.ok) setDocs(data.docs ?? []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  const current = docs.find((d) => d.id === active) ?? docs[0];

  async function copyDoc() {
    if (!current) return;
    await navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <p className="text-sm text-[var(--text-secondary)]">Generating docs…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {docs.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => setActive(doc.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              active === doc.id
                ? "bg-[var(--text)] text-[var(--bg)]"
                : "bg-[var(--surface)] text-[var(--muted)]"
            }`}
          >
            {doc.title}
          </button>
        ))}
      </div>
      {current ? (
        <section className="landing-panel p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-[var(--text)]">{current.title}</p>
              <p className="text-xs text-[var(--muted)]">{current.filename}</p>
            </div>
            <button
              type="button"
              onClick={() => void copyDoc()}
              className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--text)]"
            >
              <Copy className="h-3 w-3" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap font-sans text-sm text-[var(--text-secondary)]">
            {current.content}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
