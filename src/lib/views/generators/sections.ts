import { PROFILE_SECTIONS, SECTION_KEYS } from "@/lib/meto-prompts";
import { memoryTypeForSection } from "@/lib/knowledge/section-mapping";
import type { KnowledgeObject } from "@/lib/knowledge/types";

function sectionKeyForMemory(memory: KnowledgeObject): string | null {
  const meta = memory.metadata ?? {};
  if (typeof meta.section_key === "string") return meta.section_key;
  if (typeof meta.section_type === "string") return meta.section_type;

  for (const key of SECTION_KEYS) {
    if (memoryTypeForSection(key) === memory.type) return key;
  }
  return null;
}

export function generateSectionsFromMemories(
  memories: KnowledgeObject[]
): Record<string, string> {
  const bySection = new Map<string, string[]>();

  for (const memory of memories) {
    if (memory.status !== "active") continue;
    const key = sectionKeyForMemory(memory);
    if (!key) continue;
    const list = bySection.get(key) ?? [];
    list.push(`**${memory.title}**\n${memory.content.trim()}`);
    bySection.set(key, list);
  }

  const output: Record<string, string> = {};
  for (const key of SECTION_KEYS) {
    const chunks = bySection.get(key);
    if (chunks?.length) {
      output[key] = chunks.join("\n\n");
    }
  }

  for (const [key, chunks] of bySection) {
    if (SECTION_KEYS.includes(key as (typeof SECTION_KEYS)[number])) continue;
    output[`custom:${key}`] = chunks.join("\n\n");
  }

  return output;
}

export function sectionTitles(): Record<string, string> {
  return Object.fromEntries(
    PROFILE_SECTIONS.map((s) => [s.type, s.title])
  );
}
