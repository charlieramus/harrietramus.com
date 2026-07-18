import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, essays, wordmark, type Essay } from "@/site.config";
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

// The essay's lightbox item set, ordered [full, pairA, pairB, end] — the same
// order mdx-components.tsx maps each figure's slot to (slotIndex), so clicking a
// figure opens the lightbox at the matching image and ← / → step through this
// essay's figures only. `cls` is the .ph-* stand-in (V4 sets `src` for
// next/image); the ratios frame each shot in the viewer without cropping.
function essayItems(essay: Essay): LightboxItem[] {
  const item = (f: Essay["full"], ratio: number): LightboxItem => {
    const photo = photoByCode(f.code);
    return {
      cls: f.cls,
      alt: f.cap,
      caption: f.cap,
      code: f.code,
      ratio,
      src: photo?.src,
      blurDataURL: photo?.blurDataURL,
    };
  };
  return [
    item(essay.full, 16 / 10),
    item(essay.pairA, 4 / 5),
    item(essay.pairB, 4 / 5),
    item(essay.end, 16 / 10),
  ];
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
  const description = essay.lead;
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
          of the lightbox item set, so it stays non-clickable. */}
      <figure className="essay-lead">
        <div className={`photo full-shot essay-lead-shot ${essay.hero}`} />
      </figure>

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
