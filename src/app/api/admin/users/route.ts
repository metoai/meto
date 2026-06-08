import { NextResponse } from "next/server";
import { adminApiGuard } from "@/lib/admin-auth";
import { fetchAdminUsers } from "@/lib/admin-queries";
import type { Plan } from "@/lib/entitlements";

export async function GET(request: Request) {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? "20");
  const search = searchParams.get("search") ?? "";
  const planParam = searchParams.get("plan") ?? "all";
  const plan = planParam === "all" ? "all" : (planParam as Plan);

  try {
    const result = await fetchAdminUsers({ page, perPage, search, plan });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}
