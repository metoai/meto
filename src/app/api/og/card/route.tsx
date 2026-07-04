import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { fetchPublicProfileByUsername } from "@/lib/public-profile";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  const profile = await fetchPublicProfileByUsername(username);

  if (!profile) {
    return new Response("Profile not found", { status: 404 });
  }

  const name = profile.name;
  const headline = profile.headline ?? profile.aiSummary ?? "";
  const skills = profile.skills.slice(0, 5);
  const fact1 = profile.sections.find((s) => s.section_type === "about")?.content
    ?.split("\n")[0]
    ?.slice(0, 80) ?? "";
  const fact2 = profile.sections.find((s) => s.section_type === "work")?.content
    ?.split("\n")[0]
    ?.slice(0, 80) ?? "";
  const fact3 = profile.sections.find((s) => s.section_type === "goals")?.content
    ?.split("\n")[0]
    ?.slice(0, 80) ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0B0B0B 0%, #1A1A1A 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Orange accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "6px",
            height: "100%",
            background: "#FF4D00",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "14px", color: "#737373", marginBottom: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              AI Identity Profile
            </div>
            <div style={{ fontSize: "52px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1 }}>
              {name}
            </div>
            {headline && (
              <div style={{ fontSize: "20px", color: "#A0A0A0", marginTop: "12px", maxWidth: "700px" }}>
                {headline}
              </div>
            )}
          </div>
          {/* Meto logo placeholder */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", background: "#FF4D00", borderRadius: "8px" }} />
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#FFFFFF" }}>meto</div>
          </div>
        </div>

        {/* Facts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[fact1, fact2, fact3].filter(Boolean).map((fact, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF4D00", flexShrink: 0 }} />
              <div style={{ fontSize: "18px", color: "#D4D4D4" }}>{fact}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    background: "#2A2A2A",
                    border: "1px solid #3A3A3A",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "14px",
                    color: "#A0A0A0",
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: "14px", color: "#525252" }}>
            metoai.site/@{username}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
