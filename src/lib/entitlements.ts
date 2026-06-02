import {
  aiLimitForPlan,
  TRIAL_DAYS,
  trialEndsAtFromStart,
} from "@/lib/ai-usage-limits";
import type { AiUsageSnapshot } from "@/lib/ai-usage";

export type Plan = "trial" | "free" | "pro";

export type OnboardingAiUsed = "brain_dump" | "chat" | null;

export type BillingFeature =
  | "gap_fix"
  | "quick_update"
  | "llm_score"
  | "llm_compile"
  | "onboarding_ai"
  | "custom_sections";

export type BillingProfileRow = {
  id: string;
  plan: Plan;
  trial_ends_at: string | null;
  onboarding_ai_used: OnboardingAiUsed;
  polar_customer_id: string | null;
  polar_subscription_id: string | null;
  created_at?: string;
  ai_calls_used?: number;
  ai_usage_period_start?: string | null;
};

export type Entitlements = {
  plan: Plan;
  isProAccess: boolean;
  trialEndsAt: string | null;
  trialDaysLeft: number;
  canUseLlmScore: boolean;
  canUseUpdateChat: boolean;
  canUseLlmCompile: boolean;
  canRedoOnboardingAi: boolean;
  maxCustomSections: number;
  showTrialBanner: boolean;
  showUpgradeUrgency: boolean;
  onboardingAiUsed: OnboardingAiUsed;
  aiUsage: AiUsageSnapshot;
};

/** Urgent banner on the last day of a 3-day trial. */
export const UPGRADE_URGENCY_DAYS_LEFT = 1;

export { TRIAL_DAYS };

export function isGrandfatheredPro(): boolean {
  return process.env.METO_GRANDFATHER_PRO === "true";
}

export function trialEndsAtFromNow(): string {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() + TRIAL_DAYS);
  return end.toISOString();
}

export function isTrialActive(
  plan: Plan,
  trialEndsAt: string | null
): boolean {
  if (plan !== "trial") return false;
  if (!trialEndsAt) return true;
  return new Date(trialEndsAt).getTime() > Date.now();
}

export function trialDaysLeft(
  trialEndsAt: string | null,
  trialPeriodStart?: string | null
): number {
  if (!trialEndsAt) return TRIAL_DAYS;
  const endMs = new Date(trialEndsAt).getTime();
  const now = Date.now();
  if (trialPeriodStart) {
    const cappedEnd = new Date(trialEndsAtFromStart(trialPeriodStart)).getTime();
    const ms = Math.min(endMs, cappedEnd) - now;
    return Math.max(0, Math.min(TRIAL_DAYS, Math.ceil(ms / (1000 * 60 * 60 * 24))));
  }
  const ms = endMs - now;
  return Math.max(0, Math.min(TRIAL_DAYS, Math.ceil(ms / (1000 * 60 * 60 * 24))));
}

export function hasProAccess(
  plan: Plan,
  trialEndsAt: string | null
): boolean {
  if (isGrandfatheredPro()) return true;
  if (plan === "pro") return true;
  return isTrialActive(plan, trialEndsAt);
}

export function effectivePlan(
  plan: Plan,
  trialEndsAt: string | null
): Plan {
  if (plan === "pro" || isGrandfatheredPro()) return "pro";
  if (isTrialActive(plan, trialEndsAt)) return "trial";
  if (plan === "trial") return "free";
  return plan;
}

function buildUsageSnapshot(
  row: BillingProfileRow,
  effective: Plan
): AiUsageSnapshot {
  const limit = isGrandfatheredPro() ? 999_999 : aiLimitForPlan(effective);
  const used = row.ai_calls_used ?? 0;
  const periodLabel =
    effective === "trial"
      ? "3-day trial"
      : effective === "pro"
        ? "this month"
        : "free plan";

  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    periodStart: row.ai_usage_period_start ?? null,
    periodLabel,
  };
}

export function getEntitlements(
  row: BillingProfileRow,
  usageOverride?: AiUsageSnapshot
): Entitlements {
  const plan = row.plan ?? "free";
  const trialEndsAt = row.trial_ends_at;
  const effective = effectivePlan(plan, trialEndsAt);
  const isProAccess = hasProAccess(plan, trialEndsAt);
  const daysLeft = trialDaysLeft(trialEndsAt, row.ai_usage_period_start);
  const onboardingAiUsed = row.onboarding_ai_used ?? null;
  const aiUsage =
    usageOverride ?? buildUsageSnapshot(row, effective);
  const hasAiQuota = isProAccess && aiUsage.remaining > 0;

  return {
    plan: effective,
    isProAccess,
    trialEndsAt,
    trialDaysLeft: daysLeft,
    canUseLlmScore: hasAiQuota,
    canUseUpdateChat: hasAiQuota,
    canUseLlmCompile: hasAiQuota,
    canRedoOnboardingAi: hasAiQuota && !onboardingAiUsed,
    maxCustomSections: isProAccess ? 5 : 1,
    showTrialBanner: effective === "trial" && daysLeft > 0,
    showUpgradeUrgency:
      effective === "trial" && daysLeft > 0 && daysLeft <= UPGRADE_URGENCY_DAYS_LEFT,
    onboardingAiUsed,
    aiUsage,
  };
}

export function featureForEntitlement(
  key: keyof Pick<
    Entitlements,
    | "canUseLlmScore"
    | "canUseUpdateChat"
    | "canUseLlmCompile"
    | "canRedoOnboardingAi"
  >
): BillingFeature {
  switch (key) {
    case "canUseLlmScore":
      return "llm_score";
    case "canUseUpdateChat":
      return "quick_update";
    case "canUseLlmCompile":
      return "llm_compile";
    case "canRedoOnboardingAi":
      return "onboarding_ai";
    default:
      return "quick_update";
  }
}
