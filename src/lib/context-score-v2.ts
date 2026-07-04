import type { ContextScoreGap, ContextScoreResult } from "@/lib/context-score";
import type { KnowledgeObject } from "@/lib/knowledge/types";

type LinkRow = {
  from_memory_id: string;
  to_memory_id: string;
  relation_type: string;
};

const STALE_MS = 1000 * 60 * 60 * 24 * 90;

function findDuplicates(memories: KnowledgeObject[]): ContextScoreGap[] {
  const gaps: ContextScoreGap[] = [];
  const seen = new Map<string, string>();

  for (const memory of memories) {
    const key = `${memory.type}:${memory.content.trim().toLowerCase().slice(0, 80)}`;
    const prior = seen.get(key);
    if (prior) {
      gaps.push({
        section_type: "knowledge",
        title: "Duplicate memory",
        insight: `"${memory.title}" may duplicate "${prior}".`,
        fix_label: "Review memories",
      });
    } else {
      seen.set(key, memory.title);
    }
  }
  return gaps;
}

function findStale(memories: KnowledgeObject[]): ContextScoreGap[] {
  const now = Date.now();
  return memories
    .filter((m) => m.importance >= 4)
    .filter((m) => {
      const verified = m.last_verified_at
        ? new Date(m.last_verified_at).getTime()
        : new Date(m.updated_at).getTime();
      return now - verified > STALE_MS;
    })
    .slice(0, 3)
    .map((m) => ({
      section_type: "knowledge",
      title: "Stale memory",
      insight: `"${m.title}" hasn't been verified in 90+ days.`,
      fix_label: "Verify memory",
    }));
}

function findContradictions(
  memories: KnowledgeObject[],
  links: LinkRow[]
): ContextScoreGap[] {
  const contradicts = links.filter((l) => l.relation_type === "contradicts");
  const byId = new Map(memories.map((m) => [m.id, m]));

  return contradicts.slice(0, 3).map((link) => {
    const from = byId.get(link.from_memory_id);
    const to = byId.get(link.to_memory_id);
    return {
      section_type: "knowledge",
      title: "Contradiction",
      insight: `"${from?.title ?? "Memory"}" contradicts "${to?.title ?? "another memory"}".`,
      fix_label: "Resolve conflict",
    };
  });
}

function findOrphans(memories: KnowledgeObject[], links: LinkRow[]): ContextScoreGap[] {
  const linked = new Set<string>();
  for (const link of links) {
    linked.add(link.from_memory_id);
    linked.add(link.to_memory_id);
  }

  return memories
    .filter((m) => m.importance >= 3 && !linked.has(m.id))
    .slice(0, 2)
    .map((m) => ({
      section_type: "knowledge",
      title: "Unlinked memory",
      insight: `"${m.title}" has no relationships — consider linking it.`,
      fix_label: "Add link",
    }));
}

export function analyzeContextScoreV2(
  memories: KnowledgeObject[],
  links: LinkRow[],
  sectionScore: number
): ContextScoreResult {
  const memoryGaps = [
    ...findDuplicates(memories),
    ...findStale(memories),
    ...findContradictions(memories, links),
    ...findOrphans(memories, links),
  ];

  const memoryCoverage =
    memories.length === 0
      ? 0
      : Math.min(100, Math.round((memories.length / 12) * 100));

  const penalty = Math.min(30, memoryGaps.length * 6);
  const score = Math.max(
    0,
    Math.min(100, Math.round(sectionScore * 0.6 + memoryCoverage * 0.4 - penalty))
  );

  const headline =
    score >= 80
      ? "Strong living memory"
      : score >= 55
        ? "Good foundation — refine memories"
        : "Build your knowledge graph";

  const summary =
    memories.length === 0
      ? "No structured memories yet. Updates will populate your knowledge layer."
      : `${memories.length} active memories. ${memoryGaps.length} knowledge issue${memoryGaps.length === 1 ? "" : "s"} detected.`;

  return {
    score,
    headline,
    summary,
    gaps: memoryGaps,
    analyzed_at: new Date().toISOString(),
    used_fallback: false,
  };
}

export function blendWithSectionScore(
  sectionResult: ContextScoreResult,
  memories: KnowledgeObject[],
  links: LinkRow[]
): ContextScoreResult {
  const v2 = analyzeContextScoreV2(memories, links, sectionResult.score);
  return {
    ...v2,
    gaps: [...sectionResult.gaps, ...v2.gaps].slice(0, 12),
    summary: `${sectionResult.summary} ${v2.summary}`,
  };
}
