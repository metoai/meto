import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await supabase
      .from("context_sections")
      .delete()
      .eq("user_id", user.id);

    await supabase
      .from("compiled_profiles")
      .delete()
      .eq("user_id", user.id);

    await supabase
      .from("onboarding_chats")
      .delete()
      .eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset profile error:", error);
    return NextResponse.json(
      { error: "Failed to reset profile." },
      { status: 500 }
    );
  }
}
