import type { Project } from "@/lib/projects/types";
import type { KnowledgeObject } from "@/lib/knowledge/types";
import type { ProjectEvent } from "@/lib/projects/types";

export type SmartQuestion = {
  id: string;
  question: string;
  reason: string;
  action: "confirm_memory" | "record_decision" | "rescan" | "set_focus";
  suggestedAnswer?: string;
};

export function buildSmartQuestions(
  project: Project,
  memoriesByRole: Record<string, KnowledgeObject[]>,
  events: ProjectEvent[]
): SmartQuestion[] {
  const questions: SmartQuestion[] = [];
  const stack = memoriesByRole.stack?.[0]?.content ?? "";
  const rules = memoriesByRole.rules?.[0]?.content ?? "";
  const business = memoriesByRole.business?.[0]?.content ?? "";
  const focus = project.current_focus ?? {};

  if (stack.includes("Supabase") && !events.some((e) => e.title.includes("Supabase"))) {
    questions.push({
      id: "auth-supabase",
      question: "Authentication uses Supabase Auth — should I update project memory?",
      reason: "Detected Supabase in stack but no confirmed decision on record.",
      action: "confirm_memory",
      suggestedAnswer: "Yes — use Supabase Auth with Row Level Security.",
    });
  }

  if (stack.includes("Next.js") && !rules.includes("Server Action")) {
    questions.push({
      id: "rules-server-actions",
      question: "Should I add a rule: prefer Server Actions over client fetch?",
      reason: "Next.js detected without coding rules for data mutations.",
      action: "confirm_memory",
      suggestedAnswer: "Always use Server Actions for mutations. Avoid useEffect for data loading.",
    });
  }

  if (!business.trim()) {
    questions.push({
      id: "business-context",
      question: "What problem does this project solve for users?",
      reason: "Business context is empty — AI makes better decisions with product intent.",
      action: "confirm_memory",
    });
  }

  if (!focus.sprint && !focus.current_task) {
    questions.push({
      id: "current-focus",
      question: "What are you working on today?",
      reason: "Current sprint/task not set — agents won't know today's priority.",
      action: "set_focus",
    });
  }

  const scanEvents = events.filter((e) => e.event_type === "scan");
  if (
    scanEvents.length >= 2 &&
    scanEvents[0]?.created_at !== scanEvents[1]?.created_at
  ) {
    questions.push({
      id: "rescan-changes",
      question: "Stack changed since last scan — confirm architecture memory is current?",
      reason: "Multiple scans detected — manifests may have changed.",
      action: "rescan",
    });
  }

  if (stack.includes("Firebase") && stack.includes("Supabase")) {
    questions.push({
      id: "auth-migration",
      question: "I noticed auth stack references changed. Record a migration decision?",
      reason: "Both Firebase and Supabase appear in memory — clarify for future agents.",
      action: "record_decision",
      suggestedAnswer: "Migrated from Firebase to Supabase for RLS and lower ops overhead.",
    });
  }

  return questions.slice(0, 4);
}
