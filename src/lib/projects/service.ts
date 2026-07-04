import type { SupabaseClient } from "@supabase/supabase-js";
import {
  analyzeRepoFiles,
  scanResultToMemories,
} from "@/lib/projects/repo-scanner";
import {
  applyScanMemoriesToProject,
  defaultProjectSlug,
  recordProjectEvent,
} from "@/lib/projects/project-memories";
import type { Project, ProjectImportSource } from "@/lib/projects/types";
import { slugifyProjectName } from "@/lib/projects/types";

export const PROJECT_SELECT =
  "id,user_id,slug,name,description,status,metadata,repo_url,import_source,current_focus,last_scanned_at,created_at,updated_at";

export async function getProjectForUser(
  supabase: SupabaseClient,
  userId: string,
  projectId: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Project | null;
}

export async function createProjectFromScan(
  supabase: SupabaseClient,
  userId: string,
  input: {
    name: string;
    description?: string;
    repoUrl?: string | null;
    importSource: ProjectImportSource;
    files: Record<string, string>;
  }
) {
  const scan = analyzeRepoFiles(input.files, input.name);
  const slug = slugifyProjectName(scan.name || input.name);
  const name = (scan.name || input.name).trim();

  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId)
    .eq("slug", slug)
    .maybeSingle();

  let projectId = existing?.id;
  const now = new Date().toISOString();

  if (projectId) {
    await supabase
      .from("projects")
      .update({
        description: input.description ?? scan.summary,
        repo_url: input.repoUrl ?? null,
        import_source: input.importSource,
        last_scanned_at: now,
        updated_at: now,
      })
      .eq("id", projectId);
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        name,
        slug,
        description: input.description ?? scan.summary,
        repo_url: input.repoUrl ?? null,
        import_source: input.importSource,
        last_scanned_at: now,
      })
      .select(PROJECT_SELECT)
      .single();
    if (error) throw error;
    projectId = data.id;
  }

  const memories = scanResultToMemories(scan);
  await applyScanMemoriesToProject(
    supabase,
    userId,
    projectId!,
    slug,
    memories,
    "migration"
  );

  await recordProjectEvent(supabase, userId, projectId!, {
    event_type: "import",
    title: `Imported from ${input.importSource}`,
    content: scan.summary,
    metadata: { files: scan.filesFound },
  });

  const project = await getProjectForUser(supabase, userId, projectId!);
  return { project, scan, created: !existing };
}

export async function rescanProject(
  supabase: SupabaseClient,
  userId: string,
  project: Project,
  files: Record<string, string>
) {
  const scan = analyzeRepoFiles(files, project.name);
  const memories = scanResultToMemories(scan);
  await applyScanMemoriesToProject(
    supabase,
    userId,
    project.id,
    project.slug,
    memories,
    "migration"
  );

  await supabase
    .from("projects")
    .update({
      description: scan.summary || project.description,
      last_scanned_at: new Date().toISOString(),
    })
    .eq("id", project.id);

  return scan;
}

export { defaultProjectSlug };
