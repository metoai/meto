import { Resend } from "resend";
import { getSiteUrl } from "./site";

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

/* =========================================================================
   Email Templates & Notification Triggers
   ========================================================================= */

function emailWrapper(contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 32px 16px; color: #111827; }
    .card { background-color: #ffffff; max-width: 540px; margin: 0 auto; border-radius: 12px; border: 1px solid #e5e7eb; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px; padding: 10px 20px; margin: 16px 0; }
    .btn:hover { background-color: #1e293b; }
    .code-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 13px; color: #0f172a; margin: 16px 0; }
    .footer { max-width: 540px; margin: 24px auto 0; text-align: center; font-size: 12px; color: #9ca3af; }
    .footer a { color: #6b7280; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div style="margin-bottom: 24px;">
      <span style="font-weight: 700; font-size: 18px; letter-spacing: -0.02em; color: #0f172a;">Meto</span>
      <span style="color: #ea580c; font-weight: 600; font-size: 14px; margin-left: 6px;">AI Memory</span>
    </div>
    ${contentHtml}
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Meto. One context for all AIs.</p>
    <p><a href="${getSiteUrl()}/settings">Settings</a> · <a href="${getSiteUrl()}/integrations">Integrations</a> · <a href="${getSiteUrl()}/privacy">Privacy</a></p>
  </div>
</body>
</html>`;
}

/**
 * 1. Welcome / Onboarding Complete Email
 */
export async function sendWelcomeEmail(params: {
  to: string;
  name?: string;
}): Promise<SendEmailResult> {
  const displayName = params.name || "there";
  const html = emailWrapper(`
    <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #0f172a;">Welcome to Meto, ${displayName}!</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      Your universal AI context and memory layer is now active. Meto syncs your developer seniority, stack conventions, and architectural decisions across Cursor, Claude Code, Windsurf, ChatGPT, and Gemini with zero context rot.
    </p>

    <div class="code-box">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #64748b; margin-bottom: 6px;">Quick Start in Terminal</div>
      <code>npx meto-cli login</code>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 16px 0;">
      Once logged in, simply run <code>npx meto-cli sync</code> in any project repository to compile <code>.cursor/rules/*.mdc</code>, <code>CLAUDE.md</code>, and <code>.windsurfrules</code> automatically.
    </p>

    <a href="${getSiteUrl()}/dashboard" class="btn">Open Your Meto Dashboard</a>

    <p style="font-size: 13px; color: #6b7280; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
      Need assistance? Reply directly to this email or explore our <a href="${getSiteUrl()}/integrations" style="color: #ea580c;">Integrations Guides</a>.
    </p>
  `);

  return sendEmail({
    to: params.to,
    subject: "Welcome to Meto — Your Universal AI Context Layer",
    html,
    text: `Welcome to Meto, ${displayName}! Your universal AI context and memory layer is now active. Run 'npx meto-cli login' in your terminal to connect your IDEs. Dashboard: ${getSiteUrl()}/dashboard`,
    idempotencyKey: `welcome/${params.to}`,
  });
}

/**
 * 2. Subscription Upgraded to Pro
 */
export async function sendProSubscriptionEmail(params: {
  to: string;
  name?: string;
  subscriptionId?: string;
}): Promise<SendEmailResult> {
  const displayName = params.name || "there";
  const html = emailWrapper(`
    <div style="display: inline-block; background-color: #fef2f2; color: #ea580c; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; margin-bottom: 12px;">Meto Pro Active</div>
    <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #0f172a;">You're on Meto Pro! 🚀</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      Hi ${displayName}, thank you for supporting Meto. Your subscription has been activated and your account now has unlimited access to all Pro capabilities:
    </p>

    <ul style="font-size: 14px; line-height: 1.8; color: #374151; padding-left: 20px; margin: 0 0 20px;">
      <li><strong>Unlimited Multi-IDE Sync:</strong> Real-time rules compilation for Cursor, Claude Code, Windsurf, and Copilot.</li>
      <li><strong>Team Context Registry:</strong> Share architectural decisions and antipatterns across your repositories.</li>
      <li><strong>Deep Knowledge Graph:</strong> Context Health Audits and conflict resolution.</li>
      <li><strong>Universal Chatbot Presets:</strong> Live sync for ChatGPT Plus, Claude Projects, and Gemini.</li>
    </ul>

    <a href="${getSiteUrl()}/dashboard" class="btn">Go to Dashboard</a>
  `);

  return sendEmail({
    to: params.to,
    subject: "You're now on Meto Pro — Welcome to unlimited AI context sync",
    html,
    text: `Hi ${displayName}, your Meto Pro subscription is now active! You now have unlimited multi-IDE sync, team context, and deep knowledge graph. Access your dashboard at ${getSiteUrl()}/dashboard`,
    idempotencyKey: `sub-active/${params.to}/${params.subscriptionId || "now"}`,
  });
}

/**
 * 3. Subscription Canceled
 */
export async function sendSubscriptionCanceledEmail(params: {
  to: string;
  name?: string;
}): Promise<SendEmailResult> {
  const displayName = params.name || "there";
  const html = emailWrapper(`
    <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 12px; color: #0f172a;">Meto Pro Subscription Canceled</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      Hi ${displayName}, your Meto Pro subscription has been canceled. You will continue to retain Pro access until the end of your current billing period.
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      After that, your account will switch to the Free tier. Your existing sections and rules will remain completely safe.
    </p>
    <a href="${getSiteUrl()}/pricing" class="btn">Manage Subscription</a>
  `);

  return sendEmail({
    to: params.to,
    subject: "Meto Pro Subscription Canceled",
    html,
    text: `Hi ${displayName}, your Meto Pro subscription has been canceled. You retain Pro access until your current billing period ends. Your data remains safe.`,
    idempotencyKey: `sub-canceled/${params.to}/${Date.now()}`,
  });
}

/**
 * 4. Terminal CLI Session Approved (Security Alert)
 */
export async function sendCliLoginAlertEmail(params: {
  to: string;
  username: string;
  deviceCode: string;
}): Promise<SendEmailResult> {
  const timestamp = new Date().toUTCString();
  const html = emailWrapper(`
    <div style="display: inline-block; background-color: #f0fdf4; color: #16a34a; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; margin-bottom: 12px;">Security Notification</div>
    <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 12px; color: #0f172a;">New Terminal Authorized for @${params.username}</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      A new terminal CLI session was just authorized for your Meto account.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #334155; margin: 16px 0;">
      <div><strong>Authorization Code:</strong> <code>${params.deviceCode}</code></div>
      <div style="margin-top: 4px;"><strong>Time:</strong> ${timestamp}</div>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #64748b;">
      If you authorized this session via <code>npx meto-cli login</code>, no action is needed. If you did not make this request, you can revoke your MCP token immediately in Settings.
    </p>

    <a href="${getSiteUrl()}/settings" class="btn">Review Active Access</a>
  `);

  return sendEmail({
    to: params.to,
    subject: `Security Alert: New Terminal CLI session approved for @${params.username}`,
    html,
    text: `A new terminal CLI session (code: ${params.deviceCode}) was authorized for your Meto account @${params.username} at ${timestamp}. Review your access: ${getSiteUrl()}/settings`,
    idempotencyKey: `cli-auth/${params.deviceCode}`,
  });
}

/**
 * 5. MCP Token Rotated or Revoked (Security Alert)
 */
export async function sendMcpTokenAlertEmail(params: {
  to: string;
  username: string;
  action: "generated" | "rotated" | "revoked";
}): Promise<SendEmailResult> {
  const timestamp = new Date().toUTCString();
  const actionText =
    params.action === "revoked"
      ? "revoked"
      : params.action === "rotated"
      ? "regenerated"
      : "generated";

  const html = emailWrapper(`
    <div style="display: inline-block; background-color: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; margin-bottom: 12px;">Security Notification</div>
    <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 12px; color: #0f172a;">MCP Access Token ${actionText}</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      The Model Context Protocol (MCP) access token for <strong>@${params.username}</strong> was ${actionText} on ${timestamp}.
    </p>

    ${
      params.action === "revoked"
        ? `<p style="font-size: 13px; color: #dc2626;">All IDE connections (Cursor, Windsurf, Claude Desktop) using this token have lost access until a new token is created.</p>`
        : `<p style="font-size: 13px; color: #4b5563;">If you have IDEs configured, make sure to update their MCP configuration with your new token.</p>`
    }

    <a href="${getSiteUrl()}/settings" class="btn">View MCP Settings</a>
  `);

  return sendEmail({
    to: params.to,
    subject: `Security Alert: MCP access token ${actionText} for @${params.username}`,
    html,
    text: `Your MCP access token for @${params.username} was ${actionText} on ${timestamp}. Review settings at ${getSiteUrl()}/settings`,
    idempotencyKey: `mcp-token-${params.action}/${params.to}/${Date.now()}`,
  });
}

/**
 * 6. Trial Expiration Warning Email
 */
export async function sendTrialExpiringEmail(params: {
  to: string;
  name?: string;
  daysLeft: number;
}): Promise<SendEmailResult> {
  const displayName = params.name || "there";
  const html = emailWrapper(`
    <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 12px; color: #0f172a;">Your Meto Pro Trial Ends in ${params.daysLeft} Day${params.daysLeft === 1 ? "" : "s"}</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      Hi ${displayName}, your 14-day Meto Pro trial is wrapping up soon. To keep unlimited multi-IDE rules synchronization, team context sharing, and deep knowledge graph active, upgrade to Meto Pro.
    </p>
    <a href="${getSiteUrl()}/pricing" class="btn">Upgrade to Meto Pro</a>
  `);

  return sendEmail({
    to: params.to,
    subject: `Reminder: Your Meto Pro trial ends in ${params.daysLeft} days`,
    html,
    text: `Hi ${displayName}, your Meto Pro trial ends in ${params.daysLeft} days. Upgrade at ${getSiteUrl()}/pricing to keep unlimited multi-IDE sync active.`,
    idempotencyKey: `trial-warning/${params.to}/${params.daysLeft}d`,
  });
}

export const SUPPORT_ADMIN_EMAIL =
  process.env.SUPPORT_ADMIN_EMAIL || "metoaipr@gmail.com";

/**
 * 7. Support Inquiry Admin Alert (Notifies Founder at metoaipr@gmail.com)
 */
export async function sendSupportInquiryEmail(params: {
  customerEmail: string;
  customerName?: string;
  category: string;
  subject: string;
  message: string;
  metadata?: {
    username?: string;
    userId?: string;
    url?: string;
    userAgent?: string;
  };
}): Promise<SendEmailResult> {
  const categoryLabelMap: Record<string, string> = {
    mcp_setup: "🛠️ MCP / CLI Setup",
    bug: "🐛 Bug Report",
    billing: "💳 Billing / Account",
    feature: "💡 Feature Request",
    general: "💬 General Support",
  };
  const categoryLabel = categoryLabelMap[params.category] || params.category;
  const nameLabel = params.customerName
    ? `${params.customerName} (${params.customerEmail})`
    : params.customerEmail;
  const timestamp = new Date().toUTCString();

  const html = emailWrapper(`
    <div style="background-color: #f1f5f9; border-left: 4px solid #ea580c; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #ea580c; letter-spacing: 0.05em;">New Customer Inquiry</div>
      <div style="font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 2px;">${categoryLabel}</div>
    </div>

    <h2 style="font-size: 16px; font-weight: 600; margin: 0 0 16px; color: #0f172a;">${params.subject}</h2>

    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${params.message}</div>

    <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #64748b; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
      <tr>
        <td style="padding: 4px 0; font-weight: 600; width: 100px;">From:</td>
        <td style="padding: 4px 0; color: #0f172a;"><a href="mailto:${params.customerEmail}">${nameLabel}</a></td>
      </tr>
      ${
        params.metadata?.username
          ? `
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Meto User:</td>
        <td style="padding: 4px 0; color: #0f172a;">@${params.metadata.username}</td>
      </tr>`
          : ""
      }
      ${
        params.metadata?.url
          ? `
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Page Route:</td>
        <td style="padding: 4px 0;">${params.metadata.url}</td>
      </tr>`
          : ""
      }
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Received:</td>
        <td style="padding: 4px 0;">${timestamp}</td>
      </tr>
    </table>

    <div style="margin-top: 24px; text-align: center;">
      <a href="mailto:${params.customerEmail}?subject=Re: ${encodeURIComponent(params.subject)}" class="btn">Reply Directly to ${params.customerEmail}</a>
    </div>
  `);

  return sendEmail({
    to: SUPPORT_ADMIN_EMAIL,
    replyTo: params.customerEmail,
    subject: `[Meto Support: ${categoryLabel}] ${params.subject}`,
    html,
    text: `New support inquiry from ${nameLabel}\nCategory: ${categoryLabel}\nSubject: ${params.subject}\n\nMessage:\n${params.message}\n\nUser: @${params.metadata?.username || "Guest"}\nURL: ${params.metadata?.url || "N/A"}`,
  });
}

/**
 * 8. Customer Support Receipt Confirmation Email
 */
export async function sendSupportConfirmationEmail(params: {
  customerEmail: string;
  customerName?: string;
  category: string;
  subject: string;
}): Promise<SendEmailResult> {
  const displayName = params.customerName || "there";
  const isSetupOrBug = params.category === "mcp_setup" || params.category === "bug";

  const selfHelpTip = isSetupOrBug
    ? `
    <div class="code-box" style="margin: 16px 0;">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #64748b; margin-bottom: 6px;">Troubleshooting Tip</div>
      <p style="margin: 0 0 6px; font-size: 12px; color: #475569;">If you're diagnosing MCP or rule sync, run this in your repository:</p>
      <code>npx @metoai/cli health</code>
    </div>`
    : "";

  const html = emailWrapper(`
    <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 12px; color: #0f172a;">We received your message!</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      Hi ${displayName}, thank you for reaching out. We have logged your inquiry regarding <strong>"${params.subject}"</strong>.
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
      Our team typically reviews and replies to developer inquiries within a few hours.
    </p>
    ${selfHelpTip}
    <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
      If you have additional details or terminal logs, simply reply directly to this email.
    </p>
  `);

  return sendEmail({
    to: params.customerEmail,
    subject: `We've received your request: "${params.subject}" — Meto Support`,
    html,
    text: `Hi ${displayName},\n\nWe received your inquiry regarding "${params.subject}". We will review and reply shortly.\n\nNeed immediate CLI diagnostics? Run: npx @metoai/cli health\n\nBest,\nMeto Support`,
  });
}

