import { METO_SCOPE_GUARD } from "@/lib/meto-prompts";
import { MEMORY_TYPES } from "@/lib/knowledge/types";

export function buildExtractMemoriesPrompt(
  currentSections: Record<string, string>,
  conversation: string
): string {
  const sectionSummary = Object.entries(currentSections)
    .filter(([, content]) => content.trim())
    .map(([key, content]) => `## ${key}\n${content}`)
    .join("\n\n");

  return `${METO_SCOPE_GUARD}

You extract structured knowledge memories from a Meto profile update conversation.

CURRENT PROFILE SECTIONS:
${sectionSummary || "(empty)"}

CONVERSATION:
${conversation}

Return ONLY valid JSON:
{
  "memories": [
    {
      "type": "identity|preference|rule|goal|project|relationship|decision|experience|timeline|achievement|skill|tool|company|technology|location|task|documentation|custom",
      "title": "short label",
      "content": "first-person fact or preference",
      "confidence": 0.0,
      "importance": 1
    }
  ],
  "links": [
    {
      "from_title": "title of source memory",
      "to_title": "title of target memory",
      "relation_type": "works_at|founded|maintains|uses|prefers|depends_on|blocked_by|related_to|contradicts|supersedes|verifies"
    }
  ]
}

Rules:
- Extract only facts stated or clearly implied in the conversation
- Use first person in content (as the user)
- Allowed types: ${MEMORY_TYPES.join(", ")}
- confidence: 0-1, importance: 1-5
- Prefer several small memories over one giant blob
- links are optional — only when a clear relationship exists
- Do not invent facts`;
}
