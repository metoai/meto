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

const SECTION_TO_MEMORY_TYPE = {
  about: "identity",
  work: "experience",
  projects: "project",
  skills: "skill",
  goals: "goal",
  working_style: "preference",
  context_for_ai: "rule",
};

async function runBackfill() {
  console.log("=== Meto V2 Knowledge Layer Backfill ===");

  const { data: profiles, error: pError } = await supabase
    .from("profiles")
    .select("id, username");

  if (pError) {
    console.error("Failed to query profiles:", pError);
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.log("No profiles found.");
    return;
  }

  console.log(`Found ${profiles.length} user profile(s). Starting backfill...\n`);

  let totalMigrated = 0;
  let totalCreated = 0;
  let totalUpdated = 0;

  for (const profile of profiles) {
    const label = profile.username ? `@${profile.username} (${profile.id})` : profile.id;

    const { data: sections, error: sError } = await supabase
      .from("context_sections")
      .select("id, section_type, title, content")
      .eq("user_id", profile.id)
      .order("display_order", { ascending: true });

    if (sError) {
      console.error(`[ERROR] User ${label} sections fetch failed:`, sError);
      continue;
    }

    const rows = sections ?? [];
    let userCreated = 0;
    let userUpdated = 0;
    let userSkipped = 0;

    for (const section of rows) {
      if (!section.content || !section.content.trim()) {
        userSkipped++;
        continue;
      }

      const memoryType = SECTION_TO_MEMORY_TYPE[section.section_type] || "custom";

      // Check if already migrated
      const { data: existing } = await supabase
        .from("knowledge_objects")
        .select("id")
        .eq("user_id", profile.id)
        .eq("source", "migration")
        .contains("metadata", { migration_section_id: section.id })
        .maybeSingle();

      if (existing) {
        await supabase
          .from("knowledge_objects")
          .update({
            title: section.title,
            content: section.content.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        userUpdated++;
      } else {
        await supabase.from("knowledge_objects").insert({
          user_id: profile.id,
          type: memoryType,
          title: section.title,
          content: section.content.trim(),
          confidence: 1,
          importance: 3,
          visibility: "private",
          source: "migration",
          status: "active",
          created_by: "system",
          tags: [section.section_type],
          metadata: {
            migration_section_id: section.id,
            section_type: section.section_type,
            section_title: section.title,
            migrated_from: "context_sections",
          },
        });
        userCreated++;
      }
    }

    console.log(`[OK] User ${label}: ${userCreated} created, ${userUpdated} updated, ${userSkipped} skipped (total: ${rows.length})`);
    totalCreated += userCreated;
    totalUpdated += userUpdated;
    totalMigrated++;
  }

  console.log("\n=== Backfill Summary ===");
  console.log(`Users processed: ${totalMigrated}/${profiles.length}`);
  console.log(`Knowledge objects created: ${totalCreated}`);
  console.log(`Knowledge objects updated: ${totalUpdated}`);
  console.log("Backfill complete.\n");
}

runBackfill().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
