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
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendProSubscriptionEmail,
  sendSubscriptionCanceledEmail,
} from "@/lib/email";

export const runtime = "nodejs";

function headersRecord(request: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}

async function applySubscription(subscription: Subscription, eventType: string) {
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

  // Send transactional email to the user
  try {
    const admin = createAdminClient();
    const { data: authUser } = await admin.auth.admin.getUserById(userId);
    const email = authUser?.user?.email;
    const name =
      (authUser?.user?.user_metadata?.full_name as string | undefined) ||
      (authUser?.user?.user_metadata?.name as string | undefined) ||
      email?.split("@")[0];

    if (email) {
      if (
        eventType === "subscription.created" ||
        eventType === "subscription.active"
      ) {
        void sendProSubscriptionEmail({
          to: email,
          name,
          subscriptionId: subscription.id,
        });
      } else if (
        eventType === "subscription.canceled" ||
        eventType === "subscription.revoked"
      ) {
        void sendSubscriptionCanceledEmail({
          to: email,
          name,
        });
      }
    }
  } catch (err) {
    console.error("Failed to send billing email:", err);
  }
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
        await applySubscription(event.data, event.type);
        break;
      case "subscription.canceled":
      case "subscription.revoked":
        await applySubscription(event.data, event.type);
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
