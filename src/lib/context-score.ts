import {

  CORE_SECTION_TYPES,

  METO_SCOPE_GUARD,

  PROFILE_SECTIONS,

  type SectionKey,

} from "@/lib/meto-prompts";

import {
  computeOverallProfileScore,
  gapsFromThinSections,
  headlineForScore,
} from "@/lib/section-quality";
import {
  generateWithGemini,
  isRetryableGeminiError,
  parseJsonFromGemini,
} from "@/lib/gemini";

export type ContextScoreGap = {

  section_type: string;

  title: string;

  insight: string;

  fix_label: string;

};



export type ContextScoreResult = {

  score: number;

  headline: string;

  summary: string;

  gaps: ContextScoreGap[];

  analyzed_at: string;

  used_fallback?: boolean;

};



type SectionInput = {

  section_type: string;

  title: string;

  content: string;

  updated_at?: string;

};



const VALID_SECTION_TYPES = new Set<string>([

  ...PROFILE_SECTIONS.map((s) => s.type),

]);



const STALE_GOALS_MS = 1000 * 60 * 60 * 24 * 240; // ~8 months

const MIN_RESOLVED_CONTENT = 40;

const THIN_SECTION_CHARS = 35;

const GAP_ELIGIBLE_CHARS = 30;



const SECTION_WEIGHTS: Record<string, number> = {

  about: 12,

  work: 14,

  projects: 14,

  skills: 12,

  goals: 14,

  working_style: 18,

  context_for_ai: 16,

};



function sectionTitle(sectionType: string) {

  const meta = PROFILE_SECTIONS.find((s) => s.type === sectionType);

  return meta?.title ?? sectionType;

}



function clampScore(value: unknown) {

  const score = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(score)) return 0;

  return Math.max(0, Math.min(100, Math.round(score)));

}



function sectionContentLength(

  sections: SectionInput[],

  sectionType: string

): number {

  const row = sections.find((s) => s.section_type === sectionType);

  return row?.content?.trim().length ?? 0;

}



/** Deterministic score from section content — floor for LLM results. */

export function computeContentScore(sections: SectionInput[]): number {

  let filledWeight = 0;



  for (const [type, weight] of Object.entries(SECTION_WEIGHTS)) {

    const len = sectionContentLength(sections, type);

    if (len >= MIN_RESOLVED_CONTENT) {

      filledWeight += weight;

    } else if (len >= GAP_ELIGIBLE_CHARS) {

      filledWeight += weight * 0.55;

    } else if (len >= 12) {

      filledWeight += weight * 0.3;

    }

  }



  return clampScore(filledWeight);

}



function isStaleGoalsRow(row: SectionInput | undefined): boolean {

  if (!row?.updated_at || !row.content?.trim()) return false;

  const age = Date.now() - new Date(row.updated_at).getTime();

  return age > STALE_GOALS_MS;

}



/** Only surface gaps for sections that are actually empty or thin. */

export function filterActionableGaps(

  gaps: ContextScoreGap[],

  sections: SectionInput[]

): ContextScoreGap[] {

  const byType = new Map(sections.map((s) => [s.section_type, s]));



  return gaps.filter((gap, index, list) => {

    if (

      list.findIndex((item) => item.section_type === gap.section_type) !==

      index

    ) {

      return false;

    }



    const row = byType.get(gap.section_type);

    const len = row?.content?.trim().length ?? 0;



    if (gap.section_type === "goals" && isStaleGoalsRow(row)) {

      return true;

    }



    if (len >= THIN_SECTION_CHARS) {

      return false;

    }



    return len < THIN_SECTION_CHARS;

  });

}



function capGapsForScore(

  gaps: ContextScoreGap[],

  score: number

): ContextScoreGap[] {

  if (score >= 85) return gaps.slice(0, 1);

  if (score >= 70) return gaps.slice(0, 2);

  return gaps.slice(0, 3);

}

function dedupeGaps(gaps: ContextScoreGap[]): ContextScoreGap[] {
  const seen = new Set<string>();
  return gaps.filter((gap) => {
    if (seen.has(gap.section_type)) return false;
    seen.add(gap.section_type);
    return true;
  });
}

