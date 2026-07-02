import { NextResponse } from "next/server";
import {
  deleteAdminOnboardingChat,
  getAdminOnboardingChat,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string; chatId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;
  const { id, chatId } = await context.params;

  try {
    const chat = await getAdminOnboardingChat(id, chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found." }, { status: 404 });
    }
    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Admin onboarding chat get error:", error);
    return NextResponse.json({ error: "Failed to load chat." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;
  const { id, chatId } = await context.params;

  try {
    await deleteAdminOnboardingChat(id, chatId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin onboarding chat delete error:", error);
    return NextResponse.json({ error: "Failed to delete chat." }, { status: 500 });
  }
}
