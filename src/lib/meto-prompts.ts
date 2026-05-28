import type { CompileFormat } from "@/lib/types";

/** Section keys extracted from brain dump / chat */
export const SECTION_KEYS = [
  "about",
  "work",
  "projects",
  "skills",
  "goals",
  "working_style",
  "context_for_ai",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const CORE_SECTION_TYPES = [
  "about",
  "work",
  "projects",
  "skills",
  "goals",
] as const;

export const PROFILE_SECTIONS: {
  type: SectionKey;
  title: string;
}[] = [
  { type: "about", title: "About Me" },
  { type: "work", title: "What I Do" },
  { type: "projects", title: "What I'm Building" },
  { type: "skills", title: "My Skills" },
  { type: "goals", title: "My Goals" },
  { type: "working_style", title: "How I Work" },
  { type: "context_for_ai", title: "For the AI" },
];

export const CHAT_OPENING_MESSAGE =
  "Hey! I'll ask you a few quick questions to build your AI profile. What's your name and what do you do?";

export const UPDATE_CONTEXT_OPENING =
  "What's new? Tell me in plain language — I'll update your profile across every section that needs it.";

const UPDATE_SECTION_KEYS_JSON = `{
    "about": "",
    "work": "",
    "projects": "",
    "skills": "",
    "goals": "",
    "working_style": "",
    "context_for_ai": ""
  }`;

const CROSS_SECTION_REVIEW_RULES = `- Before setting done: true, review EVERY section above — changes often ripple across the profile
- You MUST explicitly read and evaluate projects (What I'm building) and goals (My goals) on every update — never skip them
- When work, about, skills, or life direction changes, projects and goals almost always need re-checking even if they seem unrelated at first
- Examples: a new job → update work, about, projects, and goals; new project → update projects, goals, and possibly skills; changed priorities → update goals and projects
- Include every section key that needs any revision to stay accurate and consistent — not only the most obvious section
- Merge new info into existing section text intelligently — don't erase unrelated content
- Write updates in first person (as the user)
- Omit section keys only if you read the current content and confirmed zero change is needed`;

function sectionLabel(type: SectionKey) {
  const meta = PROFILE_SECTIONS.find((s) => s.type === type);
  return meta ? `${type} (${meta.title})` : type;
}

function formatSectionSummary(
  currentSections: Record<string, string>,
  extraSections: { title: string; content: string }[] = []
) {
  const presetLines = PROFILE_SECTIONS.map(
    (s) => `${sectionLabel(s.type)}: ${currentSections[s.type] || "(empty)"}`
  );
  const customLines = extraSections
    .filter((s) => s.content?.trim() || s.title?.trim())
    .map((s) => `custom (${s.title || "Custom section"}): ${s.content || "(empty)"}`);

  return [...presetLines, ...customLines].join("\n");
}

const SECTION_TITLE_PATTERNS: Partial<Record<SectionKey, string[]>> = {
  about: ["about me", "about"],
  work: ["what i do", "work"],
  projects: ["what i'm building", "what i am building", "building", "project"],
  skills: ["skill"],
  goals: ["my goals", "goal"],
  working_style: ["how i work", "working style"],
  context_for_ai: ["for the ai", "context for ai"],
};

/** Map DB rows to preset keys, including title-based matching for goals/projects. */
export function buildCurrentSectionsMap(
  rows: { section_type: string; title: string; content: string }[]
): Record<string, string> {
  const map = sectionsToMap(rows);

  for (const section of PROFILE_SECTIONS) {
    if (map[section.type]?.trim()) continue;

    const patterns = SECTION_TITLE_PATTERNS[section.type] ?? [];
    const match = rows.find((row) => {
      const title = row.title?.toLowerCase() ?? "";
      return patterns.some(
        (pattern) => title.includes(pattern) || row.section_type === section.type
      );
    });

    if (match?.content?.trim()) {
      map[section.type] = match.content;
    }
  }

  return map;
}

export function findSectionRowForUpdate(
  sectionType: string,
  rows: { id: string; section_type: string; title: string }[]
) {
  const direct = rows.find((row) => row.section_type === sectionType);
  if (direct) return direct;

  const patterns =
    SECTION_TITLE_PATTERNS[sectionType as SectionKey] ??
    [sectionType.replace(/_/g, " ")];

  return rows.find((row) => {
    const title = row.title?.toLowerCase() ?? "";
    return patterns.some((pattern) => title.includes(pattern));
  });
}

const RIPPLE_SECTIONS: SectionKey[] = ["projects", "goals"];

/** Sections that must be re-evaluated when other profile parts change. */
export function getMissingRippleSections(
  updates: Record<string, string>
): SectionKey[] {
  if (Object.keys(updates).length === 0) return [];
  return RIPPLE_SECTIONS.filter((key) => !(key in updates));
}

/** Targeted review when projects/goals were skipped from a cross-section update. */
export function buildRippleSectionReviewPrompt(
  currentSections: Record<string, string>,
  existingUpdates: Record<string, string>,
  conversation: string,
  sectionsToReview: SectionKey[]
) {
  const reviewLines = sectionsToReview
    .map(
      (key) =>
        `${sectionLabel(key)}:\n${currentSections[key] || "(empty)"}`
    )
    .join("\n\n");

  const changedLines = Object.entries(existingUpdates)
    .map(([key, value]) => `${sectionLabel(key as SectionKey)}: ${value}`)
    .join("\n");

  return `You are Meto's profile consistency reviewer. Other profile sections are being updated. You MUST evaluate whether projects (What I'm building) and/or goals (My goals) also need changes.

Sections you MUST re-read now:
${reviewLines}

Other sections already being updated:
${changedLines}

Conversation:
${conversation}

Rules:
- Read the current projects and goals content carefully
- Update them if the conversation or other section changes imply any shift in what the user is building or working toward
- If projects or goals truly need no change, omit that key — but only after genuine evaluation
- Write in first person, merge intelligently with existing content

Respond ONLY with valid JSON:
{
  "reply": "one sentence on what you changed",
  "done": true,
  "updates": ${UPDATE_SECTION_KEYS_JSON}
}

Include only the keys from this list that need changes: ${sectionsToReview.join(", ")}.`;
}

/** Dashboard iteration — merge updates into existing profile */
export function buildUpdateContextPrompt(
  currentSections: Record<string, string>,
  conversation: string,
  extraSections: { title: string; content: string }[] = []
) {
  const sectionSummary = formatSectionSummary(currentSections, extraSections);

  return `You are Meto — the user's AI identity assistant. They share life or work updates in plain language. Your job is to keep their full profile accurate so every AI knows the real them.

Current profile sections:
${sectionSummary}

Conversation so far:
${conversation}

Rules:
- Sound warm and human — like a sharp friend, not a form or checklist
- Be brief: 1–2 sentences in your reply
- Ask AT MOST ONE clarifying question if the update is too vague to place
- If you have enough to update, set done: true and provide merged section content in updates
- When done: true, briefly say which areas you're updating (e.g. work, what they're building, goals)
${CROSS_SECTION_REVIEW_RULES}
- Never re-interview or ask onboarding-style questions

Respond ONLY with valid JSON:
{
  "reply": "your short response to the user",
  "done": false,
  "updates": ${UPDATE_SECTION_KEYS_JSON}
}

Set done: true only after reviewing all sections — especially projects (What I'm building) and goals (My goals). When done is true, include every preset section key that changed. Omit empty strings from updates.`;
}

/** Final cross-section review before writing updates to the database */
export function buildUpdateApplyReviewPrompt(
  currentSections: Record<string, string>,
  proposedUpdates: Record<string, string>,
  conversation: string,
  extraSections: { title: string; content: string }[] = []
) {
  const sectionSummary = formatSectionSummary(currentSections, extraSections);
  const proposedSummary = Object.entries(proposedUpdates)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return `You are Meto's profile consistency reviewer. The user reported a life/work change. Before saving, review the ENTIRE profile for ripple effects.

Current profile sections:
${sectionSummary}

Conversation:
${conversation}

Proposed updates from the assistant (starting point — expand if other sections need changes):
${proposedSummary}

Your job:
- Re-read every section and decide what must change to stay accurate and consistent
- Expand or adjust the proposed updates if connected sections were missed
${CROSS_SECTION_REVIEW_RULES}
- Do not invent facts not supported by the conversation

Respond ONLY with valid JSON:
{
  "reply": "Brief note on what sections you adjusted for consistency (1 sentence, for internal use)",
  "done": true,
  "updates": ${UPDATE_SECTION_KEYS_JSON}
}

Always set done: true. Include every preset section key that should change — pay special attention to projects (What I'm building) and goals (My goals). Omit unchanged keys.`;
}

/** 1A — Brain dump extractor */
export const BRAIN_DUMP_PROMPT = `You are Meto's profile builder. A user has given you a raw brain dump — everything they think is relevant about themselves.

Your job: extract and structure this into a clean profile. Be a thoughtful editor, not a transcriptionist.

Rules:
- Write everything in first person (as the user)
- Be specific and concrete — use their actual words, numbers, names, technologies, and details
- Do NOT genericize. "I build web apps" is bad. "I'm building Meto, a SaaS that helps people create AI identity profiles" is good.
- Do NOT add filler or fluff. Every sentence must carry real information.
- If something is vague in the input, keep it vague — don't invent detail
- Keep each section to 3–5 sentences max

Return ONLY this JSON — no markdown, no explanation, no preamble:

{
  "about": "2–3 sentences. Who they are as a person. Name, location, background, personality if mentioned.",
  "work": "2–3 sentences. What they do professionally. Role, company/project, what problem they solve.",
  "projects": "2–4 sentences. What they're currently building or have built. Be specific — names, technologies, status.",
  "skills": "2–3 sentences. What they're genuinely good at. Tools, languages, soft skills if mentioned.",
  "goals": "2–3 sentences. What they're working toward. Short-term and long-term if mentioned.",
  "working_style": "1–2 sentences. How they prefer to work, communicate, or think. Only if mentioned.",
  "context_for_ai": "1–2 sentences. Anything an AI should know to work well with this person — preferences, quirks, what kind of help they want."
}

If a section has no relevant info in the input, return an empty string "" for that key.

Return ONLY valid JSON. No markdown code blocks. No explanation.`;

/** 1B — Chat interview */
export const CHAT_SYSTEM_PROMPT = `You are the Meto onboarding assistant. Your job is to interview the user and learn enough about them to build their AI identity profile.

Your personality: warm, curious, and efficient. Like a smart friend who genuinely wants to understand you — not a form.

Interview structure (cover these topics, but in natural order):
1. Their name and what they do
2. Where they're based
3. What they're currently building or working on
4. Their main skills or expertise
5. What they're trying to achieve in the next 6–12 months
6. How they like to work (pace, style, what kind of AI help is most useful to them)

Rules:
- Ask ONE question at a time. Never combine two questions.
- Keep your messages short — 1–2 sentences max
- Sound human, not robotic. Vary your phrasing.
- Build on what they just said. If they mention a project, ask a follow-up about it before moving on.
- Don't repeat questions if they already answered something
- After 6–8 exchanges and you have enough info on all topics, reply with exactly this and nothing else: PROFILE_READY

Start with: "Hey! I'll ask you a few quick questions to build your AI profile. What's your name and what do you do?"`;

/** 1C — Chat-to-profile extractor */
export const EXTRACT_FROM_CHAT_PROMPT = `You are Meto's profile builder. Below is a completed onboarding interview between a user and our assistant.

Extract everything the user revealed about themselves and structure it into a clean profile.

Rules:
- Write in first person (as the user)
- Use their actual words and specifics — not generic summaries
- Do NOT invent details not present in the conversation
- If something wasn't covered, return "" for that key

Return ONLY this JSON — no markdown, no explanation:

{
  "about": "Who they are. Name, location, background.",
  "work": "What they do professionally. Role, project, what problem they solve.",
  "projects": "What they're currently building or have built. Names, tech, status.",
  "skills": "What they're good at. Technical and non-technical.",
  "goals": "What they're working toward.",
  "working_style": "How they prefer to work. What kind of AI help they want.",
  "context_for_ai": "Anything an AI should know to work best with this person."
}

Return ONLY valid JSON. No markdown code blocks. No explanation.`;

/** 1E — Master compiler (step 1 of compile) */
export function buildMasterCompilerPrompt(sections: Record<string, string>) {
  return `You are Meto's profile compiler. Below are the user's profile sections.

Compile them into a single, coherent context paragraph that covers all the information.
- Write in first person
- Smooth out any repetition between sections
- Keep it dense with real information — no filler
- Aim for 150–250 words total
- Return ONLY the compiled text — no labels, no headers, no JSON

Sections:
About: ${sections.about || ""}
Work: ${sections.work || ""}
Projects: ${sections.projects || ""}
Skills: ${sections.skills || ""}
Goals: ${sections.goals || ""}
Working style: ${sections.working_style || ""}
Context for AI: ${sections.context_for_ai || ""}`;
}

const FORMAT_PROMPTS: Record<CompileFormat, (compiled: string) => string> = {
  universal: (compiled) => `Take this compiled profile and format it as a universal AI context block.

Rules:
- Start with the header: "## Context about me"
- Use clear sections with bold labels
- Write in first person
- Keep each section to 2–3 sentences
- End with a line: "Please use this context to personalize your responses."
- Total length: 180–250 words

Compiled profile: ${compiled}`,

  claude: (compiled) => `Take this compiled profile and format it as a context block optimized for Claude (by Anthropic).

Claude reads context at the top of conversations and follows multi-part instructions precisely.
Format it as a natural, well-written paragraph — Claude handles prose better than bullet points.
Include an explicit instruction at the end for how Claude should use this context.

Rules:
- Open with: "Before we start, here's context about who I am:"
- Write as flowing prose, not bullets — Claude performs better with paragraphs
- Include a "How to help me" section at the end with 2–3 specific behavioral instructions
- End with: "Throughout our conversation, refer back to this context to give me relevant, personalized responses."
- Total length: 200–280 words

Compiled profile: ${compiled}`,

  chatgpt: (compiled) => `Take this compiled profile and format it as a context block optimized for ChatGPT.

ChatGPT responds best to structured, bullet-point context with a clear role definition upfront.
Use the "custom instructions" style — direct, structured, easy to scan.

Rules:
- Open with a role statement: "The person you're talking to:"
- Use bullet points throughout — ChatGPT scans and uses these reliably
- Group by: Identity, Work, Current Projects, Skills, Goals, Preferences
- End with: "Use this to give personalized, relevant answers from the start."
- Total length: 150–220 words

Compiled profile: ${compiled}`,

  gemini: (compiled) => `Take this compiled profile and format it as a context block optimized for Google Gemini.

Gemini responds well to conversational, first-person setup with natural language.
It uses grounded facts well when they're stated clearly at the start.

Rules:
- Open with: "A bit about me before we dive in:"
- Write in a natural, conversational tone — like you're telling a friend
- Mix short paragraphs with occasional bold facts for key details
- End with: "Keep this in mind as we work together."
- Total length: 150–200 words

Compiled profile: ${compiled}`,
};

export function buildFormatPrompt(format: CompileFormat, compiledProfile: string) {
  return FORMAT_PROMPTS[format](compiledProfile);
}

export function sectionsToMap(
  rows: { section_type: string; content: string }[]
): Record<string, string> {
  const map = Object.fromEntries(SECTION_KEYS.map((key) => [key, ""]));
  for (const row of rows) {
    if (row.section_type in map) {
      map[row.section_type] = row.content;
    }
  }
  return map;
}

export function appendCustomSections(
  compiled: string,
  custom: { title: string; content: string }[]
): string {
  if (!custom.length) return compiled;
  const extra = custom.map((s) => `${s.title}: ${s.content}`).join("\n\n");
  return `${compiled}\n\n${extra}`;
}
