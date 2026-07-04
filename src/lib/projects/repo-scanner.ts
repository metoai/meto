import type { ProjectMemoryRole } from "@/lib/projects/types";

export type RepoScanResult = {
  name: string;
  summary: string;
  stack: {
    languages: string[];
    frameworks: string[];
    packageManager: string | null;
    monorepo: boolean;
    services: string[];
  };
  architecture: Record<string, string>;
  detected: {
    docker: boolean;
    ci: boolean;
    database: string | null;
    orm: string | null;
    auth: string | null;
    hosting: string | null;
    styling: string | null;
  };
  filesFound: string[];
};

const SCAN_PATHS = [
  "package.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "package-lock.json",
  "docker-compose.yml",
  "docker-compose.yaml",
  "next.config.js",
  "next.config.ts",
  "next.config.mjs",
  "prisma/schema.prisma",
  "supabase/config.toml",
  "tailwind.config.js",
  "tailwind.config.ts",
  "tsconfig.json",
  "README.md",
  "vercel.json",
  ".github/workflows/ci.yml",
];

export const REPO_SCAN_PATHS = SCAN_PATHS;

function parsePackageJson(raw: string | undefined) {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      name?: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      workspaces?: string[] | Record<string, unknown>;
    };
  } catch {
    return null;
  }
}

function allDeps(pkg: NonNullable<ReturnType<typeof parsePackageJson>>) {
  return {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };
}

function detectFromDeps(deps: Record<string, string | undefined>) {
  const frameworks: string[] = [];
  const services: string[] = [];
  let database: string | null = null;
  let orm: string | null = null;
  let auth: string | null = null;
  let styling: string | null = null;
  let hosting: string | null = null;

  if (deps.next) frameworks.push("Next.js");
  if (deps.react) frameworks.push("React");
  if (deps.vue) frameworks.push("Vue");
  if (deps["@remix-run/react"]) frameworks.push("Remix");
  if (deps.express) frameworks.push("Express");
  if (deps["@supabase/supabase-js"] || deps["@supabase/ssr"]) {
    services.push("Supabase");
    database = database ?? "PostgreSQL (Supabase)";
    auth = auth ?? "Supabase Auth";
  }
  if (deps["@prisma/client"] || deps.prisma) {
    orm = "Prisma";
    database = database ?? "PostgreSQL";
  }
  if (deps["drizzle-orm"]) {
    orm = "Drizzle";
  }
  if (deps["@clerk/nextjs"] || deps["@clerk/clerk-react"]) {
    auth = "Clerk";
  }
  if (deps.tailwindcss) styling = "Tailwind CSS";
  if (deps["@polar-sh/sdk"]) services.push("Polar");
  if (deps["mcp-handler"] || deps["@modelcontextprotocol/sdk"]) {
    services.push("MCP");
  }
  if (deps.vercel) hosting = "Vercel";

  const languages = ["TypeScript"];
  if (deps.typescript) languages.push("TypeScript");
  else if (frameworks.length) languages.push("JavaScript");

  return {
    frameworks,
    services,
    database,
    orm,
    auth,
    styling,
    hosting,
    languages: [...new Set(languages)],
  };
}

