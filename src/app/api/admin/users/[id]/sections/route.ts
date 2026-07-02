import { NextResponse } from "next/server";
import {
  createAdminSection,
  listAdminSections,
  type UpsertSectionParams,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id } = await context.params;
    const sections = await listAdminSections(id);
    return NextResponse.json({ sections });
  } catch (error) {
    console.error("Admin sections list error:", error);
    return NextResponse.json({ error: "Failed to load sections." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;
  const { id } = await context.params;

  let body: UpsertSectionParams;
  try {
    body = (await request.json()) as UpsertSectionParams;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const section = await createAdminSection(id, body);
    return NextResponse.json({ section });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create section.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
