import { NextResponse } from "next/server";
import {
  createAdminSection,
  listAdminSections,
  type UpsertSectionParams,
} from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const sections = await listAdminSections(context.params.id);
    return NextResponse.json({ sections });
  } catch (error) {
    console.error("Admin sections list error:", error);
    return NextResponse.json({ error: "Failed to load sections." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  let body: UpsertSectionParams;
  try {
    body = (await request.json()) as UpsertSectionParams;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const section = await createAdminSection(context.params.id, body);
    return NextResponse.json({ section });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create section.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
