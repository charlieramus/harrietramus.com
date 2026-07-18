import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, essays, wordmark } from "@/site.config";
import Africa from "@/content/essays/africa.mdx";
import UnitedStates from "@/content/essays/united-states.mdx";
import Japan from "@/content/essays/japan.mdx";

// The essay prose lives in content/essays/*.mdx (editable without touching this
// component); the figure manifest stays in site.config.essays and is resolved by
// the MDX reading-column components (see mdx-components.tsx). This map wires each
// collection slug to its MDX body.
const essayBodies: Record<string, ComponentType> = {
  africa: Africa,
  "united-states": UnitedStates,
  japan: Japan,
};

// /journal/[collection] — the photo-essay reading view (V3). The slug is the
// collection's `essay` key. This replaces the V2 stub with the real template:
// a sharp .photo hero (title / eyebrow / meta + a back link) over a centred
// reading column (lead drop-cap → body → full-width figure → two-up pair →
// pull quote → closing figure → end rule). The whole page is wrapped in the
// collection's `.acc-<hue>` class, so the eyebrow, drop-cap, pull-quote rule,
// and end rule all take that collection's accent-by-place colour.
//
// Stage 2 renders the essay from `config.essays` (hero + meta + figure classes
// and captions come straight from it). Stage 3 relocates the prose into MDX
// bodies and registers the reading-column components; Stage 4 makes each figure
// open the shared lightbox. The `.ph-*` figure fills are gradient stand-ins
// until real photos land in V4.

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
  return { title: essay ? `${essay.title} — ${wordmark}` : "Journal" };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const essay = essays[collection];
  if (!essay) notFound();

  const accent = collections.find((c) => c.essay === collection)?.accent;
  const Body = essayBodies[collection];

  return (
    <main className={accent ? `essay acc-${accent}` : "essay"}>
      {/* Sharp hero (not blurred like the landing) — the .photo primitive over
          the essay's gradient stand-in, with a bottom scrim for legibility. */}
      <header className={`essay-hero photo ${essay.hero}`}>
        <span className="scrim essay-hero-scrim" />
        <Link href="/" className="essay-back">
          ← All collections
        </Link>
        <div className="essay-hero-inner">
          <p className="essay-eyebrow mono">{essay.eyebrow}</p>
          <h1 className="essay-title">{essay.title}</h1>
          <p className="essay-meta mono">{essay.meta}</p>
        </div>
      </header>

      {/* Reading column. The prose + figures come from the collection's MDX
          body (content/essays/*.mdx) via the reading-column components in
          mdx-components.tsx; the end rule + signature stay structural here. */}
      <article className="reading">
        {Body ? <Body /> : null}
        <hr className="end-rule" />
        <p className="essay-sign">{`— ${wordmark}`}</p>
      </article>
    </main>
  );
}
