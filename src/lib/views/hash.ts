import { createHash } from "node:crypto";

export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 32);
}

export function memoryVersionFingerprint(
  memories: { id: string; updated_at: string }[]
): string {
  const sorted = [...memories]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((m) => `${m.id}:${m.updated_at}`)
    .join("|");
  return hashContent(sorted);
}
