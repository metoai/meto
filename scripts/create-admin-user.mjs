/**
 * One-time script to create the Meto admin user.
 * Usage: node scripts/create-admin-user.mjs
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { randomBytes } from "crypto";

const ADMIN_EMAIL = process.env.METO_ADMIN_EMAIL ?? "admin@metoai.site";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const password =
  process.env.METO_ADMIN_PASSWORD ?? randomBytes(18).toString("base64url");

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000 });
const existing = listData?.users?.find(
  (u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
);

let userId;

if (existing) {
  userId = existing.id;
  console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Meto Admin" },
  });

  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }

  userId = data.user.id;
  console.log("Created admin auth user.");
  console.log(`Email:    ${ADMIN_EMAIL}`);
  console.log(`Password: ${password}`);
}

const { data: adminRow } = await admin
  .from("admin_users")
  .select("user_id")
  .eq("user_id", userId)
  .maybeSingle();

if (!adminRow) {
  const { error } = await admin.from("admin_users").insert({
    user_id: userId,
    email: ADMIN_EMAIL.toLowerCase(),
  });

  if (error) {
    console.error("Failed to insert admin_users row:", error.message);
    process.exit(1);
  }
  console.log("Granted admin_users access.");
} else {
  console.log("admin_users row already exists.");
}

console.log("\nAdmin portal: /admin");
console.log("Login at:   /auth/login");
