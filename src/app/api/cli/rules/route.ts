import { NextResponse } from "next/server";
import { buildProjectMetoRules, type EditorTarget } from "@/lib/mcp-install";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const editorParam = searchParams.get("editor") || "cursor";
  const projectSlug = searchParams.get("project") || undefined;
  const projectName = searchParams.get("name") || undefined;
  const username = searchParams.get("username") || undefined;

  const validEditors: EditorTarget[] = ["cursor", "claude", "windsurf", "antigravity", "copilot"];
  const editor: EditorTarget = validEditors.includes(editorParam as EditorTarget)
    ? (editorParam as EditorTarget)
    : "cursor";

  const rule = buildProjectMetoRules({
    editor,
    projectSlug,
    projectName,
    username,
  });

  return NextResponse.json({
    status: "success",
    filename: rule.filename,
    editor: rule.editor,
    projectSlug: projectSlug || null,
    content: rule.content,
    instructions: `Place this file in your repository root at ${rule.filename} to enable proactive memory recall and autonomous decision sync.`,
  });
}
