charlie

# Harriet — Build 4/4: Photos, Image Pipeline & Launch
# Work on one stage at a time. Do NOT combine stages.

---

## Context
Read `NOW.md` first. This is the final log of the Harriet build set (V1 → V2 → V3 → V4).
V1–V3 built the config/theme spine, the landing + collection wall, and the essays +
shared lightbox — all still rendering `.ph-*` gradient **stand-ins** where photographs
belong. This log builds the real image pipeline that turns those stand-ins into
photographs everywhere, adds the loose **Photos board**, the About page, and ships.

**The Photos board = every frame, unfiled — a masonry wall (no captions to read, no story
to follow) where any photo opens the shared lightbox from V3.**

This log builds the image pipeline, the Photos board, the About page, and the launch
(static export + deploy). After it, nothing renders a fabricated placeholder: real photos
where they exist, honest empty/soon states where they don't.

## Decisions
- **Image pipeline:** mirror `charlieramus.comv2/scripts/sync-gallery.mjs` — scan
  `public/photos`, read intrinsic ratios with `image-size`, generate `blurDataURL`s with
  `plaiceholder`, and emit `data/photos.ts` (auto-generated; never hand-edited). Exposed as
  `npm run sync-gallery`. `data/photos.ts` feeds the board + any `#code` lookups.
- **Photos board:** the narrowed masonry from the prototype (CSS columns, `--board` max
  width with real side whitespace, hover caption), rendering `next/image` with the blur
  placeholder, each tile opening the shared `<Lightbox>` over the full board set.
- **Swap stand-ins → real images:** replace `.ph-*` gradient blocks with `next/image` +
  `blurDataURL` across the landing hero, collection/place cards, and essay figures —
  **keeping the gradient as the fallback** wherever a real photo isn't present yet (Harriet
  has no photos at build time; the site must look right empty and fill in as she adds them).
- **About:** `app/about/page.tsx` from `config.about` (title, paragraphs, "— Harriet"
  sign). No surname.
- **Launch:** confirm `output: 'export'` static build, add metadata/sitemap/robots/OG from
  config (mirror charlieramus.comv2), deploy the `out/` static site (Vercel or any static
  host), update `NOW.md` to all-functional.
- **Large finish: six stages.**

---

# Stage 1 — Image pipeline

```
Build the gallery sync pipeline, mirroring charlieramus.comv2.

1. scripts/sync-gallery.mjs: scan public/photos/**, for each image read width/height with
   image-size (compute ratio = w/h) and a blurDataURL with plaiceholder. Emit a typed
   data/photos.ts (generated banner; do not hand-edit) exporting a Photo[] of { src, code,
   loc, ratio, blurDataURL } — key off the filename or a small sidecar for loc/code.
2. Wire `npm run sync-gallery` to run it. Handle an empty public/photos gracefully (emit an
   empty array, no crash).
3. Add a few sample images to public/photos to exercise it (placeholders Harriet later
   replaces), or document the expected filename → loc/code convention.

Verify: `npm run sync-gallery` on a sample folder writes data/photos.ts with correct ratios
+ non-empty blurDataURLs; `npx tsc --noEmit` passes on the generated file; empty folder is
handled. Report the record count + the filename convention.
```

## Stage 1 Report

Built the reproducible image pipeline, mirroring `charlieramus.comv2/scripts/sync-gallery.mjs`
and narrowing it to Harriet's board contract.

