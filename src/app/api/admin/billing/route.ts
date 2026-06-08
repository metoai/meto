import { NextResponse } from "next/server";
import { adminApiGuard } from "@/lib/admin-auth";
import { fetchBillingOverview } from "@/lib/admin-queries";

export async function GET() {
  const guard = await adminApiGuard();
  if ("response" in guard) return guard.response;

  try {
    const billing = await fetchBillingOverview();
    return NextResponse.json(billing);
  } catch (error) {
    console.error("Admin billing error:", error);
    return NextResponse.json({ error: "Failed to load billing." }, { status: 500 });
  }
}
