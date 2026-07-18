# NOW — Harriet

Read this first. It's the orientation ritual: where the build actually is, what's
real, and what's deliberately deferred. Updated at the end of each build log.

_Last updated: end of **V1 — Foundation & Config**._

---

## Build state

| Area | State | Notes |
| --- | --- | --- |
| **Foundation & Config** | ✅ Functional | Next.js 16 static-export app; `site.config.ts` single-source; `theme` → `themeToCss` token system; dark/light **lightswitch** (persists, no flash, defaults dark); nav + footer chrome on every page; `/`, `/photos`, `/about` route stubs. |
| **Landing & Journal** | ⬜ Not built | Blurred hero landing + the colour-coded collection wall. **V2.** |
| **Essays & Lightbox** | ⬜ Not built | The photo-essay reading view + the shared fullscreen lightbox. **V3.** |
| **Photos & Pipeline** | ⬜ Not built | `sync-gallery` image pipeline, the loose Photos board, the About page, real photos everywhere, launch. **V4.** |

**Real vs. locked:** the config, theme, lightswitch, and chrome are real and
verified (tsc + lint + static export green; walked through in a browser, both
themes). The home/photos/about pages are **titled stubs** — placeholders, not the
real surfaces. No fabricated images anywhere: where a photo isn't shot/synced yet,
an honest `.ph-*` gradient stands in.

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
