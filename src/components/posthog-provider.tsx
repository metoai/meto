"use client";

import {
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type posthogType from "posthog-js";

type PostHogClient = typeof posthogType;

function PostHogPageView({ client }: { client: PostHogClient }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !pathname) return;

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    client.capture("$pageview", { $current_url: url });
  }, [client, pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<PostHogClient | null>(null);
  const [Provider, setProvider] = useState<ComponentType<{
    client: PostHogClient;
    children: ReactNode;
  }> | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    let cancelled = false;

    void Promise.all([import("posthog-js"), import("posthog-js/react")]).then(
      ([posthogModule, reactModule]) => {
        if (cancelled) return;

        posthogModule.default.init(key, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
          person_profiles: "identified_only",
          capture_pageview: false,
          capture_pageleave: true,
        });

        setClient(posthogModule.default);
        setProvider(() => reactModule.PostHogProvider);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !client || !Provider) {
    return <>{children}</>;
  }

  return (
    <Provider client={client}>
      <Suspense fallback={null}>
        <PostHogPageView client={client} />
      </Suspense>
      {children}
    </Provider>
  );
}
