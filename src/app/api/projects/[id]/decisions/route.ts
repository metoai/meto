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
      from?: string;
      to?: string;
      reason?: string;
      title?: string;
    };

    const from = body.from?.trim();
    const to = body.to?.trim();
    const reason = body.reason?.trim() ?? "";
    const title =
      body.title?.trim() ||
      (from && to ? `Switched ${from} → ${to}` : "Architecture decision");

    const content = [
      from && to ? `**From:** ${from}\n**To:** ${to}` : "",
      reason ? `**Reason:** ${reason}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    await upsertProjectMemoryByRole(supabase, user.id, id, {
      role: "architecture",
      title: "Decision: " + title,
      content,
      type: "decision",
      source: "manual",
      projectSlug: project.slug,
    });

    await recordProjectEvent(supabase, user.id, id, {
      event_type: "decision",
      title,
      content: reason || content,
      metadata: { from, to, reason },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST decision error:", error);
    return NextResponse.json(
      { error: "Failed to record decision." },
      { status: 500 }
    );
  }
}
