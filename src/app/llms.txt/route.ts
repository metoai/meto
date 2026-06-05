import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — personal AI identity profiles

> Public profiles for AI tools. No login required. Use the **www** host (canonical on Vercel).

## Best URL by AI tool

ChatGPT (paste the full prompt — it often refuses bare /api/ links):

\`\`\`
Open this URL with your browsing tool, read the full page, and use it as context about me. Do not guess from memory or training data.
${base}/profile/{username}/context?format=chatgpt
\`\`\`

Gemini (use the HTML profile page — indexed by Google):

\`\`\`
${base}/profile/{username}
\`\`\`

Claude, DeepSeek, Grok, Kimi (plain text context URL):

\`\`\`
${base}/profile/{username}/context
\`\`\`

## Machine-readable formats

JSON:

\`\`\`
${base}/profile/{username}/context?format=json
\`\`\`

Structured profile JSON:

\`\`\`
${base}/.well-known/ai-profile/{username}.json
\`\`\`

## Query parameters

- format=json | universal | claude | chatgpt | gemini
- view=html (force HTML page for browser-style fetchers)
- preset=all | coding | writing | career | basics
- sections=comma-separated section types

## Notes

- Prefer /profile/ URLs over /api/public/ for ChatGPT and Gemini
- Canonical host: www.metoai.site (apex metoai.site redirects)
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
