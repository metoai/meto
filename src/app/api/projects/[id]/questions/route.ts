import { NextResponse } from "next/server";
import {
  recordProjectEvent,
  upsertProjectMemoryByRole,
} from "@/lib/projects/project-memories";
import { getProjectForUser } from "@/lib/projects/service";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
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
      questionId?: string;
      action?: string;
      answer?: string;
      focus?: { sprint?: string; current_task?: string; blockers?: string[] };
    };

    if (body.action === "set_focus" && body.focus) {
      await supabase
        .from("projects")
        .update({
          current_focus: body.focus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      await recordProjectEvent(supabase, user.id, id, {
        event_type: "focus",
        title: "Focus set via smart question",
        content: [body.focus.sprint, body.focus.current_task]
          .filter(Boolean)
          .join(" · "),
      });

      return NextResponse.json({ ok: true });
    }

    const answer = body.answer?.trim();
    if (!answer) {
      return NextResponse.json({ error: "Answer required." }, { status: 400 });
    }

    const role =
      body.questionId?.includes("business") ? "business" : "rules";

    await upsertProjectMemoryByRole(supabase, user.id, id, {
      role,
      title: role === "business" ? "Business context" : "Coding rules",
      content: answer,
      type: role === "rules" ? "rule" : "project",
      source: "user",
      projectSlug: project.slug,
    });

    await recordProjectEvent(supabase, user.id, id, {
      event_type: "memory",
      title: "Confirmed via smart question",
      content: answer.slice(0, 300),
      metadata: { questionId: body.questionId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST question answer error:", error);
    return NextResponse.json(
      { error: "Failed to save answer." },
      { status: 500 }
    );
  }
}
