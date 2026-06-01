import { createClient } from "@/lib/supabase/server";

export async function getLatestSectionUpdate(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("context_sections")
    .select("updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.updated_at ? new Date(data.updated_at) : null;
}

export function isAnalysisCacheValid(
  analyzedAt: string | null | undefined,
  latestSectionUpdate: Date | null
) {
  if (!analyzedAt) return false;
  if (!latestSectionUpdate) return true;
  return new Date(analyzedAt) >= latestSectionUpdate;
}
