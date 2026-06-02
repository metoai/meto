import { NextResponse } from "next/server";
import { upgradeRequiredResponse } from "@/lib/billing-errors";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import { SECTION_KEYS } from "@/lib/meto-prompts";
import { SECTION_SELECT } from "@/lib/section-fields";
import { createClient } from "@/lib/supabase/server";

function isCustomSectionType(sectionType: string) {
  return (
    sectionType === "custom" ||
    !SECTION_KEYS.includes(sectionType as (typeof SECTION_KEYS)[number])
  );
}

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("context_sections")
      .select(SECTION_SELECT)
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sections: data ?? [] });
  } catch (error) {
    console.error("GET sections error:", error);
    return NextResponse.json(
      { error: "Failed to load sections." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, section_type = "custom" } = await request.json();

    if (isCustomSectionType(section_type)) {
      const entitlements = await getEntitlementsForUser(user.id);
      const { data: existingSections } = await supabase
        .from("context_sections")
        .select("section_type")
        .eq("user_id", user.id);

      const customCount = (existingSections ?? []).filter((row) =>
        isCustomSectionType(row.section_type)
      ).length;

      if (customCount >= entitlements.maxCustomSections) {
        return upgradeRequiredResponse("custom_sections");
      }
    }

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("context_sections")
      .select("display_order")
      .eq("user_id", user.id)
      .order("display_order", { ascending: false })
      .limit(1);

    const displayOrder = (existing?.[0]?.display_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("context_sections")
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        section_type,
        display_order: displayOrder,
      })
      .select(SECTION_SELECT)
      .single();

    if (error) throw error;

    return NextResponse.json({ section: data });
  } catch (error) {
    console.error("POST section error:", error);
    return NextResponse.json(
      { error: "Failed to create section." },
      { status: 500 }
    );
  }
}
