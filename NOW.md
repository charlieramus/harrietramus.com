# NOW — Harriet

Read this first. It's the orientation ritual: where the build actually is, what's
real, and what's deliberately deferred. Updated at the end of each build log.

_Last updated: end of **V4 — Photos, Pipeline & Launch** (the build set is complete)._

---

## Build state

| Area | State | Notes |
| --- | --- | --- |
| **Foundation & Config** | ✅ Functional | Next.js 16 static-export app; `site.config.ts` single-source; `theme` → `themeToCss` token system; dark/light **lightswitch** (persists, no flash, defaults dark); nav + footer chrome on every page. |
| **Landing & Journal** | ✅ Functional | Full-screen **landing** (blurred backdrop layer isolated from sharp grain/scrim; serif wordmark; scroll cue that smooth-scrolls to the wall) + the colour-coded **collection wall** (`CollectionCard` hero + `PlaceCard` stack, each collection in its `.acc-<hue>` — three accents at once). Every card routes to `/journal/[collection]`, pre-rendered as titled essay **stubs**. All from `site.config`; reads in both themes. |
| **Essays & Lightbox** | ✅ Functional | Every Place opens a real **photo-essay** at `/journal/[collection]`: a sharp `.photo` hero (title/eyebrow/meta + back link) over a centred reading column — serif drop-cap lead, body, full-width figure, two-up pair, pull quote, closing figure, end rule — prose authored in `content/essays/*.mdx` (editable without touching components), figures resolved from `site.config.essays`. The whole page carries the collection's `.acc-<hue>`, so the drop-cap, pull-quote rule, caption codes, and end rule take its accent. Every figure opens the **shared fullscreen lightbox** (ported from `charlieramus.comv2`): controlled, `role="dialog"` + `aria-modal`, Escape closes + returns focus to the opener, ← / → step the essay's figures with wraparound, Tab focus-trap, body-scroll lock; caption + teal `#code` badge. The same lightbox V4's Photos board reuses. |
| **Photos & Pipeline** | ✅ Functional | The reproducible **image pipeline** (`scripts/sync-gallery.mjs` → `npm run sync-gallery`): scans `public/photos`, reads intrinsic ratios (`image-size`) + blur placeholders (`plaiceholder`), and writes the typed `data/photos.ts` (generated; never hand-edited). The loose **Photos board** at `/photos` — a CSS-columns masonry (3 → 2 → 1) of `next/image` tiles with blur-up + hover captions, each opening the **shared V3 lightbox** over the whole set; an honest "coming soon" empty state when no photos are synced. The `.ph-*` stand-ins are **swapped for real `next/image`** wherever a `#code` resolves (`lib/photos.ts`) — landing hero, collection/place cards, essay figures, and the lightbox — with the gradient kept as the fallback. Real **About** page from `config.about` (first-name sign, no surname). Full **SEO**: `sitemap.ts`, `robots.ts`, per-route canonical/OpenGraph/Twitter, and code-generated favicon + apple-icon + 1200×630 OG card from the palette. `output: 'export'` produces a complete static `out/`. |

**Real vs. locked:** the whole site is **built and verified** — config, theme,
lightswitch, chrome, the home experience (landing + collection wall), the essays +
shared lightbox, and now the image pipeline, Photos board, About page, and the SEO/
static-export surface. `npm install` + `sync-gallery` + `tsc --noEmit` + `lint` +
`build` are all green, and a full offline walkthrough over the served `out/` passes
in both themes: landing (blurred backdrop) → wall (three accent hues) → an essay
(reading column + figures + lightbox) → the Photos board (empty "coming soon" until
photos are synced) → About — with the lightswitch tokens + persist key present for
both modes. **No fabricated content anywhere:** with no photographs yet, every photo
surface shows its honest `.ph-*` gradient stand-in and the board shows "coming soon";
the moment real frames are synced they replace the stand-ins by `#code`.

**One standing action to go live:** deploy the static `out/` to a host. The build is
deploy-ready (`output: 'export'`, 1.5 MB `out/`, offline-served green), but the live
deploy needs Harriet's host / Vercel credentials and so was **not run from the build
environment** — no live URL is claimed. To ship: `npm run build`, then deploy `out/`
to Vercel (or any static host) — e.g. connect the GitHub repo in Vercel, or
`vercel deploy --prebuilt` / drop `out/` on Netlify.

**Adding photographs (no code changes):** drop images into `public/photos` (optionally
label them in `public/photos/gallery.json`), run `npm run sync-gallery`, rebuild/redeploy.
Real frames fill in the landing hero, cards, essay figures, and the Photos board by
`#code`; the gradient stand-ins remain wherever a photo isn't supplied yet.

---

## Direction

Harriet is a travel-photography journal — a blurred hero landing that scrolls into
a wall of trip **collections** (Africa, United States, Japan), each opening into a
photo-**essay**, with a loose **Photos** board for everything unfiled and a
dark/light lightswitch throughout.

Two sources of truth:

- **Design** — the approved clickable prototype (and `DESIGN.md`, written this
  log): vintage-postcard palette, Fraunces + system-sans + JetBrains Mono, grain +
  vignette on every photo, accent-by-place, "photos carry the colour", wordmark
  only (no surname).
- **Architecture** — the sibling project `charlieramus.comv2`: the same stack and,
  above all, the **`site.config.ts` philosophy** — one file holds all identity,
  palette, and content; every component only renders it, no copy in JSX.

Built in four logs, **all complete**: **V1 Foundation** → **V2 Landing & Journal**
→ **V3 Essays & Lightbox** → **V4 Photos, Pipeline & Launch**. One stage at a time;
build first, obey `DESIGN.md`, don't rebuild what a later log will.

Possible future logs (not in this set): per-collection cover video, a map view of
places, print/order links, RSS for new essays.
