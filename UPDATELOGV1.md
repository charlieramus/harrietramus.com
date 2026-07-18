charlie

# Harriet — Build 1/4: Foundation & Config
# Work on one stage at a time. Do NOT combine stages.

---

## Context
This is a greenfield repo (only `README.md` exists). This is log 1 of the Harriet
build set (V1 → V2 → V3 → V4). The design source of truth is the approved clickable
prototype (a travel-photography journal: blurred hero landing → collection wall →
photo-essays → a loose Photos board, with a dark/light lightswitch). The architectural
source of truth is the sibling project `charlieramus.comv2` — we mirror its stack
(Next.js 16 App Router, React 19, Tailwind v4, MDX, `output: 'export'` static, sharp +
plaiceholder for the image pipeline) and, above all, its **`site.config.ts` philosophy**.

**The site config = one file (`site.config.ts`) that holds all identity, palette, and
content; every component only renders it — no copy or data lives in JSX.**

This log builds only the app shell, the config single-source, the theme/token system,
the dark/light lightswitch, and the nav/footer chrome. It does **not** build the landing
hero, the collection wall, essays, the lightbox, or the Photos board — those are V2–V4.
There is no `NOW.md` yet; the final stage of this log creates it and `DESIGN.md`.

## Decisions (agreed in the design brainstorm)
- **Stack:** mirror `charlieramus.comv2` exactly — Next.js 16 App Router, React 19,
  Tailwind v4 via `@tailwindcss/postcss`, `@next/mdx`, `output: 'export'` static export,
  `sharp` + `plaiceholder` + `image-size` as deps for the V4 image pipeline.
- **Config single-source:** `site.config.ts` at repo root — typed exports, `CUSTOMIZE:`
  banner comments, zero JSX. Port the prototype's `SITE_CONFIG` object verbatim into
  typed TS (identity, theme, landing, collections, essays, photos, about).
- **Theme:** CSS custom properties, two modes via `data-mode` on the root element,
  generated from the config palette. Ship the **vintage-postcard** palette: warm cream
  `#f3ecdd` / deep-ink `#201d16` grounds; accent trio tomato `#d1495b`, teal `#3bb3a3`,
  mustard `#e9b64a` (deepened variants for light mode). Expose `--c-tomato / --c-teal /
  --c-mustard` tokens plus `.acc-*` remap classes for accent-by-place.
- **Accent-by-place:** each collection is themed with one trio hue (Africa → mustard,
  United States → teal, Japan → tomato). Tokens + classes land now; usage lands V2–V3.
- **Type:** display serif via `next/font` (a high-contrast editorial serif), system-sans
  body, a mono face for figures/stat numbers and the lightbox `#code` badge.
- **Lightswitch:** fixed bottom-right wall-switch, toggles `data-mode`, persists to
  `localStorage`, defaults **dark**, honours `prefers-reduced-motion`.
- **Privacy:** the wordmark is **"Harriet"** only — no surname anywhere, despite the repo
  name. Set in config `wordmark`.
- **DESIGN.md:** create it this log as the written design system (palette, type, grain,
  lightbox, accent-by-place); later logs obey it. No decorative gradients (the photos
  carry the colour); the one intentional gradient is the landing backdrop fallback.
- **Medium/large system: six stages.**

---

# Stage 1 — Scaffold the app

