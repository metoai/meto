import { REPO_SCAN_PATHS } from "@/lib/projects/repo-scanner";

export type GithubRepoRef = {
  owner: string;
  repo: string;
};

const GITHUB_URL_PATTERN =
  /^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?/i;

export function parseGithubUrl(url: string): GithubRepoRef | null {
  const trimmed = url.trim().replace(/\.git$/, "");
  const match = trimmed.match(GITHUB_URL_PATTERN);
  if (!match?.[1] || !match[2]) return null;
  return { owner: match[1], repo: match[2] };
}

async function fetchGithubRawFile(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
        "User-Agent": "meto-project-os",
      },
      next: { revalidate: 0 },
    }
  );
  if (!res.ok) return null;
  return res.text();
}

export async function fetchGithubRepoFiles(
  owner: string,
  repo: string
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  await Promise.all(
    REPO_SCAN_PATHS.map(async (path) => {
      const content = await fetchGithubRawFile(owner, repo, path);
      if (content?.trim()) files[path] = content;
    })
  );

  return files;
}

export async function fetchGithubRepoFromUrl(
  url: string
): Promise<{ ref: GithubRepoRef; files: Record<string, string> } | null> {
  const ref = parseGithubUrl(url);
  if (!ref) return null;
  const files = await fetchGithubRepoFiles(ref.owner, ref.repo);
  return { ref, files };
}
