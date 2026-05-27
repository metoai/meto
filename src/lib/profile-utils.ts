import { CORE_SECTION_TYPES } from "@/lib/meto-prompts";

export function getProfileCompletion(sections: { section_type: string }[]) {
  const present = new Set(sections.map((s) => s.section_type));
  const filled = CORE_SECTION_TYPES.filter((type) => present.has(type)).length;
  return Math.round((filled / CORE_SECTION_TYPES.length) * 100);
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
