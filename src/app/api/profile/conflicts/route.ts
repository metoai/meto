import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { detectProfileConflicts } from "@/lib/conflict-detector";
import { buildCurrentSectionsMap } from "@/lib/meto-prompts";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("context_sections")
      .select("section_type, title, content, updated_at")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });

    if (error) throw error;

    const sectionsMap = buildCurrentSectionsMap(rows ?? []);
    const report = await detectProfileConflicts(sectionsMap);

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/profile/conflicts error:", error);
    return NextResponse.json(
      { error: "Failed to analyze conflicts." },
      { status: 500 }
    );
  }
}