/** Single formula for hero score + section bars — no artificial inflation. */
export function finalizeContextScore(
  sections: SectionInput[],
  llmGaps: ContextScoreGap[] = [],
  resolvedSections: string[] = []
): ContextScoreResult {
  const byType = new Map(sections.map((s) => [s.section_type, s]));
  const stillResolved = resolvedSections.filter(
    (type) =>
      (byType.get(type)?.content?.trim().length ?? 0) >= MIN_RESOLVED_CONTENT
  );
  const resolvedSet = new Set(stillResolved);

  const mergedGaps = dedupeGaps([
    ...llmGaps,
    ...gapsFromThinSections(sections),
  ]).filter((gap) => !resolvedSet.has(gap.section_type));

  const filtered = filterActionableGaps(mergedGaps, sections);
  const score = computeOverallProfileScore(sections, filtered);
  const gaps = capGapsForScore(filtered, score);
  const copy = headlineForScore(score, gaps.length);

  return {
    score,
    headline: copy.headline,
    summary: copy.summary,
    gaps,
    analyzed_at: new Date().toISOString(),
  };
}



export function applyResolvedSections(

  result: ContextScoreResult,

  resolvedSections: string[],

  sections: SectionInput[],

  previousScore?: number | null

): { result: ContextScoreResult; resolvedSections: string[] } {

  const byType = new Map(sections.map((s) => [s.section_type, s]));

  const stillResolved = resolvedSections.filter((type) => {

    const content = byType.get(type)?.content?.trim() ?? "";

    return content.length >= MIN_RESOLVED_CONTENT;

  });

  const finalized = finalizeContextScore(
    sections,
    result.gaps,
    stillResolved
  );

  const score = finalized.score;

  const copy = headlineForScore(score, finalized.gaps.length);

  return {
    resolvedSections: stillResolved,
    result: {
      ...finalized,
      score: clampScore(score),
      headline: copy.headline,
      summary: copy.summary,
    },
  };

}



function normalizeGap(raw: Record<string, unknown>): ContextScoreGap | null {

  const sectionType =

    typeof raw.section_type === "string" ? raw.section_type.trim() : "";

  const insight = typeof raw.insight === "string" ? raw.insight.trim() : "";

  const fixLabel =

    typeof raw.fix_label === "string"

      ? raw.fix_label.trim()

      : typeof raw.fixLabel === "string"

        ? raw.fixLabel.trim()

        : "Fix this →";



  if (!sectionType || !insight) return null;



  return {

    section_type: sectionType,

    title: sectionTitle(sectionType),

    insight,

    fix_label: fixLabel || "Fix this →",

  };

}



export function buildContextScorePrompt(sections: SectionInput[]): string {

  const lines = PROFILE_SECTIONS.map((meta) => {

    const row = sections.find((s) => s.section_type === meta.type);

    const content = row?.content?.trim();

    const updated = row?.updated_at ? ` (updated ${row.updated_at})` : "";

    return `${meta.type} (${meta.title})${updated}: ${content || "(empty)"}`;

  });



  const custom = sections.filter(

    (s) => !VALID_SECTION_TYPES.has(s.section_type) && s.content?.trim()

  );

  for (const row of custom) {

    lines.push(

      `${row.section_type} (${row.title || "Custom"}): ${row.content.trim()}`

    );

  }



  const baseline = computeContentScore(sections);



  return `${METO_SCOPE_GUARD}



You analyze AI identity profiles for Meto — a product that stores who someone is so any AI tool can understand them.



Given this person's profile sections, estimate how well a top AI assistant would understand them in a new conversation.



Return ONLY valid JSON (no markdown):

{

  "score": number 0-100,

  "headline": "short honest headline",

  "summary": "1-2 sentences",

  "gaps": [

    {

      "section_type": "about|work|projects|skills|goals|working_style|context_for_ai",

      "insight": "what AI would get wrong — only if section is empty or very thin",

      "fix_label": "Fix this →"

    }

  ]

}



Rules:

- score must reflect content quality; baseline from content is ~${baseline} — do not score far below this unless sections are truly empty

- ONLY flag gaps for sections that are empty or have fewer than ${THIN_SECTION_CHARS} characters of useful content

- Do NOT invent stylistic nitpicks, tone preferences, or hypothetical mistakes for sections that already have solid content

- return 0–3 gaps max, ordered by impact; prefer fewer gaps when profile is decent (score > 65)

- calibrate honestly — do not inflate scores to encourage the user; do not be harsh or dismissive

- headline and summary must match the score band; no cheerleading when sections are thin

- goals stale only if updated_at is old AND content references outdated plans

- write in second person ("you", "your")

- do not be generic or gamified



Profile sections:

${lines.join("\n")}`;

}