**Files**
- `scripts/sync-gallery.mjs` (new) — scans `public/photos`, reads each image's
  intrinsic size with `image-size` (`ratio = round(w/h, 3)`), generates a base64
  blur with `plaiceholder` (`size: 10`), and writes the typed manifest
  `data/photos.ts`. No `sharp` downscale/thumb step (the sibling's) — Harriet's
  board renders one `next/image` per tile with a blur placeholder, so the extra
  thumbnail tier isn't needed yet; the ratio + blur are what the masonry consumes.
- `data/photos.ts` (generated) — exports `type Photo = { src, code, loc, ratio, blurDataURL? }`
  and `const photos: Photo[]`. Committed **empty** (`[]`): Harriet has no photos at
  build time, and no fabricated frames are written (Context/Decisions + NOW.md).
- `public/photos/README.md` (new) — keeps the folder tracked and documents the
  add-photos flow + both labelling conventions.

**Labelling — two ways (spec point 1: "filename or a small sidecar")**
- **Sidecar (preferred):** `public/photos/gallery.json` = `[{ file, loc?, code? }]`.
  `loc` → hover caption / lightbox location; `code` optional (sequential `0001…`
  when omitted); only the listed files, in order.
- **Filename convention (no sidecar):** every image is picked up alphabetically;
  `loc` is derived from the stem — drop the extension, `-`→space, `__`→`, `,
  title-case — so `big-sur__california.webp` → **Big Sur, California**. Codes
  sequential. Non-image files, `gallery.json`, and `README.md` are skipped.

**Verify** (all green)
- Exercised on a 3-image sample folder (generated WebPs at 3:2, 2:3, 1:1): wrote
  `data/photos.ts` with **3 records**, correct ratios (`1.5`, `0.667`, `1`) and
  **non-empty** `blurDataURL`s (real base64 PNGs). Sidecar-less run derived
  `Big Sur, California` / `Kyoto, Japan` from the convention as expected.
- `npx tsc --noEmit` passes on the generated file.
- **Empty folder handled:** `npm run sync-gallery` on the now-empty `public/photos`
  emits `export const photos: Photo[] = [];` with no crash. Committed state is the
  empty manifest + README; the sample images were removed (not committed) so
  nothing fabricated ships.

Record count on the sample run: **3**. Shipped record count: **0** (empty, honest).
Filename convention: `<location>.<ext>` with `-`→space and `__`→`, ` (or a
`gallery.json` sidecar for explicit `loc`/`code`).

---

# Stage 2 — Photos board

```
Build the loose masonry board at /photos over data/photos.ts.

1. app/photos/page.tsx: replace the V2 stub — the board head (eyebrow + serif "Photos" +
   lede) then a CSS-columns masonry (--board max width, side whitespace, responsive 3→2→1)
   of next/image tiles with the blur placeholder, varied heights, a hover location caption.
2. A client wrapper owns the open index and renders the shared <Lightbox> (from V3) over
   the full board item set — clicking a tile opens it there; ← / → walks the whole board.
3. Empty state: if data/photos.ts is empty, show an honest "photos coming soon" state, not
   a broken grid.

Verify: `npx tsc --noEmit`; `npm run build`; /photos renders the masonry with blur-up
images and real side whitespace, tiles open the lightbox, arrows cross the whole set, and
the empty state holds. Report the responsive column counts.
```

## Stage 2 Report

Built the loose masonry board at `/photos` over `data/photos.ts`, replacing the V2 stub.

**Files**
- `app/photos/page.tsx` — server component: the board head (eyebrow "Unfiled" +
  serif "Photos" + a lede) then hands `photos` from `data/photos.ts` to the client
  board. Real `<title>`/description metadata from `wordmark`.
- `components/photos-board.tsx` (new) — the client half. Owns the open index and
  renders the shared V3 `<Lightbox>` over the **whole** board set (mapped 1:1 to
  `LightboxItem`s carrying `src`/`blurDataURL`/`loc`/`code`/`ratio`), so a tile's
  index opens the matching frame and ← / → cross every photo with wraparound.
  Tiles are `next/image` (`fill`, `placeholder="blur"` when a `blurDataURL` exists,
  `sizes` matched to the 3/2/1 columns) inside a ratio-boxed `.photo` frame, with a
  hover-only scrim + location caption. Empty manifest → an honest "photos coming
  soon" block, not a broken grid.
- `app/globals.css` — added the `.board*` block: `.board` capped at the existing
  `--board` (1100px) token with real side whitespace; `.board-grid` a CSS-columns
  masonry (`break-inside: avoid`); the tile lift matches the collection/essay
  cards; plus the hover caption + empty-state styles.

**Responsive column counts:** **3** columns default (desktop), **2** at
`max-width: 900px`, **1** at `max-width: 560px` — via `column-count` on `.board-grid`.

**Verify** (all green)
- `npx tsc --noEmit` passes; `npm run build` exports `/photos`.
- Exercised the masonry with a 3-image sample sync: the export rendered `board-grid`
  + 3 `board-tile`s of `next/image` with real side whitespace and the varied
  intrinsic ratios (3:2, 2:3, 1:1), hover captions ("Big Sur, California",
  "Kyoto, Japan") present. Lightbox wiring reuses the V3 controlled component
  (open index + onClose/onIndex over the full set) — the same pattern verified live
  in V3; the tile buttons open it and arrows walk the whole board. (The lightbox's
  own `<Image>` swap for these real frames is Stage 3's explicit handoff; it renders
  the shared viewer + caption/#code + arrows now.)
- **Empty state holds:** shipped `data/photos.ts` is empty, and `out/photos.html`
  renders the "Photos coming soon" block — no broken grid. Sample images were
  removed after verifying (nothing fabricated ships).

---

# Stage 3 — Swap gradient stand-ins → real images

```
Replace the .ph-* placeholders with real photographs wherever they exist.

1. Landing hero: use config.landing.backdropImage as a real (blurred) next/image layer;
   keep the gradient fallback when it's "".
2. Collection + place cards: render next/image (with blurDataURL from data/photos.ts, keyed
   by the collection's/place's code) behind the overlays; fall back to the .ph-* class when
   no photo is mapped.
3. Essay figures: same swap — next/image + blur where a #code resolves to a real photo,
   gradient otherwise. The LightboxItem shape is unchanged from V3, so the lightbox needs no
   edits beyond rendering <Image> instead of the .ph-* div.

Verify: `npx tsc --noEmit`; `npm run build`; pages show real images with blur-up where
photos exist and clean gradient fallbacks where they don't — no broken/empty boxes, no
fabricated content. Report which surfaces resolved to real images vs fallback.
```

## Stage 3 Report

Replaced the `.ph-*` placeholders with real `next/image` wherever a photo resolves,
keeping the gradient as the fallback everywhere it doesn't.

**The resolver**
- `lib/photos.ts` (new) — `photoByCode(code?)` builds a `Map<code, Photo>` over the
  generated `data/photos.ts` and returns the real photo (src + blurDataURL + ratio)
  for a `#code`, or `undefined` when none is synced. That's the single keying
  mechanism the cards + essay figures + essay-lightbox items use.
- `site.config.ts` — added optional `code?` to `Collection` and `Place` (documented),
  wired to the essay/photo `#code`s (Africa `0001`, US `0011`, Japan `0021`; each
  place to its own frame). Unset codes / unsynced photos → gradient fallback.

**The swaps**
- **Landing** (`components/landing.tsx`): a set `landing.backdropImage` now renders a
  blurred `next/image` (`fill`, `priority`) inside the over-scaled backdrop box;
  `""` keeps the `.ph-dusk` gradient. New `.landing-backdrop-img { object-fit: cover }`.
- **Collection + place cards** (`collection-card.tsx`, `place-card.tsx`): resolve by
  `code` and render `next/image` (`fill`, blur-up) behind the overlays, else the
  `.ph-*` gradient. Dropped the old dormant `image?` prop + raw `<img>`; existing
  `.collection-img`/`.place-img` cover rules reused.
- **Essay figures** (`mdx-components.tsx` + `Shot` in `essay-lightbox.tsx`): `Shot`
  now takes `src`/`blurDataURL` and renders a `next/image` fill inside the `.photo`
  button when the figure's `#code` resolves; the gradient class is dropped in that
  case. New `.shot-img { object-fit: cover }`.
- **Lightbox** (`components/lightbox.tsx`): renders `next/image` (blur-up) when
  `item.src` is present, else the `.ph-*` div — same ratio-sized `.lb-shot` box, no
  API change. `essayItems` (journal page) now resolves `src`/`blurDataURL` by code so
  the essay viewer shows real frames too. New `.lb-img { object-fit: cover }` +
  `position: relative` on `.lb-shot`.

**Verify** (all green)
- `npx tsc --noEmit`; `npm run build`.
- **Shipped (empty) state:** home renders **0** `next/image` (grep) — every surface
  is a clean `.ph-*` gradient (ph-savanna/canyon/kyoto present), no broken boxes.
- **Real-image path exercised** with 4 sample photos synced to codes `0001`/`0011`/
  `0021` + a landing hero, then reverted: the export resolved real images on **all
  four surfaces** — landing (`landing-backdrop-img` + `/photos/hero.webp`), the three
  collection heroes + their mapped place cards (`collection-img`/`place-img`), and the
  Africa `full` essay figure (`shot-img`, code `0001`) — while **unmapped** codes fell
  back to gradients (`ph-crater`, `ph-sea`, `ph-neon`, `ph-coast`). No fabricated
  content: samples + `gallery.json` + the landing edit were removed after verifying;
  `data/photos.ts` ships empty.

**Resolved to real vs fallback (on the sample run):** landing hero, all 3 collection
heroes, 3 mapped place cards, 1 essay figure → **real**; every other place card,
essay pair/end figure, and the whole board → **gradient/empty fallback**. Shipped
state: **all fallback** (no photos yet), which is correct.

---

# Stage 4 — About page

```
Build the About page from config.

1. app/about/page.tsx: replace the stub — eyebrow + serif title (config.about.title), the
   paragraphs, and the serif "— Harriet" sign. No surname anywhere.
2. Match the prototype's quiet About column measure + spacing.

Verify: `npx tsc --noEmit`; `npm run build`; /about renders the bio in both themes with no
surname present. Report a grep proving the surname does not appear in the build output.
```

## Stage 4 Report

_Pending._

---

# Stage 5 — Metadata, SEO, static export

```
Make it a real, indexable static site — mirror charlieramus.comv2's SEO surface.

1. Add app/sitemap.ts, app/robots.ts, and per-route metadata/OpenGraph built from
   site.config (SITE_URL, wordmark, tagline). Add a favicon/OG image.
2. Confirm next.config.ts output:'export' produces a complete static out/ with every route
   (/, /journal/[each], /photos, /about) and hashed assets.
3. No console errors, no missing images in the export.

Verify: `npm run build` exports out/ with all routes + sitemap.xml + robots.txt;
open out/index.html locally and click through offline. Report the full exported route list.
```

## Stage 5 Report

_Pending._

---

# Stage 6 — Coherence + Verify + Launch + NOW.md

```
Final pass: prove the whole site, deploy, and close the build set.

1. Full run: `npm install` clean, `npm run sync-gallery`, `npx tsc --noEmit`, `npm run lint`,
   `npm run build`.
2. Literal end-to-end walkthrough in BOTH themes: landing (real blurred hero) → wall (three
   accent hues, real/fallback images) → an essay (read + lightbox) → Photos board (masonry +
   lightbox) → About. Confirm the lightswitch persists and nothing renders a fabricated
   placeholder.
3. Deploy the static out/ (Vercel or chosen static host); confirm the live URL works.
4. Update NOW.md: move Photos/Pipeline into functional — the whole site is now live. Note
   the one honest open item: real photographs get added by running `sync-gallery` as Harriet
   supplies them.

Verify: build/export/deploy green; both-theme walkthrough clean; live URL loads. Paste the
final NOW.md build-state table + the deployed URL into this report.
```

## Stage 6 Report

_Pending._

---

# After These Stages
- harrietramus.com is live: a config-driven, dark/light photography journal — blurred hero
  landing, colour-coded collection wall, MDX photo-essays with a shared accessible lightbox,
  a masonry Photos board, and a real image pipeline. The gradient stand-ins are gone
  wherever photos exist, and the site looks right where they don't.
- The single standing task (see `NOW.md`): Harriet drops photos into `public/photos` and runs
  `npm run sync-gallery` — no code changes needed.
- Possible future logs (not in this set): per-collection cover video, a map view of places,
  print/order links, RSS for new essays.
