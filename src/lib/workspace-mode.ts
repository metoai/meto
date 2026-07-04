import type { UserProfile } from "@/lib/types";

export type WorkspaceMode = "personal" | "developer";

export function getWorkspaceMode(
  profile: Pick<UserProfile, "workspace_mode"> | null | undefined
): WorkspaceMode {
  return profile?.workspace_mode === "developer" ? "developer" : "personal";
}

export function isDeveloperWorkspace(
  profile: Pick<UserProfile, "workspace_mode"> | null | undefined
): boolean {
  return getWorkspaceMode(profile) === "developer";
}

export const WORKSPACE_MODE_COPY = {
  personal: {
    title: "Personal AI memory",
    description:
      "Remember who you are across ChatGPT, Claude, and Gemini. Copy your context — no coding setup required.",
    cta: "Get started",
  },
  developer: {
    title: "Developer workspace",
    description:
      "Project-centric memory for Cursor, Claude Code, and MCP. Connect AI tools directly to your repos and stack.",
    cta: "Get started",
  },
} as const;

export const DEV_UPDATE_SUGGESTIONS = [
  {
    label: "New project",
    message: "I'm building a new project and want my dev context updated.",
  },
  {
    label: "Stack change",
    message: "We changed our tech stack — update my profile to match.",
  },
  {
    label: "MCP context",
    message: "Update what Cursor and Claude should know about my current work.",
  },
] as const;

/** Dev profile editor — technical context only; personal sections live in Projects later */
export const DEV_PROFILE_SECTION_TYPES = new Set([
  "work",
  "projects",
  "skills",
  "working_style",
  "context_for_ai",
]);

export function isDevProfileSection(sectionType: string): boolean {
  return DEV_PROFILE_SECTION_TYPES.has(sectionType);
}
