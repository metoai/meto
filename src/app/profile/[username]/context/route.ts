import {
  buildPublicContextBody,
  buildPublicContextJsonPayload,
  PUBLIC_CORS_HEADERS,
  publicContextHtmlResponse,
  publicContextJsonResponse,
  publicContextResponse,
  requestWantsHtml,
  requestWantsJson,
} from "@/lib/public-context";

export const revalidate = 300;
export const runtime = "nodejs";

type RouteContext = { params: { username: string } };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await buildPublicContextBody(params.username, searchParams);

    if ("error" in result) {
      const status = result.status;
      if (requestWantsJson(request, searchParams)) {
        return Response.json(
          { error: result.error, username: params.username.toLowerCase() },
          { status, headers: PUBLIC_CORS_HEADERS }
        );
      }
      return new Response(result.error, { status });
    }

    if (requestWantsJson(request, searchParams)) {
      return publicContextJsonResponse(
        buildPublicContextJsonPayload(params.username, result)
      );
    }

    if (requestWantsHtml(request, searchParams)) {
      return publicContextHtmlResponse(
        params.username,
        result.profile.name,
        result.text
      );
    }

    return publicContextResponse(params.username, result.text);
  } catch (error) {
    console.error("GET profile context error:", error);
    return new Response("Failed to load profile context.", { status: 500 });
  }
}
