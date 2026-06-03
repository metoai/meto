import type { CompileFormat } from "@/lib/types";
import { getPublicProfileUrl } from "@/lib/site";

export type ContextSectionInput = {
  section_type: string;
  title: string;
  content: string;
  id?: string;
  is_public?: boolean;
};

export type ContextPresetId =
  | "all"
  | "coding"
  | "writing"
  | "career"
  | "basics"
  | "custom";

/** Preset → section_type keys (matched against available public sections). */
export const PRESET_SECTION_TYPES: Record<
  Exclude<ContextPresetId, "all" | "custom">,
  string[]
> = {
  coding: ["work", "skills", "projects"],
  writing: ["about", "working_style", "goals"],
  career: ["about", "work", "skills", "goals"],
  basics: ["about"],
};

export const PRESET_LABELS: {
  id: Exclude<ContextPresetId, "custom">;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "coding", label: "Coding" },
  { id: "writing", label: "Writing" },
  { id: "career", label: "Career" },
  { id: "basics", label: "Just basics" },
];

export function sectionTypesForPreset(
  preset: Exclude<ContextPresetId, "custom">,
  availableTypes: string[]
): string[] {
  if (preset === "all") {
    return availableTypes;
  }

  const wanted = PRESET_SECTION_TYPES[preset];
  return availableTypes.filter((type) => wanted.includes(type));
}

export function resolveSelectedSectionTypes(
  availableTypes: string[],
  options: { sections?: string[] | null; preset?: string | null }
): string[] {
  if (options.sections && options.sections.length > 0) {
    const requested = new Set(
      options.sections.map((section) => section.trim().toLowerCase())
    );
    return availableTypes.filter((type) => requested.has(type));
  }

  if (options.preset) {
    const key = options.preset.toLowerCase();
    if (key === "all") {
      return availableTypes;
    }

    const presetTypes =
      PRESET_SECTION_TYPES[key as keyof typeof PRESET_SECTION_TYPES];
    if (presetTypes) {
      return availableTypes.filter((type) => presetTypes.includes(type));
    }
  }

  return availableTypes;
}

export function buildContextText(
  sections: ContextSectionInput[],
  selectedSectionTypes: string[],
  format: CompileFormat,
  username: string,
  displayName: string
): string {
  const selected = sections.filter(
    (section) =>
      selectedSectionTypes.includes(section.section_type) &&
      section.content?.trim()
  );

  if (selected.length === 0) {
    return "";
  }

  switch (format) {
    case "universal": {
      const body = selected
        .map((section) => `${section.title}\n${section.content.trim()}`)
        .join("\n\n");
      return `Context about ${displayName} — via Meto\n\n${body}\n\n${getPublicProfileUrl(username)}`;
    }
    case "claude": {
      const body = selected
        .map(
          (section) =>
            `<${section.section_type}>\n${section.content.trim()}\n</${section.section_type}>`
        )
        .join("\n");
      return `<context profile="${username}" source="meto">\n${body}\n</context>`;
    }
    case "chatgpt": {
      const body = selected
        .map((section) => `**${section.title}**\n${section.content.trim()}`)
        .join("\n\n");
      return [
        "Here's context about the person you're helping.",
        "Read this before responding.",
        "",
        body,
      ].join("\n");
    }
    case "gemini":
      return selected
        .map((section) => `${section.title}: ${section.content.trim()}`)
        .join("\n\n");
    default:
      return "";
  }
}

export function buildContextShareUrl(
  siteUrl: string,
  username: string,
  preset: ContextPresetId,
  selectedSectionTypes: string[],
  format: CompileFormat
): string {
  const base = `${siteUrl.replace(/\/$/, "")}/profile/${username}/context`;
  const params = new URLSearchParams();

  if (preset !== "custom") {
    params.set("preset", preset);
  } else if (selectedSectionTypes.length > 0) {
    params.set("sections", selectedSectionTypes.join(","));
  }

  if (format !== "universal") {
    params.set("format", format);
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function getSelectedSections(
  sections: ContextSectionInput[],
  selectedSectionTypes: string[]
): ContextSectionInput[] {
  return sections.filter(
    (section) =>
      selectedSectionTypes.includes(section.section_type) &&
      section.content?.trim()
  );
}

export function buildHumanPromptPreview(
  sections: ContextSectionInput[],
  selectedSectionTypes: string[],
  displayName: string
): string {
  const selected = getSelectedSections(sections, selectedSectionTypes);

  if (selected.length === 0) {
    return "";
  }

  const body = selected
    .map((section) => `${section.title}\n${section.content.trim()}`)
    .join("\n\n");

  return `Here's what AI will know about ${displayName}:\n\n${body}`;
}

export function buildHumanSummary(
  sections: ContextSectionInput[],
  selectedSectionTypes: string[],
  displayName: string
): { intro: string; items: string[] } {
  const selected = getSelectedSections(sections, selectedSectionTypes);

  if (selected.length === 0) {
    return {
      intro: "Choose at least one section above to create your AI link.",
      items: [],
    };
  }

  return {
    intro: `AI will learn about ${displayName} from these parts of your profile:`,
    items: selected.map((section) => section.title),
  };
}

export const FORMAT_USER_LABELS: Record<CompileFormat, string> = {
  universal: "any AI tool",
  claude: "Claude",
  chatgpt: "ChatGPT",
  gemini: "Gemini",
};
