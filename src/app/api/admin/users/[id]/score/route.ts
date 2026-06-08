import { NextResponse } from "next/server";
import {
  deleteAdminContextScore,
  getAdminContextScore,
  upsertAdminContextScore,
  type UpsertScoreParams,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const score = await getAdminContextScore(context.params.id);
    return NextResponse.json({ score });
  } catch (error) {
    console.error("Admin score get error:", error);
    return NextResponse.json({ error: "Failed to load score." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

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
    const score = await upsertAdminContextScore(context.params.id, body);
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
    await deleteAdminContextScore(context.params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin score delete error:", error);
    return NextResponse.json({ error: "Failed to delete score." }, { status: 500 });
  }
}
