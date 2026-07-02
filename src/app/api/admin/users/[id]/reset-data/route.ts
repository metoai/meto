import { NextResponse } from "next/server";
import { resetAdminUserData } from "@/lib/admin-crud";
import { adminApiGuard } from "@/lib/admin-auth";
import { fetchAdminUserDetail } from "@/lib/admin-queries";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const { id } = await context.params;
    await resetAdminUserData(id);
    const user = await fetchAdminUserDetail(id);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin reset user data error:", error);
    return NextResponse.json({ error: "Failed to reset user data." }, { status: 500 });
  }
}
