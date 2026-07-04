import { NextResponse } from "next/server";
import {
  MEMORY_CREATORS,
  MEMORY_SOURCES,
  MEMORY_STATUSES,
  MEMORY_TYPES,
  MEMORY_VISIBILITIES,
} from "@/lib/knowledge/types";
import { createClient } from "@/lib/supabase/server";

const KNOWLEDGE_SELECT =
  "id,user_id,type,title,content,confidence,importance,visibility,source,status,created_by,tags,metadata,created_at,updated_at,last_verified_at";

type RouteContext = { params: Promise<{ id: string }> };

function isOneOf<T extends readonly string[]>(
  value: unknown,
  allowed: T
): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

function parsePatch(body: unknown):
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body." };
  }

  const input = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.type !== undefined) {
    if (!isOneOf(input.type, MEMORY_TYPES)) {
      return { ok: false, error: "Invalid memory type." };
    }
    updates.type = input.type;
  }

  if (input.title !== undefined) {
    if (typeof input.title !== "string" || !input.title.trim()) {
      return { ok: false, error: "Title cannot be empty." };
    }
    updates.title = input.title.trim();
  }

  if (input.content !== undefined) {
    if (typeof input.content !== "string" || !input.content.trim()) {
      return { ok: false, error: "Content cannot be empty." };
    }
    updates.content = input.content.trim();
  }

  if (input.confidence !== undefined) {
    const confidence = Number(input.confidence);
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
      return { ok: false, error: "Confidence must be between 0 and 1." };
    }
    updates.confidence = confidence;
  }

  if (input.importance !== undefined) {
    const importance = Number(input.importance);
    if (
      !Number.isInteger(importance) ||
      importance < 1 ||
      importance > 5
    ) {
      return { ok: false, error: "Importance must be an integer from 1 to 5." };
    }
    updates.importance = importance;
  }

  if (input.visibility !== undefined) {
    if (!isOneOf(input.visibility, MEMORY_VISIBILITIES)) {
      return { ok: false, error: "Invalid visibility." };
    }
    updates.visibility = input.visibility;
  }

  if (input.source !== undefined) {
    if (!isOneOf(input.source, MEMORY_SOURCES)) {
      return { ok: false, error: "Invalid source." };
    }
    updates.source = input.source;
  }

  if (input.status !== undefined) {
    if (!isOneOf(input.status, MEMORY_STATUSES)) {
      return { ok: false, error: "Invalid status." };
    }
    updates.status = input.status;
  }

  if (input.created_by !== undefined) {
    if (!isOneOf(input.created_by, MEMORY_CREATORS)) {
      return { ok: false, error: "Invalid creator." };
    }
    updates.created_by = input.created_by;
  }

  if (input.tags !== undefined) {
    if (
      !Array.isArray(input.tags) ||
      !input.tags.every((item) => typeof item === "string")
    ) {
      return { ok: false, error: "Tags must be an array of strings." };
    }
    updates.tags = input.tags;
  }

  if (input.metadata !== undefined) {
    if (
      typeof input.metadata !== "object" ||
      input.metadata === null ||
      Array.isArray(input.metadata)
    ) {
      return { ok: false, error: "Metadata must be an object." };
    }
    updates.metadata = input.metadata;
  }

  if (input.last_verified_at !== undefined) {
    if (
      input.last_verified_at !== null &&
      typeof input.last_verified_at !== "string"
    ) {
      return { ok: false, error: "Last verified date must be a string." };
    }
    updates.last_verified_at = input.last_verified_at;
  }

  return { ok: true, value: updates };
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("knowledge_objects")
      .select(KNOWLEDGE_SELECT)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ memory: data });
  } catch (error) {
    console.error("GET knowledge object error:", error);
    return NextResponse.json(
      { error: "Failed to load knowledge object." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = parsePatch(await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("knowledge_objects")
      .update(parsed.value)
      .eq("id", id)
      .eq("user_id", user.id)
      .select(KNOWLEDGE_SELECT)
      .single();

    if (error) throw error;

    return NextResponse.json({ memory: data });
  } catch (error) {
    console.error("PATCH knowledge object error:", error);
    return NextResponse.json(
      { error: "Failed to update knowledge object." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("knowledge_objects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE knowledge object error:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge object." },
      { status: 500 }
    );
  }
}