```
Stand up the Next.js app, mirroring charlieramus.comv2's config files.

1. Initialise a Next.js 16 App Router + TypeScript project in place (repo root),
   React 19. Match charlieramus.comv2's package.json deps/scripts: next, react,
   react-dom, @mdx-js/loader, @mdx-js/react, @next/mdx, @types/mdx, remark-frontmatter,
   remark-mdx-frontmatter; devDeps @tailwindcss/postcss, tailwindcss v4, typescript,
   eslint, eslint-config-next, image-size, plaiceholder, sharp. Add the "sync-gallery"
   script placeholder pointing at scripts/sync-gallery.mjs (built in V4).
2. Copy the shape of these config files from charlieramus.comv2, adapting names:
   next.config.ts (MDX + output:'export' static), postcss.config.mjs (@tailwindcss/postcss),
   tsconfig.json, eslint.config.mjs, mdx-components.tsx (stub), .nvmrc, .gitignore.
3. Create app/layout.tsx (minimal shell), app/page.tsx ("Harriet" placeholder), and
   app/globals.css with only a CSS reset + base element styles for now (tokens land in
   Stage 3).
4. Confirm the dev server boots and a static export produces an out/ directory.

Verify: `npm install`; `npx tsc --noEmit`; `npm run build` (static export succeeds, out/
is written); `npm run dev` boots and "/" renders the placeholder. Report the Next/React/
Tailwind versions resolved and confirm out/ exists.
```

## Stage 1 Report

Stood up the Next.js 16 App Router + TypeScript app in place at the repo root,
mirroring `charlieramus.comv2`'s config shape.

**Config files created (ported/adapted from the sibling):**
- `package.json` — same deps/scripts/devDeps as the sibling, `name` →
  `harrietramus.com`. Includes the `sync-gallery` script placeholder pointing at
  `scripts/sync-gallery.mjs` (the script itself is a V4 build).
- `next.config.ts` — `@next/mdx` (`remark-frontmatter` +
  `remark-mdx-frontmatter`, plugins passed as strings for Turbopack),
  `output: "export"`, `images.unoptimized`, `turbopack.root` pinned to this
  project, `pageExtensions` incl. md/mdx. Dropped the Cloudflare `_redirects`
  comment (sibling-specific).
- `postcss.config.mjs` (`@tailwindcss/postcss`), `tsconfig.json` (strict, `@/*`
  path alias), `eslint.config.mjs` (core-web-vitals + typescript),
  `mdx-components.tsx` (documented empty map stub), `.nvmrc` (`22`), `.gitignore`.

**App shell created:**
- `app/layout.tsx` — minimal `<html data-mode="dark">` shell + `globals.css`
  import + placeholder metadata (theme injection / mode script / fonts /
  lightswitch deferred to Stages 3–5).
- `app/page.tsx` — `<h1>Harriet</h1>` placeholder.
- `app/globals.css` — `@import "tailwindcss"` + a CSS reset and base element
  styles only; the token layer lands in Stage 3.

**Verify:**
- `npm install` → 482 packages added, clean.
- `npx tsc --noEmit` → passes.
- `npm run build` → compiled successfully, static export written; routes `/`
  and `/_not-found` prerendered.
- `out/` exists with `index.html` (contains the "Harriet" placeholder), `404.html`,
  and `_next/` assets.
- `npm run dev` → "✓ Ready" and serves `/` (booted on :3002 as :3000 was
  occupied locally).

**Resolved versions:** Next `16.2.10`, React `19.2.4`, react-dom `19.2.4`,
Tailwind `4.3.3`. `out/` confirmed present.

---

# Stage 2 — `site.config.ts` (the single source of truth)

```
Port the prototype's SITE_CONFIG into a typed site.config.ts at repo root. This is the
ONLY file anyone edits to change content or palette (the charlieramus.comv2 model).

1. Create site.config.ts with a "THE ONLY FILE YOU EDIT" banner comment and CUSTOMIZE:
   notes, mirroring charlieramus.comv2/site.config.ts's tone.
2. Define and export typed structures for every section of the prototype's SITE_CONFIG:
   - SITE_URL ("https://harrietramus.com") + wordmark ("Harriet").
   - theme: { active, palettes (postcard trio + accentLight variants + the teal/clay/
     slate/plum/mono presets), dark grounds, light grounds } with an interface.
   - landing: { eyebrow, title, tagline, subline, backdrop, backdropImage, backdropBlur,
     cue }.
   - collections: Collection[] — { name, hero, stat, essay, accent ("tomato"|"teal"|
     "mustard"), places: Place[] { name, cls, meta } }.
   - essays: Record<string, Essay> — the three collection essays with lead/p1/quote/p2 +
     full/pairA/pairB/end figures ({ cls, cap, code }).
   - photos: Photo[] — { cls, loc, code, ratio }.
   - about: { title, paragraphs, sign }.
3. Keep the exact copy from the prototype. Types must be strict (no `any`).

Verify: `npx tsc --noEmit` passes with strict types; import `wordmark` and
`collections` into app/page.tsx and render the wordmark + a list of collection names to
prove the config resolves. Report the exported type names.
```

