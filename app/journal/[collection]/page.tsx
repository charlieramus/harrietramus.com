import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, essays, wordmark, type Essay, type EssayFigure } from "@/site.config";
import type { LightboxItem } from "@/components/lightbox";
import { EssayLightbox } from "@/components/essay-lightbox";
import { photoByCode } from "@/lib/photos";
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

// The essay's lightbox item set — this essay's `figures` mapped in order, so a
// figure's array position IS its lightbox index (the same `n` the MDX <Figure> /
// <Pair> pass to Shot). Clicking a figure opens the lightbox at the matching
// image and ← / → step through this essay's figures only. `cls` is the .ph-*
// stand-in (a synced photo sets `src` for next/image); `ratio` frames the shot
// in the viewer without cropping, defaulting to 16/10 when a figure omits it.
function essayItems(essay: Essay): LightboxItem[] {
  return essay.figures.map((f: EssayFigure): LightboxItem => {
    const photo = photoByCode(f.code);
    return {
      cls: f.cls ?? "",
      alt: f.cap,
      caption: f.cap,
      code: f.code,
      ratio: f.ratio ?? 16 / 10,
      src: photo?.src,
      blurDataURL: photo?.blurDataURL,
    };
  });
}

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
  if (!essay) return { title: "Journal" };
  // Short title — the layout template adds the "— Harriet" suffix (no double-suffix).
  // The prose now lives only in the MDX body, so the essay's meta line (place ·
  // time) seeds the SEO/OG description.
  const description = essay.meta;
  return {
    title: essay.title,
    description,
    alternates: { canonical: `/journal/${collection}` },
    openGraph: {
      type: "article",
      title: `${essay.title} — ${wordmark}`,
      description,
      url: `/journal/${collection}`,
    },
  };
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
      {/* NYT-style text masthead (V5), rendered INSIDE the column (not over a
          photo): a back kicker, the accent eyebrow, the serif headline as text,
          a quiet mono byline, and a hairline divider. */}
      <header className="essay-masthead">
        <Link href="/" className="essay-kicker">
          ← All collections
        </Link>
        <p className="essay-eyebrow mono">{essay.eyebrow}</p>
        <h1 className="essay-headline">{essay.title}</h1>
        <p className="essay-byline mono">{essay.meta}</p>
        <hr className="essay-rule" />
      </header>

      {/* The former hero photo as the lead image, at column width. Reuses the
          .full figure box (.photo grain/vignette + full-shot crop). The essay
          hero carries no #code, so it stays its gradient stand-in; it is not part
          of the lightbox item set, so it stays non-clickable. Optional now — an
          imported essay may omit the hero, in which case there's no lead image. */}
      {essay.hero ? (
        <figure className="essay-lead">
          <div className={`photo full-shot essay-lead-shot ${essay.hero}`} />
        </figure>
      ) : null}

      {/* Reading column. The prose + figures come from the collection's MDX
          body (content/essays/*.mdx) via the reading-column components in
          mdx-components.tsx. EssayLightbox owns the open index and renders the
          shared <Lightbox> over this essay's figure set; the end rule +
          signature stay structural here. */}
      <article className="reading">
        <EssayLightbox items={essayItems(essay)}>
          {Body ? <Body /> : null}
        </EssayLightbox>
        <hr className="end-rule" />
        <p className="essay-sign">{`— ${wordmark}`}</p>
      </article>
    </main>
  );
}
