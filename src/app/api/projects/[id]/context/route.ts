import { NextResponse } from "next/server";
import { PROJECT_SELECT } from "@/lib/projects/service";
import { buildProjectContext } from "@/lib/projects/types";
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

    const { data: project, error } = await supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    const { data: links, error: linksError } = await supabase
      .from("project_memories")
      .select("memory_id, role")
      .eq("project_id", id)
      .eq("user_id", user.id);

    if (linksError) throw linksError;

    const memoryIds = (links ?? []).map((l) => l.memory_id);
    let memories: { id: string; type: string; title: string; content: string }[] =
      [];

    if (memoryIds.length > 0) {
      const { data: memoryRows, error: memError } = await supabase
        .from("knowledge_objects")
        .select("id, type, title, content")
        .eq("user_id", user.id)
        .in("id", memoryIds);

      if (memError) throw memError;
      memories = memoryRows ?? [];
    }

    const context = buildProjectContext(project, memories as never);

    return NextResponse.json({
      project,
      memories,
      links: links ?? [],
      context,
    });
  } catch (error) {
    console.error("GET project context error:", error);
    return NextResponse.json(
      { error: "Failed to load project context." },
      { status: 500 }
    );
  }
}
