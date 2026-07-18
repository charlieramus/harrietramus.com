import { ImageResponse } from "next/og";
import { theme, wordmark } from "@/site.config";

// Generated favicon: the wordmark initial on the deep-ink ground, underlined in the
// default accent — the postcard palette, straight from config.theme. Rendered at
// build time so the PNG exports as a static file under `output: export`.
// CUSTOMIZE: drop a real app/icon.png / app/favicon.ico to replace it entirely.
export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        <div style={{ display: "flex", fontSize: 22, fontWeight: 600 }}>
          {wordmark.charAt(0)}
        </div>
        <div
          style={{ display: "flex", width: 14, height: 3, background: accent, marginTop: 2 }}
        />
      </div>
    ),
    { ...size }
  );
}
