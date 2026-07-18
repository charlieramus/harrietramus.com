charlie

# Harriet — Build 3/4: Essays & Lightbox
# Work on one stage at a time. Do NOT combine stages.

---

## Context
Read `NOW.md` first. This is log 3 of the Harriet build set (V1 → V2 → V3 → V4). V1 gave
us the config/theme spine; V2 gave us the landing + collection wall routing into essay
stubs. This log builds the **reading experience** — the photo-essay each Place opens into
— and the **shared fullscreen lightbox** that both essays and the Photos board (V4) use.

**An Essay = a photo-essay for a Collection: prose interwoven with photographs, themed by
its collection's accent-by-place hue, with every image opening in a fullscreen lightbox.**

This log builds only the lightbox, the essay route/template, the MDX essay bodies, and
the accent theming. It does **not** build the Photos board or the real image pipeline
(V4) — essay figures still use the `.ph-*` gradient stand-ins, swapped for `next/image` in
V4.

## Decisions
- **Lightbox:** port `charlieramus.comv2/components/lightbox.tsx` and its `.lightbox*`
  CSS **verbatim** — controlled component (parent owns `index`, `null` = closed), a11y:
  `role="dialog"` + `aria-modal`, Escape closes, ← / → step with wraparound, Tab
  focus-trap, body-scroll lock, focus returned to the opener. Caption + optional mono
  `#code` badge (badge tinted `--c-teal`). It is **shared** — do not fork a second copy
  for V4's board.
- **Essay structure:** hero (sharp, not blurred) with title/eyebrow/meta + a back link,
  then a centred reading column (~64ch) — lead paragraph with a serif drop-cap, a
  full-width figure, a two-up figure pair with captions, a pull quote, a closing figure.
  Mirrors the prototype essay.
- **Content in MDX:** essay prose lives in `content/essays/*.mdx` (the charlieramus.comv2
  writing pattern), with the figure manifest (which `.ph-*` / photo `#code` each slot
  uses) in `site.config.essays`. Prose is editable without touching components.
- **Accent-by-place:** the essay route root gets the collection's `.acc-<hue>` class, so
  the drop-cap, pull-quote rule, eyebrow, and end rule take that collection's colour.
- **Lightbox items per essay:** the essay's figures form the item set, so ← / → steps
  through that essay's photos.
- **Medium feature: five stages.**

---

# Stage 1 — Port the shared Lightbox

```
Bring the lightbox over from charlieramus.comv2 unchanged in behaviour.

1. Copy components/lightbox.tsx from charlieramus.comv2 into this repo. Keep the
   controlled API (items, index, onClose, onIndex), the LightboxItem type, and all a11y
   (Escape, arrows w/ wraparound, Tab focus-trap, scroll-lock, focus-return-to-opener).
2. Copy the .lightbox / .lightbox-inner / .lightbox-figure / .lightbox-btn /
   .lightbox-close / .lightbox-prev / .lightbox-next / .lightbox-cap / .lightbox-code CSS
   into globals.css. Adapt only the tokens: hover uses var(--accent), the #code badge uses
   var(--c-teal). Keep the prefers-reduced-motion rules.
3. Because real photos land in V4, render each item's .ph-* gradient stand-in in the
   lightbox figure (a .lb-shot div sized by the item ratio) instead of next/image for now,
   behind the same LightboxItem shape so V4 swaps to <Image> with no API change.

Verify: `npx tsc --noEmit`; `npm run build`; mount the lightbox on a scratch page with a
few items and confirm open/close, Escape, ← / →, wraparound, focus-trap (Tab cycles inside),
and body-scroll lock all work. Report the a11y checks passed.
```

## Stage 1 Report

_Pending._

---

# Stage 2 — Essay route + template

```
Build the essay page shell, driven by site.config.essays.

1. app/journal/[collection]/page.tsx: replace the V2 stub. generateStaticParams from
   config.collections (collection.essay). Look up the essay by slug; 404 unknown slugs.
2. Build the template: a sharp .photo hero (essay.hero) with eyebrow + serif title + meta
   + a back link to "/", then the reading column shell (lead, body slots, figure slots,
   pull quote, end rule). Wrap the page root in the collection's .acc-<hue> class.
3. Pull hero/meta/figure classes + captions from config.essays; leave the prose to Stage 3
   (MDX).

Verify: `npx tsc --noEmit`; `npm run build` (all three journal/[collection] routes export);
each essay hero shows the right title/meta and its collection accent on the eyebrow. Report
the three routes + their accent hues.
```

## Stage 2 Report

_Pending._

---

# Stage 3 — MDX essay bodies

```
Move the essay prose into MDX so writing is editable without touching components.

1. content/essays/africa.mdx, united-states.mdx, japan.mdx: the lead/p1/quote/p2 prose
   for each (seed from the prototype's essay copy). Frontmatter carries the slug so it maps
   to the collection.
2. Extend mdx-components.tsx with the reading-column components the essays use: Lead (drop
   cap), Figure (full-width .photo + caption), Pair (two-up figures + captions), PullQuote
   (accent left-rule), Caption. Style via globals.css from the prototype's .reading / .full
   / .pair / .pull / figcaption rules.
3. Render the matching MDX body inside the Stage 2 template's reading column.

Verify: `npx tsc --noEmit`; `npm run build`; each essay reads top-to-bottom — drop-cap lead,
full-width figure, two-up pair, pull quote, closing figure — with the collection's accent on
the drop-cap + rule. Report which MDX components you registered.
```

## Stage 3 Report

_Pending._

---

# Stage 4 — Wire essay figures to the lightbox

```
Make every essay photograph open the shared lightbox.

1. In the essay template, build the LightboxItem[] for the current essay from its figures
   (full, pairA, pairB, end) — each with its .ph-* class (photo src in V4), caption, #code,
   and ratio.
2. Make the Figure/Pair components clickable (cursor: zoom-in, real <button> semantics or
   keyboard-openable), opening the lightbox at that figure's index. A small client wrapper
   owns the open index and renders <Lightbox>.
3. ← / → steps through that essay's figures only.

Verify: `npx tsc --noEmit`; `npm run build`; clicking any essay figure opens the lightbox at
the right image, arrows cycle the essay's set, Escape returns focus to the clicked figure.
Report the item counts per essay.
```

## Stage 4 Report

_Pending._

---

# Stage 5 — Coherence + Verify + NOW.md

```
Prove the reading experience and update the living doc.

1. Full run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
2. Literal walkthrough: home → click a place → read the essay (accent-by-place holds) →
   open a figure in the lightbox → arrow through → Escape → flip the lightswitch and
   re-check legibility in both modes.
3. Update NOW.md: move "Essays & Lightbox" into the functional list; note the Photos board
   + real image pipeline (V4) remain.

Verify: build/export green; walkthrough clean in both themes; lightbox a11y intact. Paste
the updated NOW.md rows into this report.
```

## Stage 5 Report

_Pending._

---

# After These Stages
- Every Place opens a real photo-essay that carries its collection's colour, and every
  photograph opens a shared, accessible fullscreen lightbox — the same one V4's Photos
  board will reuse.
- Deferred on purpose (see `NOW.md`): the loose Photos board and the pipeline that turns
  the gradient stand-ins into real photographs (V4).
- Next: **V4 — Photos, Image Pipeline & Launch** builds the masonry board, the real image
  pipeline, swaps every stand-in for `next/image`, and ships.
