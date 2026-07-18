import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { essays } from "@/site.config";

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

/** The mono caption line under a figure: accent #code badge + the caption. */
function Caption({ code, cap }: { code: string; cap: string }) {
  return (
    <figcaption className="essay-cap mono">
      <span className="essay-cap-code">#{code}</span>
      {cap}
    </figcaption>
  );
}

/** Opening paragraph — rendered with the serif, accent drop-cap. */
function Lead({ children }: { children?: ReactNode }) {
  return <p className="lead">{children}</p>;
}

/** Pull quote — serif, with the collection's accent left-rule. */
function PullQuote({ children }: { children?: ReactNode }) {
  return <blockquote className="pull">{children}</blockquote>;
}

/** A full-width figure, resolved from config.essays[essay][slot]. */
function Figure({ essay, slot }: { essay: string; slot: Slot }) {
  const fig = essays[essay]?.[slot];
  if (!fig) return null;
  return (
    <figure className="full">
      <div
        className={`essay-shot photo full-shot ${fig.cls}`}
        role="img"
        aria-label={fig.cap}
      />
      <Caption code={fig.code} cap={fig.cap} />
    </figure>
  );
}

/** A two-up pair of figures with captions, resolved from config. */
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
  return (
    <div className="pair">
      <figure>
        <div
          className={`essay-shot photo pair-shot ${fa.cls}`}
          role="img"
          aria-label={fa.cap}
        />
        <Caption code={fa.code} cap={fa.cap} />
      </figure>
      <figure>
        <div
          className={`essay-shot photo pair-shot ${fb.cls}`}
          role="img"
          aria-label={fb.cap}
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
