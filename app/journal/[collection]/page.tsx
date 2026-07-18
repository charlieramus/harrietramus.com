import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, essays } from "@/site.config";

// /journal/[collection] — titled STUB for V2. The slug is the collection's
// `essay` key; the real photo-essay reading view + the shared lightbox land in V3.
// It exists now only so every collection/place link on the wall resolves in the
// static export. Content is config-driven (the essay's eyebrow/title), and the
// page is wrapped in the collection's `.acc-<hue>` class so the accent eyebrow
// reads in the place's hue.

// Pre-render one route per collection essay slug (required under output: export).
export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.essay }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const essay = essays[collection];
  return { title: essay ? essay.title : "Journal" };
}

export default async function EssayStub({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const essay = essays[collection];
  if (!essay) notFound();

  const accent = collections.find((c) => c.essay === collection)?.accent;

  return (
    <main className={accent ? `route-stub acc-${accent}` : "route-stub"}>
      <p className="eyebrow mono">{essay.eyebrow}</p>
      <h1>{essay.title}</h1>
      <p className="stub-note">
        The full photo-essay and the shared lightbox arrive in the next build.
      </p>
    </main>
  );
}
