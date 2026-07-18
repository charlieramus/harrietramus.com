import type { Metadata } from "next";

// /about — titled stub. The real About page (from config.about) lands in V4.
export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="route-stub">
      <p className="eyebrow mono">About</p>
      <h1>About the journal</h1>
      <p className="stub-note">The About page arrives in a later build.</p>
    </main>
  );
}