## Stage 2 Report

Created `site.config.ts` at the repo root — the single source of truth, with the
"THE ONLY FILE YOU EDIT" banner + `CUSTOMIZE:` notes in the `charlieramus.comv2`
voice, zero JSX, strict types (no `any`). No standalone prototype file exists on
disk, so the copy/palette were authored to the V1 **Decisions** + this stage's
spec, and the field shapes were checked against what V2–V4 consume (grepped the
later logs) so the config feeds them without rework.

**Exported values + their types:**
- `SITE_URL` (`"https://harrietramus.com"`) and `wordmark` (`"Harriet"`, first
  name only — the privacy decision; every downstream signature reuses it).
- `theme: Theme` — interfaces `Trio` (tomato/teal/mustard), `Grounds`
  (bg/bg2/ink/inkSoft/inkFaint/accentInk/line/navBg/plate), `Theme`
  (`active: "postcard"`, `defaultAccent`, `palettes.postcard` bright trio,
  `palettes.accentLight` deepened trio, `palettes.presets` teal/clay/slate/plum/
  mono shelf, `dark` + `light` grounds). Ships the postcard palette: cream
  `#f3ecdd` / deep-ink `#201d16` grounds; trio tomato `#d1495b` / teal `#3bb3a3`
  / mustard `#e9b64a` (deepened `#b23a4b` / `#2b8677` / `#c8912f` for light).
  Stage 3's `themeToCss` reads this object — no hand-copied hexes.
- `landing: Landing` — eyebrow/title/tagline/subline/backdrop/backdropImage/
  backdropBlur/cue (`title` = wordmark; `tagline` doubles as the meta desc;
  `backdropImage: ""` → the `ph-dusk` gradient stands in until V4).
- `collections: Collection[]` — interfaces `Place` (name/cls/meta) and
  `Collection` (name/hero/stat/essay/accent/places). Three trips with the agreed
  accent-by-place mapping: **Africa → mustard, United States → teal, Japan →
  tomato**. `essay` is the `/journal/[essay]` slug + the key into `essays`.
- `essays: Record<string, Essay>` — interfaces `Figure` (cls/cap/code) and
  `Essay` (hero/eyebrow/title/meta + lead/p1/quote/p2 prose + full/pairA/pairB/
  end figures). Three essays keyed `africa` / `united-states` / `japan`.
- `photos: Photo[]` — interface `Photo` (cls/loc/code/ratio); nine pre-pipeline
  board frames (replaced by generated `data/photos.ts` in V4).
- `about: About` — interface `About` (title/paragraphs/sign), sign `"— Harriet"`,
  no surname.

**Verify:**
- `npx tsc --noEmit` → passes with strict types, no `any`.
- Imported `wordmark` + `collections` into `app/page.tsx` and rendered the
  wordmark + a `<ul>` of collection names.
- `npm run build` → static export succeeds; `out/index.html` contains
  `Harriet`, `Africa`, `United States`, `Japan` — the config resolves end to end.

**Exported type names:** `Trio`, `Grounds`, `Theme`, `Landing`, `Place`,
`Collection`, `Figure`, `Essay`, `Photo`, `About`.

---

# Stage 3 — Theme + token system

