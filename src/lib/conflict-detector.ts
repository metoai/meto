/**
 * Profile Conflict Detector (#4)
 * Scans profile sections for factual contradictions using an LLM.
 * Runs after profile updates and surfaces conflicts to the dashboard.
 */
import { generateText } from "@/lib/llm";
import { METO_SCOPE_GUARD } from "@/lib/meto-prompts";

export type ProfileConflict = {
  sections: [string, string];
  description: string;
  severity: "low" | "medium" | "high";
};

export type ConflictReport = {
  conflicts: ProfileConflict[];
  checked_at: string;
};

function buildConflictPrompt(
  sections: Record<string, string>
): string {
  const sectionBlock = Object.entries(sections)
    .filter(([, content]) => content.trim().length > 20)
    .map(([key, content]) => `### ${key}\n${content.trim()}`)
    .join("\n\n");

  return `${METO_SCOPE_GUARD}

You are Meto's profile consistency checker. Your only job is to detect genuine factual contradictions between profile sections — not style differences or vague overlaps.

Profile sections:
${sectionBlock}

Return ONLY valid JSON (no markdown, no explanation):
{
  "conflicts": [
    {
      "sections": ["section_key_1", "section_key_2"],
      "description": "One sentence describing the contradiction.",
      "severity": "low|medium|high"
    }
  ]
}

Rules:
- Only flag real contradictions (e.g., job title conflicts, incompatible tech stacks, conflicting timelines)
- Do NOT flag: style differences, missing information, vague overlaps
- severity "high" = same fact stated differently (e.g., "Senior Engineer" vs "Junior Developer")
- severity "medium" = plausible but unlikely combination (e.g., "10 years React" vs "Started coding 2 years ago")
- severity "low" = worth noting but not critical
- If no conflicts, return { "conflicts": [] }
- Max 5 conflicts`;
}

function parseConflicts(raw: string): ProfileConflict[] {
  try {
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const parsed = JSON.parse(cleaned) as { conflicts?: unknown[] };
    if (!Array.isArray(parsed.conflicts)) return [];

    return parsed.conflicts
      .map((item) => {
        if (typeof item !== "object" || !item) return null;
        const c = item as Record<string, unknown>;
        const sections = Array.isArray(c.sections)
          ? (c.sections.slice(0, 2) as [string, string])
          : (["unknown", "unknown"] as [string, string]);
        const description =
          typeof c.description === "string" ? c.description.trim() : "";
        const severity =
          c.severity === "high" || c.severity === "medium"
            ? c.severity
            : "low";
        if (!description) return null;
        return { sections, description, severity } satisfies ProfileConflict;
      })
      .filter((c): c is ProfileConflict => c !== null);
  } catch {
    return [];
  }
}

/**
 * Detect factual contradictions across profile sections.
 * Returns immediately with empty conflicts if sections have too little content.
 */
export async function detectProfileConflicts(
  sections: Record<string, string>
): Promise<ConflictReport> {
  const filledSections = Object.entries(sections).filter(
    ([, v]) => v.trim().length > 20
  );

  // Need at least 2 filled sections to compare
  if (filledSections.length < 2) {
    return { conflicts: [], checked_at: new Date().toISOString() };
  }

  try {
    const prompt = buildConflictPrompt(sections);
    const raw = await generateText(prompt, { temperature: 0.1 });
    const conflicts = parseConflicts(raw);
    return { conflicts, checked_at: new Date().toISOString() };
  } catch (error) {
    console.error("Conflict detection failed:", error);
    return { conflicts: [], checked_at: new Date().toISOString() };
  }
}
