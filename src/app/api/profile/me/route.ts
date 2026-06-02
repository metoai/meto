import { NextResponse } from "next/server";
import { catchApiError } from "@/lib/api-error";
import { normalizeUsername, validateUsername } from "@/lib/username";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, display_name, created_at, updated_at")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ profile: data, email: user.email });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json(
      { error: "Failed to load profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { display_name, username, password } = await request.json();
    const updates: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };

    if (display_name !== undefined) {
      if (!display_name.trim()) {
        return NextResponse.json(
          { error: "Display name cannot be empty." },
          { status: 400 }
        );
      }
      updates.display_name = display_name.trim();
    }

    if (username !== undefined) {
      const normalized = normalizeUsername(username);
      const validationError = validateUsername(normalized);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", normalized)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "That username is already taken." },
          { status: 400 }
        );
      }

      updates.username = normalized;
    }

    if (password !== undefined) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters." },
          { status: 400 }
        );
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordError) throw passwordError;
    }

    if (Object.keys(updates).length > 1) {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select("id, username, display_name, created_at, updated_at")
        .single();

      if (error) throw error;

      return NextResponse.json({ profile: data });
    }

    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, created_at, updated_at")
      .eq("id", user.id)
      .single();

    return NextResponse.json({ profile: data });
  } catch (error) {
    return catchApiError(error, "Failed to update profile.");
  }
}
