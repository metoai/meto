import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: { id: string } };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, is_public } = await request.json();

    const updates: Record<string, string | boolean> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (is_public !== undefined) updates.is_public = Boolean(is_public);

    const { data, error } = await supabase
      .from("context_sections")
      .update(updates)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ section: data });
  } catch (error) {
    console.error("PATCH section error:", error);
    return NextResponse.json(
      { error: "Failed to update section." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("context_sections")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE section error:", error);
    return NextResponse.json(
      { error: "Failed to delete section." },
      { status: 500 }
    );
  }
}
