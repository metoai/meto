import { NextResponse } from "next/server";
import { z } from "zod";
import {
  sendSupportInquiryEmail,
  sendSupportConfirmationEmail,
  SUPPORT_ADMIN_EMAIL,
} from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const supportRequestSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  name: z.string().optional(),
  category: z.enum(["mcp_setup", "bug", "billing", "feature", "general"]).default("general"),
  subject: z.string().min(2, "Subject must be at least 2 characters.").max(200).default("Support Request"),
  message: z.string().min(5, "Message must be at least 5 characters.").max(5000, "Message cannot exceed 5000 characters."),
  url: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = supportRequestSchema.safeParse(json);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid support payload.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email, name, category, subject, message, url } = parsed.data;

    // Check if user is logged in
    let username: string | undefined;
    let userId: string | undefined;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, display_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.username) username = profile.username;
      }
    } catch {
      // Non-fatal if auth lookup fails
    }

    const userAgent = request.headers.get("user-agent") || undefined;

    // 1. Send Alert to Founder/Admin (metoaipr@gmail.com)
    const adminResult = await sendSupportInquiryEmail({
      customerEmail: email,
      customerName: name,
      category,
      subject,
      message,
      metadata: {
        username,
        userId,
        url,
        userAgent,
      },
    });

    if (!adminResult.success) {
      console.warn("[Support API] Admin notification warning:", adminResult.error);
    }

    // 2. Send Confirmation Receipt to Customer
    try {
      await sendSupportConfirmationEmail({
        customerEmail: email,
        customerName: name,
        category,
        subject,
      });
    } catch (confirmErr) {
      // Log confirmation warning without failing the user request
      console.warn("[Support API] Customer receipt warning:", confirmErr);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received! We'll reply to your email shortly.",
      recipient: SUPPORT_ADMIN_EMAIL,
    });
  } catch (error) {
    console.error("[Support API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to submit support request. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
