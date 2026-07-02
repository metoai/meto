import { NextResponse } from "next/server";
import {
  getAdminAiUsage,
  resetAdminAiUsage,
  updateAdminUserProfile,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id } = await context.params;
    const usage = await getAdminAiUsage(id);
    return NextResponse.json({ usage });
  } catch (error) {
    console.error("Admin AI usage get error:", error);
    return NextResponse.json({ error: "Failed to load AI usage." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;
  const { id } = await context.params;

  let body: { ai_calls_used?: number; ai_usage_period_start?: string | null };
  try {
    body = (await request.json()) as {
      ai_calls_used?: number;
      ai_usage_period_start?: string | null;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (
    body.ai_calls_used !== undefined &&
    (typeof body.ai_calls_used !== "number" || body.ai_calls_used < 0)
  ) {
    return NextResponse.json({ error: "Invalid AI usage." }, { status: 400 });
  }

  try {
    await updateAdminUserProfile(id, body);
    const usage = await getAdminAiUsage(id);
    return NextResponse.json({ usage });
  } catch (error) {
    console.error("Admin AI usage update error:", error);
    return NextResponse.json({ error: "Failed to update AI usage." }, { status: 500 });
  }
}

export async function POST(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id } = await context.params;
    const usage = await resetAdminAiUsage(id);
    return NextResponse.json({ usage });
  } catch (error) {
    console.error("Admin AI usage reset error:", error);
    return NextResponse.json({ error: "Failed to reset AI usage." }, { status: 500 });
  }
}
