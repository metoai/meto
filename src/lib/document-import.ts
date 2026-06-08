/** Limits and allowlist for Update chat document attachments. */

export const DOCUMENT_IMPORT = {
  MAX_FILE_BYTES: 5 * 1024 * 1024,
  MAX_FILES: 3,
  MAX_EXTRACTED_CHARS: 50_000,
  /** Cap passed to update-chat — keeps ingest fast without a separate LLM pass. */
  MAX_FACT_CHARS: 18_000,
  RATE_LIMIT: 10,
  RATE_WINDOW_MS: 60 * 60 * 1000,
} as const;

/** Local path: pass truncated text as facts (update-chat prompt already treats docs as untrusted). */
export function formatLocalDocumentFacts(
  filename: string,
  rawText: string,
  truncated: boolean
): string {
  const header = `Document: ${filename}${truncated ? " (truncated)" : ""}`;
  return `${header}\n\n${rawText}`;
}

export type DocumentImportMode = "supplement" | "refresh";

export type IngestedDocument = {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  extractedChars: number;
  truncated: boolean;
  facts: string;
};

export const CUSTOM_SECTION_KEY_PREFIX = "custom:";

export function isCustomSectionUpdateKey(key: string): boolean {
  return key.startsWith(CUSTOM_SECTION_KEY_PREFIX);
}

export function customSectionTitleFromKey(key: string): string {
  return key.slice(CUSTOM_SECTION_KEY_PREFIX.length).trim();
}

export function customSectionUpdateKey(title: string): string {
  return `${CUSTOM_SECTION_KEY_PREFIX}${title.trim()}`;
}

const EXTENSIONS: Record<string, string[]> = {
  pdf: ["application/pdf"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  txt: ["text/plain"],
  md: ["text/markdown", "text/x-markdown"],
  csv: ["text/csv", "application/csv"],
  rtf: ["application/rtf", "text/rtf"],
};

export function extensionFromFilename(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot < 0) return "";
  return filename.slice(dot + 1).toLowerCase();
}

export function isAllowedDocumentFilename(filename: string): boolean {
  const ext = extensionFromFilename(filename);
  return ext in EXTENSIONS || ext === "doc";
}

export function isAllowedDocumentMime(
  filename: string,
  mimeType: string
): boolean {
  const ext = extensionFromFilename(filename);
  if (ext === "doc") {
    return mimeType === "application/msword" || mimeType === "";
  }
  const allowed = EXTENSIONS[ext];
  if (!allowed) return false;
  if (!mimeType) return true;
  return allowed.includes(mimeType);
}

export const DOCUMENT_ACCEPT =
  ".pdf,.docx,.doc,.txt,.md,.csv,.rtf,application/pdf,text/plain,text/markdown";
