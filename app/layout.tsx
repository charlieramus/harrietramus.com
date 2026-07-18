import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { SITE_URL, theme, wordmark, landing } from "@/site.config";
import { themeToCss } from "@/lib/theme";
import Lightswitch from "@/components/lightswitch";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import "./globals.css";

// Runs before first paint (blocking, in <head>): reads the stored mode and sets
// data-mode on <html> so the correct theme is on the very first frame — no flash
// of the wrong palette. Defaults to "dark" on first visit / when storage fails.
// Kept as a tiny string so it can be inlined without a separate request.
const MODE_SCRIPT = `(function(){try{var m=localStorage.getItem("harriet-mode");document.documentElement.dataset.mode=(m==="light"||m==="dark")?m:"dark"}catch(e){document.documentElement.dataset.mode="dark"}})();`;

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
// metadataBase resolves relative OG/canonical URLs to absolute. The default share
// card is app/opengraph-image.tsx (inherited by every route); the favicon is
// app/icon.tsx. Inner routes set a SHORT title (e.g. "Photos") that gets the
// "— Harriet" suffix for free via the template — never append the wordmark
// themselves, or it double-suffixes.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: wordmark,
    template: `%s — ${wordmark}`,
  },
  description: landing.tagline,
  applicationName: wordmark,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: wordmark,
    title: wordmark,
    description: landing.tagline,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: wordmark,
    description: landing.tagline,
  },
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
        {/* Pre-paint: set data-mode from storage before any CSS runs (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
        {/* The per-mode colour tokens, generated once from site.config's theme.
            One source of truth — no hand-copied hexes in the stylesheet. */}
        <style dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} />
      </head>
      <body>
        <div className="page-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <Lightswitch />
      </body>
    </html>
  );
}
