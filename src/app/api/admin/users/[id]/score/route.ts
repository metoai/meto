import { NextResponse } from "next/server";
import {
  deleteAdminContextScore,
  getAdminContextScore,
  upsertAdminContextScore,
  type UpsertScoreParams,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id } = await context.params;
    const score = await getAdminContextScore(id);
    return NextResponse.json({ score });
  } catch (error) {
    console.error("Admin score get error:", error);
    return NextResponse.json({ error: "Failed to load score." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;
  const { id } = await context.params;

  let body: UpsertScoreParams;
  try {
    body = (await request.json()) as UpsertScoreParams;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (
    typeof body.score !== "number" ||
    !body.headline?.trim() ||
    !body.summary?.trim()
  ) {
    return NextResponse.json({ error: "Score, headline, and summary are required." }, { status: 400 });
  }

  try {
    const score = await upsertAdminContextScore(id, body);
    return NextResponse.json({ score });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save score.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id } = await context.params;
    await deleteAdminContextScore(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin score delete error:", error);
    return NextResponse.json({ error: "Failed to delete score." }, { status: 500 });
  }
}
