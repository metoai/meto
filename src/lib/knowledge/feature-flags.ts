const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

function envFlag(name: string): boolean {
  return TRUE_VALUES.has(process.env[name]?.trim().toLowerCase() ?? "");
}

export const knowledgeFlags = {
  layerEnabled: envFlag("KNOWLEDGE_LAYER_ENABLED"),
  writeEnabled: envFlag("KNOWLEDGE_WRITE_ENABLED"),
  readEnabled: envFlag("KNOWLEDGE_READ_ENABLED"),
  workspaceModeDevEnabled: envFlag("WORKSPACE_MODE_DEV_ENABLED"),
  contextScoreV2Enabled: envFlag("CONTEXT_SCORE_V2_ENABLED"),
} as const;

export type KnowledgeFlagName = keyof typeof knowledgeFlags;

export function isKnowledgeFlagEnabled(flag: KnowledgeFlagName): boolean {
  return knowledgeFlags[flag];
}
