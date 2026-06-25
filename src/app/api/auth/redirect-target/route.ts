import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-auth";
import { resolvePostAuthRedirect } from "@/lib/post-auth-redirect";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ path: "/auth/login", isAdmin: false });
  }

  const next = new URL(request.url).searchParams.get("next");
  const [path, isAdmin] = await Promise.all([
    resolvePostAuthRedirect(user.id, user.email, next),
    isAdminUser(user.id, user.email),
  ]);

  return NextResponse.json({ path, isAdmin });
}
