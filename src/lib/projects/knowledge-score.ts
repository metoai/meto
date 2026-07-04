import type { ProjectMemoryRole } from "@/lib/projects/types";

export type KnowledgeScoreDimension = {
  id: string;
  label: string;
  score: number;
  hint: string;
};

export type ProjectKnowledgeScore = {
  overall: number;
  dimensions: KnowledgeScoreDimension[];
  recommendations: string[];
};

const DIMENSIONS: Array<{
  role: ProjectMemoryRole;
  id: string;
  label: string;
  minChars: number;
}> = [
  { role: "architecture", id: "architecture", label: "Architecture", minChars: 80 },
  { role: "stack", id: "stack", label: "Tech stack", minChars: 40 },
  { role: "rules", id: "rules", label: "Coding rules", minChars: 30 },
  { role: "business", id: "business", label: "Business context", minChars: 50 },
  { role: "tasks", id: "sprint", label: "Current sprint", minChars: 20 },
  { role: "deployment", id: "deployment", label: "Deployment", minChars: 20 },
  { role: "api", id: "api", label: "API knowledge", minChars: 30 },
  { role: "database", id: "database", label: "Database", minChars: 20 },
  { role: "issues", id: "issues", label: "Known issues", minChars: 10 },
];

export function scoreProjectKnowledge(
  memoriesByRole: Record<string, { content?: string }[]>,
  hasFocus: boolean,
  hasRepo: boolean,
  eventCount: number
): ProjectKnowledgeScore {
  const dimensions: KnowledgeScoreDimension[] = [];
  const recommendations: string[] = [];

  for (const dim of DIMENSIONS) {
    const items = memoriesByRole[dim.role] ?? [];
    const chars = items.reduce((n, m) => n + (m.content?.trim().length ?? 0), 0);
    let score = 0;
    if (chars >= dim.minChars * 2) score = 95;
    else if (chars >= dim.minChars) score = 78;
    else if (chars > 0) score = 45;
    else score = 12;

    let hint = "Not discovered yet";
    if (score >= 90) hint = "Strong";
    else if (score >= 70) hint = "Good";
    else if (score > 0) hint = "Thin — AI can infer more";
    else hint = "Missing — import repo or let AI scan";

    if (score < 70) {
      recommendations.push(
        `${dim.label} is ${score < 30 ? "missing" : "thin"} — import or scan the repository.`
      );
    }

    dimensions.push({
      id: dim.id,
      label: dim.label,
      score,
      hint,
    });
  }

  if (!hasFocus) {
    recommendations.push("Set current sprint / task so AI knows what you're doing today.");
  }
  if (!hasRepo) {
    recommendations.push("Connect a GitHub repo for zero-manual stack discovery.");
  }
  if (eventCount < 2) {
    recommendations.push("Decision history will grow as you work — MCP updates add timeline events.");
  }

  const overall = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length
  );

  return {
    overall,
    dimensions,
    recommendations: recommendations.slice(0, 4),
  };
}
