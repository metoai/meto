import type { CompileFormat } from "@/lib/types";

/** Brand marks via https://iconify.design */
export type AiPlatformIconConfig = {
  url: string;
  label: string;
};

const ICONIFY = "https://api.iconify.design";

export const AI_PLATFORM_ICONS: Record<CompileFormat, AiPlatformIconConfig> = {
  universal: { url: "", label: "Any AI" },
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
  deepseek: {
    url: `${ICONIFY}/simple-icons/deepseek.svg`,
    label: "DeepSeek",
  },
  grok: {
    url: `${ICONIFY}/simple-icons/x.svg`,
    label: "Grok",
  },
  kimi: {
    url: `${ICONIFY}/logos/moonshot-ai-icon.svg`,
    label: "Moonshot",
  },
  qwen: {
    url: `${ICONIFY}/simple-icons/qwen.svg`,
    label: "Qwen",
  },
};

export type AiPartnerId =
  | "chatgpt"
  | "gemini"
  | "claude"
  | "deepseek"
  | "grok"
  | "kimi"
  | "qwen";

export type AiPartner = {
  id: AiPartnerId;
  label: string;
  url: string;
  /** Show readable text beside the icon (e.g. Moonshot for Kimi). */
  showLabel?: boolean;
};

/** Logos shown on landing page, workspace, and share UI. */
export const SUPPORTED_AI_PARTNERS: AiPartner[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    url: AI_PLATFORM_ICONS.chatgpt.url,
  },
  {
    id: "gemini",
    label: "Gemini",
    url: AI_PLATFORM_ICONS.gemini.url,
  },
  {
    id: "claude",
    label: "Claude",
    url: AI_PLATFORM_ICONS.claude.url,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    url: AI_PLATFORM_ICONS.deepseek.url,
  },
  {
    id: "grok",
    label: "Grok",
    url: AI_PLATFORM_ICONS.grok.url,
  },
  {
    id: "kimi",
    label: "Moonshot",
    url: AI_PLATFORM_ICONS.kimi.url,
  },
  {
    id: "qwen",
    label: "Qwen",
    url: AI_PLATFORM_ICONS.qwen.url,
  },
];

/** MCP-capable dev tools shown on the connect page */
export const MCP_TOOL_ICONS = {
  cursor: {
    label: "Cursor",
    url: `${ICONIFY}/simple-icons/cursor.svg`,
    hint: "Built-in MCP · one-click install",
  },
  claude: {
    label: "Claude Desktop",
    url: AI_PLATFORM_ICONS.claude.url,
    hint: "Paste config · restart app",
  },
} as const;

export type McpToolId = keyof typeof MCP_TOOL_ICONS;

export function aiPlatformIconUrl(format: CompileFormat) {
  return AI_PLATFORM_ICONS[format]?.url || null;
}

export function aiPlatformLabel(format: CompileFormat) {
  return AI_PLATFORM_ICONS[format]?.label ?? "Any AI";
}
