import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — personal AI identity profiles

> Public profiles for AI tools. No login required. Use the **www** host (canonical on Vercel).

## Recommended URLs for AI agents

JSON (best for tools that expect application/json):

\`\`\`
${base}/api/public/profile/{username}/context?format=json
\`\`\`

Example: ${base}/api/public/profile/smone/context?format=json

Or send header: Accept: application/json

Plain text (paste-ready block):

\`\`\`
${base}/api/public/profile/{username}/context
\`\`\`

Structured profile JSON:

\`\`\`
${base}/.well-known/ai-profile/{username}.json
\`\`\`

## Other formats

- HTML: ${base}/profile/{username}
- Legacy plain text: ${base}/profile/{username}/context

## Query parameters

- format=json | universal | claude | chatgpt | gemini (json returns full payload + context field)
- preset=all | coding | writing | career | basics
- sections=comma-separated section types

## Notes

- Canonical host: www.metoai.site (apex metoai.site redirects — follow redirects or use www directly)
- CORS: Access-Control-Allow-Origin: *
- No cookies or authentication
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
