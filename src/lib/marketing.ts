import { getResendClient, DEFAULT_FROM_EMAIL, sendEmail, SendEmailResult } from "@/lib/email";
import { getSiteUrl } from "@/lib/site";

// Resend Segment IDs created for Meto
export const RESEND_SEGMENTS = {
  GENERAL: "77416625-1820-4bb7-b9ef-53b89a886497",
  DEVELOPERS: "3a56282f-ed66-4355-ae4e-e05a56eba42f",
  GENERAL_AI: "48a0b499-6b15-43be-ab7f-d5d4f3492172",
} as const;

export type UserCategory = "developers" | "general_ai" | "all";

/**
 * Syncs a user as a Resend Contact with their appropriate segment.
 */
export async function syncContactToResend(params: {
  email: string;
  firstName?: string;
  lastName?: string;
  category?: UserCategory;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = getResendClient();

    let segmentId: string = RESEND_SEGMENTS.GENERAL;
    if (params.category === "developers") {
      segmentId = RESEND_SEGMENTS.DEVELOPERS;
    } else if (params.category === "general_ai") {
      segmentId = RESEND_SEGMENTS.GENERAL_AI;
    }

    const { data, error } = await resend.contacts.create({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      segments: [{ id: segmentId }],
      unsubscribed: false,
    });

    if (error) {
      console.warn("[Marketing] Resend contact sync warning:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Marketing] Exception syncing contact:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to sync contact",
    };
  }
}

/* =========================================================================
   Marketing Email Templates by Category (Emil Kowalski Design Craft)
   ========================================================================= */

function marketingWrapper(contentHtml: string, categoryName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 40px 16px; color: #111827; }
    .card { background-color: #ffffff; max-width: 560px; margin: 0 auto; border-radius: 12px; border: 1px solid #e5e7eb; padding: 36px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
    .pill { display: inline-block; background-color: #fff7ed; color: #c2410c; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 6px; margin-bottom: 16px; border: 1px solid #ffedd5; }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px; padding: 12px 24px; margin: 20px 0; }
    .code-block { background-color: #0f172a; color: #f8fafc; border-radius: 8px; padding: 14px 18px; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.5; margin: 18px 0; }
    .feature-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .footer { max-width: 560px; margin: 24px auto 0; text-align: center; font-size: 12px; color: #9ca3af; line-height: 1.6; }
    .footer a { color: #6b7280; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px;">
      <span style="font-weight: 700; font-size: 19px; letter-spacing: -0.02em; color: #0f172a;">Meto</span>
      <span style="font-size: 12px; color: #64748b;">${categoryName}</span>
    </div>
    ${contentHtml}
  </div>
  <div class="footer">
    <p>Sent by Meto · One context protocol for all AI tools & chatbots.</p>
    <p>
      You are receiving this because you signed up for Meto.<br>
      <a href="${getSiteUrl()}/settings">Email Preferences</a> · <a href="${getSiteUrl()}/settings">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}

/**
 * Campaign 1: For Developers & Software Engineers
 */
export async function sendDeveloperMarketingEmail(params: {
  to: string;
  name?: string;
}): Promise<SendEmailResult> {
  const displayName = params.name || "there";
  const html = marketingWrapper(`
    <div class="pill">Developer Workflow</div>
    <h1 style="font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 14px; color: #0f172a;">
      Stop prompt rot: Sync rules between Cursor and Claude Code in one command
    </h1>
    <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 16px;">
      Hey ${displayName},
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 16px;">
      If you switch between <strong>Claude Code CLI</strong> in your terminal and <strong>Cursor Composer</strong> in your editor, you've likely hit the rule drift problem: updating <code>CLAUDE.md</code> while forgetting <code>.cursor/rules/*.mdc</code>, or watching AI assistants violate your framework conventions.
    </p>

    <div class="code-block">
      <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;"># In your repository root:</div>
      <div>npx meto-cli sync</div>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 16px 0;">
      Meto serves as your canonical context compiler. It generates native rules with glob matching for Cursor, compiles <code>CLAUDE.md</code>, and connects via Model Context Protocol (MCP) so both tools share the exact same architectural memory.
    </p>

    <div class="feature-card">
      <div style="font-weight: 600; font-size: 14px; color: #0f172a; margin-bottom: 4px;">What Meto handles automatically:</div>
      <ul style="font-size: 13px; line-height: 1.7; color: #4b5563; padding-left: 20px; margin: 8px 0 0;">
        <li>Compiles <code>.cursor/rules/*.mdc</code> and <code>CLAUDE.md</code> from one source.</li>
        <li>Dynamic MCP server feeds relevant rules without blowing your token budget.</li>
        <li>Context Health Score flags conflicting directives before they cause buggy code.</li>
      </ul>
    </div>

    <a href="${getSiteUrl()}/for/cursor-and-claude" class="btn">Explore the Cursor + Claude Dual Workflow →</a>
  `, "Developer Guide");

  return sendEmail({
    to: params.to,
    subject: "Stop prompt rot: Sync rules between Cursor and Claude Code in 1 command",
    html,
    text: `Hey ${displayName}, switch between Cursor and Claude Code without rule drift. Run 'npx meto-cli sync' to compile both .cursor/rules and CLAUDE.md automatically. Guide: ${getSiteUrl()}/for/cursor-and-claude`,
    idempotencyKey: `marketing-dev/${params.to}/v1`,
  });
}

/**
 * Campaign 2: For General AI & Chatbot Power Users
 */
export async function sendGeneralAiMarketingEmail(params: {
  to: string;
  name?: string;
}): Promise<SendEmailResult> {
  const displayName = params.name || "there";
  const html = marketingWrapper(`
    <div class="pill">AI Identity & Instructions</div>
    <h1 style="font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 14px; color: #0f172a;">
      One AI Identity: Stop re-introducing yourself to ChatGPT, Claude, and Gemini
    </h1>
    <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 16px;">
      Hey ${displayName},
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 16px;">
      Every time you start a fresh thread in <strong>ChatGPT</strong>, open a project in <strong>Claude.ai</strong>, or prompt <strong>Gemini</strong>, you find yourself repeating the same instructions: your professional background, preferred tone, banned buzzwords, and formatting rules.
    </p>

    <div class="feature-card">
      <div style="font-weight: 600; font-size: 14px; color: #0f172a; margin-bottom: 6px;">Universal Custom Instructions with Meto:</div>
      <p style="font-size: 13px; line-height: 1.6; color: #4b5563; margin: 0;">
        Write your profile once in Meto. Meto formats and compiles it into ready-to-use custom instructions optimized for ChatGPT Plus, Claude Projects, and Gemini Advanced.
      </p>
    </div>

    <ul style="font-size: 13px; line-height: 1.8; color: #374151; padding-left: 20px; margin: 16px 0;">
      <li><strong>Consistent Voice:</strong> Every model talks to you like a senior partner, not a generic assistant.</li>
      <li><strong>Negative Directives:</strong> Explicitly ban AI clichés ("delve", "testament", "beacon") across all tools.</li>
      <li><strong>1-Click Copy & Sync:</strong> Pre-formatted blocks ready to paste into Custom Instructions.</li>
    </ul>

    <a href="${getSiteUrl()}/solutions/universal-custom-instructions" class="btn">View Universal Custom Instructions →</a>
  `, "General AI Guide");

  return sendEmail({
    to: params.to,
    subject: "One AI Identity: Stop re-introducing yourself to ChatGPT, Claude, and Gemini",
    html,
    text: `Hey ${displayName}, stop re-typing your background into every AI chat. Meto gives you Universal Custom Instructions that sync across ChatGPT, Claude.ai, and Gemini in 1 click. Guide: ${getSiteUrl()}/solutions/universal-custom-instructions`,
    idempotencyKey: `marketing-general-ai/${params.to}/v1`,
  });
}
