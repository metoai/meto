import type { Plan } from "@/lib/entitlements";

/** Free signup includes this many days of Pro-feature trial (with a low AI cap). */
export const TRIAL_DAYS = 3;

/** Total LLM calls allowed for the entire trial window (not monthly). */
export const TRIAL_AI_CALL_LIMIT = 50;

/** LLM calls per calendar month on paid Pro. */
export const PRO_AI_CALL_LIMIT = 600;

/** Free tier: no LLM (local/heuristic only). */
export const FREE_AI_CALL_LIMIT = 0;

export function aiLimitForPlan(effectivePlan: Plan): number {
  switch (effectivePlan) {
    case "trial":
      return TRIAL_AI_CALL_LIMIT;
    case "pro":
      return PRO_AI_CALL_LIMIT;
    default:
      return FREE_AI_CALL_LIMIT;
  }
}

export function startOfUtcMonth(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function trialEndsAtFromStart(start: string | Date): string {
  const s = new Date(start);
  s.setUTCDate(s.getUTCDate() + TRIAL_DAYS);
  return s.toISOString();
}

export function trialStartedAt(
  trialEndsAt: string | null,
  periodStart?: string | null,
  createdAt?: string | null
): Date {
  if (periodStart) return new Date(periodStart);
  if (createdAt) return new Date(createdAt);
  if (trialEndsAt) {
    const end = new Date(trialEndsAt);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - TRIAL_DAYS);
    return start;
  }
  return new Date();
}
