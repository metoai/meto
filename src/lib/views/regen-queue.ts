import type { SupabaseClient } from "@supabase/supabase-js";
import {
  regenerateViews,
  type RegenerateScope,
} from "@/lib/views/regenerate";

type PendingJob = {
  userId: string;
  username: string | null;
  scope: RegenerateScope;
  resolve: (value: void) => void;
  reject: (reason: unknown) => void;
};

const timers = new Map<string, ReturnType<typeof setTimeout>>();
const pending = new Map<string, PendingJob>();

const DEBOUNCE_MS = 1500;

export function scheduleRegeneration(
  supabase: SupabaseClient,
  userId: string,
  username: string | null = null,
  scope: RegenerateScope = "all"
): Promise<void> {
  const existing = timers.get(userId);
  if (existing) clearTimeout(existing);

  return new Promise((resolve, reject) => {
    pending.set(userId, { userId, username, scope, resolve, reject });

    const timer = setTimeout(async () => {
      timers.delete(userId);
      const job = pending.get(userId);
      pending.delete(userId);
      if (!job) return;

      try {
        await regenerateViews(supabase, job.userId, job.username, job.scope);
        job.resolve();
      } catch (error) {
        job.reject(error);
      }
    }, DEBOUNCE_MS);

    timers.set(userId, timer);
  });
}

export async function flushRegeneration(
  supabase: SupabaseClient,
  userId: string,
  username: string | null = null,
  scope: RegenerateScope = "all"
) {
  const existing = timers.get(userId);
  if (existing) {
    clearTimeout(existing);
    timers.delete(userId);
  }
  pending.delete(userId);
  return regenerateViews(supabase, userId, username, scope);
}
