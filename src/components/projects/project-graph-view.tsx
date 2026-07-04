"use client";

import type { RepositoryGraph } from "@/lib/projects/repository-graph";

export function ProjectGraphView({ graph }: { graph: RepositoryGraph }) {
  if (!graph.nodes.length) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Import and scan a repo to visualize architecture layers.
      </p>
    );
  }

  const layers = [
    "frontend",
    "api",
    "database",
    "workers",
    "storage",
    "external",
  ] as const;

  return (
    <div className="landing-panel p-6">
      <p className="landing-panel-label mb-4">Repository graph</p>
      <div className="flex flex-col items-center gap-2">
        {layers.map((layer) => {
          const nodes = graph.nodes.filter((n) => n.layer === layer);
          if (!nodes.length) return null;
          return (
            <div key={layer} className="flex w-full max-w-md flex-col items-center gap-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-center text-sm font-medium text-[var(--text)]"
                >
                  {node.label}
                </div>
              ))}
              {layer !== "external" ? (
                <span className="text-[var(--muted)]" aria-hidden>
                  ↓
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      {graph.edges.length > 1 ? (
        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          {graph.edges.length} connections inferred from manifests
        </p>
      ) : null}
    </div>
  );
}
