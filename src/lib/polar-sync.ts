import type { CustomerState } from "@polar-sh/sdk/models/components/customerstate.js";
import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import {
  fetchBillingProfile,
  setPlanFromPolar,
} from "@/lib/billing-profile";
import { getPolar, getPolarProProductId } from "@/lib/polar";
import { subscriptionGrantsPro } from "@/lib/polar-billing";

function activeSubscriptions(state: CustomerState) {
  return state.activeSubscriptions;
}

/** Pull active Polar subscription into Supabase (checkout return + webhook fallback). */
export async function syncBillingFromPolar(userId: string): Promise<boolean> {
  const polar = getPolar();
  const proProductId = getPolarProProductId();

  let state: CustomerState;
  try {
    state = await polar.customers.getStateExternal({ externalId: userId });
  } catch (error) {
    console.warn("Polar sync: customer lookup failed", { userId, error });
    return false;
  }

  const proSub = activeSubscriptions(state).find(
    (sub) =>
      (sub.status === "active" || sub.status === "trialing") &&
      sub.productId === proProductId
  );

  if (!proSub) {
    return false;
  }

  await setPlanFromPolar(userId, {
    plan: "pro",
    polarCustomerId: state.id,
    polarSubscriptionId: proSub.id,
  });

  return true;
}

/** Apply a Polar subscription payload (webhooks). */
export async function applyPolarSubscriptionToProfile(
  subscription: Subscription,
  userId: string
) {
  const proProductId = getPolarProProductId();
  const active = subscriptionGrantsPro(subscription, proProductId);

  await setPlanFromPolar(userId, {
    plan: active ? "pro" : "free",
    polarCustomerId: subscription.customerId,
    polarSubscriptionId: active ? subscription.id : null,
  });
}

/** Sync when profile already stores a Polar customer id but plan is stale. */
export async function syncBillingFromPolarIfNeeded(userId: string): Promise<boolean> {
  const row = await fetchBillingProfile(userId, true);
  if (row?.plan === "pro" && row.polar_subscription_id) {
    return true;
  }
  return syncBillingFromPolar(userId);
}
