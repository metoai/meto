import { hashContent } from "@/lib/views/hash";

type SectionRow = {
  section_type: string;
  title: string;
  content: string;
  updated_at?: string | null;
};

export function buildMcpHandoffBundle(
  username: string,
  rows: SectionRow[],
  compiledText: string
): { text: string; version: string; updatedAt: string } {
  const version = hashContent(
    rows.map((r) => `${r.section_type}:${r.content}`).join("|")
  );
  const sorted = rows
    .map((r) => r.updated_at)
    .filter((v): v is string => Boolean(v))
    .sort();
  const updatedAt = sorted.at(-1) ?? new Date().toISOString();

  const sectionBlock = rows
    .map(
      (r) =>
        `## ${r.title || r.section_type}\n${r.content.trim() || "(empty)"}`
    )
    .join("\n\n");

  const text = [
    `# Meto Handoff Bundle`,
    ``,
    `username: ${username}`,
    `version: ${version}`,
    `updated_at: ${updatedAt}`,
    ``,
    `## Compiled context`,
    compiledText,
    ``,
    `## Raw sections`,
    sectionBlock,
  ].join("\n");

  return { text, version, updatedAt };
}
