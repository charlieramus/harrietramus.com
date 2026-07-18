import type { Metadata } from "next";
import "./globals.css";

// Minimal shell for V1 Stage 1. The theme <style> injection, pre-paint mode
// script, next/font wiring, Lightswitch, and config-driven metadata all land in
// later stages of this log (Stage 3 tokens, Stage 4 lightswitch, Stage 5 chrome).
export const metadata: Metadata = {
  title: "Harriet",
  description: "A journal of places.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mode="dark">
      <body>{children}</body>
    </html>
  );
}
