import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { count } = await supabase
      .from("context_sections")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) > 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase.from("context_sections").insert({
      user_id: user.id,
      section_type: "about",
      title: "About Me",
      content: "Add a short intro about yourself here.",
      display_order: 0,
    });

    if (error) throw error;

    if (user.email) {
      const displayName =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        user.email.split("@")[0];
      void sendWelcomeEmail({ to: user.email, name: displayName });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Skip onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to skip onboarding." },
      { status: 500 }
    );
  }
}
