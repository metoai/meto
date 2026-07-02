import { NextResponse } from "next/server";
import {
  deleteAdminSection,
  updateAdminSection,
  type UpdateSectionParams,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string; sectionId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;
  const { id, sectionId } = await context.params;

  let body: UpdateSectionParams;
  try {
    body = (await request.json()) as UpdateSectionParams;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const section = await updateAdminSection(id, sectionId, body);
    return NextResponse.json({ section });
  } catch (error) {
    console.error("Admin section update error:", error);
    return NextResponse.json({ error: "Failed to update section." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id, sectionId } = await context.params;
    await deleteAdminSection(id, sectionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin section delete error:", error);
    return NextResponse.json({ error: "Failed to delete section." }, { status: 500 });
  }
}
