import type { CompileFormat } from "@/lib/types";

/** Brand marks via https://iconify.design */
export type AiPlatformIconConfig = {
  url: string;
  label: string;
};

const ICONIFY = "https://api.iconify.design";

export const AI_PLATFORM_ICONS: Partial<
  Record<CompileFormat, AiPlatformIconConfig>
> = {
  claude: {
    url: `${ICONIFY}/simple-icons/claude.svg`,
    label: "Claude",
  },
  chatgpt: {
    url: `${ICONIFY}/logos/openai-icon.svg`,
    label: "ChatGPT",
  },
  gemini: {
    url: `${ICONIFY}/simple-icons/googlegemini.svg`,
    label: "Gemini",
  },
};

/**
 * Landing trust row — append entries when Meto adds compile/support for more tools.
 * Example: { id: "copilot", label: "Copilot", url: `${ICONIFY}/simple-icons/microsoftcopilot.svg` }
 */
export type LandingAiPartnerId =
  | "claude"
  | "chatgpt"
  | "gemini"
  | "perplexity";

export const LANDING_AI_PARTNERS: {
  id: LandingAiPartnerId;
  label: string;
  url: string;
}[] = [
  {
    id: "claude",
    label: "Claude",
    url: `${ICONIFY}/simple-icons/claude.svg`,
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    url: `${ICONIFY}/logos/openai-icon.svg`,
  },
  {
    id: "gemini",
    label: "Gemini",
    url: `${ICONIFY}/simple-icons/googlegemini.svg`,
  },
  {
    id: "perplexity",
    label: "Perplexity",
    url: `${ICONIFY}/simple-icons/perplexity.svg`,
  },
];

export function aiPlatformIconUrl(format: CompileFormat) {
  return AI_PLATFORM_ICONS[format]?.url ?? null;
}

export function aiPlatformLabel(format: CompileFormat) {
  return AI_PLATFORM_ICONS[format]?.label ?? "Any AI";
}
