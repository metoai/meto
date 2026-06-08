import { NextResponse } from "next/server";
import { adminApiGuard } from "@/lib/admin-auth";
import { fetchAdminStats } from "@/lib/admin-queries";

export async function GET() {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const stats = await fetchAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to load stats." }, { status: 500 });
  }
}
