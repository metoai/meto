import { NextResponse } from "next/server";
import {
  fetchPublicProfileByUsername,
  getSiteUrl,
  toAiProfileDocument,
} from "@/lib/public-profile";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: { username: string };
};

export const revalidate = 60;

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const supabase = createClient();
    const publicProfile = await fetchPublicProfileByUsername(
      supabase,
      params.username
    );

    if (!publicProfile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    if (!publicProfile.hasPublicContent) {
      return NextResponse.json(
        { error: "This profile has no public content." },
        { status: 404 }
      );
    }

    return NextResponse.json(toAiProfileDocument(publicProfile, getSiteUrl()), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Content-Type": "application/json",
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
