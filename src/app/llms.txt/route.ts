import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  const body = `# Meto — personal AI identity profiles

> Public profiles for AI tools. No login required. Always use the **www** host (canonical on Vercel).

## Best URL for AI fetch tools (plain text)

\`\`\`
${base}/api/public/profile/{username}/context?preset=all&format=universal
\`\`\`

Returns \`text/plain\` with full profile context. CORS enabled. Bot fetchers hitting \`/profile/{username}\` are rewritten to this endpoint.

## Human-readable profile page

\`\`\`
${base}/profile/{username}
\`\`\`

## Legacy context path (rewrites to API)

\`\`\`
${base}/profile/{username}/context
\`\`\`

## JSON context

\`\`\`
${base}/api/public/profile/{username}/context?format=json&preset=all
\`\`\`

## Structured profile document

\`\`\`
${base}/.well-known/ai-profile/{username}.json
\`\`\`

## Query parameters

- format=json | universal | claude | chatgpt | gemini | deepseek | grok | kimi | qwen
- view=html (force HTML page for browser-style fetchers)
- preset=all | coding | writing | career | basics
- sections=comma-separated section types

## Supported AI platforms (workspace copy)

ChatGPT, Gemini, Claude, DeepSeek, Grok, Kimi (Moonshot), Qwen, and universal plain text.

## Notes

- Canonical host: www.metoai.site (apex metoai.site redirects)
- CORS: Access-Control-Allow-Origin: * on /api/public/*
- No cookies or authentication required for public profile URLs
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