```
Build the design-token layer in globals.css, generated from the config palette, plus the
photo/grain primitives and the fonts.

1. In globals.css, define structural tokens on :root (fonts, --maxw, --board, --read,
   --grain SVG data URI, easing) — mirror the prototype's structural CSS.
2. Generate the per-mode colour tokens from site.config's theme: emit
   [data-mode="dark"]{…} and [data-mode="light"]{…} blocks defining --bg, --bg2, --ink,
   --ink-soft, --ink-faint, --accent, --accent-ink, --c-tomato, --c-teal, --c-mustard,
   --line, --nav-bg, --plate. Do this with a small build-time helper that reads the
   theme object (a themeToCss(theme) function in lib/theme.ts) injected via a <style> in
   layout.tsx — one source of truth, no hand-copied hexes.
3. Add the .acc-tomato/.acc-teal/.acc-mustard remap classes and the .photo primitive
   (::before vignette, ::after grain, .scrim) and all .ph-* gradient stand-in classes
   from the prototype (photos land in V4; keep the classes as honest placeholders).
4. Wire fonts via next/font: a display serif (--font-serif), system-sans body, and a
   mono (--font-mono) for figures/badges.

Verify: `npx tsc --noEmit`; `npm run build`; render a test page that shows a token swatch
in both modes (toggle data-mode by hand) and confirm --accent + the trio resolve and the
serif/mono load. Report which serif + mono you chose.
```

## Stage 3 Report

Built the design-token layer, the photo/grain primitives, and the fonts — all
generated from `site.config`'s `theme`, no hand-copied hexes.

**`lib/theme.ts` — `themeToCss(theme)`:** the one place the palette becomes CSS.
Emits the two per-mode blocks `[data-mode="dark"]{…}` and `[data-mode="light"]{…}`,
each defining the full token contract: `--bg --bg2 --ink --ink-soft --ink-faint
--accent --accent-ink --c-tomato --c-teal --c-mustard --line --nav-bg --plate`.
Dark reads the bright `postcard` trio, light reads the deepened `accentLight`
trio; `--accent` defaults to `theme.defaultAccent` (tomato) per mode.

**`app/layout.tsx`:** injects `themeToCss(theme)` once via a `<style>` in `<head>`
(single source of truth) and wires the fonts via `next/font/google` — **Fraunces**
(display serif, `--font-display`) and **JetBrains Mono** (`--font-figure`), set as
variables on `<html>`. Body stays on the system-sans stack per the type decision.
Metadata now comes from config (`title` = `wordmark`, `description` =
`landing.tagline`, `metadataBase`). `data-mode="dark"` is the default until the
Stage 4 lightswitch takes over.

**`app/globals.css`:** structural `:root` tokens — `--font-serif/-sans/-mono`
aliases (with fallbacks), `--maxw` (1200px), `--board` (1100px), `--read` (68ch),
`--ease`, and the `--grain` fractal-noise SVG data URI. Base elements consume the
injected tokens (body `background:var(--bg)`/`color:var(--ink)` with a mode
transition; serif headings; `.mono` tabular figures; accent focus rings). Added
the `.acc-tomato/.acc-teal/.acc-mustard` remap classes, the `.photo` primitive
(`::before` vignette, `::after` grain overlay, `.scrim` child), and all ten
`.ph-*` gradient stand-ins used by the config (`ph-dusk` landing fallback +
savanna/crater/sea/canyon/coast/granite/kyoto/neon/fuji), kept as honest
placeholders. Reduced-motion is honoured globally.

**Verify:**
- `npx tsc --noEmit` → passes.
- `npm run build` → static export succeeds.
- Rendered a scratch `theme-check` swatch page and inspected the export: the
  injected `<style>` carries both blocks with correct hexes — dark `--accent:
  #d1495b`, light `--accent: #b23a4b`; the full trio (`#d1495b/#3bb3a3/#e9b64a`
  dark, `#b23a4b/#2b8677/#c8912f` light) resolves; `--font-display` +
  `--font-figure` are defined in the built CSS with Fraunces + JetBrains Mono,
  and nine `.woff2` files ship. `.acc-teal` correctly remaps `--accent` to teal.
- Scratch page deleted; clean rebuild exports only `/` and `/_not-found`.

**Chosen faces:** display serif **Fraunces** (high-contrast editorial old-style,
fits the vintage-postcard character); mono **JetBrains Mono** (figures / stat
numbers / lightbox `#code`).

