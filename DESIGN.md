# DESIGN.md — Harriet

The written design system for **Harriet**, a travel-photography journal. Later
build logs (V2–V4) obey this document. Everything here is realised as data in
`site.config.ts` and turned into CSS by `lib/theme.ts` + `app/globals.css` — this
file is the *why*; those are the *what*.

The one rule that governs all of it: **the photographs carry the colour.** The
interface is a quiet mount around them — warm, editorial, and out of the way.

---

## Palette — vintage postcard

Two grounds and a three-hue accent trio. The grounds set the mood (a warm-cream
day / a deep-ink night); the trio is used sparingly, and mostly to colour-code
the collections (see Accent-by-place).

**Grounds**

| Token | Dark (deep-ink) | Light (warm-cream) | Role |
| --- | --- | --- | --- |
| `--bg` | `#201d16` | `#f3ecdd` | page background |
| `--bg2` | `#2a261d` | `#ece3d0` | raised surface / card |
| `--ink` | `#f3ecdd` | `#201d16` | primary text |
| `--ink-soft` | `#c9c0ad` | `#4a4536` | secondary text |
| `--ink-faint` | `#8a8272` | `#857d69` | faint labels / footer |
| `--line` | `rgba(243,236,221,.12)` | `rgba(32,29,22,.12)` | hairlines |
| `--nav-bg` | `rgba(32,29,22,.72)` | `rgba(243,236,221,.72)` | translucent nav |
| `--plate` | `#17140f` | `#e6dcc6` | lightswitch plate |

Dark is the **default** (see Lightswitch).

**Accent trio** — bright in dark mode, deepened for legibility on cream:

| Hue | Dark | Light (deepened) |
| --- | --- | --- |
| tomato | `#d1495b` | `#b23a4b` |
| teal | `#3bb3a3` | `#2b8677` |
| mustard | `#e9b64a` | `#c8912f` |

Exposed as `--c-tomato / --c-teal / --c-mustard`, plus `--accent` (the live hue,
defaulting to tomato). Never hand-copy these — edit `theme` in `site.config.ts`;
`themeToCss()` regenerates the `[data-mode="dark"]` / `[data-mode="light"]` token
blocks on build.

---

## Accent-by-place

Each collection is themed with **one** trio hue, so several colours are visible on
the wall at once without any of them being decorative — the colour *names the
place*.

| Collection | Hue | Remap class |
| --- | --- | --- |
| Africa | mustard | `.acc-mustard` |
| United States | teal | `.acc-teal` |
| Japan | tomato | `.acc-tomato` |

Wrapping a collection/essay in its `.acc-*` class remaps `--accent` to that hue,
so its stat number, arrows, rules, and essay eyebrow all pick it up. New
collections pick a trio key via `accent` in config.

---

## Type

| Role | Face | Token | Where |
| --- | --- | --- | --- |
| Display / editorial | **Fraunces** (high-contrast old-style serif) | `--font-serif` | wordmark, headings, essay titles, quotes |
| Body / UI | **system-sans** stack | `--font-sans` | paragraphs, nav, meta |
| Figures / numbers | **JetBrains Mono** | `--font-mono` | stat numbers, captions, the lightbox `#code` badge |

Fraunces gives the vintage-postcard character; the system sans keeps the body
neutral so the serif and the photos do the talking; the mono is reserved for
figures and codes so numbers read as data, not prose. Display headings are weight
400, tight leading, slight negative tracking.

---

## Grain & vignette — the `.photo` primitive

Every photograph (and every `.ph-*` gradient stand-in) sits in `.photo`, which
adds, in layers:

- `::before` — a soft radial **vignette** (darkens the edges, focuses the frame).
- `::after` — the **film grain**: a fractal-noise SVG (`--grain`) at low opacity,
  `mix-blend-mode: overlay`. It's what makes the images feel like prints, not
  screenshots.
