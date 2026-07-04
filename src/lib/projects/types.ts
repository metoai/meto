import type { KnowledgeObject } from "@/lib/knowledge/types";

export type WorkspaceMode = "personal" | "developer";

export type ProjectImportSource =
  | "manual"
  | "github"
  | "gitlab"
  | "local"
  | "zip"
  | "profile_sync";

export type ProjectFocus = {
  sprint?: string;
  current_task?: string;
  blockers?: string[];
};

export type Project = {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  description: string;
  status: "active" | "archived" | "paused";
  metadata: Record<string, unknown>;
  repo_url: string | null;
  import_source: ProjectImportSource;
  current_focus: ProjectFocus;
  last_scanned_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectEvent = {
  id: string;
  project_id: string;
  user_id: string;
  event_type:
    | "decision"
    | "change"
    | "scan"
    | "rule"
    | "focus"
    | "import"
    | "memory";
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ProjectMemoryRole =
  | "architecture"
  | "stack"
  | "rules"
  | "tasks"
  | "business"
  | "database"
  | "api"
  | "deployment"
  | "issues"
  | "context";

export function slugifyProjectName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function buildProjectContext(
  project: Project,
  memories: KnowledgeObject[]
): string {
  const blocks = memories.map(
    (m) => `### ${m.title} (${m.type})\n${m.content.trim()}`
  );

  return [
    `# ${project.name}`,
    project.description.trim() ? project.description.trim() : "",
    "",
    ...blocks,
  ]
    .filter(Boolean)
    .join("\n\n");
}
