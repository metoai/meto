import {
  getAdminAiUsage,
  listAdminCompiledProfiles,
  listAdminOnboardingChats,
  listAdminSections,
  getAdminContextScore,
  type AdminAiUsage,
  type AdminCompiledProfile,
  type AdminContextScore,
  type AdminOnboardingChat,
  type AdminSection,
} from "@/lib/admin-crud";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getEntitlements,
  type BillingProfileRow,
  type OnboardingAiUsed,
  type Plan,
} from "@/lib/entitlements";

export type AdminStats = {
  totalUsers: number;
  planCounts: Record<Plan, number>;
  proSubscribers: number;
  activeTrials: number;
  trialsExpiringSoon: number;
  totalAiCalls: number;
  totalSections: number;
  avgContextScore: number;
  usersWithSections: number;
  onboardingCompleted: number;
  signupsByDay: { date: string; count: number }[];
  aiUsageByPlan: { plan: string; calls: number }[];
  scoreDistribution: { bucket: string; count: number }[];
  recentSignups: AdminUserRow[];
};

export type AdminUserRow = {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  plan: Plan;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
  ai_calls_used: number;
  ai_usage_limit: number;
  ai_usage_remaining: number;
  polar_customer_id: string | null;
  polar_subscription_id: string | null;
  onboarding_ai_used: OnboardingAiUsed;
  section_count: number;
  context_score: number | null;
};

export type AdminUserDetail = AdminUserRow & {
  ai_usage_period_start: string | null;
  ai_usage: AdminAiUsage;
  sections: AdminSection[];
  context_score_detail: AdminContextScore | null;
  compiled_profiles: AdminCompiledProfile[];
  onboarding_chats: AdminOnboardingChat[];
};

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  plan: Plan;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
  ai_calls_used: number | null;
  ai_usage_period_start: string | null;
  polar_customer_id: string | null;
  polar_subscription_id: string | null;
  onboarding_ai_used: OnboardingAiUsed;
};

function withAiLimits(
  p: ProfileRow,
  score: number | null,
  sectionCount: number,
  email: string,
): AdminUserRow {
  const billingRow: BillingProfileRow = {
    id: p.id,
    plan: p.plan,
    trial_ends_at: p.trial_ends_at,
    onboarding_ai_used: p.onboarding_ai_used ?? null,
    polar_customer_id: p.polar_customer_id,
    polar_subscription_id: p.polar_subscription_id,
    created_at: p.created_at,
    ai_calls_used: p.ai_calls_used ?? undefined,
    ai_usage_period_start: p.ai_usage_period_start,
  };
  const usage = getEntitlements(billingRow).aiUsage;

  return {
    id: p.id,
    email,
    username: p.username,
    display_name: p.display_name,
    plan: p.plan,
    trial_ends_at: p.trial_ends_at,
    created_at: p.created_at,
    updated_at: p.updated_at,
    ai_calls_used: p.ai_calls_used ?? 0,
    ai_usage_limit: usage.limit,
    ai_usage_remaining: usage.remaining,
    polar_customer_id: p.polar_customer_id,
    polar_subscription_id: p.polar_subscription_id,
    onboarding_ai_used: p.onboarding_ai_used ?? null,
    section_count: sectionCount,
    context_score: score,
  };
}

