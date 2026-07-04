import { NextResponse } from "next/server";
import { autoCreateProjectsFromDeveloperUpdate } from "@/lib/projects/auto-create";
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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("workspace_mode")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    if (profile?.workspace_mode !== "developer") {
      return NextResponse.json({ projectsCreated: 0, skipped: true });
    }

    const { data: section, error: sectionError } = await supabase
      .from("context_sections")
      .select("content")
      .eq("user_id", user.id)
      .eq("section_type", "projects")
      .maybeSingle();

    if (sectionError) throw sectionError;

    const content = section?.content?.trim() ?? "";
    if (!content) {
      return NextResponse.json({ projectsCreated: 0, synced: false });
    }

    const result = await autoCreateProjectsFromDeveloperUpdate(supabase, user.id, {
      updates: { projects: content },
      source: "migration",
    });

    return NextResponse.json({
      projectsCreated: result.createdCount,
      projectIds: result.projectIds,
      synced: true,
    });
  } catch (error) {
    console.error("POST projects sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync projects from profile." },
      { status: 500 }
    );
  }
}
