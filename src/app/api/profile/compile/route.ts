import { NextResponse } from "next/server";
import { compileLocally } from "@/lib/compile-local";
import {
  compileProfileWithGemini,
  friendlyGeminiError,
  isRetryableGeminiError,
} from "@/lib/gemini";
import { assertAiAccess, recordAiUsage } from "@/lib/ai-usage";
import { upgradeRequiredResponse } from "@/lib/billing-errors";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import { COMPILE_FORMATS, type CompileFormat } from "@/lib/types";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

const VALID_FORMATS = COMPILE_FORMATS;

async function saveCompiled(
  userId: string,
  format: CompileFormat,
  compiled: string
) {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { error } = await supabase.from("compiled_profiles").upsert(
    {
      user_id: userId,
      full_context: compiled,
      format,
      last_compiled: now,
    },
    { onConflict: "user_id,format" }
  );

  if (error) throw error;
}

async function getLatestSectionUpdate(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("context_sections")
    .select("updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.updated_at ? new Date(data.updated_at) : null;
}

async function getSavedCompiled(userId: string, format: CompileFormat) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("compiled_profiles")
    .select("full_context, last_compiled")
    .eq("user_id", userId)
    .eq("format", format)
    .order("last_compiled", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] ?? null;
}

function isCacheValid(
  lastCompiled: string | null | undefined,
  latestSectionUpdate: Date | null
) {
  if (!lastCompiled) return false;
  if (!latestSectionUpdate) return true;
  return new Date(lastCompiled) >= latestSectionUpdate;
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") ?? "universal") as CompileFormat;

    if (!VALID_FORMATS.includes(format)) {
      return NextResponse.json({ error: "Invalid format." }, { status: 400 });
    }

    const saved = await getSavedCompiled(user.id, format);

    if (!saved?.full_context) {
      return NextResponse.json({ compiled: null, cached: false });
    }

    const latestUpdate = await getLatestSectionUpdate(user.id);
    const cached = isCacheValid(saved.last_compiled, latestUpdate);

    return NextResponse.json({
      compiled: saved.full_context,
      cached,
      lastCompiled: saved.last_compiled,
    });
  } catch (error) {
    console.error("GET compile error:", error);
    return NextResponse.json(
      { error: "Failed to load compiled profile." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = await enforceRateLimit(
      request,
      "compile",
      30,
      60 * 60 * 1000,
      user.id
    );
    if (limited) return limited;

    const {
      format = "universal",
      force = false,
      localOnly = false,
    } = await request.json();

    if (!VALID_FORMATS.includes(format)) {
      return NextResponse.json({ error: "Invalid format." }, { status: 400 });
    }

    const { data: sections, error: sectionsError } = await supabase
      .from("context_sections")
      .select("section_type, title, content")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });

    if (sectionsError) throw sectionsError;

    if (!sections?.length) {
      return NextResponse.json(
        { error: "No sections to compile." },
        { status: 400 }
      );
    }

    const entitlements = await getEntitlementsForUser(user.id);

    if (force && !localOnly && !entitlements.canUseLlmCompile) {
      return upgradeRequiredResponse("llm_compile");
    }

    if (!force && !localOnly) {
      const saved = await getSavedCompiled(user.id, format);
      const latestUpdate = await getLatestSectionUpdate(user.id);

      if (
        saved?.full_context &&
        isCacheValid(saved.last_compiled, latestUpdate)
      ) {
        return NextResponse.json({
          compiled: saved.full_context,
          cached: true,
          usedFallback: false,
        });
      }
    }

    let compiled: string;
    let usedFallback = false;

    if (localOnly || !entitlements.canUseLlmCompile) {
      compiled = compileLocally(format, sections);
      usedFallback = true;
    } else {
      const aiAccess = await assertAiAccess(user.id, "llm_compile");
      if (!aiAccess.ok) return aiAccess.response;

      try {
        compiled = await compileProfileWithGemini(sections, format);
        await recordAiUsage(user.id, 1, aiAccess.row);
      } catch (error) {
        if (isRetryableGeminiError(error)) {
          compiled = compileLocally(format, sections);
          usedFallback = true;
        } else {
          throw error;
        }
      }
    }

    await saveCompiled(user.id, format, compiled);

    return NextResponse.json({ compiled, cached: false, usedFallback: localOnly ? false : usedFallback });
  } catch (error) {
    console.error("Compile error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
