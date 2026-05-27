import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
      .from("context_sections")
      .select("*")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sections: data ?? [] });
  } catch (error) {
    console.error("GET sections error:", error);
    return NextResponse.json(
      { error: "Failed to load sections." },
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

    const { title, content, section_type = "custom" } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("context_sections")
      .select("display_order")
      .eq("user_id", user.id)
      .order("display_order", { ascending: false })
      .limit(1);

    const displayOrder = (existing?.[0]?.display_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("context_sections")
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        section_type,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ section: data });
  } catch (error) {
    console.error("POST section error:", error);
    return NextResponse.json(
      { error: "Failed to create section." },
      { status: 500 }
    );
  }
}
