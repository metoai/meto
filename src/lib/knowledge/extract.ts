import { generateWithGemini } from "@/lib/gemini";
import { buildExtractMemoriesPrompt } from "@/lib/knowledge/knowledge-prompts";
import {
  memoriesFromSectionUpdates,
  syncKnowledgeFromSectionUpdates,
} from "@/lib/knowledge/persist";
import {
  MEMORY_RELATION_TYPES,
  MEMORY_TYPES,
  type MemoryRelationType,
  type MemorySource,
  type NewKnowledgeObject,
} from "@/lib/knowledge/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ExtractedLink = {
  from_title: string;
  to_title: string;
  relation_type: MemoryRelationType;
  strength?: number;
};

export type ExtractMemoriesResult = {
  memories: NewKnowledgeObject[];
  links: ExtractedLink[];
};

function isMemoryType(value: unknown): value is NewKnowledgeObject["type"] {
  return typeof value === "string" && MEMORY_TYPES.includes(value as never);
}

function isRelationType(value: unknown): value is MemoryRelationType {
  return (
    typeof value === "string" &&
    MEMORY_RELATION_TYPES.includes(value as never)
  );
}

function parseExtractResponse(raw: string): ExtractMemoriesResult | null {
  try {
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const parsed = JSON.parse(cleaned) as {
      memories?: unknown;
      links?: unknown;
    };

    const memories: NewKnowledgeObject[] = [];
    if (Array.isArray(parsed.memories)) {
      for (const item of parsed.memories) {
        if (!item || typeof item !== "object") continue;
        const row = item as Record<string, unknown>;
        if (!isMemoryType(row.type)) continue;
        const title = typeof row.title === "string" ? row.title.trim() : "";
        const content =
          typeof row.content === "string" ? row.content.trim() : "";
        if (!title || !content) continue;

        const confidence =
          row.confidence === undefined ? 0.8 : Number(row.confidence);
        const importance =
          row.importance === undefined ? 3 : Number(row.importance);

        memories.push({
          type: row.type,
          title,
          content,
          confidence: Number.isFinite(confidence)
            ? Math.min(1, Math.max(0, confidence))
            : 0.8,
          importance: Number.isInteger(importance) &&
            importance >= 1 &&
            importance <= 5
            ? (importance as 1 | 2 | 3 | 4 | 5)
            : 3,
          source: "quick_update",
          created_by: "ai",
        });
      }
    }

    const links: ExtractedLink[] = [];
    if (Array.isArray(parsed.links)) {
      for (const item of parsed.links) {
        if (!item || typeof item !== "object") continue;
        const row = item as Record<string, unknown>;
        const fromTitle =
          typeof row.from_title === "string" ? row.from_title.trim() : "";
        const toTitle =
          typeof row.to_title === "string" ? row.to_title.trim() : "";
        if (!fromTitle || !toTitle || !isRelationType(row.relation_type)) {
          continue;
        }
        const strength =
          row.strength === undefined ? 1 : Number(row.strength);
        links.push({
          from_title: fromTitle,
          to_title: toTitle,
          relation_type: row.relation_type,
          strength: Number.isFinite(strength)
            ? Math.min(1, Math.max(0, strength))
            : 1,
        });
      }
    }

    return { memories, links };
  } catch {
    return null;
  }
}

/** Heuristic shadow extraction from proposed section updates (no LLM). */
export function shadowExtractFromUpdates(
  updates: Record<string, string>,
  source: MemorySource = "quick_update"
): NewKnowledgeObject[] {
  return memoriesFromSectionUpdates(updates, source);
}

/** LLM extraction from conversation + current sections. */
export async function extractMemoriesWithLlm(
  currentSections: Record<string, string>,
  conversation: string
): Promise<ExtractMemoriesResult> {
  const raw = await generateWithGemini(
    buildExtractMemoriesPrompt(currentSections, conversation),
    { temperature: 0.2 }
  );
  return (
    parseExtractResponse(raw) ?? {
      memories: [],
      links: [],
    }
  );
}

export async function persistExtractedMemories(
  supabase: SupabaseClient,
  userId: string,
  memories: NewKnowledgeObject[]
) {
  if (memories.length === 0) return [];

  const { data, error } = await supabase
    .from("knowledge_objects")
    .insert(
      memories.map((memory) => ({
        ...memory,
        user_id: userId,
        visibility: memory.visibility ?? "private",
        status: memory.status ?? "active",
        tags: memory.tags ?? [],
        metadata: memory.metadata ?? {},
      }))
    )
    .select("id, title");

  if (error) throw error;
  return data ?? [];
}

export async function persistExtractedLinks(
  supabase: SupabaseClient,
  userId: string,
  links: ExtractedLink[],
  titleToId: Map<string, string>
) {
  const rows = links
    .map((link) => {
      const fromId = titleToId.get(link.from_title.toLowerCase());
      const toId = titleToId.get(link.to_title.toLowerCase());
      if (!fromId || !toId || fromId === toId) return null;
      return {
        user_id: userId,
        from_memory_id: fromId,
        to_memory_id: toId,
        relation_type: link.relation_type,
        strength: link.strength ?? 1,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) return [];

  const { data, error } = await supabase
    .from("knowledge_links")
    .insert(rows)
    .select("id");

  if (error) throw error;
  return data ?? [];
}

export async function dualWriteSectionUpdates(
  supabase: SupabaseClient,
  userId: string,
  updates: Record<string, string>,
  source: MemorySource
) {
  return syncKnowledgeFromSectionUpdates(supabase, userId, updates, source);
}
