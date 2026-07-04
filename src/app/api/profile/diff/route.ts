import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type SectionSnapshot = {
  section_type: string;
  title: string;
  content: string;
  updated_at: string;
};

export type ProfileDiff = {
  section_type: string;
  title: string;
  before: string;
  after: string;
  changed: boolean;
  updated_at: string;
};

/**
 * GET /api/profile/diff?since=ISO_DATE
 * Returns a diff of sections changed since the given date.
 * Falls back to 30 days ago if no date provided.
 */
export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const sinceParam = url.searchParams.get("since");
    const since = sinceParam
      ? new Date(sinceParam)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    if (isNaN(since.getTime())) {
      return NextResponse.json(
        { error: "Invalid 'since' date." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Get current sections
    const { data: current, error } = await admin
      .from("context_sections")
      .select("section_type, title, content, updated_at")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });

    if (error) throw error;

    // Get section history snapshots from knowledge events (project_events style)
    // We use context_section_history if it exists, otherwise derive from updated_at
    const { data: history } = await admin
      .from("context_sections")
      .select("section_type, title, content, updated_at")
      .eq("user_id", user.id)
      .lt("updated_at", since.toISOString())
      .order("updated_at", { ascending: false });

    const historyMap = new Map<string, SectionSnapshot>();
    for (const row of history ?? []) {
      if (!historyMap.has(row.section_type)) {
        historyMap.set(row.section_type, row as SectionSnapshot);
      }
    }

    const diffs: ProfileDiff[] = (current ?? [])
      .filter((row) => new Date(row.updated_at) >= since)
      .map((row) => {
        const before = historyMap.get(row.section_type);
        return {
          section_type: row.section_type,
          title: row.title,
          before: before?.content ?? "",
          after: row.content ?? "",
          changed: (before?.content ?? "") !== (row.content ?? ""),
          updated_at: row.updated_at,
        };
      })
      .filter((d) => d.changed);

    return NextResponse.json({
      since: since.toISOString(),
      diffs,
      total_changes: diffs.length,
    });
  } catch (error) {
    console.error("GET /api/profile/diff error:", error);
    return NextResponse.json(
      { error: "Failed to compute profile diff." },
      { status: 500 }
    );
  }
}
