export type MetoStatusPhase = "idle" | "reading" | "thinking" | "saving";

export const METO_STATUS_LABELS = {
  readingFile: [
    "Reading your file",
    "Extracting text",
    "Pulling out what matters",
  ],
  readingFiles: [
    "Reading your files",
    "Extracting text",
    "Reviewing the details",
  ],
  attachment: ["Reading", "Extracting text", "Almost ready"],
  thinking: [
    "Thinking",
    "Reviewing your profile",
    "Figuring out what to update",
  ],
  saving: ["Saving your updates", "Applying changes"],
} as const;

export function quickUpdateStatusPhase(input: {
  applying: boolean;
  ingesting: boolean;
  typing: boolean;
  gapFixBootstrapping: boolean;
}): MetoStatusPhase {
  if (input.applying) return "saving";
  if (input.ingesting) return "reading";
  if (input.typing || input.gapFixBootstrapping) return "thinking";
  return "idle";
}

export function labelsForStatusPhase(
  phase: MetoStatusPhase,
  multipleFiles = false
): string[] {
  switch (phase) {
    case "reading":
      return multipleFiles
        ? [...METO_STATUS_LABELS.readingFiles]
        : [...METO_STATUS_LABELS.readingFile];
    case "thinking":
      return [...METO_STATUS_LABELS.thinking];
    case "saving":
      return [...METO_STATUS_LABELS.saving];
    default:
      return [];
  }
}
