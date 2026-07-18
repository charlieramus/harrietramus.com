charlie

# Harriet — V5: Essay Reading Layout (NYT-style refactor)
# Work on one stage at a time. Do NOT combine stages.

---

## Context
Read `NOW.md` first. This log is a **follow-on** to the V1–V4 build set, not part of
it — the site is built and the essays are functional. It refactors one thing: the
**essay reading layout** that V3 shipped.

Today's essay (V3) is a **narrow** ~68ch reading column (`--read`) with figures that
**break out much wider** than the text — `.reading .full` renders at `min(--maxw, 92vw)`
(~1200px) via a `margin-left: 50%` / `translateX(-50%)` trick, plus a serif accent
**drop-cap** and a heavy accent left-rule pull quote. That is the opposite of the target.

**The target: one clean New York Times / Google-Doc column — text and images share a
single, relatively wide measure, centred with generous whitespace on both sides. The
widest image is exactly as wide as the text; images are big but not full-bleed.**

This log changes only the essay reading view: the column measure, the figure widths, the
hero (into a clean text masthead), and the typographic details (drop-cap, pull quote,
captions). It does **not** touch the landing, the collection wall, the Photos board, the
config, the theme, or — critically — the **lightbox wiring** (`Shot` / `EssayLightbox` and
the `slotIndex` order must stay intact; every figure stays clickable and steps the same
set).

## Decisions
- **One unified column:** introduce `--essay-col` (target `min(880px, 92vw)` — a
  relatively wide, Google-Doc-like measure). **Both** the reading text and every figure
  (`.full` and `.pair`) sit at this exact width. The `.full` break-out (`margin-left:50%`
  / `translateX`) is **removed** — nothing breaks the column. Side whitespace is whatever
  the viewport has beyond `--essay-col`. `--read` is retired for essays (the About page
  keeps its own tighter measure).
- **Readable wide measure:** because the text now runs as wide as the images, bump the
  body to ~19px and line-height to ~1.75 so the longer measure still reads cleanly. This
  is the explicit trade the brief asks for (text as wide as the widest images).
- **Clean text masthead (no photo-overlay hero):** replace the title-over-photo hero with
  an NYT-style masthead *inside the column* — a back kicker, a small accent eyebrow, the
  serif headline as **text** (not overlaid on an image), a quiet mono byline/meta line, a
  hairline divider — then the former hero photo as the **lead image at column width** with
  its caption. Big, but not too big.
- **Super-clean typography:** **remove the drop-cap** (the lead becomes a clean paragraph).
  The pull quote loses the heavy accent left-rule and becomes a centred serif quote with
  generous margins (optionally a thin hairline above/below). Figure corners go near-square
  (radius ~2px) for the editorial feel; captions stay small, quiet, left-aligned.
- **Keep accent-by-place, quieter:** the collection's `.acc-<hue>` stays on the page, but
  the accent now shows only in the small eyebrow/kicker, the caption `#code`, and the
  hairline/end rule — not a big drop-cap or a thick quote bar. Colour still comes mostly
  from the photographs.
- **No behaviour regressions:** the lightbox, back link, metadata, MDX prose, and
  accent-by-place all keep working; only layout + type change.
- **Thin/medium feature: three stages.**

---

# Stage 1 — One column: unify text + image width

```
Collapse the narrow-text / wide-figure split into a single Google-Doc-wide column.

1. app/globals.css — add a --essay-col token (min(880px, 92vw)) near --read/--maxw.
2. .reading: set max-width to var(--essay-col) (was --read); raise font-size to ~19px and
   line-height to ~1.75; keep it centred (margin-inline: auto) so the side whitespace is
   symmetric. Leave the vertical rhythm generous.
3. .reading .full: REMOVE the break-out — delete margin-left:50% / transform:translateX
   and the width:min(--maxw,92vw). It now simply spans the column (width:100%), so the
   widest image equals the text width. Keep its top/bottom margins.
4. .pair: keep the two-up grid but ensure it spans the full column width (it already lives
   inside .reading, so once .reading is the column it's bounded correctly); keep the
   single-column collapse under the existing narrow breakpoint.
5. Soften figure corners to ~2px (.essay-shot / .full-shot / .pair-shot) for the clean
   editorial look. Do NOT touch the Shot/lightbox classes or slotIndex.

Verify: `npx tsc --noEmit`; `npm run build`. Open a built essay (out/journal/*/index.html)
and confirm: the text column and a .full figure have the SAME rendered width, the page is
centred with clear whitespace on both sides, figures no longer exceed the text, and the
measure still reads. Report the resolved --essay-col width in px at a desktop viewport.
```

