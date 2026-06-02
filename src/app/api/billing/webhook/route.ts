import { NextResponse } from "next/server";
import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import {
  resolveUserIdFromSubscription,
} from "@/lib/polar-billing";
import { applyPolarSubscriptionToProfile } from "@/lib/polar-sync";

export const runtime = "nodejs";

function headersRecord(request: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}

async function applySubscription(subscription: Subscription) {
  const userId = await resolveUserIdFromSubscription(subscription);
  if (!userId) {
    console.warn("Polar webhook: could not resolve user for subscription", {
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      metadata: subscription.metadata,
    });
    return;
  }

  await applyPolarSubscriptionToProfile(subscription, userId);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("POLAR_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 500 }
    );
  }

  const body = await request.text();

  try {
    const event = validateEvent(body, headersRecord(request), webhookSecret);

    switch (event.type) {
      case "subscription.active":
      case "subscription.created":
      case "subscription.updated":
      case "subscription.uncanceled":
        await applySubscription(event.data);
        break;
      case "subscription.canceled":
      case "subscription.revoked":
        await applySubscription(event.data);
        break;
      default:
        break;
    }
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error("Polar webhook signature error:", error.message);
      return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
    }

    console.error("Polar webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
