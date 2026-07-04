import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const WebhookSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  events: z
    .array(
      z.enum([
        "profile.section_updated",
        "profile.score_changed",
        "project.decision_added",
        "profile.conflict_detected",
      ])
    )
    .min(1, "At least one event required"),
  label: z.string().max(80).optional(),
});

/** GET /api/webhooks — list the user's webhooks */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profile_webhooks")
    .select("id, url, events, label, active, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ webhooks: data ?? [] });
}

/** POST /api/webhooks — register a new webhook */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = WebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  // Generate a signing secret
  const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const { data, error } = await supabase
    .from("profile_webhooks")
    .insert({
      user_id: user.id,
      url: parsed.data.url,
      events: parsed.data.events,
      label: parsed.data.label ?? null,
      secret,
      active: true,
    })
    .select("id, url, events, label, active, created_at, secret")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return secret only on creation — never shown again
  return NextResponse.json({ webhook: data }, { status: 201 });
}

/** DELETE /api/webhooks?id=xxx — remove a webhook */
export async function DELETE(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing webhook id" }, { status: 400 });

  const { error } = await supabase
    .from("profile_webhooks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
