import { NextResponse } from "next/server";
import { MEMORY_RELATION_TYPES } from "@/lib/knowledge/types";
import { createClient } from "@/lib/supabase/server";

const LINK_SELECT =
  "id,user_id,from_memory_id,to_memory_id,relation_type,strength,created_at";

function isRelationType(value: unknown): value is (typeof MEMORY_RELATION_TYPES)[number] {
  return (
    typeof value === "string" &&
    MEMORY_RELATION_TYPES.includes(value as never)
  );
}

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("knowledge_links")
      .select(LINK_SELECT)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ links: data ?? [] });
  } catch (error) {
    console.error("GET knowledge links error:", error);
    return NextResponse.json(
      { error: "Failed to load knowledge links." },
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

    const body = (await request.json()) as {
      from_memory_id?: string;
      to_memory_id?: string;
      relation_type?: string;
      strength?: number;
    };

    const fromId = body.from_memory_id?.trim();
    const toId = body.to_memory_id?.trim();

    if (!fromId || !toId || fromId === toId) {
      return NextResponse.json(
        { error: "Valid from_memory_id and to_memory_id are required." },
        { status: 400 }
      );
    }

    if (!isRelationType(body.relation_type)) {
      return NextResponse.json(
        { error: "A valid relation_type is required." },
        { status: 400 }
      );
    }

    const strength =
      body.strength === undefined ? 1 : Number(body.strength);
    if (!Number.isFinite(strength) || strength < 0 || strength > 1) {
      return NextResponse.json(
        { error: "Strength must be between 0 and 1." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("knowledge_links")
      .insert({
        user_id: user.id,
        from_memory_id: fromId,
        to_memory_id: toId,
        relation_type: body.relation_type,
        strength,
      })
      .select(LINK_SELECT)
      .single();

    if (error) throw error;

    return NextResponse.json({ link: data });
  } catch (error) {
    console.error("POST knowledge link error:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge link." },
      { status: 500 }
    );
  }
}
