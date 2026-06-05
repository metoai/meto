import { NextResponse } from "next/server";
import {
  fetchPublicProfileByUsername,
  toAiProfileDocument,
} from "@/lib/public-profile";

type RouteContext = {
  params: { username: string };
};

export const revalidate = 60;

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const publicProfile = await fetchPublicProfileByUsername(params.username);

    if (!publicProfile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    if (!publicProfile.hasPublicContent) {
      return NextResponse.json(
        { error: "This profile has no public content." },
        { status: 404 }
      );
    }

    return NextResponse.json(toAiProfileDocument(publicProfile), {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "X-Robots-Tag": "all",
      },
    });
  } catch (error) {
    console.error("GET ai-profile error:", error);
    return NextResponse.json(
      { error: "Failed to load AI profile." },
      { status: 500 }
    );
  }
}
