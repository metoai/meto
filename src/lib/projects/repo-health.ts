import type { Project } from "@/lib/projects/types";
import type { KnowledgeObject } from "@/lib/knowledge/types";
import type { ProjectEvent } from "@/lib/projects/types";

export type RepoHealthIssue = {
  id: string;
  severity: "critical" | "warning" | "info";
  label: string;
  detail: string;
};

export type RepoHealthReport = {
  score: number;
  issues: RepoHealthIssue[];
};

export function assessRepoHealth(
  project: Project,
  memoriesByRole: Record<string, KnowledgeObject[]>,
  events: ProjectEvent[]
): RepoHealthReport {
  const issues: RepoHealthIssue[] = [];
  const stack = memoriesByRole.stack?.[0]?.content ?? "";
  const architecture = memoriesByRole.architecture?.[0]?.content ?? "";
  const deployment = memoriesByRole.deployment?.[0]?.content ?? "";
  const api = memoriesByRole.api?.[0]?.content ?? "";
  const context = memoriesByRole.context?.[0]?.content ?? "";

  if (!context.includes("README.md found")) {
    issues.push({
      id: "readme",
      severity: "warning",
      label: "Missing README",
      detail: "No README detected during scan. Generate one from project memory.",
    });
  }

  if (!architecture.trim() || architecture.length < 80) {
    issues.push({
      id: "architecture",
      severity: "warning",
      label: "Architecture outdated or thin",
      detail: "Rescan the repo or confirm architecture after major changes.",
    });
  }

  if (!api.trim()) {
    issues.push({
      id: "api-docs",
      severity: "info",
      label: "API docs stale or missing",
      detail: "Route handlers were not summarized — rescan after API changes.",
    });
  }

  if (!deployment.trim()) {
    issues.push({
      id: "deployment",
      severity: "warning",
      label: "No deployment guide",
      detail: "Connect hosting manifests (vercel.json, docker-compose) via rescan.",
    });
  }

  if (!project.repo_url) {
    issues.push({
      id: "repo",
      severity: "critical",
      label: "No repository connected",
      detail: "Import from GitHub or GitLab for automatic discovery.",
    });
  }

  if (!project.last_scanned_at) {
    issues.push({
      id: "scan",
      severity: "critical",
      label: "Never scanned",
      detail: "Run import & scan to populate project memory.",
    });
  } else {
    const daysSinceScan =
      (Date.now() - new Date(project.last_scanned_at).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysSinceScan > 14) {
      issues.push({
        id: "stale-scan",
        severity: "info",
        label: "Scan is stale",
        detail: `Last scanned ${Math.floor(daysSinceScan)} days ago — rescan after recent commits.`,
      });
    }
  }

  if (!stack.includes("Database") && !stack.includes("Supabase")) {
    issues.push({
      id: "env",
      severity: "info",
      label: "Environment incomplete",
      detail: "Database layer not detected — confirm .env variable names in docs.",
    });
  }

  const decisionCount = events.filter((e) => e.event_type === "decision").length;
  if (decisionCount === 0) {
    issues.push({
      id: "decisions",
      severity: "info",
      label: "No decision history",
      detail: "Record stack choices so AI can explain why later.",
    });
  }

  const critical = issues.filter((i) => i.severity === "critical").length;
  const warning = issues.filter((i) => i.severity === "warning").length;
  const score = Math.max(
    0,
    Math.min(100, 100 - critical * 25 - warning * 12 - issues.length * 3)
  );

  return { score, issues };
}
