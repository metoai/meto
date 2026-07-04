import { NextResponse } from "next/server";
import { fetchGithubRepoFromUrl } from "@/lib/projects/github-import";
import { fetchGitlabRepoFromUrl } from "@/lib/projects/gitlab-import";
import { createProjectFromScan } from "@/lib/projects/service";
import { createClient } from "@/lib/supabase/server";
import type { ProjectImportSource } from "@/lib/projects/types";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("workspace_mode")
      .eq("id", user.id)
      .single();

    if (profile?.workspace_mode !== "developer") {
      return NextResponse.json({ error: "Developer workspace required." }, { status: 403 });
    }

    const body = (await request.json()) as {
      source?: ProjectImportSource;
      githubUrl?: string;
      gitlabUrl?: string;
      repoUrl?: string;
      name?: string;
      files?: Record<string, string>;
    };

    const source = body.source ?? "manual";

    if ((source === "github" || body.githubUrl) && body.githubUrl) {
      const fetched = await fetchGithubRepoFromUrl(body.githubUrl);
      if (!fetched) {
        return NextResponse.json(
          { error: "Invalid GitHub URL or repo not accessible." },
          { status: 400 }
        );
      }

      const result = await createProjectFromScan(supabase, user.id, {
        name: body.name ?? fetched.ref.repo,
        repoUrl: body.githubUrl.trim(),
        importSource: "github",
        files: fetched.files,
      });
      return NextResponse.json(result);
    }

    if ((source === "gitlab" || body.gitlabUrl) && body.gitlabUrl) {
      const fetched = await fetchGitlabRepoFromUrl(body.gitlabUrl);
      if (!fetched) {
        return NextResponse.json(
          { error: "Invalid GitLab URL or repo not accessible." },
          { status: 400 }
        );
      }

      const result = await createProjectFromScan(supabase, user.id, {
        name: body.name ?? fetched.ref.repo,
        repoUrl: body.gitlabUrl.trim(),
        importSource: "gitlab",
        files: fetched.files,
      });
      return NextResponse.json(result);
    }

    if (body.files && Object.keys(body.files).length > 0) {
      const importSource: ProjectImportSource =
        source === "zip" ? "zip" : source === "local" ? "local" : "local";

      const result = await createProjectFromScan(supabase, user.id, {
        name: body.name ?? "Imported project",
        repoUrl: body.repoUrl ?? null,
        importSource,
        files: body.files,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Provide githubUrl, gitlabUrl, or files to import." },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST projects import error:", error);
    return NextResponse.json(
      { error: "Failed to import project." },
      { status: 500 }
    );
  }
}
