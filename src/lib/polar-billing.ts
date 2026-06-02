import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import { SubscriptionStatus } from "@polar-sh/sdk/models/components/subscriptionstatus.js";
import {
  findUserIdByExternalId,
  findUserIdByPolarCustomer,
} from "@/lib/billing-profile";

export function metadataUserId(
  metadata?: Record<string, unknown> | null
): string | null {
  if (!metadata) return null;
  const value = metadata.meto_user_id;
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

export async function resolveUserIdFromSubscription(
  subscription: Subscription
): Promise<string | null> {
  const fromMeta = metadataUserId(
    subscription.metadata as Record<string, unknown>
  );
  if (fromMeta) return fromMeta;

  const externalId = subscription.customer?.externalId;
  if (externalId) {
    const byExternal = await findUserIdByExternalId(externalId);
    if (byExternal) return byExternal;
  }

  return findUserIdByPolarCustomer(subscription.customerId);
}

export function subscriptionGrantsPro(
  subscription: Subscription,
  proProductId?: string
): boolean {
  const active =
    subscription.status === SubscriptionStatus.Active ||
    subscription.status === SubscriptionStatus.Trialing;

  if (!active) return false;
  if (proProductId && subscription.productId !== proProductId) return false;
  return true;
}
