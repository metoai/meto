import { NextResponse } from "next/server";
import { catchApiError } from "@/lib/api-error";
import { loadPortalBootstrap } from "@/lib/portal-bootstrap";
import { createClient } from "@/lib/supabase/server";

/** One request for portal load: profile, sections, entitlements, cached context score. */
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await loadPortalBootstrap(user.id, user.email ?? "");
    return NextResponse.json(data);
  } catch (error) {
    return catchApiError(error, "Failed to load portal data.");
  }
}