## Stage 1 Report

_Pending._

---

# Stage 2 — NYT masthead + clean typographic pass

```
Turn the photo-overlay hero into a clean text masthead and strip the vintage flourishes.

1. app/journal/[collection]/page.tsx: replace the .essay-hero photo-overlay header with a
   masthead rendered INSIDE the column (same --essay-col measure): a back kicker
   ("← All collections"), the accent eyebrow (essay.eyebrow, mono/small-caps), the serif
   headline as text (essay.title, essay-headline class), a quiet mono byline/meta line
   (essay.meta), and a hairline divider. THEN render the former hero photo (essay.hero) as
   the lead image at column width — reuse the .full figure treatment (a .photo box, and in
   V4 the next/image swap) with an optional caption. Keep the accent-by-place class on
   <main>. Do not change the essay's lightbox item set or the EssayLightbox wrapper.
2. app/globals.css: add .essay-headline / .essay-kicker / .essay-byline / .essay-rule
   styles (clean, restrained, both themes). Remove the old .essay-hero / .essay-hero-inner
   / .essay-title overlay styles (or repurpose) now that the title is text.
3. mdx-components.tsx + globals.css: remove the drop-cap — delete .reading .lead::first-letter
   and let Lead render a clean lead paragraph (optionally a slightly larger first line).
   Restyle .pull to a centred serif quote with generous margins and a thin hairline
   above/below instead of the heavy accent left-rule.
4. Keep captions (.essay-cap) small, quiet, left-aligned; keep the accent #code badge.

Verify: `npx tsc --noEmit`; `npm run build`. Walk a built essay: the headline is TEXT at
the top of the column (no text-over-photo), the lead image sits at column width below it,
there is no drop-cap, the pull quote is centred and clean, and every figure still opens the
lightbox. Confirm it reads well in BOTH themes. Report the before/after of the hero markup.
```

## Stage 2 Report

_Pending._

---

# Stage 3 — Coherence + Verify + docs

```
Prove the new reading layout across all essays and record it.

1. Full run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
2. Literal walkthrough of ALL three essays (africa, united-states, japan) in BOTH themes:
   confirm the single-column measure (text == widest image), centred whitespace, the clean
   masthead, no drop-cap, the centred pull quote, and that figures/lightbox + accent-by-place
   + back link + metadata all still work. Check the narrow-viewport collapse (pair → single).
3. Update DESIGN.md: rewrite the essay-layout section — one --essay-col column, text and
   images share the measure, text masthead (no photo overlay), no drop-cap, centred pull
   quote, quiet accent-by-place. Supersede the old "narrow reading column + break-out
   figures + drop-cap" description.
4. Update NOW.md: note under Essays that the reading layout was refactored to the
   single-column NYT/Google-Doc format in V5 (build-state stays Functional).

Verify: build/lint/export green; all three essays read correctly in both themes; no
lightbox/routing regressions. Paste the updated DESIGN.md essay-layout paragraph and the
NOW.md note into this report.
```

## Stage 3 Report

_Pending._

---

# After These Stages
- Every essay reads like a clean New York Times / Google-Doc article: one relatively wide
  column, text exactly as wide as the widest image, big-but-not-too-big photographs, a text
  masthead, and generous side whitespace — with the lightbox, accent-by-place, and MDX prose
  all intact.
- Nothing else changed: landing, collection wall, Photos board, config, and theme are
  untouched.
- Natural follow-ons (not in this log): an optional occasional full-bleed image for a single
  hero moment, and pull-quote / caption variants if the writing wants them.
