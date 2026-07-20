import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { essays } from "@/site.config";
import { Shot } from "@/components/essay-lightbox";
import { photoByCode } from "@/lib/photos";

// Reading-column components for the essay MDX bodies (content/essays/*.mdx).
// Prose lives in the MDX; the FIGURE MANIFEST (which .ph-* / #code each figure
// uses) stays in site.config.essays as an ordered `figures` list — so a body
// only references a figure by its essay slug + its position `n` and the data is
// resolved here from config. That keeps the writing editable without touching
// components and the manifest in one place. @next/mdx (App Router) picks these
// up via useMDXComponents below, so the bodies render <Lead>, <Figure>, <Pair>,
// <PullQuote>, <Caption> as these.
//
// V6: figures are an ordered list of any length. A figure's `n` IS its index in
// the lightbox set (the same order essayItems() builds in the essay page), so
// clicking it opens the lightbox there and ← / → step through the essay's own
// figures. When a #code resolves to a synced photo a next/image fills the box;
// otherwise the figure's `.ph-*` gradient stands in.

/** The mono caption line under a figure: accent #code badge + the caption. */
function Caption({ code, cap }: { code: string; cap: string }) {
  return (
    <figcaption className="essay-cap mono">
      <span className="essay-cap-code">#{code}</span>
      {cap}
    </figcaption>
  );
}

/** Opening paragraph — a clean lead, set a touch larger than the body (V5
    removed the drop-cap). */
function Lead({ children }: { children?: ReactNode }) {
  return <p className="lead">{children}</p>;
}

/** Pull quote — a centred serif quote with hairlines above/below (V5 dropped the
    heavy accent left-rule). */
function PullQuote({ children }: { children?: ReactNode }) {
  return <blockquote className="pull">{children}</blockquote>;
}

/** A full-width figure (clickable — opens the shared lightbox at its index),
    resolved from config.essays[essay].figures[n] (0-based). */
function Figure({ essay, n }: { essay: string; n: number }) {
  const fig = essays[essay]?.figures[n];
  if (!fig) return null;
  const photo = photoByCode(fig.code);
  const cls = photo
    ? "essay-shot photo full-shot"
    : `essay-shot photo full-shot ${fig.cls ?? ""}`.trim();
  return (
    <figure className="full">
      <Shot
        index={n}
        className={cls}
        label={fig.cap}
        src={photo?.src}
        blurDataURL={photo?.blurDataURL}
      />
      <Caption code={fig.code} cap={fig.cap} />
    </figure>
  );
}

/** A two-up pair of clickable figures with captions, resolved from config by the
    two figure indices `a` / `b`. Kept for hand-authored essays; the importer
    never emits pairs (it lays every PHOTO out as a single full-width Figure). */
function Pair({ essay, a, b }: { essay: string; a: number; b: number }) {
  const fa = essays[essay]?.figures[a];
  const fb = essays[essay]?.figures[b];
  if (!fa || !fb) return null;
  const pa = photoByCode(fa.code);
  const pb = photoByCode(fb.code);
  const clsA = pa ? "essay-shot photo pair-shot" : `essay-shot photo pair-shot ${fa.cls ?? ""}`.trim();
  const clsB = pb ? "essay-shot photo pair-shot" : `essay-shot photo pair-shot ${fb.cls ?? ""}`.trim();
  return (
    <div className="pair">
      <figure>
        <Shot
          index={a}
          className={clsA}
          label={fa.cap}
          src={pa?.src}
          blurDataURL={pa?.blurDataURL}
        />
        <Caption code={fa.code} cap={fa.cap} />
      </figure>
      <figure>
        <Shot
          index={b}
          className={clsB}
          label={fb.cap}
          src={pb?.src}
          blurDataURL={pb?.blurDataURL}
        />
        <Caption code={fb.code} cap={fb.cap} />
      </figure>
    </div>
  );
}

const components: MDXComponents = { Lead, Figure, Pair, PullQuote, Caption };

// Required by @next/mdx (App Router). Merge our reading-column components over
// any provided by the caller so the essay bodies render with them.
export function useMDXComponents(existing: MDXComponents = {}): MDXComponents {
  return { ...existing, ...components };
}
