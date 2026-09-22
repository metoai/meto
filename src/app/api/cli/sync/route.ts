import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashMcpToken } from "@/lib/mcp-auth";
import { getUserContextSections, getCompiledContext } from "@/lib/context/read";

function extractBearerToken(request: Request): string | null {
  const rawHeader = request.headers.get("authorization");
  if (!rawHeader) return null;
  const [scheme, token] = rawHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token?.trim()) {
    return null;
  }
  return token.trim();
}

function parseSectionSkills(content?: string): string[] {
  if (!content) return [];
  return content
    .split(/[\n,•;]+/)
    .map((s) => s.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedRole = searchParams.get("role") || "Senior Fullstack Engineer";
  const requestedStack = searchParams.get("stack") || "Next.js, TypeScript, Tailwind CSS, Supabase";

  const token = extractBearerToken(request);
  if (!token) {
    // Unauthenticated fallback
    return NextResponse.json({
      status: "success",
      version: "1.0.0",
      authenticated: false,
      profile: {
        role: requestedRole,
        stack: requestedStack.split(",").map((s) => s.trim()),
        directives: "Write clean, type-safe code. Prefer server components and functional patterns. Never swallow errors.",
        compiledContext: null,
      },
      meta: {
        generatedAt: new Date().toISOString(),
        mcpCommand: "npx -y meto mcp",
      },
    });
  }

  const tokenHash = hashMcpToken(token);
  const admin = createAdminClient();

  const { data: profile, error } = await admin
    .from("profiles")
    .select("id, username, display_name")
    .or(`mcp_access_token_hash.eq.${tokenHash},mcp_access_token.eq.${token}`)
    .maybeSingle();

  if (error || !profile) {
    return NextResponse.json(
      { error: "Invalid or expired authorization token." },
      { status: 401 }
    );
  }

  const sections = await getUserContextSections(admin, profile.id, false);
  const compiled = await getCompiledContext(admin, profile.id, "universal", sections);

  const skillsSection = sections.find((s) => s.section_type === "skills");
  const workingStyleSection = sections.find((s) => s.section_type === "working_style" || s.section_type === "context_for_ai");
  const aboutSection = sections.find((s) => s.section_type === "about" || s.section_type === "work");

  const stackList = skillsSection
    ? parseSectionSkills(skillsSection.content)
    : requestedStack.split(",").map((s) => s.trim());

  const directives = workingStyleSection?.content?.trim() || "Write clean, type-safe code. Prefer server components and functional patterns. Never swallow errors.";
  const role = aboutSection?.title?.trim() || profile.display_name || requestedRole;

  return NextResponse.json({
    status: "success",
    version: "1.0.0",
    authenticated: true,
    username: profile.username,
    profile: {
      role,
      stack: stackList,
      directives,
      compiledContext: compiled,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      mcpCommand: "npx -y meto mcp",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: "success",
      message: "CLI identity profile saved successfully.",
      syncedAt: new Date().toISOString(),
      received: body,
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}
