import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not defined in the environment.");
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Meto <hello@mail.metoai.site>";

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  from?: string;
  replyTo?: string | string[];
  idempotencyKey?: string;
  tags?: Array<{ name: string; value: string }>;
} & ({ html: string; text?: string } | { text: string; html?: string });

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Sends an email via Resend with exponential backoff on 429 / 5xx errors.
 * Never throws — returns `{ success, id, error }`.
 */
export async function sendEmail(
  options: SendEmailOptions,
  maxRetries = 2
): Promise<SendEmailResult> {
  const from = options.from || DEFAULT_FROM_EMAIL;
  const to = Array.isArray(options.to) ? options.to : [options.to];

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const resend = getResendClient();
      const basePayload = {
        from,
        to,
        subject: options.subject,
        replyTo: options.replyTo,
        tags: options.tags,
      };

      const payload =
        "html" in options && options.html
          ? { ...basePayload, html: options.html, text: options.text }
          : { ...basePayload, text: options.text || "" };

      const { data, error } = await resend.emails.send(
        payload,
        options.idempotencyKey
          ? { idempotencyKey: options.idempotencyKey }
          : undefined
      );

      if (error) {
        // If rate limited or 5xx, retry with backoff
        const isRetryable =
          error.name === "rate_limit_exceeded" ||
          error.name === "internal_server_error";

        if (isRetryable && attempt < maxRetries) {
          const delayMs = Math.pow(2, attempt) * 1000;
          await new Promise((r) => setTimeout(r, delayMs));
          attempt++;
          continue;
        }

        console.error("[Email] Resend send error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data?.id };
    } catch (err) {
      console.error("[Email] Exception sending email:", err);
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000;
        await new Promise((r) => setTimeout(r, delayMs));
        attempt++;
        continue;
      }
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown send error",
      };
    }
  }

  return { success: false, error: "Exceeded max retries" };
}

/**
 * Sends welcome email to newly onboarded developers & AI users.
 * Does not block caller flow.
 */
export async function sendWelcomeEmail(params: {
  to: string;
  name?: string;
}): Promise<SendEmailResult> {
  const displayName = params.name || "there";
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #111;">
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Welcome to Meto, ${displayName}!</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #444;">
        Your universal AI context and memory layer is now ready. With Meto, you maintain one persistent developer identity and set of architectural rules across Cursor, Claude Code, Windsurf, ChatGPT, and Gemini.
      </p>
      <div style="margin: 24px 0; padding: 16px; background-color: #f6f6f7; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #222;">Quick Start in your terminal:</p>
        <code style="font-family: ui-monospace, Menlo, Monaco, monospace; font-size: 13px; background: #fff; padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e2e5; display: inline-block;">
          npx meto-cli login
        </code>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #444;">
        Need help connecting your IDE or setting up shared team rules? Check out our <a href="https://www.metoai.site/integrations" style="color: #ff5500; text-decoration: underline;">Integrations Directory</a> or reply directly to this email.
      </p>
      <p style="font-size: 13px; color: #888; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
        Meto — One context for all AIs.
      </p>
    </div>
  `;

  return sendEmail({
    to: params.to,
    subject: "Welcome to Meto — Your Universal AI Context Layer",
    html,
    idempotencyKey: `welcome/${params.to}`,
  });
}
