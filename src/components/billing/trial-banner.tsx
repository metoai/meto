"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Entitlements } from "@/lib/entitlements";
import { openProCheckout } from "@/lib/billing-client";
import { TRIAL_DAYS } from "@/lib/ai-usage-limits";

const DISMISS_KEY = "meto-upgrade-banner-hidden";

type TrialBannerProps = {
  entitlements: Entitlements;
};

export function TrialBanner({ entitlements }: TrialBannerProps) {
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function handleDismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (dismissed) {
    return null;
  }

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
          <div className="flex shrink-0 items-center gap-2">
            <UpgradeButton loading={loading} setLoading={setLoading} label="Upgrade to Pro" />
            <button
              type="button"
              onClick={handleDismiss}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#7A4E00]/70 hover:bg-[#F5D0A8]/50 hover:text-[#7A4E00] active:scale-[0.97] transition-all duration-150"
              aria-label="Hide upgrade notice"
              title="Hide upgrade notice"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 border-b px-4 py-2.5 md:px-6 ${
        urgent
          ? "border-[#F5D0A8] bg-[#FFF8ED]"
          : "border-[var(--accent-border)] bg-[var(--primary-light)]"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-[13px] ${urgent ? "text-[#7A4E00]" : "text-[var(--primary)]"}`}
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
            className="text-[13px] text-[var(--text-secondary)] underline-offset-2 hover:underline"
          >
            Compare plans
          </Link>
          <UpgradeButton
            loading={loading}
            setLoading={setLoading}
            label={urgent ? "Subscribe now" : "Upgrade to Pro"}
          />
          <button
            type="button"
            onClick={handleDismiss}
            className={`flex h-7 w-7 items-center justify-center rounded-lg active:scale-[0.97] transition-all duration-150 ${
              urgent
                ? "text-[#7A4E00]/70 hover:bg-[#F5D0A8]/50 hover:text-[#7A4E00]"
                : "text-[var(--primary)]/70 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
            }`}
            aria-label="Hide upgrade notice"
            title="Hide upgrade notice"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
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
      className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
    >
      {loading ? "Loading…" : label}
    </button>
  );
}
