import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Grainient } from "@/components/ui/grainient";

describe("Grainient component SSR & render", () => {
  it("renders container and canvas markup safely in SSR", () => {
    const html = renderToString(
      <Grainient
        colors={["#0b0b0b", "#1a0b06", "#872a08", "#ff4d00", "#ffaa70"]}
        angle={55}
        flow={0.8}
        silk={0.35}
        grainAmount={0.06}
      />
    );

    expect(html).toContain("grainient-container");
    expect(html).toContain("grainient-canvas");
  });

  it("applies custom className and style props", () => {
    const html = renderToString(
      <Grainient
        className="custom-grainient-test"
        style={{ width: "200px", height: "100px" }}
      />
    );

    expect(html).toContain("custom-grainient-test");
    expect(html).toContain("width:200px");
  });
});