export function analyzeContextScoreLocally(

  sections: SectionInput[]

): ContextScoreResult {

  const byType = new Map(sections.map((s) => [s.section_type, s]));

  const gaps: ContextScoreGap[] = [];



  const priorityChecks: {

    type: SectionKey | (typeof CORE_SECTION_TYPES)[number];

    emptyInsight: string;

    thinInsight?: string;

  }[] = [

    {

      type: "working_style",

      emptyInsight:

        "AI doesn't know how you like to communicate — it may give answers in the wrong format.",

      thinInsight:

        "Your communication preferences are barely sketched. AI will guess how formal or detailed to be.",

    },

    {

      type: "context_for_ai",

      emptyInsight:

        "AI doesn't know your constraints or pet peeves — it can't tailor answers to how you work.",

    },

    {

      type: "goals",

      emptyInsight:

        "AI doesn't know what you're working toward — advice won't match your priorities.",

    },

    {

      type: "about",

      emptyInsight:

        "AI doesn't know who you are beyond a job title — introductions will feel generic.",

    },

    {

      type: "work",

      emptyInsight:

        "AI doesn't know what you do day to day — it will guess your role.",

    },

    {

      type: "skills",

      emptyInsight:

        "AI doesn't know your stack or strengths — technical advice won't match your level.",

    },

    {

      type: "projects",

      emptyInsight:

        "AI doesn't know what you're building — it can't connect advice to your work.",

    },

  ];



  for (const check of priorityChecks) {

    const row = byType.get(check.type);

    const content = row?.content?.trim() ?? "";

    if (!content) {

      gaps.push({

        section_type: check.type,

        title: sectionTitle(check.type),

        insight: check.emptyInsight,

        fix_label: "Fix this in 30 seconds →",

      });

    } else if (content.length < THIN_SECTION_CHARS && check.thinInsight) {

      gaps.push({

        section_type: check.type,

        title: sectionTitle(check.type),

        insight: check.thinInsight,

        fix_label: "Add a bit more →",

      });

    }

  }



  const goalsRow = byType.get("goals");

  if (isStaleGoalsRow(goalsRow)) {

    gaps.push({

      section_type: "goals",

      title: sectionTitle("goals"),

      insight:

        "Your goals haven't been updated in a while. AI may be optimizing for an old version of you.",

      fix_label: "Update your goals →",

    });

  }



  const uniqueGaps = filterActionableGaps(gaps, sections);

  const finalized = finalizeContextScore(sections, uniqueGaps);

  return {
    ...finalized,
    used_fallback: true,
  };

}



export async function analyzeContextScoreWithGemini(

  sections: SectionInput[]

): Promise<ContextScoreResult> {

  const rawText = await generateWithGemini(buildContextScorePrompt(sections), {

    temperature: 0.35,

  });



  const parsed = parseJsonFromGemini(rawText) as Record<string, unknown>;

  const gapsRaw = Array.isArray(parsed.gaps) ? parsed.gaps : [];

  const llmGaps = gapsRaw
    .map((gap) =>
      normalizeGap(
        typeof gap === "object" && gap !== null
          ? (gap as Record<string, unknown>)
          : {}
      )
    )
    .filter((gap): gap is ContextScoreGap => Boolean(gap));

  const finalized = finalizeContextScore(sections, llmGaps);

  return {
    ...finalized,
    used_fallback: false,
  };

}



export async function analyzeContextScore(

  sections: SectionInput[]

): Promise<ContextScoreResult> {

  if (!sections.some((s) => s.content?.trim())) {

    return analyzeContextScoreLocally(sections);

  }



  try {

    return await analyzeContextScoreWithGemini(sections);

  } catch (error) {

    if (isRetryableGeminiError(error)) {

      return analyzeContextScoreLocally(sections);

    }

    throw error;

  }

}



export function finalizeScoreAfterFixes(

  result: ContextScoreResult,

  resolvedSections: string[],

  sections: SectionInput[],

  previousScore?: number | null

): ContextScoreResult {

  const applied = applyResolvedSections(

    result,

    resolvedSections,

    sections,

    previousScore

  );

  return applied.result;

}


