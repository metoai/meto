/** Shared landing chat types and helpers — see docs/AI_SYSTEM.md */

export const LANDING_OPENING =
  "Hey — what do you do and what are you working on right now?";

export const LANDING_SAVE_PROMPT_AFTER = 3;

export type LandingChatRole = "user" | "assistant";

export type LandingChatMessage = {
  role: LandingChatRole;
  content: string;
};

export type CollectedProfile = {
  about: string | null;
  work: string | null;
  projects: string | null;
  goals: string | null;
};

export const EMPTY_COLLECTED: CollectedProfile = {
  about: null,
  work: null,
  projects: null,
  goals: null,
};

export const LANDING_SECTION_LABELS: {
  key: keyof CollectedProfile;
  label: string;
}[] = [
  { key: "about", label: "About" },
  { key: "work", label: "Work" },
  { key: "projects", label: "Projects" },
  { key: "goals", label: "Goals" },
];

export function mergeCollected(
  current: CollectedProfile,
  incoming: CollectedProfile
): CollectedProfile {
  return {
    about: incoming.about ?? current.about,
    work: incoming.work ?? current.work,
    projects: incoming.projects ?? current.projects,
    goals: incoming.goals ?? current.goals,
  };
}

export function hasCollectedContent(collected: CollectedProfile) {
  return Object.values(collected).some((value) => value?.trim());
}

export function countFilledSections(collected: CollectedProfile) {
  return Object.values(collected).filter((v) => v?.trim()).length;
}
