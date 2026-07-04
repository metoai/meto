import { NextResponse } from "next/server";
import { fetchGithubRepoFromUrl } from "@/lib/projects/github-import";
import { loadProjectMemoriesGrouped } from "@/lib/projects/project-memories";
import { scoreProjectKnowledge } from "@/lib/projects/knowledge-score";
import { buildProjectPromptPacks } from "@/lib/projects/prompt-packs";
import { buildTodayContext } from "@/lib/projects/today-context";
import { assessRepoHealth } from "@/lib/projects/repo-health";
import { buildRepositoryGraph } from "@/lib/projects/repository-graph";
import { buildSmartQuestions } from "@/lib/projects/smart-questions";
import { generateProjectDocs } from "@/lib/projects/doc-generator";
import {
  getProjectForUser,
  PROJECT_SELECT,
  rescanProject,
} from "@/lib/projects/service";
import { createClient } from "@/lib/supabase/server";
import type { KnowledgeObject } from "@/lib/knowledge/types";

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
    const flatMemories = Object.values(grouped).flat() as KnowledgeObject[];

    const memoriesByRole: Record<string, KnowledgeObject[]> = {};
    for (const [role, items] of Object.entries(grouped)) {
      memoriesByRole[role] = items as KnowledgeObject[];
    }

    const { data: events } = await supabase
      .from("project_events")
      .select("id, event_type, title, content, metadata, created_at")
      .eq("project_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    const focus = project.current_focus ?? {};
    const knowledgeScore = scoreProjectKnowledge(
      grouped as Record<string, { content?: string }[]>,
      Boolean(focus.sprint || focus.current_task),
      Boolean(project.repo_url),
      events?.length ?? 0
    );

    const todayContext = buildTodayContext(
      project,
      memoriesByRole,
      (events ?? []).map((e) => ({
        title: e.title,
        content: e.content,
        created_at: e.created_at,
      }))
    );

    const repoHealth = assessRepoHealth(
      project,
      memoriesByRole,
      (events ?? []) as never
    );
    const graph = buildRepositoryGraph(memoriesByRole);
    const smartQuestions = buildSmartQuestions(
      project,
      memoriesByRole,
      (events ?? []) as never
    );
    const docs = generateProjectDocs(project, memoriesByRole);

    return NextResponse.json({
      project,
      memories: grouped,
      events: events ?? [],
      knowledgeScore,
      todayContext,
      promptPacks: buildProjectPromptPacks(project.name),
      repoHealth,
      graph,
      smartQuestions,
      docs,
    });
  } catch (error) {
    console.error("GET project error:", error);
    return NextResponse.json(
      { error: "Failed to load project." },
      { status: 500 }
    );
  }
}

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

    const body = (await request.json()) as {
      name?: string;
      description?: string;
      status?: string;
      current_focus?: {
        sprint?: string;
        current_task?: string;
        blockers?: string[];
      };
    };

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (body.name?.trim()) updates.name = body.name.trim();
    if (body.description !== undefined) updates.description = body.description.trim();
    if (body.status) updates.status = body.status;
    if (body.current_focus) updates.current_focus = body.current_focus;

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select(PROJECT_SELECT)
      .single();

    if (error) throw error;

    if (body.current_focus) {
      await supabase.from("project_events").insert({
        project_id: id,
        user_id: user.id,
        event_type: "focus",
        title: "Focus updated",
        content: [
          body.current_focus.sprint,
          body.current_focus.current_task,
          body.current_focus.blockers?.join(", "),
        ]
          .filter(Boolean)
          .join(" · "),
        metadata: body.current_focus,
      });
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    console.error("PATCH project error:", error);
    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}

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

    let files: Record<string, string> = {};
    const body = (await request.json().catch(() => ({}))) as {
      files?: Record<string, string>;
    };

    if (body.files && Object.keys(body.files).length) {
      files = body.files;
    } else if (project.repo_url) {
      const fetched = await fetchGithubRepoFromUrl(project.repo_url);
      if (fetched) files = fetched.files;
    }

    if (!Object.keys(files).length) {
      return NextResponse.json(
        { error: "No repo connected or files to scan." },
        { status: 400 }
      );
    }

    const scan = await rescanProject(supabase, user.id, project, files);
    const updated = await getProjectForUser(supabase, user.id, id);

    return NextResponse.json({ project: updated, scan });
  } catch (error) {
    console.error("POST project scan error:", error);
    return NextResponse.json(
      { error: "Failed to scan project." },
      { status: 500 }
    );
  }
}
