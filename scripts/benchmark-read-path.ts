import { createClient } from "@supabase/supabase-js";
import { compileLocally } from "../src/lib/compile-local";
import { getCompiledContext, getUserContextSections } from "../src/lib/context/read";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE environment variables. Use .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching a user with context sections...");
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id")
    .limit(10);
    
  if (error || !users || users.length === 0) {
    console.error("Failed to find users", error);
    return;
  }
  
  let targetUser = users[0].id;
  
  console.log(`Benchmarking for user: ${targetUser}`);
  
  // 1. Benchmark raw query vs getUserContextSections
  console.log("\n--- Raw DB Query vs getUserContextSections ---");
  const t0 = performance.now();
  await supabase.from("context_sections").select("*").eq("user_id", targetUser);
  const t1 = performance.now();
  console.log(`Raw DB Query: ${(t1 - t0).toFixed(2)}ms`);
  
  const t2 = performance.now();
  await getUserContextSections(supabase, targetUser);
  const t3 = performance.now();
  console.log(`getUserContextSections (w/ metrics overhead): ${(t3 - t2).toFixed(2)}ms`);

  // 2. Benchmark compileLocally vs getCompiledContext
  console.log("\n--- compileLocally vs getCompiledContext ---");
  const sections = await getUserContextSections(supabase, targetUser);
  
  if (sections.length === 0) {
    console.log("User has no sections to compile. Skipping.");
    return;
  }
  
  const t4 = performance.now();
  compileLocally("universal", sections);
  const t5 = performance.now();
  console.log(`compileLocally (synchronous): ${(t5 - t4).toFixed(2)}ms`);
  
  const t6 = performance.now();
  await getCompiledContext(supabase, targetUser, "universal", sections);
  const t7 = performance.now();
  console.log(`getCompiledContext (async w/ cache check): ${(t7 - t6).toFixed(2)}ms`);
  
  console.log("\nBenchmarking complete.");
}

run().catch(console.error);
