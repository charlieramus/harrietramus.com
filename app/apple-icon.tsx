import { ImageResponse } from "next/og";
import { theme, wordmark } from "@/site.config";

// Apple touch icon (180×180) — the same wordmark monogram as the favicon, sized up.
// Rendered at build time so the PNG exports statically under `output: export`.
export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const { bg, ink } = theme.dark;
  const accent = theme.palettes.postcard[theme.defaultAccent];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          color: ink,
        }}
      >
        <div style={{ display: "flex", fontSize: 112, fontWeight: 600 }}>
          {wordmark.charAt(0)}
        </div>
        <div
          style={{ display: "flex", width: 72, height: 10, background: accent, marginTop: 8, borderRadius: 5 }}
        />
      </div>
    ),
    { ...size }
  );
}