function scoreBucket(score: number): string {
  if (score < 25) return "0–24";
  if (score < 50) return "25–49";
  if (score < 75) return "50–74";
  return "75–100";
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const admin = createAdminClient();
  const now = new Date();
  const soon = new Date(now);
  soon.setUTCDate(soon.getUTCDate() + 3);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

  const [
    profilesRes,
    sectionsRes,
    scoresRes,
    authUsersRes,
  ] = await Promise.all([
    admin
      .from("profiles")
      .select(
        "id, username, display_name, plan, trial_ends_at, created_at, updated_at, ai_calls_used, ai_usage_period_start, polar_customer_id, polar_subscription_id, onboarding_ai_used",
      )
      .order("created_at", { ascending: false }),
    admin.from("context_sections").select("user_id"),
    admin.from("context_scores").select("user_id, score"),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (profilesRes.error) throw profilesRes.error;
  if (sectionsRes.error) throw sectionsRes.error;
  if (scoresRes.error) throw scoresRes.error;
  if (authUsersRes.error) throw authUsersRes.error;

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const emailById = new Map(
    (authUsersRes.data.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  const sectionCountByUser = new Map<string, number>();
  for (const row of sectionsRes.data ?? []) {
    const uid = row.user_id as string;
    sectionCountByUser.set(uid, (sectionCountByUser.get(uid) ?? 0) + 1);
  }

  const scoreByUser = new Map<string, number>();
  for (const row of scoresRes.data ?? []) {
    scoreByUser.set(row.user_id as string, row.score as number);
  }

  const planCounts: Record<Plan, number> = { trial: 0, free: 0, pro: 0 };
  let totalAiCalls = 0;
  let activeTrials = 0;
  let trialsExpiringSoon = 0;
  let proSubscribers = 0;
  let usersWithSections = 0;
  let onboardingCompleted = 0;
  const signupMap = new Map<string, number>();
  const aiByPlan = new Map<Plan, number>();
  const scoreBuckets = new Map<string, number>();

  for (const p of profiles) {
    planCounts[p.plan] = (planCounts[p.plan] ?? 0) + 1;
    totalAiCalls += p.ai_calls_used ?? 0;
    aiByPlan.set(p.plan, (aiByPlan.get(p.plan) ?? 0) + (p.ai_calls_used ?? 0));

    if (p.plan === "trial" && p.trial_ends_at && new Date(p.trial_ends_at) > now) {
      activeTrials += 1;
      if (new Date(p.trial_ends_at) <= soon) {
        trialsExpiringSoon += 1;
      }
    }

    if (p.plan === "pro" || p.polar_subscription_id) {
      proSubscribers += 1;
    }

    const sc = sectionCountByUser.get(p.id) ?? 0;
    if (sc > 0) usersWithSections += 1;
    if (p.onboarding_ai_used) onboardingCompleted += 1;

    const created = new Date(p.created_at);
    if (created >= thirtyDaysAgo) {
      const key = dayKey(p.created_at);
      signupMap.set(key, (signupMap.get(key) ?? 0) + 1);
    }

    const score = scoreByUser.get(p.id);
    if (typeof score === "number") {
      const bucket = scoreBucket(score);
      scoreBuckets.set(bucket, (scoreBuckets.get(bucket) ?? 0) + 1);
    }
  }

  const scores = Array.from(scoreByUser.values());
  const avgContextScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const signupsByDay: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = dayKey(d.toISOString());
    signupsByDay.push({ date: key, count: signupMap.get(key) ?? 0 });
  }

  const recentSignups: AdminUserRow[] = profiles.slice(0, 8).map((p) =>
    withAiLimits(
      p,
      scoreByUser.get(p.id) ?? null,
      sectionCountByUser.get(p.id) ?? 0,
      emailById.get(p.id) ?? "",
    ),
  );

  return {
    totalUsers: profiles.length,
    planCounts,
    proSubscribers,
    activeTrials,
    trialsExpiringSoon,
    totalAiCalls,
    totalSections: sectionsRes.data?.length ?? 0,
    avgContextScore,
    usersWithSections,
    onboardingCompleted,
    signupsByDay,
    aiUsageByPlan: (["trial", "free", "pro"] as Plan[]).map((plan) => ({
      plan,
      calls: aiByPlan.get(plan) ?? 0,
    })),
    scoreDistribution: ["0–24", "25–49", "50–74", "75–100"].map((bucket) => ({
      bucket,
      count: scoreBuckets.get(bucket) ?? 0,
    })),
    recentSignups,
  };
}

export type UsersListParams = {
  page?: number;
  perPage?: number;
  search?: string;
  plan?: Plan | "all";
};

export type UsersListResult = {
  users: AdminUserRow[];
  total: number;
  page: number;
  perPage: number;
};

export async function fetchAdminUsers(
  params: UsersListParams = {},
): Promise<UsersListResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.min(50, Math.max(10, params.perPage ?? 20));
  const search = params.search?.trim().toLowerCase() ?? "";
  const planFilter = params.plan ?? "all";

  const admin = createAdminClient();

  let query = admin
    .from("profiles")
    .select(
      "id, username, display_name, plan, trial_ends_at, created_at, updated_at, ai_calls_used, ai_usage_period_start, polar_customer_id, polar_subscription_id, onboarding_ai_used",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (planFilter !== "all") {
    query = query.eq("plan", planFilter);
  }

  if (search) {
    query = query.or(
      `username.ilike.%${search}%,display_name.ilike.%${search}%`,
    );
  }

  const from = (page - 1) * perPage;
  const { data, error, count } = await query.range(from, from + perPage - 1);

  if (error) throw error;

  const profiles = (data ?? []) as ProfileRow[];
  const ids = profiles.map((p) => p.id);

  const [sectionsRes, scoresRes, authUsersRes] = await Promise.all([
    ids.length
      ? admin.from("context_sections").select("user_id").in("user_id", ids)
      : Promise.resolve({ data: [], error: null }),
    ids.length
      ? admin.from("context_scores").select("user_id, score").in("user_id", ids)
      : Promise.resolve({ data: [], error: null }),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (sectionsRes.error) throw sectionsRes.error;
  if (scoresRes.error) throw scoresRes.error;
  if (authUsersRes.error) throw authUsersRes.error;

  const emailById = new Map(
    (authUsersRes.data.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  const sectionCountByUser = new Map<string, number>();
  for (const row of sectionsRes.data ?? []) {
    const uid = row.user_id as string;
    sectionCountByUser.set(uid, (sectionCountByUser.get(uid) ?? 0) + 1);
  }

  const scoreByUser = new Map<string, number>();
  for (const row of scoresRes.data ?? []) {
    scoreByUser.set(row.user_id as string, row.score as number);
  }

  let users: AdminUserRow[] = profiles.map((p) =>
    withAiLimits(
      p,
      scoreByUser.get(p.id) ?? null,
      sectionCountByUser.get(p.id) ?? 0,
      emailById.get(p.id) ?? "",
    ),
  );

  if (search) {
    users = users.filter(
      (u) =>
        u.email.toLowerCase().includes(search) ||
        (u.username?.toLowerCase().includes(search) ?? false) ||
        (u.display_name?.toLowerCase().includes(search) ?? false),
    );
  }

  return {
    users,
    total: count ?? users.length,
    page,
    perPage,
  };
}

export async function fetchAdminUserDetail(
  userId: string,
): Promise<AdminUserDetail | null> {
  const admin = createAdminClient();

  const [profileRes, authRes, aiUsage, sections, score, compiled, chats] =
    await Promise.all([
      admin
        .from("profiles")
        .select(
          "id, username, display_name, plan, trial_ends_at, created_at, updated_at, ai_calls_used, ai_usage_period_start, polar_customer_id, polar_subscription_id, onboarding_ai_used",
        )
        .eq("id", userId)
        .maybeSingle(),
      admin.auth.admin.getUserById(userId),
      getAdminAiUsage(userId),
      listAdminSections(userId),
      getAdminContextScore(userId),
      listAdminCompiledProfiles(userId),
      listAdminOnboardingChats(userId),
    ]);

  if (profileRes.error) throw profileRes.error;
  if (!profileRes.data) return null;
  if (authRes.error) throw authRes.error;

  const p = profileRes.data as ProfileRow;
  const base = withAiLimits(
    p,
    score?.score ?? null,
    sections.length,
    authRes.data.user?.email ?? "",
  );

  return {
    ...base,
    ai_usage_period_start: p.ai_usage_period_start ?? null,
    ai_usage: aiUsage,
    sections,
    context_score_detail: score,
    compiled_profiles: compiled,
    onboarding_chats: chats,
  };
}

export type BillingOverview = {
  proCount: number;
  trialCount: number;
  freeCount: number;
  withPolarCustomer: number;
  withSubscription: number;
  expiringTrials: AdminUserRow[];
  proUsers: AdminUserRow[];
};

export async function fetchBillingOverview(): Promise<BillingOverview> {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await admin
    .from("profiles")
    .select(
      "id, username, display_name, plan, trial_ends_at, created_at, updated_at, ai_calls_used, ai_usage_period_start, polar_customer_id, polar_subscription_id, onboarding_ai_used",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  const profiles = (data ?? []) as ProfileRow[];
  const authUsersRes = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (authUsersRes.error) throw authUsersRes.error;

  const emailById = new Map(
    (authUsersRes.data.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  const toRow = (p: ProfileRow): AdminUserRow =>
    withAiLimits(p, null, 0, emailById.get(p.id) ?? "");

  let proCount = 0;
  let trialCount = 0;
  let freeCount = 0;
  let withPolarCustomer = 0;
  let withSubscription = 0;

  const expiringTrials: AdminUserRow[] = [];
  const proUsers: AdminUserRow[] = [];

  for (const p of profiles) {
    if (p.plan === "pro") proCount += 1;
    else if (p.plan === "trial") trialCount += 1;
    else freeCount += 1;

    if (p.polar_customer_id) withPolarCustomer += 1;
    if (p.polar_subscription_id) withSubscription += 1;

    if (
      p.plan === "trial" &&
      p.trial_ends_at &&
      p.trial_ends_at > now &&
      !p.polar_subscription_id
    ) {
      expiringTrials.push(toRow(p));
    }

    if (p.plan === "pro" || p.polar_subscription_id) {
      proUsers.push(toRow(p));
    }
  }

  expiringTrials.sort(
    (a, b) =>
      new Date(a.trial_ends_at ?? 0).getTime() -
      new Date(b.trial_ends_at ?? 0).getTime(),
  );

  return {
    proCount,
    trialCount,
    freeCount,
    withPolarCustomer,
    withSubscription,
    expiringTrials: expiringTrials.slice(0, 20),
    proUsers,
  };
}
