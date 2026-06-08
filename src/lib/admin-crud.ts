import {
  getAiUsageSnapshotFromRow,
  syncAiUsagePeriod,
  type AiUsageSnapshot,
} from "@/lib/ai-usage";
import type { OnboardingAiUsed, Plan } from "@/lib/entitlements";
import { getEntitlements } from "@/lib/entitlements";
import { SECTION_SELECT } from "@/lib/section-fields";
import { normalizeUsername, validateUsername } from "@/lib/username";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CompileFormat } from "@/lib/types";
import { COMPILE_FORMATS } from "@/lib/types";

export type AdminAiUsage = AiUsageSnapshot & {
  effectivePlan: Plan;
};

export type AdminSection = {
  id: string;
  user_id: string;
  section_type: string;
  title: string;
  content: string;
  is_public: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminCompiledProfile = {
  format: CompileFormat;
  full_context: string;
  last_compiled: string;
};

export type AdminOnboardingChat = {
  id: string;
  completed: boolean;
  message_count: number;
  created_at: string;
};

export type AdminContextScore = {
  score: number;
  headline: string;
  summary: string;
  gaps: unknown;
  resolved_sections: unknown;
  analyzed_at: string;
};

export type UpdateAdminUserParams = {
  username?: string | null;
  display_name?: string | null;
  plan?: Plan;
  trial_ends_at?: string | null;
  onboarding_ai_used?: OnboardingAiUsed;
  polar_customer_id?: string | null;
  polar_subscription_id?: string | null;
  ai_calls_used?: number;
  ai_usage_period_start?: string | null;
};

export type UpsertSectionParams = {
  title: string;
  content: string;
  section_type?: string;
  is_public?: boolean;
  display_order?: number;
};

export type UpdateSectionParams = Partial<UpsertSectionParams>;

export type UpsertScoreParams = {
  score: number;
  headline: string;
  summary: string;
  gaps?: unknown;
  resolved_sections?: unknown;
};

export async function getAdminAiUsage(userId: string): Promise<AdminAiUsage> {
  const row = await syncAiUsagePeriod(userId);
  const entitlements = getEntitlements(row);
  const usage = getAiUsageSnapshotFromRow(row);
  return { ...usage, effectivePlan: entitlements.plan };
}

export async function resetAdminAiUsage(userId: string): Promise<AdminAiUsage> {
  const admin = createAdminClient();
  const row = await syncAiUsagePeriod(userId);
  const effective = getEntitlements(row).plan;
  const now = new Date().toISOString();

  let periodStart: string | null = null;
  if (effective === "pro") {
    periodStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
    ).toISOString();
  } else if (effective === "trial") {
    periodStart = row.ai_usage_period_start ?? row.created_at ?? now;
  }

  const { error } = await admin
    .from("profiles")
    .update({
      ai_calls_used: 0,
      ai_usage_period_start: periodStart,
      updated_at: now,
    })
    .eq("id", userId);

  if (error) throw error;
  return getAdminAiUsage(userId);
}

export async function updateAdminUserProfile(
  userId: string,
  updates: UpdateAdminUserParams,
): Promise<void> {
  const admin = createAdminClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.username !== undefined) {
    if (updates.username === null || updates.username === "") {
      payload.username = null;
    } else {
      const err = validateUsername(updates.username);
      if (err) throw new Error(err);
      payload.username = normalizeUsername(updates.username);
    }
  }

  if (updates.display_name !== undefined) {
    payload.display_name =
      updates.display_name?.trim() ? updates.display_name.trim() : null;
  }
  if (updates.plan !== undefined) payload.plan = updates.plan;
  if (updates.trial_ends_at !== undefined) payload.trial_ends_at = updates.trial_ends_at;
  if (updates.onboarding_ai_used !== undefined) {
    payload.onboarding_ai_used = updates.onboarding_ai_used;
  }
  if (updates.polar_customer_id !== undefined) {
    payload.polar_customer_id = updates.polar_customer_id || null;
  }
  if (updates.polar_subscription_id !== undefined) {
    payload.polar_subscription_id = updates.polar_subscription_id || null;
  }
  if (updates.ai_calls_used !== undefined) payload.ai_calls_used = updates.ai_calls_used;
  if (updates.ai_usage_period_start !== undefined) {
    payload.ai_usage_period_start = updates.ai_usage_period_start;
  }

  const { error } = await admin.from("profiles").update(payload).eq("id", userId);
  if (error) throw error;
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw error;
}

export async function listAdminSections(userId: string): Promise<AdminSection[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("context_sections")
    .select(SECTION_SELECT)
    .eq("user_id", userId)
    .order("display_order");

  if (error) throw error;
  return (data ?? []) as AdminSection[];
}

export async function createAdminSection(
  userId: string,
  input: UpsertSectionParams,
): Promise<AdminSection> {
  const admin = createAdminClient();

  if (!input.title?.trim() || !input.content?.trim()) {
    throw new Error("Title and content are required.");
  }

  let displayOrder = input.display_order;
  if (displayOrder === undefined) {
    const { data: existing } = await admin
      .from("context_sections")
      .select("display_order")
      .eq("user_id", userId)
      .order("display_order", { ascending: false })
      .limit(1);

    displayOrder = (existing?.[0]?.display_order ?? -1) + 1;
  }

  const { data, error } = await admin
    .from("context_sections")
    .insert({
      user_id: userId,
      title: input.title.trim(),
      content: input.content.trim(),
      section_type: input.section_type ?? "custom",
      is_public: input.is_public ?? false,
      display_order: displayOrder,
    })
    .select(SECTION_SELECT)
    .single();

  if (error) throw error;
  return data as AdminSection;
}

