import { NextResponse } from "next/server";
import {
  fetchPublicProfileByUsername,
  toPublicProfileApiResponse,
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

    return NextResponse.json(toPublicProfileApiResponse(publicProfile), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET public profile error:", error);
    return NextResponse.json(
      { error: "Failed to load public profile." },
      { status: 500 }
    );
  }
}