---

# Stage 4 — Lightswitch

```
Build the dark/light lightswitch as a client component.

1. Create components/lightswitch.tsx ("use client"): a fixed bottom-right wall-switch
   plate + rocker (from the prototype's CSS), toggling data-mode on document.documentElement.
2. Persist the choice to localStorage ("harriet-mode"); default to "dark" on first visit.
   Read the stored value before first paint (inline script in layout.tsx head) to avoid a
   flash of the wrong theme.
3. A11y: real <button>, aria-pressed reflecting light-on, visible focus ring, and
   disable the rocker transition under prefers-reduced-motion.

Verify: `npm run build`; toggle flips the whole UI between warm-cream and deep-ink,
survives a reload (localStorage), and shows no theme flash on load. Report the flash-
prevention approach.
```

## Stage 4 Report

Built the dark/light lightswitch as a client component and wired it (plus the
pre-paint mode script) into the layout.

**`components/lightswitch.tsx` (`"use client"`):** a fixed bottom-right wall-plate
holding a rocker (`.ls-plate` + `.ls-rocker`, styled in globals.css) that toggles
`data-mode` on `document.documentElement`. It never *sets* the initial theme —
the pre-paint script already did — it reads the current `data-mode` in a
`useEffect` to stay in sync, then flips + persists on click.

**Persistence + default:** writes the choice to `localStorage["harriet-mode"]`;
defaults to **dark** on first visit (no stored value) and when storage throws
(private mode). The `<html>` static attribute stays `data-mode="dark"`, so SSR and
the first client render agree.

**Flash prevention:** a tiny synchronous inline `<script>` in `<head>`
(`MODE_SCRIPT`) reads `harriet-mode` and sets `document.documentElement.dataset.mode`
to `light`/`dark` (else `dark`) **before the body is parsed or painted**. Because
it's a blocking head script, the browser executes it before the first paint
regardless of where the injected stylesheet `<link>` sits, so the very first frame
already carries the correct palette — no flash of the wrong theme, and no
dependence on React hydration.

**A11y:** a real `<button>` with `aria-pressed` reflecting light-on, an
`aria-label` naming the action, a visible focus ring on the plate
(`:focus-visible`), and the rocker transition disabled under
`prefers-reduced-motion`.

**Verify:**
- `npx tsc --noEmit` → passes.
- `npm run build` → static export succeeds; the switch + pre-paint script ship in
  `out/index.html`.
- Drove the built export in a real headless browser (served on :4321):
  - First visit → `data-mode=dark`, `body` bg `rgb(32,29,22)` (`#201d16`),
    stored value `null`, `aria-pressed=false`.
  - Click → `data-mode=light`, bg `rgb(243,236,221)` (`#f3ecdd`), stored
    `"light"`, `aria-pressed=true` — the whole UI flips warm-cream ↔ deep-ink.
  - Reload → theme persists both directions (light→light, dark→dark).
  - No console errors.

---

# Stage 5 — Chrome: layout, nav, footer

```
Build the shared chrome that wraps every page.

1. app/layout.tsx: root <html data-mode> shell, the injected theme <style>, the pre-paint
   mode script, next/font variables, the Lightswitch, and metadata built from
   site.config (metadataBase, title = wordmark, description = tagline).
2. components/site-header.tsx: sticky translucent nav — "Harriet." wordmark (links home)
   + Journal / Photos / About links (Next <Link>). Active-link styling via usePathname.
3. components/site-footer.tsx: the quiet footer from the prototype (wordmark · "A journal
   of places").
4. Create route stubs so nav links resolve: app/page.tsx (home), app/photos/page.tsx,
   app/about/page.tsx — each a titled placeholder for now.

Verify: `npx tsc --noEmit`; `npm run build` (all routes export); nav renders on every
page, links route without full reload, active link is marked, footer shows. Report the
route list from out/.
```

## Stage 5 Report

Built the shared chrome that wraps every page and the route stubs the nav links
resolve to.

