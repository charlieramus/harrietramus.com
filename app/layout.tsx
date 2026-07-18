import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { theme, wordmark, landing } from "@/site.config";
import { themeToCss } from "@/lib/theme";
import "./globals.css";

// Display serif — a high-contrast editorial old-style face that suits the
// vintage-postcard character (headings, wordmark, essay titles). Variable font,
// so no enumerated weights. Exposed as --font-display; globals.css aliases it to
// --font-serif with fallbacks.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Mono — figure captions, stat numbers, and the lightbox #code badge. Exposed as
// --font-figure; globals.css aliases it to --font-mono. Body text uses the
// system-sans stack (no import) per the type decision.
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-figure",
  subsets: ["latin"],
  display: "swap",
});

// Metadata from site.config: title = wordmark, description = the landing tagline.
// metadataBase resolves relative OG/canonical URLs to absolute. Nav/footer +
// lightswitch + the pre-paint mode script land in Stages 4–5.
export const metadata: Metadata = {
  metadataBase: new URL("https://harrietramus.com"),
  title: wordmark,
  description: landing.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-mode="dark"
      className={`${fraunces.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        {/* The per-mode colour tokens, generated once from site.config's theme.
            One source of truth — no hand-copied hexes in the stylesheet. */}
        <style dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
