export type PromptPack = {
  id: string;
  label: string;
  description: string;
  prompt: string;
};

export function buildProjectPromptPacks(projectName: string): PromptPack[] {
  const p = projectName.trim() || "this project";

  return [
    {
      id: "bug-fix",
      label: "Bug fix",
      description: "Diagnose and fix with project context",
      prompt: `You have Meto context for ${p}. Find the root cause, propose a minimal fix, and note what project memory should be updated.`,
    },
    {
      id: "refactor",
      label: "Refactor",
      description: "Safe refactor aligned with architecture",
      prompt: `Using ${p} architecture and coding rules from Meto, refactor the selected code. Preserve behavior; match existing patterns.`,
    },
    {
      id: "code-review",
      label: "Code review",
      description: "Review against project rules",
      prompt: `Review this change for ${p}. Check against Meto rules, stack choices, and architecture. Flag risks and missing tests.`,
    },
    {
      id: "feature",
      label: "New feature",
      description: "Implement with sprint context",
      prompt: `Implement this feature for ${p}. Respect current sprint focus, stack, and conventions in Meto project memory.`,
    },
    {
      id: "architecture",
      label: "Architecture",
      description: "Design within existing system",
      prompt: `Propose an architecture change for ${p} that fits the current stack and deployment model in Meto. List tradeoffs.`,
    },
    {
      id: "security",
      label: "Security",
      description: "Security pass on change",
      prompt: `Security review for ${p}: auth model, data access, env usage, and API exposure per Meto context.`,
    },
    {
      id: "docs",
      label: "Documentation",
      description: "Generate living docs",
      prompt: `Generate or update README / architecture notes for ${p} from codebase and Meto project memory.`,
    },
  ];
}
