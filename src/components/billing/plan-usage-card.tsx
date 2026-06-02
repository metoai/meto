"use client";

import Link from "next/link";
import { useState } from "react";
import { useEntitlements } from "@/hooks/use-entitlements";
import { openProCheckout } from "@/lib/billing-client";
import {
  PRO_AI_CALL_LIMIT,
  TRIAL_AI_CALL_LIMIT,
  TRIAL_DAYS,
} from "@/lib/ai-usage-limits";

type PlanUsageCardProps = {
  compact?: boolean;
};

function planLabel(plan: string) {
  if (plan === "pro") return "Meto Pro";
  if (plan === "trial") return `${TRIAL_DAYS}-day trial`;
  return "Free";
}

export function PlanUsageCard({ compact = false }: PlanUsageCardProps) {
  const { entitlements, loaded } = useEntitlements();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (!loaded || !entitlements) {
    return (
      <div
        className={`rounded-xl border border-black/[0.08] bg-white ${compact ? "p-4" : "p-5"}`}
      >
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton mt-3 h-2 w-full rounded-full" />
      </div>
    );
  }

  const { aiUsage, plan, trialDaysLeft } = entitlements;
  const pct =
    aiUsage.limit > 0
      ? Math.min(100, Math.round((aiUsage.used / aiUsage.limit) * 100))
      : 0;
  const isLow = aiUsage.limit > 0 && aiUsage.remaining <= Math.ceil(aiUsage.limit * 0.2);
  const showUpgrade = plan === "free" || (plan === "trial" && aiUsage.remaining === 0);

  return (
    <div
      className={`rounded-xl border border-black/[0.08] bg-white ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9B9B93]">
            Plan & AI usage
          </p>
          <p className="mt-1 text-sm font-medium text-[#1A1A18]">
            {planLabel(plan)}
            {plan === "trial" ? (
              <span className="font-normal text-[#6B6B63]">
                {" "}
                · {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} left
              </span>
            ) : null}
          </p>
        </div>
        {showUpgrade ? (
          <button
            type="button"
            disabled={checkoutLoading}
            onClick={() => {
              setCheckoutLoading(true);
              void openProCheckout().catch(() => setCheckoutLoading(false));
            }}
            className="shrink-0 rounded-lg bg-[#0F6E56] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1D9E75] disabled:opacity-60"
          >
            {checkoutLoading ? "Loading…" : "Upgrade to Pro"}
          </button>
        ) : null}
      </div>

      {plan === "free" ? (
        <p className="mt-3 text-xs leading-relaxed text-[#6B6B63]">
          No AI actions on Free — manual edits, heuristic score, and workspace
          copy still work. Pro includes {PRO_AI_CALL_LIMIT} AI actions per month.
        </p>
      ) : (
        <>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-[#6B6B63]">
              <span>AI actions left</span>
              <span className="tabular-nums font-medium text-[#1A1A18]">
                {aiUsage.remaining} / {aiUsage.limit}
                <span className="font-normal text-[#9B9B93]">
                  {" "}
                  ({aiUsage.periodLabel})
                </span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#F7F7F5]">
              <div
                className={`h-full rounded-full transition-all ${
                  isLow ? "bg-[#B45309]" : "bg-[#0F6E56]"
                }`}
                style={{ width: `${Math.max(pct, aiUsage.used > 0 ? 4 : 0)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[#9B9B93]">
              {plan === "trial"
                ? `Trial includes ${TRIAL_AI_CALL_LIMIT} actions over ${TRIAL_DAYS} days — enough to try gap fixes, updates, and scoring.`
                : `${PRO_AI_CALL_LIMIT} actions per month — resets at the start of each month.`}
            </p>
          </div>
        </>
      )}

      <Link
        href="/pricing"
        className="mt-3 inline-block text-xs text-[#0F6E56] hover:underline"
      >
        Compare plans →
      </Link>
    </div>
  );
}
