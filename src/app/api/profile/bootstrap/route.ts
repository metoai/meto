import { NextResponse } from "next/server";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import { catchApiError } from "@/lib/api-error";
import { SECTION_SELECT } from "@/lib/section-fields";
import { createClient } from "@/lib/supabase/server";

/** One request for portal load: profile, sections, entitlements, fix badge count. */
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [profileResult, sectionsResult, scoreResult, entitlements] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, display_name, created_at, updated_at")
          .eq("id", user.id)
          .single(),
        supabase
          .from("context_sections")
          .select(SECTION_SELECT)
          .eq("user_id", user.id)
          .order("display_order", { ascending: true }),
        supabase
          .from("context_scores")
          .select("gaps")
          .eq("user_id", user.id)
          .maybeSingle(),
        getEntitlementsForUser(user.id),
      ]);

    if (profileResult.error) throw profileResult.error;
    if (sectionsResult.error) throw sectionsResult.error;
    if (scoreResult.error && scoreResult.error.code !== "42P01") {
      throw scoreResult.error;
    }

    const gaps = scoreResult.data?.gaps;
    const issueCount = Array.isArray(gaps) ? gaps.length : 0;

    return NextResponse.json({
      profile: profileResult.data,
      email: user.email,
      sections: sectionsResult.data ?? [],
      entitlements,
      issueCount,
    });
  } catch (error) {
    return catchApiError(error, "Failed to load portal data.");
  }
}
