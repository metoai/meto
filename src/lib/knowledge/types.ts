export const MEMORY_TYPES = [
  "identity",
  "preference",
  "rule",
  "goal",
  "project",
  "relationship",
  "decision",
  "experience",
  "timeline",
  "achievement",
  "skill",
  "tool",
  "company",
  "technology",
  "location",
  "task",
  "documentation",
  "custom",
] as const;

export type MemoryType = (typeof MEMORY_TYPES)[number];

export const MEMORY_STATUSES = [
  "active",
  "archived",
  "superseded",
  "pending_review",
] as const;

export type MemoryStatus = (typeof MEMORY_STATUSES)[number];

export const MEMORY_VISIBILITIES = [
  "private",
  "public",
  "integration",
] as const;

export type MemoryVisibility = (typeof MEMORY_VISIBILITIES)[number];

export const MEMORY_SOURCES = [
  "quick_update",
  "onboarding",
  "landing",
  "mcp",
  "profile_editor",
  "document",
  "migration",
  "manual",
] as const;

export type MemorySource = (typeof MEMORY_SOURCES)[number];

export const MEMORY_CREATORS = ["user", "ai", "system"] as const;

export type MemoryCreator = (typeof MEMORY_CREATORS)[number];

export const MEMORY_RELATION_TYPES = [
  "works_at",
  "founded",
  "maintains",
  "uses",
  "prefers",
  "depends_on",
  "blocked_by",
  "related_to",
  "contradicts",
  "supersedes",
  "verifies",
] as const;

export type MemoryRelationType = (typeof MEMORY_RELATION_TYPES)[number];

export type KnowledgeObject = {
  id: string;
  user_id: string;
  type: MemoryType;
  title: string;
  content: string;
  confidence: number;
  importance: 1 | 2 | 3 | 4 | 5;
  visibility: MemoryVisibility;
  source: MemorySource;
  status: MemoryStatus;
  created_by: MemoryCreator;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_verified_at: string | null;
};

export type KnowledgeLink = {
  id: string;
  user_id: string;
  from_memory_id: string;
  to_memory_id: string;
  relation_type: MemoryRelationType;
  strength: number;
  created_at: string;
};

export type NewKnowledgeObject = Pick<
  KnowledgeObject,
  "type" | "title" | "content"
> &
  Partial<
    Pick<
      KnowledgeObject,
      | "confidence"
      | "importance"
      | "visibility"
      | "source"
      | "status"
      | "created_by"
      | "tags"
      | "metadata"
      | "last_verified_at"
    >
  >;

export type KnowledgeObjectPatch = Partial<NewKnowledgeObject>;
