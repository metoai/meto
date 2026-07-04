import type { Project, ProjectFocus } from "@/lib/projects/types";
import type { KnowledgeObject } from "@/lib/knowledge/types";

export function buildTodayContext(
  project: Project,
  memoriesByRole: Record<string, KnowledgeObject[]>,
  recentEvents: { title: string; content: string; created_at: string }[]
): string {
  const focus = (project.current_focus ?? {}) as ProjectFocus;
  const sections: string[] = [
    `# Today's context — ${project.name}`,
    new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    "",
  ];

  if (focus.sprint || focus.current_task || focus.blockers?.length) {
    sections.push("## Current focus");
    if (focus.sprint) sections.push(`Sprint: ${focus.sprint}`);
    if (focus.current_task) sections.push(`Task: ${focus.current_task}`);
    if (focus.blockers?.length) {
      sections.push(`Blockers: ${focus.blockers.join("; ")}`);
    }
    sections.push("");
  }

  const roleOrder = [
    "architecture",
    "stack",
    "rules",
    "api",
    "database",
    "deployment",
    "business",
    "issues",
    "tasks",
    "context",
  ] as const;

  for (const role of roleOrder) {
    const items = memoriesByRole[role];
    if (!items?.length) continue;
    sections.push(`## ${role.charAt(0).toUpperCase() + role.slice(1)}`);
    for (const item of items) {
      sections.push(`### ${item.title}\n${item.content.trim()}`);
    }
    sections.push("");
  }

  if (recentEvents.length) {
    sections.push("## Recent changes");
    for (const event of recentEvents.slice(0, 5)) {
      sections.push(`- **${event.title}** (${event.created_at.slice(0, 10)})`);
      if (event.content.trim()) sections.push(`  ${event.content.trim()}`);
    }
  }

  return sections.join("\n").trim();
}
