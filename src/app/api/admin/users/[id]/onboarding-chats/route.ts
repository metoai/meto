import { NextResponse } from "next/server";
import {
  deleteAllAdminOnboardingChats,
  listAdminOnboardingChats,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id } = await context.params;
    const chats = await listAdminOnboardingChats(id);
    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Admin onboarding chats error:", error);
    return NextResponse.json({ error: "Failed to load chats." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id } = await context.params;
    await deleteAllAdminOnboardingChats(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin onboarding chats delete error:", error);
    return NextResponse.json({ error: "Failed to delete chats." }, { status: 500 });
  }
}
