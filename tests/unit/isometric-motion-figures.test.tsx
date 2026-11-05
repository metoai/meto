import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  ContentConnectedCompilerFigure,
  ContentConnectedMcpRouterFigure,
  ContentConnectedPrivacyVaultFigure,
  ContentConnectedSyncTreeFigure,
} from "@/components/landing/isometric-motion-figures";

describe("Content-Connected Isometric Motion Figures", () => {
  it("renders ContentConnectedCompilerFigure with domain labels and formats", () => {
    const html = renderToString(
      <ContentConnectedCompilerFigure
        format="claude"
        tokens="1.8k tokens"
        reduction="-62%"
        play={false}
      />
    );
    expect(html).toContain("claude-project.xml");
    expect(html).toContain("METO COMPRESSION AST");
    expect(html).toContain("-62% PRUNED");
    expect(html).toContain("1.8k tokens");
  });

  it("renders ContentConnectedMcpRouterFigure with live client nodes and pings", () => {
    const html = renderToString(
      <ContentConnectedMcpRouterFigure copied={false} play={false} />
    );
    expect(html).toContain("METO MCP HUB");
    expect(html).toContain("CURSOR");
    expect(html).toContain("CLAUDE");
    expect(html).toContain("TERMINAL / CLI");
    expect(html).toContain("14ms");
  });

  it("renders ContentConnectedPrivacyVaultFigure with isolation shield states", () => {
    const htmlMasked = renderToString(
      <ContentConnectedPrivacyVaultFigure isMasked={true} play={false} />
    );
    expect(htmlMasked).toContain("ISOLATION ACTIVE");
    expect(htmlMasked).toContain("SECRET ZONE");
    expect(htmlMasked).toContain("sk-••••••••");

    const htmlUnmasked = renderToString(
      <ContentConnectedPrivacyVaultFigure isMasked={false} play={false} />
    );
    expect(htmlUnmasked).toContain("SHIELD LIFTED");
    expect(htmlUnmasked).toContain("sk-proj-7x9");
  });

  it("renders ContentConnectedSyncTreeFigure with multi-agent branch targets", () => {
    const html = renderToString(
      <ContentConnectedSyncTreeFigure play={false} />
    );
    expect(html).toContain("METO TRUTH (v2.4)");
    expect(html).toContain(".cursorrules");
    expect(html).toContain("CLAUDE.md");
    expect(html).toContain("MCP Gateway");
    expect(html).toContain("all branches in sync");
  });
});
