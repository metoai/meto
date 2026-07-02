import { NextResponse } from "next/server";
import {
  deleteAdminCompiledProfile,
  updateAdminCompiledProfile,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string; format: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  const { id, format: rawFormat } = await context.params;
  const format = decodeURIComponent(rawFormat);
  let body: { full_context?: string };
  try {
    body = (await request.json()) as { full_context?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.full_context?.trim()) {
    return NextResponse.json({ error: "full_context is required." }, { status: 400 });
  }

  try {
    const compiled = await updateAdminCompiledProfile(
      id,
      format,
      body.full_context,
    );
    return NextResponse.json({ compiled });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update compiled profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  const { id, format: rawFormat } = await context.params;
  const format = decodeURIComponent(rawFormat);

  try {
    await deleteAdminCompiledProfile(id, format);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin compiled delete error:", error);
    return NextResponse.json({ error: "Failed to delete compiled profile." }, { status: 500 });
  }
}
