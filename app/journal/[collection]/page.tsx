import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, essays, wordmark } from "@/site.config";

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

      {/* Reading column. Stage 3 swaps this config-driven body for the MDX
          essay body (same structure, prose authored in content/essays/*.mdx). */}
      <article className="reading">
        <p className="lead">{essay.lead}</p>
        <p>{essay.p1}</p>

        <figure className="full">
          <div
            className={`essay-shot photo full-shot ${essay.full.cls}`}
            role="img"
            aria-label={essay.full.cap}
          />
          <figcaption className="essay-cap mono">
            <span className="essay-cap-code">#{essay.full.code}</span>
            {essay.full.cap}
          </figcaption>
        </figure>

        <div className="pair">
          <figure>
            <div
              className={`essay-shot photo pair-shot ${essay.pairA.cls}`}
              role="img"
              aria-label={essay.pairA.cap}
            />
            <figcaption className="essay-cap mono">
              <span className="essay-cap-code">#{essay.pairA.code}</span>
              {essay.pairA.cap}
            </figcaption>
          </figure>
          <figure>
            <div
              className={`essay-shot photo pair-shot ${essay.pairB.cls}`}
              role="img"
              aria-label={essay.pairB.cap}
            />
            <figcaption className="essay-cap mono">
              <span className="essay-cap-code">#{essay.pairB.code}</span>
              {essay.pairB.cap}
            </figcaption>
          </figure>
        </div>

        <blockquote className="pull">{essay.quote}</blockquote>

        <p>{essay.p2}</p>

        <figure className="full">
          <div
            className={`essay-shot photo full-shot ${essay.end.cls}`}
            role="img"
            aria-label={essay.end.cap}
          />
          <figcaption className="essay-cap mono">
            <span className="essay-cap-code">#{essay.end.code}</span>
            {essay.end.cap}
          </figcaption>
        </figure>

        <hr className="end-rule" />
        <p className="essay-sign">{`— ${wordmark}`}</p>
      </article>
    </main>
  );
}
