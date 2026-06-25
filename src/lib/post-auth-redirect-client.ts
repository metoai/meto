export async function fetchPostAuthRedirect(next?: string): Promise<string> {
  const qs = next ? `?next=${encodeURIComponent(next)}` : "";
  const res = await fetch(`/api/auth/redirect-target${qs}`);

  if (!res.ok) {
    return "/dashboard";
  }

  const data = (await res.json()) as { path?: string };
  return data.path ?? "/dashboard";
}
