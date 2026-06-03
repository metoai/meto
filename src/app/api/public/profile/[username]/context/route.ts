import {
  buildPublicContextBody,
  publicContextResponse,
} from "@/lib/public-context";

export const revalidate = 300;
export const runtime = "nodejs";

type RouteContext = { params: { username: string } };

/** Machine-readable public profile — optimized for AI crawlers and fetch tools. */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await buildPublicContextBody(params.username, searchParams);

    if ("error" in result) {
      return new Response(result.error, {
        status: result.status,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    return publicContextResponse(params.username, result.text);
  } catch (error) {
    console.error("GET public context API error:", error);
    return new Response("Failed to load profile context.", { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
