import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { essays } from "@/site.config";
import { Shot } from "@/components/essay-lightbox";
import { photoByCode } from "@/lib/photos";

// Reading-column components for the essay MDX bodies (content/essays/*.mdx).
// Prose lives in the MDX; the FIGURE MANIFEST (which .ph-* / #code each slot
// uses) stays in site.config.essays — so a body only references a figure by its
// essay slug + slot name and the data is resolved here from config. That keeps
// the writing editable without touching components and the manifest in one
// place. @next/mdx (App Router) picks these up via useMDXComponents below, so
// the bodies render <Lead>, <Figure>, <Pair>, <PullQuote>, <Caption> as these.
//
// The figure boxes are static .ph-* stand-ins now; Stage 4 makes them open the
// shared lightbox, and V4 swaps the gradient div for next/image.

type Slot = "full" | "pairA" | "pairB" | "end";

// The essay's lightbox item set is ordered [full, pairA, pairB, end]; a figure's
// slot maps to its index in that set, so clicking it opens the lightbox there and
// ← / → step through the essay's own figures. Kept in sync with the items array
// built in app/journal/[collection]/page.tsx.
const slotIndex: Record<Slot, number> = { full: 0, pairA: 1, pairB: 2, end: 3 };

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
    resolved from config.essays[essay][slot]. */
function Figure({ essay, slot }: { essay: string; slot: Slot }) {
  const fig = essays[essay]?.[slot];
  if (!fig) return null;
  const photo = photoByCode(fig.code);
  const cls = photo
    ? "essay-shot photo full-shot"
    : `essay-shot photo full-shot ${fig.cls}`;
  return (
    <figure className="full">
      <Shot
        index={slotIndex[slot]}
        className={cls}
        label={fig.cap}
        src={photo?.src}
        blurDataURL={photo?.blurDataURL}
      />
      <Caption code={fig.code} cap={fig.cap} />
    </figure>
  );
}

/** A two-up pair of clickable figures with captions, resolved from config. */
function Pair({
  essay,
  a = "pairA",
  b = "pairB",
}: {
  essay: string;
  a?: Slot;
  b?: Slot;
}) {
  const fa = essays[essay]?.[a];
  const fb = essays[essay]?.[b];
  if (!fa || !fb) return null;
  const pa = photoByCode(fa.code);
  const pb = photoByCode(fb.code);
  const clsA = pa ? "essay-shot photo pair-shot" : `essay-shot photo pair-shot ${fa.cls}`;
  const clsB = pb ? "essay-shot photo pair-shot" : `essay-shot photo pair-shot ${fb.cls}`;
  return (
    <div className="pair">
      <figure>
        <Shot
          index={slotIndex[a]}
          className={clsA}
          label={fa.cap}
          src={pa?.src}
          blurDataURL={pa?.blurDataURL}
        />
        <Caption code={fa.code} cap={fa.cap} />
      </figure>
      <figure>
        <Shot
          index={slotIndex[b]}
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
