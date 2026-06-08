import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — personal AI identity profiles

> Public profiles for AI tools. No login required. Use the **www** host (canonical on Vercel).

## Share link (works in ChatGPT, Gemini, Claude, DeepSeek, Grok, Kimi, Qwen, and more)

\`\`\`
${base}/profile/{username}
\`\`\`

## Other formats

Plain text context:

\`\`\`
${base}/profile/{username}/context
\`\`\`

JSON:

\`\`\`
${base}/profile/{username}/context?format=json
\`\`\`

Structured profile JSON:

\`\`\`
${base}/.well-known/ai-profile/{username}.json
\`\`\`

## Query parameters

- format=json | universal | claude | chatgpt | gemini | deepseek | grok | kimi | qwen
- view=html (force HTML page for browser-style fetchers)
- preset=all | coding | writing | career | basics
- sections=comma-separated section types

## Notes

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
