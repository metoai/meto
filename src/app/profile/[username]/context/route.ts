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

type RouteContext = { params: Promise<{ username: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const result = await buildPublicContextBody(username, searchParams);

    if ("error" in result) {
      const status = result.status;
      if (requestWantsJson(request, searchParams)) {
        return Response.json(
          { error: result.error, username: username.toLowerCase() },
          {
            status,
            headers: {
              "Cache-Control": "public, max-age=60",
              ...PUBLIC_CORS_HEADERS,
            },
          }
        );
      }
      return new Response(result.error, {
        status,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=60",
          ...PUBLIC_CORS_HEADERS,
        },
      });
    }

    if (requestWantsJson(request, searchParams)) {
      return publicContextJsonResponse(
        buildPublicContextJsonPayload(username, result)
      );
    }

    if (requestWantsHtml(request, searchParams)) {
      return publicContextHtmlResponse(
        username,
        result.profile.name,
        result.text
      );
    }

    return publicContextResponse(username, result.text);
  } catch (error) {
    console.error("GET profile context error:", error);
    return new Response("Failed to load profile context.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        ...PUBLIC_CORS_HEADERS,
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: PUBLIC_CORS_HEADERS,
  });
}