- `.scrim` — an optional bottom-weighted dark wash, added only under text laid
  over a photo (landing, hero cards) for legibility in both modes.

Grain and vignette are subtle by design — present on photo surfaces, invisible on
flat UI. Real images drop in as the first child of `.photo` in V4 (`next/image` +
`blurDataURL`); until then a `.ph-*` gradient stands in — an **honest**
placeholder, never a fabricated photo.

---

## Lightbox (intent — built V3)

A shared fullscreen lightbox is the single viewer for both essay figures and the
Photos board. Deep-ink backdrop regardless of mode, the photo centred, its caption
and a mono `#code` badge beneath. `←` / `→` step through the current set (an
essay's figures, or the whole board); `Esc` closes and returns focus to the
element that opened it. It is the one place the interface goes fully dark to let a
single photograph hold the screen.

---

## Essay reading layout (refactored V5)

An essay reads like a clean **New York Times / Google-Doc article**: one relatively
wide column where the text and the images share a single measure.

- **One unified column.** `--essay-col` (`min(880px, 92vw)`) is the whole measure.
  Both the reading text *and* every figure (`.full`, `.pair`) sit at this exact width,
  centred with symmetric whitespace on both sides. Nothing breaks out wider than the
  text — the widest image is exactly as wide as the paragraph above it (big, but never
  full-bleed). Because the text runs as wide as the images, the body is set at ~19px /
  1.75 leading so the longer measure still reads. (The About page keeps its own tighter
  `--read` measure — this is essay-only.)
- **Text masthead, no photo overlay.** The piece opens with a masthead *inside* the
  column: a back kicker, the small accent eyebrow, the serif headline as **text** (not
  set over an image), a quiet mono byline, and a hairline divider. The former hero photo
  then follows as the **lead image at column width**.
- **Quiet typography.** No drop-cap — the lead is a clean paragraph (a touch larger than
  the body). The pull quote is a **centred serif quote** with generous margins and a thin
  hairline above/below — not a heavy accent left-rule. Figure corners are near-square
  (~2px) for the editorial feel; captions stay small, quiet, left-aligned.
- **Accent-by-place, quieter.** The collection's `.acc-*` hue still themes the page, but
  now shows only in the small eyebrow/kicker, the caption `#code` badge, and the end
  rule — not a big drop-cap or a thick quote bar. Colour still comes mostly from the
  photographs.

This supersedes the earlier V3 layout (a narrow ~68ch reading column with figures that
broke out much wider than the text, plus a serif accent drop-cap and an accent-rule pull
quote). The lightbox wiring, accent-by-place, back link, metadata, and MDX prose are
unchanged — only the layout and type moved.

---

## Rules

- **Photos carry the colour. No decorative gradients.** The UI is warm-neutral;
  saturation comes from the photographs and the accent trio. The **one**
  intentional gradient is the landing backdrop fallback (`ph-dusk`), used only
  when no real hero photo is set. `.ph-*` gradients are placeholders, not chrome.
- **No AI slop.** No glows, no faux-3D, no gratuitous motion. Editorial restraint:
  type, whitespace, and the image.
- **Motion is optional.** Everything honours `prefers-reduced-motion` (the
  lightswitch rocker, the scroll cue, transitions).
- **Two modes, always both.** Every surface must read in warm-cream *and*
  deep-ink. Dark is the default.
- **Privacy — wordmark only.** The name on the site is **"Harriet"**, first name
  only, everywhere (nav, footer, landing, essay signatures, `about.sign`). No
  surname appears anywhere, despite the repo name. Set once as `wordmark` in
  `site.config.ts`.

---

## Source of truth

- `site.config.ts` — all identity, palette, and content. The only file edited to
  change copy or colour.
- `lib/theme.ts` — `themeToCss()` turns `theme` into the per-mode token blocks.
- `app/globals.css` — structural tokens, base styles, and the `.photo` / `.ph-*`
  / `.acc-*` primitives.
