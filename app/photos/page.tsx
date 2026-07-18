import type { Metadata } from "next";

// /photos — titled stub. The loose masonry Photos board over the real image
// pipeline lands in V4.
export const metadata: Metadata = {
  title: "Photos",
};

export default function PhotosPage() {
  return (
    <main className="route-stub">
      <p className="eyebrow mono">Unfiled</p>
      <h1>Photos</h1>
      <p className="stub-note">The photo board arrives in a later build.</p>
    </main>
  );
}
