import { SECTION_KEYS } from "@/lib/meto-prompts";
import { isCustomSectionUpdateKey } from "@/lib/document-import";

export type UpdateRoutingDecision =
  | {
      route: "deterministic";
      updates: Record<string, string>;
      reason: string;
    }
  | {
      route: "llm_extraction";
      reason: string;
    };

const PRESET_KEYS = new Set<string>(SECTION_KEYS);

/**
 * Checks if a given string is a valid preset or custom section key.
 */
export function isValidSectionTarget(key: string): boolean {
  const normalized = key.trim().toLowerCase();
  if (PRESET_KEYS.has(normalized)) return true;
  return isCustomSectionUpdateKey(key);
}

/**
 * Evaluates user input or payload to determine if it can be applied deterministically
 * without invoking an expensive LLM extraction pass.
 */
export function routeUpdateInput(input: string): UpdateRoutingDecision {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      route: "deterministic",
      updates: {},
      reason: "Empty input",
    };
  }

  // 1. Try parsing as direct JSON object (e.g. from developer integrations or automated tools)
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const candidateUpdates: Record<string, string> = {};
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
          if (isValidSectionTarget(k) && typeof v === "string" && v.trim()) {
            candidateUpdates[k.toLowerCase()] = v.trim();
          }
        }
        if (Object.keys(candidateUpdates).length > 0) {
          return {
            route: "deterministic",
            updates: candidateUpdates,
            reason: "Structured JSON section updates provided",
          };
        }
      }
    } catch {
      // Fall through to regex parsing
    }
  }

  // 2. Command pattern: "set <section>: <content>" or "update <section>: <content>"
  const customCmdMatch = trimmed.match(/^(?:set|update)\s+(custom:[^:]+)\s*:\s*([\s\S]+)$/i);
  if (customCmdMatch) {
    const rawTarget = customCmdMatch[1].trim();
    const content = customCmdMatch[2].trim();
    if (content.length > 0) {
      return {
        route: "deterministic",
        updates: { [rawTarget]: content },
        reason: `Explicit command to update custom section "${rawTarget}"`,
      };
    }
  }

  const commandMatch = trimmed.match(/^(?:set|update)\s+([a-zA-Z0-9_\-]+)\s*:\s*([\s\S]+)$/i);
  if (commandMatch) {
    const rawTarget = commandMatch[1].trim().toLowerCase();
    const content = commandMatch[2].trim();
    if (isValidSectionTarget(rawTarget) && content.length > 0) {
      return {
        route: "deterministic",
        updates: { [rawTarget]: content },
        reason: `Explicit command to update section "${rawTarget}"`,
      };
    }
  }

  // 3. Simple key-value single line: "<section>: <content>" when section is an exact preset key
  const kvMatch = trimmed.match(/^([a-zA-Z0-9_\-]+)\s*:\s*([\s\S]+)$/);
  if (kvMatch && !trimmed.includes("\n")) {
    const rawTarget = kvMatch[1].trim().toLowerCase();
    const content = kvMatch[2].trim();
    if (PRESET_KEYS.has(rawTarget) && content.length > 0) {
      return {
        route: "deterministic",
        updates: { [rawTarget]: content },
        reason: `Single-line direct key-value for section "${rawTarget}"`,
      };
    }
  }

  // 4. Default: Unstructured natural language requiring LLM extraction
  return {
    route: "llm_extraction",
    reason: "Conversational natural language requires semantic LLM extraction",
  };
}
