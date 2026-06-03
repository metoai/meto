import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — personal AI identity profiles

> Public profiles are plain text for AI tools. Use the API URL for the most reliable fetch (ChatGPT, Claude, scripts).

## Recommended URL for AI agents

\`\`\`
${base}/api/public/profile/{username}/context
\`\`\`

Example: ${base}/api/public/profile/smone/context

## Other formats

- HTML: ${base}/profile/{username}
- Legacy plain text: ${base}/profile/{username}/context
- JSON: ${base}/.well-known/ai-profile/{username}.json

## Query parameters

- preset=all | coding | writing | career | basics
- format=universal | claude | chatgpt | gemini

## Notes

- No authentication required
- CORS: Access-Control-Allow-Origin: *
- Content-Type: text/plain; charset=utf-8
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
