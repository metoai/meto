import { PROFILE_SECTIONS, SECTION_KEYS } from "@/lib/meto-prompts";

/** Friendly display titles (sentence case) */
export const SECTION_FRIENDLY_TITLES: Record<string, string> = {
  about: "About me",
  work: "What I do",
  projects: "What I'm building",
  skills: "My skills",
  goals: "My goals",
  working_style: "How I work",
  context_for_ai: "For the AI",
  custom: "Custom section",
};

export const SECTION_PLACEHOLDERS: Record<string, string> = {
  about: "Who are you? Where are you based? What drives you?",
  work: "What do you do? What tools do you use?",
  projects: "What are you currently building or working on?",
  skills: "What are you actually good at?",
  goals: "What are you trying to achieve?",
  working_style: "How do you prefer to collaborate and communicate?",
  context_for_ai: "How do you like AI to talk to you?",
  custom: "Add anything else worth knowing about you…",
};

export function friendlySectionTitle(sectionType: string, fallbackTitle?: string) {
  return (
    SECTION_FRIENDLY_TITLES[sectionType] ??
    fallbackTitle ??
    sectionType.replace(/_/g, " ")
  );
}

export function sectionPlaceholder(sectionType: string) {
  return SECTION_PLACEHOLDERS[sectionType] ?? SECTION_PLACEHOLDERS.custom;
}

/** Preset section types the user can add (not yet on their profile) */
export function availablePresetSectionTypes(existingTypes: string[]) {
  const existing = new Set(existingTypes);
  return PROFILE_SECTIONS.filter((s) => !existing.has(s.type));
}

export const ALL_PRESET_SECTION_TYPES = SECTION_KEYS;
