import {
  customSectionTitleFromKey,
  isCustomSectionUpdateKey,
} from "@/lib/document-import";
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
  about: "Who are you? Where are you based?",
  work: "What do you do? What tools do you use?",
  projects: "What are you currently building?",
  skills: "What are you actually good at?",
  goals: "What are you trying to achieve?",
  working_style: "How do you prefer to collaborate and communicate?",
  communication_style: "How do you like AI to respond?",
  context_for_ai: "How do you like AI to respond?",
  custom: "Add anything else worth knowing about you…",
};

export function friendlySectionTitle(sectionType: string, fallbackTitle?: string) {
  if (isCustomSectionUpdateKey(sectionType)) {
    return customSectionTitleFromKey(sectionType);
  }
  return (
    SECTION_FRIENDLY_TITLES[sectionType] ??
    fallbackTitle ??
    sectionType.replace(/_/g, " ")
  );
}

export function sectionPlaceholder(sectionType: string) {
  return SECTION_PLACEHOLDERS[sectionType] ?? SECTION_PLACEHOLDERS.custom;
}

export function availablePresetSectionTypes(
  existingTypes: string[],
  allowedTypes?: ReadonlySet<string>
) {
  const existing = new Set(existingTypes);
  return PROFILE_SECTIONS.filter(
    (s) =>
      !existing.has(s.type) &&
      (!allowedTypes || allowedTypes.has(s.type))
  );
}

export const ALL_PRESET_SECTION_TYPES = SECTION_KEYS;
