import type { Metadata } from "next";
import { about, wordmark } from "@/site.config";

// /about — the quiet bio, rendered entirely from config.about. A short eyebrow +
// serif title over a narrow reading column of paragraphs, closed by the serif
// "— Harriet" sign. First-name only: no surname anywhere (the privacy decision).
// `title: "About"` gets the "— Harriet" suffix for free from the layout template.
export const metadata: Metadata = {
  title: "About",
  description: "About the journal — photographs and short essays from the road.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${about.title} — ${wordmark}`,
    description: "About the journal — photographs and short essays from the road.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="about">
      <header className="about-head">
        <p className="about-eyebrow mono">About</p>
        <h1 className="about-title">{about.title}</h1>
      </header>

      <div className="about-body">
        {about.paragraphs.map((p, i) => (
          <p key={i} className="about-p">
            {p}
          </p>
        ))}
        <p className="about-sign">{about.sign}</p>
      </div>
    </main>
  );
}
