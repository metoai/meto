import { NextResponse } from "next/server";
import {
  aiLimitForPlan,
  PRO_AI_CALL_LIMIT,
  startOfUtcMonth,
  trialStartedAt,
  TRIAL_AI_CALL_LIMIT,
} from "@/lib/ai-usage-limits";
import type { BillingFeature, Plan } from "@/lib/entitlements";
import { getEntitlements, hasProAccess, type BillingProfileRow } from "@/lib/entitlements";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncBillingState } from "@/lib/billing-profile";

export type AiUsageSnapshot = {
  used: number;
  limit: number;
  remaining: number;
  periodStart: string | null;
  periodLabel: string;
};

const USAGE_SELECT =
  "id, plan, trial_ends_at, onboarding_ai_used, polar_customer_id, polar_subscription_id, created_at, ai_calls_used, ai_usage_period_start";

type UsageRow = BillingProfileRow & {
  ai_calls_used: number;
  ai_usage_period_start: string | null;
};

function periodLabel(effectivePlan: Plan): string {
  if (effectivePlan === "trial") return "3-day trial";
  if (effectivePlan === "pro") return "this month";
  return "free plan";
}

function expectedPeriodStart(
  row: UsageRow,
  effectivePlan: Plan
): Date | null {
  if (effectivePlan === "pro") {
    return startOfUtcMonth();
  }
  if (effectivePlan === "trial") {
    return trialStartedAt(
      row.trial_ends_at,
      row.ai_usage_period_start,
      row.created_at
    );
  }
  return null;
}

function shouldResetPeriod(
  row: UsageRow,
  effectivePlan: Plan
): boolean {
  const expected = expectedPeriodStart(row, effectivePlan);
  if (!expected) return false;

  if (!row.ai_usage_period_start) return true;

  const current = new Date(row.ai_usage_period_start);
  return current.getTime() !== expected.getTime();
}

export async function syncAiUsagePeriod(userId: string): Promise<UsageRow> {
  const row = (await syncBillingState(userId)) as UsageRow;
  const admin = createAdminClient();

  const { data: usageRow } = await admin
    .from("profiles")
    .select("ai_calls_used, ai_usage_period_start")
    .eq("id", userId)
    .single();

  const full: UsageRow = {
    ...row,
    ai_calls_used: usageRow?.ai_calls_used ?? 0,
    ai_usage_period_start: usageRow?.ai_usage_period_start ?? null,
  };

  const effective = getEntitlements(full).plan;

  if (shouldResetPeriod(full, effective)) {
    const expected = expectedPeriodStart(full, effective)!;
    const { data, error } = await admin
      .from("profiles")
      .update({
        ai_calls_used: 0,
        ai_usage_period_start: expected.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select(USAGE_SELECT)
      .single();

    if (error) throw error;
    return data as UsageRow;
  }

  if (effective !== "free" && !full.ai_usage_period_start) {
    const expected = expectedPeriodStart(full, effective);
    if (expected) {
      const { data, error } = await admin
        .from("profiles")
        .update({
          ai_usage_period_start: expected.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select(USAGE_SELECT)
        .single();

      if (error) throw error;
      return data as UsageRow;
    }
  }

  return full;
}

export async function getAiUsageSnapshot(
  userId: string
): Promise<AiUsageSnapshot> {
  const row = await syncAiUsagePeriod(userId);
  const effective = getEntitlements(row).plan;
  const limit = aiLimitForPlan(effective);
  const used = row.ai_calls_used ?? 0;

  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    periodStart: row.ai_usage_period_start,
    periodLabel: periodLabel(effective),
  };
}

export async function resetAiUsageForProUpgrade(userId: string) {
  const admin = createAdminClient();
  const now = startOfUtcMonth();
  await admin
    .from("profiles")
    .update({
      ai_calls_used: 0,
      ai_usage_period_start: now.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

export type AiAccessResult =
  | { ok: true; row: UsageRow; usage: AiUsageSnapshot }
  | { ok: false; response: NextResponse };

/** Gate LLM routes: must have Pro/trial access and remaining AI quota. */
export async function assertAiAccess(
  userId: string,
  feature: BillingFeature
): Promise<AiAccessResult> {
  const row = await syncAiUsagePeriod(userId);
  const entitlements = getEntitlements(row);
  const proAccess = hasProAccess(row.plan, row.trial_ends_at);

  if (!proAccess) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Upgrade to Meto Pro to use this feature.",
          code: "UPGRADE_REQUIRED",
          feature,
        },
        { status: 402 }
      ),
    };
  }

  const usage = entitlements.aiUsage;

  if (usage.remaining <= 0) {
    const isTrial = entitlements.plan === "trial";
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: isTrial
            ? `You've used all ${TRIAL_AI_CALL_LIMIT} AI actions on your 3-day trial. Upgrade to Pro for ${PRO_AI_CALL_LIMIT}/month.`
            : `You've used all ${PRO_AI_CALL_LIMIT} AI actions this month. Your limit resets next month.`,
          code: "AI_LIMIT_REACHED",
          feature,
          usage,
        },
        { status: 402 }
      ),
    };
  }

  return { ok: true, row, usage };
}

/** Call after a successful LLM operation (one HTTP request = one call). */
export async function recordAiUsage(userId: string, units = 1) {
  const admin = createAdminClient();
  const row = await syncAiUsagePeriod(userId);
  const used = (row.ai_calls_used ?? 0) + units;

  await admin
    .from("profiles")
    .update({
      ai_calls_used: used,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}
