import {
  GoogleGenerativeAI,
} from "@google/generative-ai";
import type { CompileFormat } from "@/lib/types";
import {
  appendCustomSections,
  buildFormatPrompt,
  buildMasterCompilerPrompt,
  sectionsToMap,
} from "@/lib/meto-prompts";

const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_API_BASE?.trim() || "https://api.deepseek.com";

const DEEPSEEK_DEFAULT_MODEL = "deepseek-v4-flash";
const DEEPSEEK_FALLBACK_MODELS = ["deepseek-chat", "deepseek-v3"];

const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash";
const GEMINI_FALLBACK_MODELS = [
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

type GenerateOptions = {
  temperature?: number;
};

function getDeepSeekModelCandidates(): string[] {
  const preferred =
    process.env.DEEPSEEK_MODEL?.trim() || process.env.LLM_MODEL?.trim();
  return Array.from(
    new Set(
      [preferred, DEEPSEEK_DEFAULT_MODEL, ...DEEPSEEK_FALLBACK_MODELS].filter(
        (model): model is string => Boolean(model)
      )
    )
  );
}

function getGeminiModelCandidates(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  return Array.from(
    new Set(
      [preferred, GEMINI_DEFAULT_MODEL, ...GEMINI_FALLBACK_MODELS].filter(
        (model): model is string => Boolean(model)
      )
    )
  );
}

function getDeepSeekApiKey() {
  return process.env.DEEPSEEK_API_KEY?.trim() || "";
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY?.trim() || "";
}

export function isLlmQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("Quota exceeded") ||
    message.includes("Too Many Requests") ||
    message.includes("rate limit")
  );
}

export function isLlmBillingError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Insufficient Balance") ||
    message.includes("insufficient balance") ||
    message.includes("Payment Required") ||
    message.includes("billing")
  );
}

export function isRetryableLlmError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    isLlmQuotaError(error) ||
    isLlmBillingError(error) ||
    message.includes("503") ||
    message.includes("502") ||
    message.includes("500") ||
    message.includes("Service Unavailable") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("DEEPSEEK_API_KEY") ||
    message.includes("GEMINI_API_KEY") ||
    message.includes("not supported for generateContent")
  );
}

export function friendlyLlmError(error: unknown): string {
  if (isLlmBillingError(error)) {
    const hasGemini = Boolean(getGeminiApiKey());
    const hasDeepSeek = Boolean(getDeepSeekApiKey());
    if (hasDeepSeek && !hasGemini) {
      return "DeepSeek account has insufficient balance. Add credits at platform.deepseek.com or set GEMINI_API_KEY for fallback.";
    }
    if (hasGemini && !hasDeepSeek) {
      return "Gemini API quota or billing issue. Check your Google AI Studio account.";
    }
    return "AI provider billing issue. Check your DeepSeek or Gemini account balance.";
  }
  if (isRetryableLlmError(error)) {
    return "AI is temporarily unavailable. Your profile was saved using a basic compile instead.";
  }
  if (error instanceof Error) return error.message;
  return "AI request failed. Please try again.";
}

async function callDeepSeek(
  model: string,
  prompt: string,
  temperature: number
): Promise<string> {
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getDeepSeekApiKey()}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      stream: false,
    }),
  });

  const data = (await response.json()) as {
    error?: { message?: string };
    choices?: { message?: { content?: string } }[];
  };

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `DeepSeek API error (${response.status})`
    );
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("DeepSeek returned an empty response.");
  }

  return content;
}

async function callGemini(
  modelName: string,
  prompt: string,
  temperature: number
): Promise<string> {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { temperature },
  });
  const result = await model.generateContent(prompt);
  const text = result.response.text()?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }
  return text;
}

async function generateWithDeepSeek(
  input: string,
  temperature: number
): Promise<string> {
  if (!getDeepSeekApiKey()) {
    throw new Error("DEEPSEEK_API_KEY is not configured.");
  }

  let lastError: unknown;
  for (const modelName of getDeepSeekModelCandidates()) {
    try {
      return await callDeepSeek(modelName, input, temperature);
    } catch (error) {
      lastError = error;
      if (!isRetryableLlmError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

async function generateWithGeminiProvider(
  input: string,
  temperature: number
): Promise<string> {
  if (!getGeminiApiKey()) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  let lastError: unknown;
  for (const modelName of getGeminiModelCandidates()) {
    try {
      return await callGemini(modelName, input, temperature);
    } catch (error) {
      lastError = error;
      if (!isRetryableLlmError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function generateText(
  input: string,
  options?: GenerateOptions
): Promise<string> {
  const temperature = options?.temperature ?? 0.3;
  const providers: Array<() => Promise<string>> = [];

  if (getDeepSeekApiKey()) {
    providers.push(() => generateWithDeepSeek(input, temperature));
  }
  if (getGeminiApiKey()) {
    providers.push(() => generateWithGeminiProvider(input, temperature));
  }

  if (providers.length === 0) {
    throw new Error(
      "No AI provider configured. Set DEEPSEEK_API_KEY and/or GEMINI_API_KEY."
    );
  }

  let lastError: unknown;
  for (const provider of providers) {
    try {
      return await provider();
    } catch (error) {
      lastError = error;
      if (!isRetryableLlmError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export function parseJsonFromText(text: string): Record<string, string> {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned) as Record<string, string>;
}

export async function compileProfileWithLlm(
  sections: { section_type: string; title: string; content: string }[],
  format: CompileFormat
): Promise<string> {
  const known = sections.filter((s) => SECTION_KEY_SET.has(s.section_type));
  const custom = sections.filter((s) => !SECTION_KEY_SET.has(s.section_type));
  const sectionsMap = sectionsToMap(known);

  const masterCompiled = (
    await generateText(buildMasterCompilerPrompt(sectionsMap), {
      temperature: 0.3,
    })
  ).trim();

  const formatted = (
    await generateText(buildFormatPrompt(format, masterCompiled), {
      temperature: 0.3,
    })
  ).trim();

  return appendCustomSections(formatted, custom);
}
