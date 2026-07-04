/**
 * Webhook Events (#12)
 * Fires signed webhooks when the user's profile changes.
 *
 * Payload is signed with HMAC-SHA256 using the user's webhook secret.
 * Consumers verify: X-Meto-Signature: sha256=<hex>
 */

const WEBHOOK_TIMEOUT_MS = 5000;

export type WebhookEventType =
  | "profile.section_updated"
  | "profile.score_changed"
  | "project.decision_added"
  | "profile.conflict_detected";

export type WebhookPayload = {
  event: WebhookEventType;
  user_id: string;
  timestamp: string;
  data: Record<string, unknown>;
};

/**
 * Sign a webhook payload with HMAC-SHA256.
 * Returns the hex digest used in X-Meto-Signature header.
 */
async function signPayload(secret: string, body: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(body)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Deliver a webhook to a single endpoint.
 * Fires and forgets — does not throw on delivery failure.
 */
export async function deliverWebhook(
  url: string,
  secret: string,
  payload: WebhookPayload
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const body = JSON.stringify(payload);
  const signature = await signPayload(secret, body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Meto-Signature": `sha256=${signature}`,
        "X-Meto-Event": payload.event,
        "User-Agent": "Meto-Webhooks/1.0",
      },
      body,
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    return { ok: response.ok, status: response.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

/**
 * Fire webhooks for a user event.
 * Loads registered webhook URLs from DB and delivers in parallel.
 * Never throws — all errors are caught and logged.
 */
export async function fireWebhooks(
  supabase: Parameters<typeof import("@supabase/supabase-js").createClient>[2] extends undefined
    ? never
    : import("@supabase/supabase-js").SupabaseClient,
  userId: string,
  event: WebhookEventType,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const { data: webhooks } = await (supabase as import("@supabase/supabase-js").SupabaseClient)
      .from("profile_webhooks")
      .select("url, secret")
      .eq("user_id", userId)
      .eq("active", true)
      .contains("events", [event]);

    if (!webhooks?.length) return;

    const payload: WebhookPayload = {
      event,
      user_id: userId,
      timestamp: new Date().toISOString(),
      data,
    };

    await Promise.allSettled(
      webhooks.map(({ url, secret }: { url: string; secret: string }) =>
        deliverWebhook(url, secret, payload)
      )
    );
  } catch (error) {
    console.error("fireWebhooks error:", error);
  }
}
