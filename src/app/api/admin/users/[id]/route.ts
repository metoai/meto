import { NextResponse } from "next/server";
import {
  deleteAdminUser,
  updateAdminUserProfile,
  type UpdateAdminUserParams,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";
import { fetchAdminUserDetail } from "@/lib/admin-queries";
import type { OnboardingAiUsed, Plan } from "@/lib/entitlements";

type RouteContext = { params: { id: string } };

const PLANS: Plan[] = ["trial", "free", "pro"];
const ONBOARDING: OnboardingAiUsed[] = [null, "brain_dump", "chat"];

function parseBody(body: UpdateAdminUserParams): string | null {
  if (body.plan !== undefined && !PLANS.includes(body.plan)) return "Invalid plan.";
  if (
    body.onboarding_ai_used !== undefined &&
    !ONBOARDING.includes(body.onboarding_ai_used)
  ) {
    return "Invalid onboarding_ai_used.";
  }
  if (
    body.ai_calls_used !== undefined &&
    (typeof body.ai_calls_used !== "number" || body.ai_calls_used < 0)
  ) {
    return "Invalid AI usage.";
  }
  return null;
}

export async function GET(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  const { id } = context.params;

  try {
    const user = await fetchAdminUserDetail(id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Admin user detail error:", error);
    return NextResponse.json({ error: "Failed to load user." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  const { id } = context.params;

  let body: UpdateAdminUserParams;
  try {
    body = (await request.json()) as UpdateAdminUserParams;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const validationError = parseBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    await updateAdminUserProfile(id, body);
    const user = await fetchAdminUserDetail(id);
    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update user.";
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  const { id } = context.params;

  if (id === guard.session.userId) {
    return NextResponse.json(
      { error: "You cannot delete your own admin account." },
      { status: 400 },
    );
  }

  try {
    await deleteAdminUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
