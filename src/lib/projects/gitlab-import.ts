import { REPO_SCAN_PATHS } from "@/lib/projects/repo-scanner";

export type GitlabRepoRef = {
  owner: string;
  repo: string;
};

const GITLAB_URL_PATTERN =
  /^https?:\/\/(?:www\.)?gitlab\.com\/([A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*)\/([A-Za-z0-9_.-]+)\/?/i;

export function parseGitlabUrl(url: string): GitlabRepoRef | null {
  const trimmed = url.trim().replace(/\.git$/, "");
  const match = trimmed.match(GITLAB_URL_PATTERN);
  if (!match?.[1] || !match[2]) return null;
  return { owner: match[1], repo: match[2] };
}

async function fetchGitlabRawFile(
  projectPath: string,
  path: string
): Promise<string | null> {
  const encoded = encodeURIComponent(projectPath);
  const filePath = encodeURIComponent(path);
  const res = await fetch(
    `https://gitlab.com/api/v4/projects/${encoded}/repository/files/${filePath}/raw?ref=main`,
    {
      headers: { "User-Agent": "meto-project-os" },
      next: { revalidate: 0 },
    }
  );
  if (!res.ok) {
    const resMaster = await fetch(
      `https://gitlab.com/api/v4/projects/${encoded}/repository/files/${filePath}/raw?ref=master`,
      { headers: { "User-Agent": "meto-project-os" }, next: { revalidate: 0 } }
    );
    if (!resMaster.ok) return null;
    return resMaster.text();
  }
  return res.text();
}

export async function fetchGitlabRepoFiles(
  owner: string,
  repo: string
): Promise<Record<string, string>> {
  const projectPath = `${owner}/${repo}`;
  const files: Record<string, string> = {};

  await Promise.all(
    REPO_SCAN_PATHS.map(async (path) => {
      const content = await fetchGitlabRawFile(projectPath, path);
      if (content?.trim()) files[path] = content;
    })
  );

  return files;
}

export async function fetchGitlabRepoFromUrl(
  url: string
): Promise<{ ref: GitlabRepoRef; files: Record<string, string> } | null> {
  const ref = parseGitlabUrl(url);
  if (!ref) return null;
  const files = await fetchGitlabRepoFiles(ref.owner, ref.repo);
  return { ref, files };
}
