import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

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
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== Meto Read Path Latency Benchmark ===");

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, username")
    .limit(10);

  if (error || !users || users.length === 0) {
    console.error("Failed to find users", error);
    return;
  }

  // Find a user with sections
  let targetUser = users[0];
  let sections = [];
  for (const u of users) {
    const { data: s } = await supabase
      .from("context_sections")
      .select("section_type, title, content")
      .eq("user_id", u.id);
    if (s && s.length > 0) {
      targetUser = u;
      sections = s;
      break;
    }
  }

  console.log(`Testing with user: ${targetUser.username ? "@" + targetUser.username : targetUser.id} (${sections.length} sections)\n`);

  // 1. Direct DB Query
  const t0 = performance.now();
  const { data: dbSections } = await supabase
    .from("context_sections")
    .select("section_type, title, content, updated_at, display_order")
    .eq("user_id", targetUser.id)
    .order("display_order", { ascending: true });
  const t1 = performance.now();
  console.log(`[1] Raw DB Section Fetch: ${(t1 - t0).toFixed(2)}ms (${dbSections?.length ?? 0} rows)`);

  // 2. Versioned Cache Query
  const t2 = performance.now();
  const { data: cached } = await supabase
    .from("compiled_profiles")
    .select("full_context, last_compiled")
    .eq("user_id", targetUser.id)
    .eq("format", "universal")
    .maybeSingle();
  const t3 = performance.now();
  console.log(`[2] Compiled Profile Cache Lookup: ${(t3 - t2).toFixed(2)}ms (hit: ${Boolean(cached)})`);

  // 3. Knowledge Objects Query (V2)
  const t4 = performance.now();
  const { data: memories } = await supabase
    .from("knowledge_objects")
    .select("id, type, title, status")
    .eq("user_id", targetUser.id)
    .eq("status", "active");
  const t5 = performance.now();
  console.log(`[3] V2 Knowledge Graph Fetch: ${(t5 - t4).toFixed(2)}ms (${memories?.length ?? 0} memories)`);

  // 4. Memory-to-Section Synchronous Compile (in-memory)
  const t6 = performance.now();
  const compiled = sections.map((s) => `## ${s.title}\n${s.content}`).join("\n\n");
  const t7 = performance.now();
  console.log(`[4] In-Memory Compilation (zero LLM overhead): ${(t7 - t6).toFixed(4)}ms (${compiled.length} chars)`);

  console.log("\n=== Latency Assessment ===");
  const totalReadMs = (t1 - t0);
  if (totalReadMs < 200) {
    console.log(`⚡ EXCELLENT: DB roundtrip is ${totalReadMs.toFixed(2)}ms (well under 300ms SLA).`);
  } else {
    console.log(`⚠️ NOTICE: DB roundtrip is ${totalReadMs.toFixed(2)}ms.`);
  }
}

run().catch(console.error);