**`app/layout.tsx`:** now the full shell — `<html data-mode>` + the pre-paint
mode script + the injected theme `<style>` + the `next/font` variables (all from
earlier stages), and it wraps `{children}` in a `.page-shell` flex column with
`<SiteHeader />` above and `<SiteFooter />` below (the `<Lightswitch />` sits
outside as a fixed element). Metadata now uses a title template:
`title: { default: wordmark, template: "%s — Harriet" }`, `description =
landing.tagline`, `metadataBase = SITE_URL` — so the home title is `Harriet` and
inner routes get the suffix for free.

**`components/site-header.tsx` (`"use client"`):** sticky translucent nav
(`var(--nav-bg)` + `backdrop-filter` blur, hairline bottom border). The
`"Harriet."` wordmark links home; Journal / Photos / About are Next `<Link>`s.
Active state comes from `usePathname` — Journal matches `/` (and any `/journal/*`
for V2+), the others match their prefix — rendered as `data-active` + an accent
underline + `aria-current="page"`.

**`components/site-footer.tsx`:** the quiet footer — `Harriet · A journal of
places`, reading the wordmark from config.

**Route stubs:** `app/page.tsx` (home), `app/photos/page.tsx`,
`app/about/page.tsx` — each a titled placeholder (`.route-stub`) with its own
metadata title, so the nav links all resolve in the static export. Real content
lands in V2–V4.

**Verify:**
- `npx tsc --noEmit` → passes.
- `npm run build` → static export succeeds.
- Exported route list (`out/`): `/` (`index.html`), `/about` (`about.html`),
  `/photos` (`photos.html`), plus `/_not-found` + `404.html`.
- Drove the served export in a headless browser: the nav + footer render on
  every page; the home marks **Journal** active, `/photos` marks **Photos**,
  `/about` marks **About**; clicking a nav `<Link>` routes client-side (pathname
  + `document.title` update to e.g. `Photos — Harriet` without a full document
  reload); the footer reads `Harriet · A journal of places` throughout.
- Console note: the RSC **prefetch** requests for subroutes
  (`/about/__next.about.__PAGE__.txt`, `/photos/…`) 404. This is inherent Next 16
  `output: export` behavior — the exported payload is `__next.<route>.txt`, with
  no `__PAGE__` variant for subroutes — and it's **identical in the sibling
  `charlieramus.comv2` build** (the architectural source of truth). It's a failed
  prefetch, not a failed navigation: actual routing works, as verified above. Not
  a regression introduced here.

---

# Stage 6 — Coherence + Verify + NOW.md/DESIGN.md

```
Tie the foundation together, prove it, and write the project's living docs.

1. Full run: `npm install` clean, `npx tsc --noEmit`, `npm run lint`, `npm run build`
   (static export). Fix anything that fails.
2. Literal walkthrough: load "/", flip the lightswitch (persists), click Journal / Photos
   / About (route stubs), confirm both themes read well and the serif/mono/grain are live.
3. Create DESIGN.md: the written design system — postcard palette + trio hexes, accent-
   by-place mapping, type roles, grain/vignette, lightbox intent, "photos carry the
   colour / no decorative gradients" rule, privacy (wordmark only).
4. Create NOW.md: a build-state table (Foundation = functional; Landing/Journal, Essays/
   Lightbox, Photos/Pipeline = not built) + a short "Direction" section pointing at the
   prototype and this V1→V4 set.

Verify: build + export are green; NOW.md and DESIGN.md exist and are accurate. Paste the
NOW.md build-state table into this report.
```

## Stage 6 Report

_Pending._

---

# After These Stages
- The app boots, exports statically, and has a real theme system + lightswitch + chrome,
  all driven by one `site.config.ts` — the spine every later log renders against.
- Deferred on purpose (see `NOW.md`): the landing hero, collection wall, essays, the
  lightbox, and the real image pipeline.
- Next: **V2 — Landing & Journal** builds the blurred hero landing and the collection
  wall on top of this config + theme.
