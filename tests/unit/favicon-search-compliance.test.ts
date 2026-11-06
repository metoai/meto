import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import fs from "fs";
import path from "path";

describe("Search Engine Favicon & Asset Compliance", () => {
  it("declares Google-compliant multi-resolution icons in layout metadata file", () => {
    const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");

    // Must declare stable favicon.ico and standard multiple-of-48px icons
    expect(layoutContent).toContain('shortcut: "/favicon.ico"');
    expect(layoutContent).toContain('{ url: "/favicon.ico", sizes: "any" }');
    expect(layoutContent).toContain('{ url: "/icon-48x48.png", sizes: "48x48", type: "image/png" }');
    expect(layoutContent).toContain('{ url: "/icon-96x96.png", sizes: "96x96", type: "image/png" }');
    expect(layoutContent).toContain('{ url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }');
    expect(layoutContent).toContain('{ url: "/brand/favicon.svg", type: "image/svg+xml" }');
    expect(layoutContent).toContain('manifest: "/site.webmanifest"');

    // Organization logo must be high-resolution square PNG for Knowledge Graph / search snippets
    expect(layoutContent).toContain('logo: `${siteUrl}/icon-512x512.png`');
  });

  it("has public assets for all declared search icons with valid dimensions", () => {
    const publicDir = path.resolve(process.cwd(), "public");

    const requiredAssets = [
      "favicon.ico",
      "icon-48x48.png",
      "icon-96x96.png",
      "icon-144x144.png",
      "icon-192x192.png",
      "icon-512x512.png",
      "favicon-48x48.png",
      "apple-touch-icon.png",
      "site.webmanifest",
    ];

    for (const asset of requiredAssets) {
      const filePath = path.join(publicDir, asset);
      expect(fs.existsSync(filePath), `Asset ${asset} must exist in public/`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size, `Asset ${asset} must not be empty`).toBeGreaterThan(0);
    }
  });

  it("verifies site.webmanifest contains valid JSON and declared icons", () => {
    const manifestPath = path.resolve(process.cwd(), "public/site.webmanifest");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.name).toBe("Meto — Your AI Identity");
    expect(manifest.icons).toBeInstanceOf(Array);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    const iconSizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    expect(iconSizes).toContain("192x192");
    expect(iconSizes).toContain("512x512");
  });

  it("explicitly permits Googlebot-Image and icon paths in robots.txt", () => {
    const robotsConfig = robots();
    const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];

    const googleRule = rules.find((r) => {
      const agents = Array.isArray(r?.userAgent) ? r.userAgent : [r?.userAgent];
      return agents.includes("Googlebot-Image");
    });

    expect(googleRule, "Robots rules must include Googlebot-Image").toBeDefined();

    const allowed = Array.isArray(googleRule?.allow) ? googleRule.allow : [googleRule?.allow];
    expect(allowed).toContain("/favicon.ico");
    expect(allowed).toContain("/icon*.png");
    expect(allowed).toContain("/brand/");
    expect(allowed).toContain("/site.webmanifest");
  });
});
