import { NextResponse } from "next/server";
import {
  MEMORY_CREATORS,
  MEMORY_SOURCES,
  MEMORY_STATUSES,
  MEMORY_TYPES,
  MEMORY_VISIBILITIES,
  type MemoryCreator,
  type MemorySource,
  type MemoryStatus,
  type MemoryType,
  type MemoryVisibility,
  type NewKnowledgeObject,
} from "@/lib/knowledge/types";
import { createClient } from "@/lib/supabase/server";

const KNOWLEDGE_SELECT =
  "id,user_id,type,title,content,confidence,importance,visibility,source,status,created_by,tags,metadata,created_at,updated_at,last_verified_at";

function isOneOf<T extends readonly string[]>(
  value: unknown,
  allowed: T
): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

function parseStringArray(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  return value.every((item) => typeof item === "string") ? value : null;
}

function parseMetadata(value: unknown): Record<string, unknown> | null {
  if (value === undefined) return {};
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function parseKnowledgeObject(body: unknown):
  | { ok: true; value: NewKnowledgeObject }
  | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body." };
  }

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const content =
    typeof input.content === "string" ? input.content.trim() : "";

  if (!isOneOf(input.type, MEMORY_TYPES)) {
    return { ok: false, error: "A valid memory type is required." };
  }

  if (!title || !content) {
    return { ok: false, error: "Title and content are required." };
  }

  const confidence =
    input.confidence === undefined ? 1 : Number(input.confidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    return { ok: false, error: "Confidence must be between 0 and 1." };
  }

  const importance =
    input.importance === undefined ? 3 : Number(input.importance);
  if (
    !Number.isInteger(importance) ||
    importance < 1 ||
    importance > 5
  ) {
    return { ok: false, error: "Importance must be an integer from 1 to 5." };
  }

  const tags = parseStringArray(input.tags);
  if (!tags) return { ok: false, error: "Tags must be an array of strings." };

  const metadata = parseMetadata(input.metadata);
  if (!metadata) return { ok: false, error: "Metadata must be an object." };

  if (
    input.last_verified_at !== undefined &&
    input.last_verified_at !== null &&
    typeof input.last_verified_at !== "string"
  ) {
    return { ok: false, error: "Last verified date must be a string." };
  }

  return {
    ok: true,
    value: {
      type: input.type as MemoryType,
      title,
      content,
      confidence,
      importance: importance as 1 | 2 | 3 | 4 | 5,
      visibility: isOneOf(input.visibility, MEMORY_VISIBILITIES)
        ? (input.visibility as MemoryVisibility)
        : "private",
      source: isOneOf(input.source, MEMORY_SOURCES)
        ? (input.source as MemorySource)
        : "manual",
      status: isOneOf(input.status, MEMORY_STATUSES)
        ? (input.status as MemoryStatus)
        : "active",
      created_by: isOneOf(input.created_by, MEMORY_CREATORS)
        ? (input.created_by as MemoryCreator)
        : "user",
      tags,
      metadata,
      last_verified_at:
        typeof input.last_verified_at === "string"
          ? input.last_verified_at
          : null,
    },
  };
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status") ?? "active";

    let query = supabase
      .from("knowledge_objects")
      .select(KNOWLEDGE_SELECT)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (type && isOneOf(type, MEMORY_TYPES)) {
      query = query.eq("type", type);
    }

    if (status && isOneOf(status, MEMORY_STATUSES)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ memories: data ?? [] });
  } catch (error) {
    console.error("GET knowledge error:", error);
    return NextResponse.json(
      { error: "Failed to load knowledge objects." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = parseKnowledgeObject(await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("knowledge_objects")
      .insert({
        ...parsed.value,
        user_id: user.id,
      })
      .select(KNOWLEDGE_SELECT)
      .single();

    if (error) throw error;

    return NextResponse.json({ memory: data });
  } catch (error) {
    console.error("POST knowledge error:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge object." },
      { status: 500 }
    );
  }
}
