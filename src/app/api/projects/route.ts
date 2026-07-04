import { NextResponse } from "next/server";
import { PROJECT_SELECT } from "@/lib/projects/service";
import { slugifyProjectName } from "@/lib/projects/types";
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

    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects: data ?? [] });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { error: "Failed to load projects." },
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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("workspace_mode")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    if (profile?.workspace_mode !== "developer") {
      return NextResponse.json(
        { error: "Switch to Developer workspace in Settings to create projects." },
        { status: 403 }
      );
    }

    const body = (await request.json()) as {
      name?: string;
      description?: string;
      slug?: string;
    };

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Project name is required." },
        { status: 400 }
      );
    }

    const slug = (body.slug?.trim() || slugifyProjectName(name)) || "project";

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name,
        slug,
        description: body.description?.trim() ?? "",
      })
      .select(PROJECT_SELECT)
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json(
      { error: "Failed to create project." },
      { status: 500 }
    );
  }
}
