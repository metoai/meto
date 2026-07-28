import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "Senior Fullstack Engineer";
  const stack = searchParams.get("stack") || "Next.js, TypeScript, Tailwind CSS, Supabase";

  return NextResponse.json({
    status: "success",
    version: "1.0.0",
    profile: {
      role,
      stack: stack.split(",").map((s) => s.trim()),
      directives: "Write clean, type-safe code. Prefer server components and functional patterns. Never swallow errors.",
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
