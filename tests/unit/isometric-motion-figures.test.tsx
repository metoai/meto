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
  it("renders ContentConnectedCompilerFigure with SVG layers and format badge", () => {
    const html = renderToString(
      <ContentConnectedCompilerFigure
        format="claude"
        tokens="1.8k tokens"
        reduction="-62%"
        play={false}
      />
    );
    expect(html).toContain("RAW PROFILE");
    expect(html).toContain("PRUNED");
    expect(html).toContain("1.8k tokens");
    expect(html).toContain("AST NORMALIZER");
    expect(html).toContain("claude-project.xml");
  });

  it("renders ContentConnectedMcpRouterFigure with hub and tool nodes", () => {
    const html = renderToString(
      <ContentConnectedMcpRouterFigure copied={false} play={false} />
    );
    expect(html).toContain("MCP");
    expect(html).toContain("METO");
    expect(html).toContain("Cursor");
    expect(html).toContain("Claude");
    expect(html).toContain("14ms");
  });

  it("renders ContentConnectedPrivacyVaultFigure with both zone labels", () => {
    const htmlMasked = renderToString(
      <ContentConnectedPrivacyVaultFigure isMasked={true} play={false} />
    );
    expect(htmlMasked).toContain("ISOLATION ACTIVE");
    expect(htmlMasked).toContain("RESTRICTED");
    expect(htmlMasked).toContain("PUBLIC EGRESS");

    const htmlUnmasked = renderToString(
      <ContentConnectedPrivacyVaultFigure isMasked={false} play={false} />
    );
    expect(htmlUnmasked).toContain("SHIELD LIFTED");
  });

  it("renders ContentConnectedSyncTreeFigure with root M node and tool branches", () => {
    const html = renderToString(
      <ContentConnectedSyncTreeFigure play={false} />
    );
    expect(html).toContain("0ms drift");
    expect(html).toContain(".cursorrules");
    expect(html).toContain("CLAUDE.md");
    expect(html).toContain("MCP Gateway");
    expect(html).toContain("In Sync");
  });
});
