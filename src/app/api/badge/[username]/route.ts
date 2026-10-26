import { NextRequest, NextResponse } from "next/server";
import { fetchPublicProfileByUsername } from "@/lib/public-profile";

export const revalidate = 300;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> | { username: string } }
) {
  const resolvedParams = await Promise.resolve(params);
  const username = resolvedParams.username.trim().toLowerCase();

  const profile = await fetchPublicProfileByUsername(username);

  const isVerified = Boolean(profile?.hasPublicContent);
  const statusText = isVerified ? "Verified" : "Active";
  const statusColor = isVerified ? "#10B981" : "#6B7280";

  const labelText = "Meto AI Context";
  const labelWidth = 100;
  const statusWidth = isVerified ? 64 : 54;
  const totalWidth = labelWidth + statusWidth;
  const height = 20;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="${labelText}: ${statusText}">
  <title>${labelText}: ${statusText}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".15"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="#18181B"/>
    <rect x="${labelWidth}" width="${statusWidth}" height="${height}" fill="${statusColor}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text aria-hidden="true" x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${labelText}</text>
    <text x="${labelWidth / 2}" y="14">${labelText}</text>
    <text aria-hidden="true" x="${labelWidth + statusWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${statusText}</text>
    <text x="${labelWidth + statusWidth / 2}" y="14">${statusText}</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
