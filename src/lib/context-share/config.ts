import type { CompileFormat } from "@/lib/types";
import type { ContextPresetId } from "@/lib/context-templates";

export type IntentPreset = {
  id: Exclude<ContextPresetId, "custom">;
  label: string;
  description: string;
};

export const INTENT_PRESETS: IntentPreset[] = [
  {
    id: "all",
    label: "Everything",
    description: "Full profile — best for a new AI chat",
  },
  {
    id: "coding",
    label: "Build & code",
    description: "Work, skills, and active projects",
  },
  {
    id: "writing",
    label: "Write & create",
    description: "Voice, style, and creative goals",
  },
  {
    id: "career",
    label: "Career move",
    description: "Background, experience, and ambitions",
  },
  {
    id: "basics",
    label: "Quick intro",
    description: "Just who you are — one section",
  },
];

export type PlatformOption = {
  id: CompileFormat;
  label: string;
  hint: string;
};

export const PLATFORM_OPTIONS: PlatformOption[] = [
  { id: "universal", label: "Any AI", hint: "Plain text, works everywhere" },
  { id: "claude", label: "Claude", hint: "XML-tagged blocks" },
  { id: "chatgpt", label: "ChatGPT", hint: "Markdown with headers" },
  { id: "gemini", label: "Gemini", hint: "Short labeled lines" },
];

export const SECTION_EMOJI: Record<string, string> = {
  about: "👤",
  work: "💼",
  projects: "🛠",
  skills: "⚡",
  goals: "🎯",
  working_style: "🤝",
  context_for_ai: "🤖",
  custom: "✦",
};

export function sectionEmoji(sectionType: string) {
  return SECTION_EMOJI[sectionType] ?? SECTION_EMOJI.custom;
}

export function truncateContent(content: string, max = 72) {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}
