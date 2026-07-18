import { ImageResponse } from "next/og";
import { theme, wordmark, landing } from "@/site.config";

// Default share card (1200×630) — used for every route that doesn't set its own
// openGraph.images. The deep-ink postcard ground, the serif wordmark, the tagline,
// and the accent TRIO bar (tomato / teal / mustard — "three accents at once"). No
// gradients (DESIGN.md). Built from config.theme + config.landing so it re-skins
// with the palette. Rendered at build time → static PNG under `output: export`.
// CUSTOMIZE: drop a real app/opengraph-image.png here to replace it.
export const dynamic = "force-static";
export const alt = `${wordmark} — ${landing.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { bg, ink, inkSoft } = theme.dark;
  const { tomato, teal, mustard } = theme.palettes.postcard;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          color: ink,
          padding: "80px 88px",
        }}
      >
        {/* The accent trio bar. */}
        <div style={{ display: "flex", gap: 16 }}>
          {[tomato, teal, mustard].map((c) => (
            <div key={c} style={{ display: "flex", width: 96, height: 12, background: c, borderRadius: 6 }} />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 600, letterSpacing: -3 }}>
            {wordmark}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: inkSoft, marginTop: 20, maxWidth: 920, lineHeight: 1.4 }}>
            {landing.tagline}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: inkSoft, letterSpacing: 2, textTransform: "uppercase" }}>
          {landing.eyebrow}
        </div>
      </div>
    ),
    { ...size }
  );
}
