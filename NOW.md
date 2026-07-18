# NOW — Harriet

Read this first. It's the orientation ritual: where the build actually is, what's
real, and what's deliberately deferred. Updated at the end of each build log.

_Last updated: end of **V3 — Essays & Lightbox**._

---

## Build state

| Area | State | Notes |
| --- | --- | --- |
| **Foundation & Config** | ✅ Functional | Next.js 16 static-export app; `site.config.ts` single-source; `theme` → `themeToCss` token system; dark/light **lightswitch** (persists, no flash, defaults dark); nav + footer chrome on every page. |
| **Landing & Journal** | ✅ Functional | Full-screen **landing** (blurred backdrop layer isolated from sharp grain/scrim; serif wordmark; scroll cue that smooth-scrolls to the wall) + the colour-coded **collection wall** (`CollectionCard` hero + `PlaceCard` stack, each collection in its `.acc-<hue>` — three accents at once). Every card routes to `/journal/[collection]`, pre-rendered as titled essay **stubs**. All from `site.config`; reads in both themes. |
| **Essays & Lightbox** | ✅ Functional | Every Place opens a real **photo-essay** at `/journal/[collection]`: a sharp `.photo` hero (title/eyebrow/meta + back link) over a centred reading column — serif drop-cap lead, body, full-width figure, two-up pair, pull quote, closing figure, end rule — prose authored in `content/essays/*.mdx` (editable without touching components), figures resolved from `site.config.essays`. The whole page carries the collection's `.acc-<hue>`, so the drop-cap, pull-quote rule, caption codes, and end rule take its accent. Every figure opens the **shared fullscreen lightbox** (ported from `charlieramus.comv2`): controlled, `role="dialog"` + `aria-modal`, Escape closes + returns focus to the opener, ← / → step the essay's figures with wraparound, Tab focus-trap, body-scroll lock; caption + teal `#code` badge. The same lightbox V4's Photos board reuses. |
| **Photos & Pipeline** | ⬜ Not built | `sync-gallery` image pipeline, the loose Photos board (reuses the V3 lightbox), the About page, real photos everywhere (swap the `.ph-*` stand-ins for `next/image` — the lightbox already carries dormant `src`/`blurDataURL`), launch. **V4.** |

**Real vs. locked:** the config, theme, lightswitch, chrome, the **home
experience** (landing + collection wall), and now the **essays + shared
lightbox** are real and verified — tsc + lint + static export green, plus a live
walkthrough (home → Japan essay → open a figure → arrow through with wraparound →
Escape returns focus → flip the lightswitch: legible and accent-correct in both
modes). `/photos` and `/about` are still **titled stubs** — placeholders, not the
real surfaces (V4). No fabricated images anywhere: every photo — the landing
backdrop, every card, every essay figure and lightbox shot — is an honest `.ph-*`
gradient stand-in until the real frames land in V4 (the `next/image` swap is
already wired behind an unused `image` prop on the cards and the lightbox's
dormant `src`/`blurDataURL`).

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

Built in four logs: **V1 Foundation** (done) → **V2 Landing & Journal** → **V3
Essays & Lightbox** → **V4 Photos, Pipeline & Launch**. One stage at a time; build
first, obey `DESIGN.md`, don't rebuild what a later log will.
