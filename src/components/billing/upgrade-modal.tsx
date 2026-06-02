"use client";

import { useState } from "react";
import type { BillingFeature } from "@/lib/entitlements";
import { PRO_AI_CALL_LIMIT, TRIAL_AI_CALL_LIMIT } from "@/lib/ai-usage-limits";
import { openProCheckout } from "@/lib/billing-client";

const FEATURE_COPY: Record<BillingFeature, { title: string; detail: string }> = {
  gap_fix: {
    title: "Fix gaps with AI",
    detail:
      "Short AI interviews that fill weak sections — the fastest way to raise your context score.",
  },
  quick_update: {
    title: "Quick update",
    detail:
      "Tell Meto what changed in plain language and it updates every section that needs it.",
  },
  llm_score: {
    title: "Smart context score",
    detail:
      "LLM-powered analysis of how well AI understands you, with precise gap insights.",
  },
  llm_compile: {
    title: "AI compile",
    detail:
      "Regenerate polished context blocks tuned for Claude, ChatGPT, Gemini, and more.",
  },
  onboarding_ai: {
    title: "AI onboarding",
    detail:
      "Brain dump or chat interview to build your full profile in minutes.",
  },
  custom_sections: {
    title: "More custom sections",
    detail: "Free includes 1 custom section. Pro unlocks up to 5.",
  },
};

const AI_LIMIT_COPY: Partial<Record<BillingFeature, { title: string; detail: string }>> = {
  gap_fix: {
    title: "AI limit reached",
    detail: `Trial includes ${TRIAL_AI_CALL_LIMIT} AI actions over 3 days. Pro includes ${PRO_AI_CALL_LIMIT}/month.`,
  },
  quick_update: {
    title: "AI limit reached",
    detail: `Trial includes ${TRIAL_AI_CALL_LIMIT} AI actions over 3 days. Pro includes ${PRO_AI_CALL_LIMIT}/month.`,
  },
};

type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  feature?: BillingFeature | null;
  aiLimitReached?: boolean;
};

export function UpgradeModal({
  open,
  onClose,
  feature,
  aiLimitReached,
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const copy = aiLimitReached
    ? AI_LIMIT_COPY[feature ?? "quick_update"] ?? AI_LIMIT_COPY.quick_update
    : feature
      ? FEATURE_COPY[feature]
      : null;

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      await openProCheckout();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xl">
        <h2
          id="upgrade-modal-title"
          className="text-lg font-semibold text-[#1A1A18]"
        >
          {copy?.title ?? "Upgrade to Meto Pro"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B6B63]">
          {copy?.detail ??
            "Your Pro trial ended. Subscribe to keep AI gap fixes, quick updates, smart scoring, and LLM compile."}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-[#6B6B63]">
          <li>· AI gap fixes and fix-all flows</li>
          <li>· Quick update chat across sections</li>
          <li>· LLM context score and regenerate compile</li>
          <li>· Up to 5 custom profile sections</li>
        </ul>
        {error ? (
          <p className="mt-3 text-sm text-[#DC2626]">{error}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/[0.08] px-4 py-2.5 text-sm text-[#6B6B63] hover:text-[#1A1A18]"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={() => void handleUpgrade()}
            disabled={loading}
            className="rounded-lg bg-[#0F6E56] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1D9E75] disabled:opacity-60"
          >
            {loading ? "Redirecting…" : "Upgrade to Pro"}
          </button>
        </div>
      </div>
    </div>
  );
}
