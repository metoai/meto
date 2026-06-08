import type { CompileFormat } from "@/lib/types";

type SectionInput = { title: string; content: string };

export function compileLocally(
  format: CompileFormat,
  sections: SectionInput[]
): string {
  switch (format) {
    case "claude":
      return [
        "Before we start, here's context about who I am:",
        "",
        sections.map((s) => s.content).join("\n\n"),
        "",
        "Throughout our conversation, refer back to this context to give me relevant, personalized responses.",
      ].join("\n");

    case "chatgpt":
      return [
        "The person you're talking to:",
        "",
        ...sections.map((s) => `- **${s.title}**: ${s.content}`),
        "",
        "Use this to give personalized, relevant answers from the start.",
      ].join("\n");

    case "gemini":
    case "qwen":
      return [
        "A bit about me before we dive in:",
        "",
        sections.map((s) => s.content).join("\n\n"),
        "",
        "Keep this in mind as we work together.",
      ].join("\n");

    case "deepseek":
      return [
        "Here's context about the person you're helping.",
        "",
        ...sections.map((s) => `**${s.title}**\n${s.content}`),
        "",
        "Read this before responding.",
      ].join("\n\n");

    case "grok":
      return [
        "Context about me:",
        "",
        ...sections.map((s) => `- **${s.title}**: ${s.content}`),
      ].join("\n");

    case "kimi":
      return [
        "## Context about me",
        "",
        ...sections.map((s) => `**${s.title}:** ${s.content}`),
        "",
        "Please use this context to personalize your responses.",
      ].join("\n\n");

    case "universal":
    default:
      return [
        "## Context about me",
        "",
        ...sections.map((s) => `**${s.title}:** ${s.content}`),
        "",
        "Please use this context to personalize your responses.",
      ].join("\n\n");
  }
}
