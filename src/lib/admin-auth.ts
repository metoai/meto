import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string;
};

function parseAdminEmails(): Set<string> {
  const raw = process.env.METO_ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function isAdminUser(userId: string, email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const allowlist = parseAdminEmails();

  if (allowlist.has(normalizedEmail)) {
    return true;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Admin check failed:", error);
    return false;
  }

  return Boolean(data);
}

export async function requireAdminSession(): Promise<AdminSession | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const ok = await isAdminUser(user.id, user.email);
  if (!ok) {
    return null;
  }

  return { userId: user.id, email: user.email };
}

export async function adminApiGuard(): Promise<
  { session: AdminSession } | { response: NextResponse }
> {
  const session = await requireAdminSession();
  if (!session) {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session };
}
