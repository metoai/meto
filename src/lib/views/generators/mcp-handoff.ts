import { compileLocally } from "@/lib/compile-local";
import { hashContent } from "@/lib/views/hash";

type SectionRow = {
  section_type: string;
  title: string;
  content: string;
  updated_at?: string | null;
};

export function buildMcpHandoffBundle(
  username: string,
  rows: SectionRow[]
): { text: string; version: string; updatedAt: string } {
  const compiled = compileLocally("universal", rows);
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
    compiled,
    ``,
    `## Raw sections`,
    sectionBlock,
  ].join("\n");

  return { text, version, updatedAt };
}
