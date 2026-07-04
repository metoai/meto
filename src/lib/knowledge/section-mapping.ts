import type { MemoryType } from "@/lib/knowledge/types";
import type { SectionKey } from "@/lib/meto-prompts";

/** Default memory type when migrating a preset section to one knowledge object. */
export const SECTION_TO_MEMORY_TYPE: Record<SectionKey, MemoryType> = {
  about: "identity",
  work: "experience",
  projects: "project",
  skills: "skill",
  goals: "goal",
  working_style: "preference",
  context_for_ai: "rule",
};

export function memoryTypeForSection(
  sectionType: string
): MemoryType {
  if (sectionType in SECTION_TO_MEMORY_TYPE) {
    return SECTION_TO_MEMORY_TYPE[sectionType as SectionKey];
  }
  return "custom";
}

export function migrationMetadata(section: {
  id: string;
  section_type: string;
  title: string;
}) {
  return {
    migration_section_id: section.id,
    section_type: section.section_type,
    section_title: section.title,
    migrated_from: "context_sections",
  };
}
