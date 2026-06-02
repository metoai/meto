import { getAiUsageSnapshot, resetAiUsageForProUpgrade } from "@/lib/ai-usage";
import { trialEndsAtFromStart } from "@/lib/ai-usage-limits";
import {
  getEntitlements,
  trialEndsAtFromNow,
  type BillingProfileRow,
  type Entitlements,
  type OnboardingAiUsed,
  type Plan,
} from "@/lib/entitlements";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const BILLING_SELECT =
  "id, plan, trial_ends_at, onboarding_ai_used, polar_customer_id, polar_subscription_id, created_at, ai_calls_used, ai_usage_period_start";

export async function fetchBillingProfile(
  userId: string,
  useAdmin = false
): Promise<BillingProfileRow | null> {
  const supabase = useAdmin ? createAdminClient() : createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(BILLING_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as BillingProfileRow | null;
}

/** Initialize trial on first access; expire trial → free when past end. */
export async function syncBillingState(
  userId: string
): Promise<BillingProfileRow> {
  const admin = createAdminClient();
  let row = await fetchBillingProfile(userId, true);

  if (!row) {
    const trialEndsAt = trialEndsAtFromNow();
    const now = new Date().toISOString();
    const { data, error } = await admin
      .from("profiles")
      .upsert(
        {
          id: userId,
          plan: "trial",
          trial_ends_at: trialEndsAt,
          ai_calls_used: 0,
          ai_usage_period_start: now,
        },
        { onConflict: "id" }
      )
      .select(BILLING_SELECT)
      .single();

    if (error) throw error;
    return data as BillingProfileRow;
  }

  const updates: Record<string, string> = {};
  const now = new Date();
  const nowIso = now.toISOString();

  if (row.plan === "trial") {
    const trialStart =
      row.ai_usage_period_start ?? row.created_at ?? nowIso;
    const correctEnd = trialEndsAtFromStart(trialStart);

    if (!row.ai_usage_period_start) {
      updates.ai_usage_period_start = trialStart;
    }

    if (
      !row.trial_ends_at ||
      new Date(row.trial_ends_at).getTime() > new Date(correctEnd).getTime()
    ) {
      updates.trial_ends_at = correctEnd;
    }
  }

  if (
    row.plan === "trial" &&
    row.trial_ends_at &&
    new Date(row.trial_ends_at) <= now &&
    !row.polar_subscription_id
  ) {
    updates.plan = "free";
  }

  if (Object.keys(updates).length > 0) {
    updates.updated_at = now.toISOString();
    const { data, error } = await admin
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select(BILLING_SELECT)
      .single();

    if (error) throw error;
    row = data as BillingProfileRow;
  }

  return row;
}

export async function getEntitlementsForUser(
  userId: string
): Promise<Entitlements> {
  const row = await syncBillingState(userId);
  const usage = await getAiUsageSnapshot(userId);
  return getEntitlements(row, usage);
}

export async function markOnboardingAiUsed(
  userId: string,
  method: OnboardingAiUsed
) {
  if (!method) return;
  const admin = createAdminClient();
  const row = await fetchBillingProfile(userId, true);
  if (row?.onboarding_ai_used) return;

  await admin
    .from("profiles")
    .update({
      onboarding_ai_used: method,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

export async function setPlanFromPolar(
  userId: string,
  params: {
    plan: Plan;
    polarCustomerId?: string | null;
    polarSubscriptionId?: string | null;
  }
) {
  const admin = createAdminClient();
  const updates: Record<string, string | null> = {
    plan: params.plan,
    updated_at: new Date().toISOString(),
  };

  if (params.polarCustomerId !== undefined) {
    updates.polar_customer_id = params.polarCustomerId;
  }
  if (params.polarSubscriptionId !== undefined) {
    updates.polar_subscription_id = params.polarSubscriptionId;
  }

  await admin.from("profiles").update(updates).eq("id", userId);

  if (params.plan === "pro") {
    await resetAiUsageForProUpgrade(userId);
  }
}

export async function findUserIdByPolarCustomer(
  customerId: string
): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("polar_customer_id", customerId)
    .maybeSingle();

  return data?.id ?? null;
}

export async function findUserIdByExternalId(
  externalId: string
): Promise<string | null> {
  if (!externalId) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("id", externalId)
    .maybeSingle();

  return data?.id ?? null;
}
