import posthog from "posthog-js";

export function isPostHogEnabled() {
  return Boolean(
    typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY
  );
}

export function getPostHogClient() {
  if (!isPostHogEnabled()) return null;
  return posthog;
}

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (!isPostHogEnabled()) return;
  posthog.capture(event, properties);
}

export function identifyUser(
  distinctId: string,
  properties?: Record<string, unknown>
) {
  if (!isPostHogEnabled()) return;
  posthog.identify(distinctId, properties);
}

export function resetPostHogUser() {
  if (!isPostHogEnabled()) return;
  posthog.reset();
}
