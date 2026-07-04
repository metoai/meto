import { knowledgeFlags } from "@/lib/knowledge/feature-flags";

export function isV2ReadMode(): boolean {
  return knowledgeFlags.readEnabled;
}

export function isV2WriteMode(): boolean {
  return knowledgeFlags.writeEnabled;
}

export function isV2LayerActive(): boolean {
  return knowledgeFlags.layerEnabled;
}

/** All three core flags on — Phase 10 cutover path. */
export function isV2FullyEnabled(): boolean {
  return (
    knowledgeFlags.layerEnabled &&
    knowledgeFlags.writeEnabled &&
    knowledgeFlags.readEnabled
  );
}

export function isDevWorkspaceEnabled(): boolean {
  return knowledgeFlags.workspaceModeDevEnabled;
}

export function isContextScoreV2Enabled(): boolean {
  return knowledgeFlags.contextScoreV2Enabled;
}
