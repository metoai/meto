"use client";

import Link from "next/link";
import { useState } from "react";
import type { Entitlements } from "@/lib/entitlements";
import { openProCheckout } from "@/lib/billing-client";
import { TRIAL_DAYS } from "@/lib/ai-usage-limits";

type TrialBannerProps = {
  entitlements: Entitlements;
};

export function TrialBanner({ entitlements }: TrialBannerProps) {
  const [loading, setLoading] = useState(false);

  if (!entitlements.showTrialBanner && entitlements.plan !== "free") {
    return null;
  }

  if (entitlements.plan === "pro") {
    return null;
  }

  const urgent = entitlements.showUpgradeUrgency;
  const daysLeft = entitlements.trialDaysLeft;

  if (entitlements.plan === "free") {
    return (
      <div className="shrink-0 border-b border-[#F5D0A8] bg-[#FFF8ED] px-4 py-2.5 md:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[#7A4E00]">
            Your Pro trial ended. AI updates, gap fixes, and smart scoring are
            paused — manual edits and workspace copy still work.
          </p>
          <UpgradeButton loading={loading} setLoading={setLoading} label="Upgrade to Pro" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 border-b px-4 py-2.5 md:px-6 ${
        urgent
          ? "border-[#F5D0A8] bg-[#FFF8ED]"
          : "border-[#C0E0D8] bg-[#E8F5F0]"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-[13px] ${urgent ? "text-[#7A4E00]" : "text-[#0F6E56]"}`}
        >
          {urgent ? (
            <>
              <strong>
                {daysLeft} day{daysLeft === 1 ? "" : "s"} left
              </strong>{" "}
              on your trial · {entitlements.aiUsage.remaining} AI actions left.
              Subscribe to keep Pro after the trial ends.
            </>
          ) : (
            <>
              <strong>{TRIAL_DAYS}-day trial</strong> — {daysLeft} day
              {daysLeft === 1 ? "" : "s"} left ·{" "}
              {entitlements.aiUsage.remaining} AI actions remaining
            </>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/pricing"
            className="text-[13px] text-[#6B6B63] underline-offset-2 hover:underline"
          >
            Compare plans
          </Link>
          {urgent ? (
            <UpgradeButton
              loading={loading}
              setLoading={setLoading}
              label="Subscribe now"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function UpgradeButton({
  loading,
  setLoading,
  label,
}: {
  loading: boolean;
  setLoading: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        void openProCheckout().catch(() => setLoading(false));
      }}
      className="rounded-lg bg-[#0F6E56] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#1D9E75] disabled:opacity-60"
    >
      {loading ? "Loading…" : label}
    </button>
  );
}
