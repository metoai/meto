"use client";

import { useState } from "react";
import { AiPartnerLogos } from "@/components/ui/ai-partner-logos";
import { publicProfileLabel } from "@/lib/site";

type PublicProfileShareCardProps = {
  shareText: string;
  username: string;
};

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M8 8V5.5A1.5 1.5 0 0 1 9.5 4h9A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H16M5.5 8h9A1.5 1.5 0 0 1 16 9.5v9A1.5 1.5 0 0 1 14.5 20h-9A1.5 1.5 0 0 1 4 18.5v-9A1.5 1.5 0 0 1 5.5 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PublicProfileShareCard({
  shareText,
  username,
}: PublicProfileShareCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section
      id="profile-context"
      aria-label="Share with AI"
      className="landing-cta-card p-6 sm:p-8"
    >
      <p className="landing-panel-label">Use with AI</p>
      <h2 className="mt-3 text-xl font-medium tracking-[-0.02em] text-[var(--text)] sm:text-[22px]">
        Paste into any AI chat
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
        One link — ChatGPT, Claude, Gemini, Perplexity, and every other AI can
        fetch this as your background context.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy for AI"}
        </button>
        <span className="font-mono-brand text-[12px] text-[var(--muted)]">
          {publicProfileLabel(username)}
        </span>
      </div>

      <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
        <AiPartnerLogos size={18} align="start" />
      </div>

      <details className="group mt-5">
        <summary className="cursor-pointer list-none text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-1.5">
            Preview prompt
            <span className="text-[var(--muted)] transition-transform group-open:rotate-180">
              ▾
            </span>
          </span>
        </summary>
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 font-mono-brand text-[12px] leading-relaxed text-[var(--text-secondary)]">
          {shareText}
        </pre>
      </details>
    </section>
  );
}
