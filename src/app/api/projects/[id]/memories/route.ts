import { NextResponse } from "next/server";
import {
  recordProjectEvent,
  upsertProjectMemoryByRole,
} from "@/lib/projects/project-memories";
import { getProjectForUser } from "@/lib/projects/service";
import { createClient } from "@/lib/supabase/server";
import type { ProjectMemoryRole } from "@/lib/projects/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
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

    const body = (await request.json()) as {
      role?: ProjectMemoryRole;
      content?: string;
      title?: string;
      append?: boolean;
    };

    const role = body.role ?? "business";
    const title =
      body.title?.trim() ||
      (role === "rules"
        ? "Coding rules"
        : role === "business"
          ? "Business context"
          : `${project.name} ${role}`);

    let content = body.content?.trim() ?? "";
    if (!content) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }

    if (body.append) {
      const { data: links } = await supabase
        .from("project_memories")
        .select("memory_id")
        .eq("project_id", id)
        .eq("user_id", user.id)
        .eq("role", role)
        .limit(1);

      if (links?.[0]?.memory_id) {
        const { data: existing } = await supabase
          .from("knowledge_objects")
          .select("content")
          .eq("id", links[0].memory_id)
          .single();
        if (existing?.content) {
          content = `${existing.content.trim()}\n\n${content}`;
        }
      }
    }

    const memoryType =
      role === "rules" ? "rule" : role === "business" ? "project" : "documentation";

    await upsertProjectMemoryByRole(supabase, user.id, id, {
      role,
      title,
      content,
      type: memoryType,
      source: "user",
      projectSlug: project.slug,
    });

    await recordProjectEvent(supabase, user.id, id, {
      event_type: role === "rules" ? "rule" : "memory",
      title: `Updated ${role}`,
      content: content.slice(0, 200),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH project memory error:", error);
    return NextResponse.json(
      { error: "Failed to update memory." },
      { status: 500 }
    );
  }
}