export async function updateAdminSection(
  userId: string,
  sectionId: string,
  updates: UpdateSectionParams,
): Promise<AdminSection> {
  const admin = createAdminClient();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) payload.title = updates.title.trim();
  if (updates.content !== undefined) payload.content = updates.content.trim();
  if (updates.section_type !== undefined) payload.section_type = updates.section_type;
  if (updates.is_public !== undefined) payload.is_public = updates.is_public;
  if (updates.display_order !== undefined) payload.display_order = updates.display_order;

  const { data, error } = await admin
    .from("context_sections")
    .update(payload)
    .eq("id", sectionId)
    .eq("user_id", userId)
    .select(SECTION_SELECT)
    .single();

  if (error) throw error;
  return data as AdminSection;
}

export async function deleteAdminSection(
  userId: string,
  sectionId: string,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("context_sections")
    .delete()
    .eq("id", sectionId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getAdminContextScore(
  userId: string,
): Promise<AdminContextScore | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("context_scores")
    .select("score, headline, summary, gaps, resolved_sections, analyzed_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    score: data.score as number,
    headline: data.headline as string,
    summary: data.summary as string,
    gaps: data.gaps,
    resolved_sections: data.resolved_sections ?? [],
    analyzed_at: data.analyzed_at as string,
  };
}

export async function upsertAdminContextScore(
  userId: string,
  input: UpsertScoreParams,
): Promise<AdminContextScore> {
  const admin = createAdminClient();

  if (input.score < 0 || input.score > 100) {
    throw new Error("Score must be between 0 and 100.");
  }

  const { data, error } = await admin
    .from("context_scores")
    .upsert({
      user_id: userId,
      score: input.score,
      headline: input.headline.trim(),
      summary: input.summary.trim(),
      gaps: input.gaps ?? [],
      resolved_sections: input.resolved_sections ?? [],
      analyzed_at: new Date().toISOString(),
    })
    .select("score, headline, summary, gaps, resolved_sections, analyzed_at")
    .single();

  if (error) throw error;
  return {
    score: data.score as number,
    headline: data.headline as string,
    summary: data.summary as string,
    gaps: data.gaps,
    resolved_sections: data.resolved_sections ?? [],
    analyzed_at: data.analyzed_at as string,
  };
}

export async function deleteAdminContextScore(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("context_scores").delete().eq("user_id", userId);
  if (error) throw error;
}

export async function listAdminCompiledProfiles(
  userId: string,
): Promise<AdminCompiledProfile[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("compiled_profiles")
    .select("format, full_context, last_compiled")
    .eq("user_id", userId)
    .order("last_compiled", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdminCompiledProfile[];
}

export async function updateAdminCompiledProfile(
  userId: string,
  format: string,
  full_context: string,
): Promise<AdminCompiledProfile> {
  if (!COMPILE_FORMATS.includes(format as CompileFormat)) {
    throw new Error("Invalid compile format.");
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await admin
    .from("compiled_profiles")
    .upsert(
      {
        user_id: userId,
        format,
        full_context: full_context.trim(),
        last_compiled: now,
      },
      { onConflict: "user_id,format" },
    )
    .select("format, full_context, last_compiled")
    .single();

  if (error) throw error;
  return data as AdminCompiledProfile;
}

export async function deleteAdminCompiledProfile(
  userId: string,
  format: string,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("compiled_profiles")
    .delete()
    .eq("user_id", userId)
    .eq("format", format);

  if (error) throw error;
}

export async function listAdminOnboardingChats(
  userId: string,
): Promise<AdminOnboardingChat[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("onboarding_chats")
    .select("id, messages, completed, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const messages = row.messages as unknown[];
    return {
      id: row.id as string,
      completed: Boolean(row.completed),
      message_count: Array.isArray(messages) ? messages.length : 0,
      created_at: row.created_at as string,
    };
  });
}

export async function getAdminOnboardingChat(
  userId: string,
  chatId: string,
): Promise<{ id: string; messages: unknown; completed: boolean; created_at: string } | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("onboarding_chats")
    .select("id, messages, completed, created_at")
    .eq("user_id", userId)
    .eq("id", chatId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id as string,
    messages: data.messages,
    completed: Boolean(data.completed),
    created_at: data.created_at as string,
  };
}

export async function deleteAdminOnboardingChat(
  userId: string,
  chatId: string,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("onboarding_chats")
    .delete()
    .eq("user_id", userId)
    .eq("id", chatId);

  if (error) throw error;
}

export async function deleteAllAdminOnboardingChats(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("onboarding_chats")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}

export async function resetAdminUserData(userId: string): Promise<void> {
  const admin = createAdminClient();
  await Promise.all([
    admin.from("context_sections").delete().eq("user_id", userId),
    admin.from("compiled_profiles").delete().eq("user_id", userId),
    admin.from("onboarding_chats").delete().eq("user_id", userId),
    admin.from("context_scores").delete().eq("user_id", userId),
  ]);
}
