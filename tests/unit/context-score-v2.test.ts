import { describe, it, expect } from "vitest";
import { analyzeContextScoreV2, blendWithSectionScore } from "@/lib/context-score-v2";
import type { KnowledgeObject } from "@/lib/knowledge/types";

describe("context-score-v2", () => {
  const baseMemory = (overrides: Partial<KnowledgeObject> = {}): KnowledgeObject => ({
    id: "mem-1",
    user_id: "user-1",
    type: "skill",
    title: "TypeScript",
    content: "Advanced TypeScript development including generics and AST manipulation.",
    confidence: 1,
    importance: 4,
    visibility: "private",
    source: "manual",
    status: "active",
    created_by: "user",
    tags: ["tech"],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_verified_at: new Date().toISOString(),
    ...overrides,
  });

  it("identifies duplicate memories", () => {
    const mem1 = baseMemory({ id: "1", title: "TypeScript 1", content: "Advanced TypeScript development" });
    const mem2 = baseMemory({ id: "2", title: "TypeScript 2", content: "Advanced TypeScript development" });

    const result = analyzeContextScoreV2([mem1, mem2], [], 80);
    expect(result.gaps.some((g) => g.title === "Duplicate memory")).toBe(true);
  });

  it("identifies stale high-importance memories (>90 days)", () => {
    const fourMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString();
    const staleMem = baseMemory({
      id: "stale-1",
      title: "Previous Role",
      importance: 5,
      updated_at: fourMonthsAgo,
      last_verified_at: fourMonthsAgo,
    });

    const result = analyzeContextScoreV2([staleMem], [], 70);
    expect(result.gaps.some((g) => g.title === "Stale memory")).toBe(true);
  });

  it("identifies contradiction relationships", () => {
    const mem1 = baseMemory({ id: "1", title: "Prefers Tailwind" });
    const mem2 = baseMemory({ id: "2", title: "Prefers CSS Modules" });
    const links = [{ from_memory_id: "1", to_memory_id: "2", relation_type: "contradicts" }];

    const result = analyzeContextScoreV2([mem1, mem2], links, 80);
    expect(result.gaps.some((g) => g.title === "Contradiction")).toBe(true);
  });

  it("identifies unlinked orphan memories with high importance", () => {
    const orphan = baseMemory({ id: "orphan-1", importance: 3 });
    const result = analyzeContextScoreV2([orphan], [], 80);
    expect(result.gaps.some((g) => g.title === "Unlinked memory")).toBe(true);
  });

  it("blends section score with v2 memory score smoothly", () => {
    const sectionResult = {
      score: 85,
      headline: "Good Profile",
      summary: "Profile is detailed.",
      gaps: [{ section_type: "about", title: "Add bio", insight: "Bio is short", fix_label: "Fix" }],
      analyzed_at: new Date().toISOString(),
    };

    const mem = baseMemory({ id: "1" });
    const blended = blendWithSectionScore(sectionResult, [mem], []);

    expect(blended.score).toBeGreaterThan(0);
    expect(blended.gaps.length).toBeGreaterThanOrEqual(1);
    expect(blended.summary).toContain("Profile is detailed.");
  });
});
