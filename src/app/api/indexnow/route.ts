import { NextResponse } from "next/server";
import {
  getIndexableUrls,
  getIndexNowKey,
  submitToIndexNow,
} from "@/lib/indexnow";
import { CANONICAL_SITE_HOST } from "@/lib/site";

export async function GET() {
  const key = getIndexNowKey();
  const host = CANONICAL_SITE_HOST;
  const keyLocation = `https://${host}/${key}.txt`;
  const urls = await getIndexableUrls();

  return NextResponse.json({
    status: "ok",
    host,
    key,
    keyLocation,
    urlCount: urls.length,
    urls,
  });
}

export async function POST(request: Request) {
  try {
    let body: { urls?: string[]; host?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional
    }

    const result = await submitToIndexNow(body.urls, {
      host: body.host,
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 502,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "IndexNow submit failed",
      },
      { status: 500 }
    );
  }
}
