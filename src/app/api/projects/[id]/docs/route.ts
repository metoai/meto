import { NextResponse } from "next/server";
import { generateProjectDocs } from "@/lib/projects/doc-generator";
import { loadProjectMemoriesGrouped } from "@/lib/projects/project-memories";
import { getProjectForUser } from "@/lib/projects/service";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await getProjectForUser(supabase, user.id, id);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const grouped = await loadProjectMemoriesGrouped(supabase, user.id, id);
    const docs = generateProjectDocs(project, grouped as never);

    return NextResponse.json({ docs });
  } catch (error) {
    console.error("GET project docs error:", error);
    return NextResponse.json(
      { error: "Failed to generate docs." },
      { status: 500 }
    );
  }
}
