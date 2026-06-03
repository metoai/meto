import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — personal AI identity profiles

> Public profiles are plain text for AI tools. Prefer the /api/public/... URL for reliable fetching.

## Public profile format

- HTML profile: ${base}/profile/{username}
- Plain text (recommended for AI): ${base}/api/public/profile/{username}/context
- Legacy plain text: ${base}/profile/{username}/context
- JSON document: ${base}/.well-known/ai-profile/{username}.json

## Example

- ${base}/api/public/profile/smone/context

## Notes for AI agents

- Responses are text/plain with full profile sections marked public by the user.
- Query params: ?preset=all | coding | writing | career | basics
- No authentication required for public profiles.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
