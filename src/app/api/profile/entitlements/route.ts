import { NextResponse } from "next/server";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entitlements = await getEntitlementsForUser(user.id);

    return NextResponse.json({ entitlements });
  } catch (error) {
    console.error("GET entitlements error:", error);
    return NextResponse.json(
      { error: "Failed to load entitlements." },
      { status: 500 }
    );
  }
}
