"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { identifyUser, resetPostHogUser } from "@/lib/posthog";

type PostHogIdentifyProps = {
  email?: string;
  username?: string | null;
  plan?: string | null;
};

/** Links Supabase auth + Meto profile to PostHog person records. */
export function PostHogIdentify({
  email,
  username,
  plan,
}: PostHogIdentifyProps) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    const supabase = createClient();

    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        resetPostHogUser();
        return;
      }

      identifyUser(user.id, {
        email: email || user.email,
        username: username ?? undefined,
        plan: plan ?? undefined,
      });
    });
  }, [email, username, plan]);

  return null;
}
