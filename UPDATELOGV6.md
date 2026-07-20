charlie

# Harriet — V6: Trip Authoring & Import Pipeline
# Work on one stage at a time. Do NOT combine stages.

---

## Context
Read `NOW.md` first. This is a **follow-on** log (the V1–V4 set is built; V5 refactored
the essay layout to the clean one-column NYT format). It solves a workflow problem, not a
visual one: **Harriet has zero coding experience and cannot author an essay**, because an
essay today is three coder-things — `content/essays/*.mdx` (JSX tags), a rigid
`site.config.essays` manifest of exactly four photo slots (`full`/`pairA`/`pairB`/`end`),
and coded photo `#code`s in `public/photos`.

**The goal: Harriet writes a trip in a plain Google Doc using ONE keyword — `PHOTO:` —
and Charlie runs one command that turns her exported Markdown into a real essay
(MDX + config entry) plus a photo checklist telling him exactly which webp to save where.**

Her side has no syntax beyond `PHOTO:` (and optional `QUOTE:`) and four labelled fields.
Charlie's side handles the photos manually (he converts the Drive images to webp and drops
them in per the checklist) — the importer never touches image files.

This log builds: (1) a **flexible essay model** (any number of photos, not a fixed four),
(2) the **authoring template** Harriet fills in, and (3) the **`import-essay` script**. It
does **not** build a photo-upload flow (photos stay a manual webp step via the existing
`sync-gallery`), and it does **not** auto-create new *collections* — the importer writes an
essay for an existing collection slug; wiring a brand-new trip into the wall stays a manual
`site.config` edit (that's where collection identity lives).

## Decisions
- **Flexible essay model:** replace the fixed `Essay` slots with an ordered
  `figures: EssayFigure[]` (`{ code, cap, ratio? }`) plus `{ title, eyebrow, meta, hero? }`.
  The reading view + lightbox render an arbitrary number of figures in order. The three
  existing essays (africa / united-states / japan) migrate to the new shape; the V5
  one-column layout and the shared lightbox stay exactly as-is.
- **Every `PHOTO:` = one full-width figure** in the V5 single column. The two-up `Pair`
  stays as a hand-authored/advanced component but the importer does **not** emit pairs —
  imported essays are a clean alternating flow of paragraphs and column-width photos.
- **Authoring format (agreed in the brainstorm):** a Google Doc. Four top fields
  (`Title` / `Place` / `Trip` / `When`), an `Intro`, then a `Story` where she writes
  normal paragraphs and drops `PHOTO: <caption>` lines wherever an image goes; optional
  `QUOTE: <line>` for a pull quote. The caption doubles as Charlie's hint for which Drive
  photo it is. Drafted at `templates/essay-template.md` (finalised in Stage 2).
- **Import, not upload:** `scripts/import-essay.mjs` takes her **Markdown export**
  (Google Docs → File → Download → Markdown) + a `--collection <slug>`. It emits the MDX
  body + the `config.essays` entry and **prints a photo checklist** (each `PHOTO:` → a
  target `public/photos/<code>.webp` + its caption). Charlie then converts the matching
  Drive images to webp, saves them at those paths, and runs `sync-gallery`. The script
  writes no images and edits nothing under `public/`.
- **Tolerant parser:** case-insensitive markers, smart/curly quotes from Google Docs
  normalised, blank lines and stray whitespace ignored, missing optional fields degrade
  gracefully.
- **Medium feature: three stages.**

---

# Stage 1 — Flexible essay model

```
Generalise the essay from four fixed slots to an ordered figure list, keeping the V5
layout + lightbox identical.

1. site.config.ts: change the Essay type to { title, eyebrow, meta, hero?, figures:
   EssayFigure[] } where EssayFigure = { code, cap, ratio? }. Remove the fixed
   full/pairA/pairB/end fields.
2. app/journal/[collection]/page.tsx: rewrite essayItems() to map essay.figures ->
   LightboxItem[] in order (index = array position). Hero/eyebrow/meta unchanged.
3. mdx-components.tsx: <Figure n={i}> now resolves essay.figures[i] (0-based); drop the
   slotIndex map (index IS the position). Keep <Lead>, <PullQuote>. Keep <Pair> working
   for hand-authored essays (takes two indices) but it's no longer required.
4. Migrate content/essays/africa.mdx, united-states.mdx, japan.mdx + their config entries
   to the new figures[] shape (old full->0, pairA->1, pairB->2, end->3; convert the old
   pair into two single <Figure> calls, or keep one <Pair> — your call, but the rendered
   result must match V5).

Verify: `npx tsc --noEmit`; `npm run build`. Walk all three essays: same V5 one-column
reading view, every figure still opens the lightbox and ← / → steps the full set, accent-
by-place intact. Report the figure counts per essay and confirm no visual change vs V5.
```

## Stage 1 Report

Generalised the essay from four fixed slots to an ordered figure list, keeping the V5
layout + lightbox byte-for-byte on the shipped state.

**`site.config.ts`** — replaced `Figure` with `EssayFigure = { code, cap, ratio?, cls? }`
and rewrote `Essay` to `{ eyebrow, title, meta, hero?, figures: EssayFigure[] }`. The old
`full/pairA/pairB/end` fields and the now-unused seed prose (`lead/p1/quote/p2`, which
moved to the MDX bodies back in V3) are gone. All three essays migrated to `figures[]` in
the old order (full→0, pairA→1, pairB→2, end→3), each figure carrying the same `code`,
`cap`, and `cls` it had, plus an explicit `ratio` (0/3 → 16/10, 1/2 → 4/5) so the lightbox
framing is identical to V5.

- **Deviation from the spec's `EssayFigure = { code, cap, ratio? }`:** I kept two optional
  fields — `cls?` and `hero?`. The site currently ships with **no synced photos** (see
  `NOW.md`), so every figure renders its `.ph-*` gradient stand-in; dropping `cls` would
  have blanked all three essays' figures and *failed* the "no visual change vs V5" check.
  Both are optional, so imported essays (Stage 2) simply omit them, which matches the
  importer's `{ code, cap }`-only figures. `hero?` likewise lets an imported essay skip the
  lead image.

**`app/journal/[collection]/page.tsx`** — `essayItems()` now `essay.figures.map(...)` in
order (array index = lightbox index), reading each figure's `ratio` (default 16/10) and
`cls` (default ""). The optional `hero` lead image is guarded (`essay.hero ? … : null`).
The SEO/OG `description`, previously the removed `essay.lead`, now uses `essay.meta`.

**`mdx-components.tsx`** — dropped the `Slot` type and the `slotIndex` map (the index *is*
the position now). `<Figure essay n={i} />` resolves `essays[essay].figures[i]` and passes
`index={n}` to `Shot`; `<Pair essay a={i} b={j} />` takes two figure indices (kept for
hand-authored essays — the importer never emits pairs). `<Lead>`, `<PullQuote>`, `<Caption>`
unchanged.

**MDX bodies** — `africa/united-states/japan.mdx` updated to
`<Figure … n={0} />`, `<Pair … a={1} b={2} />`, `<Figure … n={3} />`, so the rendered flow
(lead → body → full figure → two-up pair → pull quote → body → closing figure) is exactly
the V5 flow. I kept the two-up `<Pair>` rather than splitting it into two singles, so the
rendered result matches V5 precisely.

**Verify:** `npx tsc --noEmit` clean; `npm run build` green — all three essays SSG'd
(`/journal/africa`, `/journal/united-states`, `/journal/japan`). Walked the exported HTML:

| Essay | Figures | Clickable `Shot`s | Accent |
| --- | --- | --- | --- |
| africa | 4 | 4 (full, pairA, pairB, end) | `acc-mustard` ✓ |
| united-states | 4 | 4 | `acc-teal` ✓ |
| japan | 4 | 4 | `acc-tomato` ✓ |

Each essay still renders 4 `Open photograph:` buttons stepping the same lightbox set, the
one-column V5 reading view and gradient stand-ins are unchanged, and accent-by-place is
intact. No visual change vs V5.

---

# Stage 2 — Authoring template + import script

```
Finalise the Google Doc template and build the importer.

1. templates/essay-template.md: finalise the Harriet-facing doc — the "read this once"
   instructions, the four fields (Title / Place / Trip / When), Intro, Story, the PHOTO:
   and optional QUOTE: convention, and a filled EXAMPLE followed by a blank to copy. Plain
   language, zero jargon.
2. scripts/import-essay.mjs (wire `npm run import-essay`): input a Markdown file + a
   --collection <slug> (defaulted from the Trip field if omitted). Parse:
   - the four front fields -> title, eyebrow (Place), meta (When), trip->collection slug;
   - the Intro + Story bodies into paragraphs;
   - each `PHOTO: <caption>` line -> a figure { code: `<slug>-NN`, cap: <caption> } and a
     <Figure n> placeholder at that spot in the flow;
   - each `QUOTE: <line>` -> a <PullQuote>.
   Emit content/essays/<slug>.mdx (Lead for the intro, paragraphs, <Figure>/<PullQuote> in
   order) and the config.essays[<slug>] entry (title/eyebrow/meta/figures[]). Be tolerant:
   case-insensitive markers, normalise curly quotes, ignore blank lines.
3. Print a PHOTO CHECKLIST to stdout: for each PHOTO, `#<code>  ->  public/photos/<code>.webp
   — "<caption>"`, so Charlie knows exactly which Drive image to convert + where to save it.
   The script writes NO images and nothing under public/.

Verify: `npx tsc --noEmit`; run `npm run import-essay templates/essay-template.md` against
the EXAMPLE section and confirm it writes a valid MDX + config entry and prints the
checklist. `npm run build` compiles the generated essay. Report the generated files + the
printed checklist.
```

## Stage 2 Report

_Pending._

---

# Stage 3 — Round-trip, docs, coherence

```
Prove the whole author->import->build loop and document Charlie's runbook.

1. Round-trip: take the template EXAMPLE as if it were a real export, run import-essay into
   a scratch slug, confirm the essay page renders in the V5 layout with the right number of
   figures + the pull quote, and that the checklist maps 1:1 to the PHOTO lines. Remove the
   scratch essay after (don't ship the example as a real page).
2. AUTHORING.md: Charlie's runbook — (a) share the Google Doc from templates/, (b) when she's
   done: File > Download > Markdown, (c) `npm run import-essay <file> --collection <slug>`,
   (d) convert the Drive photos to webp and save them at the checklist paths, (e) `npm run
   sync-gallery`, (f) `npm run build`. Note the honest fence: a brand-new trip needs a new
   collection added to site.config by hand first.
3. Update NOW.md (essays are now flexible-length + author-by-Google-Doc) and DESIGN.md (essay
   = arbitrary alternating text/figure flow).

Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build` all green; the round-trip essay
built and was removed; AUTHORING.md is accurate. Paste the AUTHORING.md steps + the NOW.md
note into this report.
```

## Stage 3 Report

_Pending._

---

# After These Stages
- Harriet can write a trip in a Google Doc with one keyword, and one command turns it into a
  real essay plus a checklist of exactly which webp to save where — no code, no fixed photo
  count, and the V5 layout + lightbox unchanged.
- Still manual on purpose (see `NOW.md`): converting Drive images to webp + `sync-gallery`
  (Charlie), and adding a brand-new *collection* to the wall (a one-time `site.config` edit).
- Natural follow-ons (not in this log): a tiny preview so Charlie can eyeball an import before
  it lands, and support for the two-up `Pair` from the Doc if the writing ever wants it.
