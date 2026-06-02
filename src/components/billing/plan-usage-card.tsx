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
  showCompareLink?: boolean;
};

function planLabel(plan: string) {
  if (plan === "pro") return "Meto Pro";
  if (plan === "trial") return `${TRIAL_DAYS}-day trial`;
  return "Free";
}

export function PlanUsageCard({
  compact = false,
  showCompareLink = true,
}: PlanUsageCardProps) {
  const { entitlements, loaded } = useEntitlements();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (!loaded || !entitlements) {
    return (
      <div
        className={`rounded-xl border border-black/[0.08] bg-white ${compact ? "p-3" : "p-5"}`}
      >
        <div className="skeleton h-3.5 w-28 rounded" />
        <div className="skeleton mt-2 h-1.5 w-full rounded-full" />
      </div>
    );
  }

  const { aiUsage, plan, trialDaysLeft } = entitlements;
  const pct =
    aiUsage.limit > 0
      ? Math.min(100, Math.round((aiUsage.used / aiUsage.limit) * 100))
      : 0;
  const isLow = aiUsage.limit > 0 && aiUsage.remaining <= Math.ceil(aiUsage.limit * 0.2);
  const showUpgrade = plan === "free" || plan === "trial";

  return (
    <div
      className={`rounded-xl border border-black/[0.08] bg-white ${compact ? "p-3" : "p-5"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9B9B93]">
            Plan & AI usage
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-[#1A1A18]">
            {planLabel(plan)}
            {plan === "trial" ? (
              <span className="font-normal text-[#6B6B63]">
                {" "}
                · {trialDaysLeft}d left
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
            className="shrink-0 rounded-lg bg-[#0F6E56] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#1D9E75] disabled:opacity-60"
          >
            {checkoutLoading ? "…" : "Upgrade"}
          </button>
        ) : null}
      </div>

      {plan === "free" ? (
        <p
          className={`text-[#6B6B63] ${compact ? "mt-2 text-[11px] leading-snug" : "mt-3 text-xs leading-relaxed"}`}
        >
          {compact
            ? `No AI on Free · Pro includes ${PRO_AI_CALL_LIMIT}/mo`
            : `No AI actions on Free — manual edits, heuristic score, and workspace copy still work. Pro includes ${PRO_AI_CALL_LIMIT} AI actions per month.`}
        </p>
      ) : (
        <div className={compact ? "mt-2" : "mt-4"}>
          <div
            className={`flex items-center justify-between text-[#6B6B63] ${compact ? "mb-1 text-[11px]" : "mb-1.5 text-xs"}`}
          >
            <span>AI actions left</span>
            <span className="tabular-nums font-medium text-[#1A1A18]">
              {aiUsage.remaining} / {aiUsage.limit}
              {!compact ? (
                <span className="font-normal text-[#9B9B93]">
                  {" "}
                  ({aiUsage.periodLabel})
                </span>
              ) : (
                <span className="font-normal text-[#9B9B93]">
                  {" "}
                  · {aiUsage.periodLabel}
                </span>
              )}
            </span>
          </div>
          <div
            className={`overflow-hidden rounded-full bg-[#F7F7F5] ${compact ? "h-1.5" : "h-2"}`}
          >
            <div
              className={`h-full rounded-full transition-all ${
                isLow ? "bg-[#B45309]" : "bg-[#0F6E56]"
              }`}
              style={{ width: `${Math.max(pct, aiUsage.used > 0 ? 4 : 0)}%` }}
            />
          </div>
          {!compact ? (
            <p className="mt-2 text-[11px] text-[#9B9B93]">
              {plan === "trial"
                ? `Trial includes ${TRIAL_AI_CALL_LIMIT} actions over ${TRIAL_DAYS} days — enough to try gap fixes, updates, and scoring.`
                : `${PRO_AI_CALL_LIMIT} actions per month — resets at the start of each month.`}
            </p>
          ) : null}
        </div>
      )}

      {showCompareLink ? (
        <Link
          href="/pricing"
          className={`inline-block text-[#0F6E56] hover:underline ${compact ? "mt-2 text-[11px]" : "mt-3 text-xs"}`}
        >
          Compare plans →
        </Link>
      ) : null}
    </div>
  );
}
