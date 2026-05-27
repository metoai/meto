import {
  GoogleGenerativeAI,
  type GenerateContentRequest,
} from "@google/generative-ai";
import type { CompileFormat } from "@/lib/types";
import {
  appendCustomSections,
  buildFormatPrompt,
  buildMasterCompilerPrompt,
  sectionsToMap,
} from "@/lib/meto-prompts";

export {
  BRAIN_DUMP_PROMPT,
  CHAT_OPENING_MESSAGE,
  CHAT_SYSTEM_PROMPT,
  CORE_SECTION_TYPES,
  EXTRACT_FROM_CHAT_PROMPT,
  PROFILE_SECTIONS,
} from "@/lib/meto-prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const DEFAULT_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
  "gemini-2.0-flash",
];

const SECTION_KEY_SET = new Set([
  "about",
  "work",
  "projects",
  "skills",
  "goals",
  "working_style",
  "context_for_ai",
]);

function getModelCandidates(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  return [
    ...new Set([preferred, DEFAULT_MODEL, ...FALLBACK_MODELS].filter(Boolean)),
  ];
}

type GenerateOptions = {
  temperature?: number;
};

export function getGeminiModel(
  modelName?: string,
  options?: GenerateOptions
) {
  return genAI.getGenerativeModel({
    model: modelName ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
    generationConfig: {
      temperature: options?.temperature ?? 0.3,
    },
  });
}

export function isGeminiQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("Quota exceeded") ||
    message.includes("Too Many Requests")
  );
}

export function isRetryableGeminiError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    isGeminiQuotaError(error) ||
    message.includes("503") ||
    message.includes("Service Unavailable") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("not supported for generateContent")
  );
}

export function friendlyGeminiError(error: unknown): string {
  if (isRetryableGeminiError(error)) {
    return "AI is temporarily unavailable. Your profile was saved using a basic compile instead.";
  }
  if (error instanceof Error) return error.message;
  return "AI request failed. Please try again.";
}

export async function generateWithGemini(
  input: string | GenerateContentRequest["contents"],
  options?: GenerateOptions
): Promise<string> {
  let lastError: unknown;

  for (const modelName of getModelCandidates()) {
    try {
      const model = getGeminiModel(modelName, options);
      const result = await model.generateContent(input);
      return result.response.text();
    } catch (error) {
      lastError = error;
      if (!isRetryableGeminiError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export function parseJsonFromGemini(text: string): Record<string, string> {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned) as Record<string, string>;
}

export async function compileProfileWithGemini(
  sections: { section_type: string; title: string; content: string }[],
  format: CompileFormat
): Promise<string> {
  const known = sections.filter((s) => SECTION_KEY_SET.has(s.section_type));
  const custom = sections.filter((s) => !SECTION_KEY_SET.has(s.section_type));
  const sectionsMap = sectionsToMap(known);

  const masterCompiled = (
    await generateWithGemini(buildMasterCompilerPrompt(sectionsMap), {
      temperature: 0.3,
    })
  ).trim();

  const formatted = (
    await generateWithGemini(buildFormatPrompt(format, masterCompiled), {
      temperature: 0.3,
    })
  ).trim();

  return appendCustomSections(formatted, custom);
}
