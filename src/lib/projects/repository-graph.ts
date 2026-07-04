import type { KnowledgeObject } from "@/lib/knowledge/types";

export type GraphNode = {
  id: string;
  label: string;
  layer: "frontend" | "api" | "database" | "workers" | "storage" | "external";
};

export type GraphEdge = {
  from: string;
  to: string;
};

export type RepositoryGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const LAYER_ORDER: GraphNode["layer"][] = [
  "frontend",
  "api",
  "database",
  "workers",
  "storage",
  "external",
];

function archText(memories: KnowledgeObject[]): string {
  return (memories ?? [])
    .map((m) => m.content)
    .join("\n")
    .toLowerCase();
}

export function buildRepositoryGraph(
  memoriesByRole: Record<string, KnowledgeObject[]>
): RepositoryGraph {
  const arch = archText(memoriesByRole.architecture ?? []);
  const stack = archText(memoriesByRole.stack ?? []);
  const deployment = archText(memoriesByRole.deployment ?? []);
  const combined = `${arch}\n${stack}\n${deployment}`;

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  function addNode(id: string, label: string, layer: GraphNode["layer"]) {
    if (!nodes.some((n) => n.id === id)) {
      nodes.push({ id, label, layer });
    }
  }

  addNode("frontend", "Frontend", "frontend");
  addNode("api", "API / Server", "api");
  addNode("database", "Database", "database");

  if (combined.includes("next.js") || combined.includes("react")) {
    nodes[0] = { id: "frontend", label: "Next.js UI", layer: "frontend" };
  }
  if (combined.includes("server action") || combined.includes("route handler")) {
    nodes.find((n) => n.id === "api")!.label = "Server Actions / Routes";
  }
  if (combined.includes("supabase")) {
    addNode("database", "Supabase PostgreSQL", "database");
    addNode("auth", "Supabase Auth", "external");
    edges.push({ from: "api", to: "auth" });
  }
  if (combined.includes("prisma")) {
    nodes.find((n) => n.id === "database")!.label = "PostgreSQL (Prisma)";
  }
  if (combined.includes("docker")) {
    addNode("workers", "Docker services", "workers");
    edges.push({ from: "api", to: "workers" });
  }
  if (combined.includes("mcp")) {
    addNode("external", "MCP / AI agents", "external");
    edges.push({ from: "api", to: "external" });
  }
  if (combined.includes("polar") || combined.includes("stripe")) {
    addNode("billing", "Billing API", "external");
    edges.push({ from: "api", to: "billing" });
  }
  if (combined.includes("vercel") || combined.includes("hosting")) {
    addNode("storage", "Deployment (Vercel)", "storage");
    edges.push({ from: "api", to: "storage" });
  }
  if (combined.includes("redis")) {
    addNode("cache", "Redis cache", "storage");
    edges.push({ from: "api", to: "cache" });
  }

  edges.push({ from: "frontend", to: "api" });
  edges.push({ from: "api", to: "database" });

  nodes.sort(
    (a, b) => LAYER_ORDER.indexOf(a.layer) - LAYER_ORDER.indexOf(b.layer)
  );

  return { nodes, edges };
}