export function analyzeRepoFiles(
  files: Record<string, string>,
  fallbackName?: string
): RepoScanResult {
  const filesFound = Object.keys(files).filter((k) => files[k]?.trim());
  const pkg = parsePackageJson(files["package.json"]);
  const deps = pkg ? allDeps(pkg) : {};
  const detected = detectFromDeps(deps);

  const packageManager = files["pnpm-lock.yaml"]
    ? "pnpm"
    : files["yarn.lock"]
      ? "yarn"
      : files["package-lock.json"]
        ? "npm"
        : null;

  const monorepo = Boolean(
    pkg?.workspaces && (Array.isArray(pkg.workspaces) ? pkg.workspaces.length : true)
  );

  const docker = Boolean(
    files["docker-compose.yml"] || files["docker-compose.yaml"]
  );
  const ci = Boolean(files[".github/workflows/ci.yml"]);
  const hosting =
    detected.hosting ??
    (files["vercel.json"] ? "Vercel" : null);

  let database = detected.database;
  if (!database && files["prisma/schema.prisma"]) database = "PostgreSQL (Prisma)";
  if (!database && files["supabase/config.toml"]) database = "PostgreSQL (Supabase)";

  const architecture: Record<string, string> = {};

  if (detected.frameworks.includes("Next.js")) {
    architecture.Frontend = "Next.js App Router UI";
    architecture.Backend =
      files["src/app/api"] || files["package.json"]?.includes("app/api")
        ? "Next.js Route Handlers / Server Actions"
        : "Next.js server components + API routes";
  } else if (detected.frameworks.length) {
    architecture.Frontend = detected.frameworks.join(", ");
  }

  if (detected.services.includes("Supabase")) {
    architecture.Database = database ?? "Supabase PostgreSQL";
    architecture.Auth = detected.auth ?? "Supabase Auth";
  } else if (database) {
    architecture.Database = database;
  }

  if (docker) architecture.Infrastructure = "Docker Compose";
  if (ci) architecture["CI/CD"] = "GitHub Actions";
  if (hosting) architecture.Deployment = hosting;
  if (detected.styling) architecture.Styling = detected.styling;
  if (detected.services.includes("MCP")) {
    architecture["AI Stack"] = "MCP server integration";
  }

  const name = pkg?.name ?? fallbackName ?? "project";
  const summary = [
    detected.frameworks.length
      ? `Frameworks: ${detected.frameworks.join(", ")}`
      : null,
    packageManager ? `Package manager: ${packageManager}` : null,
    detected.services.length
      ? `Services: ${detected.services.join(", ")}`
      : null,
    monorepo ? "Monorepo detected" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    name,
    summary,
    stack: {
      languages: detected.languages,
      frameworks: detected.frameworks,
      packageManager,
      monorepo,
      services: detected.services,
    },
    architecture,
    detected: {
      docker,
      ci,
      database,
      orm: detected.orm,
      auth: detected.auth,
      hosting,
      styling: detected.styling,
    },
    filesFound,
  };
}

export type ScanMemoryDraft = {
  role: ProjectMemoryRole;
  title: string;
  content: string;
  type: "technology" | "documentation" | "decision" | "rule" | "project";
};

export function scanResultToMemories(scan: RepoScanResult): ScanMemoryDraft[] {
  const memories: ScanMemoryDraft[] = [];

  memories.push({
    role: "stack",
    title: "Tech stack",
    type: "technology",
    content: [
      scan.summary,
      scan.stack.languages.length
        ? `Languages: ${scan.stack.languages.join(", ")}`
        : "",
      scan.stack.packageManager
        ? `Package manager: ${scan.stack.packageManager}`
        : "",
      scan.detected.orm ? `ORM: ${scan.detected.orm}` : "",
      scan.detected.database ? `Database: ${scan.detected.database}` : "",
      scan.detected.auth ? `Auth: ${scan.detected.auth}` : "",
      scan.detected.styling ? `Styling: ${scan.detected.styling}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  const archLines = Object.entries(scan.architecture).map(
    ([key, value]) => `**${key}:** ${value}`
  );
  if (archLines.length) {
    memories.push({
      role: "architecture",
      title: "Architecture",
      type: "documentation",
      content: archLines.join("\n"),
    });
  }

  if (scan.detected.docker || scan.detected.ci || scan.detected.hosting) {
    memories.push({
      role: "deployment",
      title: "Infrastructure",
      type: "documentation",
      content: [
        scan.detected.docker ? "Docker Compose present" : "",
        scan.detected.ci ? "GitHub Actions CI configured" : "",
        scan.detected.hosting ? `Hosting: ${scan.detected.hosting}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  const readme = scan.filesFound.includes("README.md")
    ? "README.md found — review for business context."
    : "No README detected — consider generating one.";
  memories.push({
    role: "context",
    title: "Repository scan",
    type: "project",
    content: `Auto-discovered from ${scan.filesFound.length} manifest files.\n${readme}`,
  });

  const inferredRules: string[] = [];
  if (scan.detected.styling?.includes("Tailwind")) {
    inferredRules.push("Use Tailwind CSS — never write inline styles.");
  }
  if (scan.stack.frameworks.includes("Next.js")) {
    inferredRules.push("Prefer Server Actions for mutations.");
    inferredRules.push("Avoid unnecessary useEffect for server-fetched data.");
  }
  if (scan.detected.auth?.includes("Supabase")) {
    inferredRules.push("Use Supabase Auth — prefer RLS over app-layer checks.");
  }
  if (inferredRules.length) {
    memories.push({
      role: "rules",
      title: "Inferred coding rules",
      type: "rule",
      content: inferredRules.map((r) => `- ${r}`).join("\n"),
    });
  }

  return memories;
}
