import { PRO_AI_CALL_LIMIT, TRIAL_DAYS } from "@/lib/ai-usage-limits";

export const FREE_FEATURES = [
  "Manual profile editing",
  "Context score & gaps",
  "Workspace copy",
  "Public profile",
] as const;

export const PRO_FEATURES = [
  "AI gap fixes & updates",
  "LLM compile for every AI",
  "Brain dump onboarding",
  `${PRO_AI_CALL_LIMIT} AI actions / month`,
] as const;

export const PRICING_PLANS = {
  free: {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Edit manually after your trial. No AI actions.",
    features: FREE_FEATURES,
  },
  pro: {
    name: "Pro",
    price: "$10",
    period: "/ mo",
    tagline: `${TRIAL_DAYS}-day trial first, then subscribe when you're ready.`,
    features: PRO_FEATURES,
    featured: true,
  },
} as const;
