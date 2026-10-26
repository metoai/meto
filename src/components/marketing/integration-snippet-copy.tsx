"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function IntegrationSnippetCopy({
  snippet,
  filename,
  language = "json",
}: {
  snippet: string;
  filename?: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--card)] px-3.5 py-2 text-[11px] text-[var(--muted)]">
        <span className="font-mono text-[var(--text-secondary)]">{filename || language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1 font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="max-h-72 overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-[var(--text)]">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}
