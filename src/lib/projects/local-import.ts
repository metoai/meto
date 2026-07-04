import { REPO_SCAN_PATHS } from "@/lib/projects/repo-scanner";

/** Paths we try to read from a local folder or zip upload. */
export { REPO_SCAN_PATHS as LOCAL_IMPORT_PATHS };

export async function readFilesFromFileList(
  fileList: FileList
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};
  const paths = new Set(REPO_SCAN_PATHS.map((p) => p.toLowerCase()));

  for (const file of Array.from(fileList)) {
    const relative =
      (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
      file.name;
    const normalized = relative.replace(/\\/g, "/");
    const baseName = normalized.split("/").pop()?.toLowerCase() ?? "";
    const fullLower = normalized.toLowerCase();

    const matched = REPO_SCAN_PATHS.find(
      (p) =>
        fullLower.endsWith(p.toLowerCase()) ||
        (p.includes("/") && fullLower.endsWith(p.toLowerCase())) ||
        baseName === p.toLowerCase()
    );

    if (!matched && !paths.has(baseName)) continue;

    const key =
      matched ??
      REPO_SCAN_PATHS.find((p) => p.toLowerCase().endsWith(baseName)) ??
      normalized;
    try {
      const text = await file.text();
      if (text.trim()) files[key] = text;
    } catch {
      /* skip binary */
    }
  }

  return files;
}

export function projectNameFromFiles(
  files: Record<string, string>,
  fallback = "Local project"
): string {
  const pkg = files["package.json"];
  if (pkg) {
    try {
      const parsed = JSON.parse(pkg) as { name?: string };
      if (parsed.name?.trim()) return parsed.name.trim();
    } catch {
      /* ignore */
    }
  }
  return fallback;
}
