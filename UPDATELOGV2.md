charlie

# Harriet — Build 2/4: Landing & Journal
# Work on one stage at a time. Do NOT combine stages.

---

## Context
Read `NOW.md` first. This is log 2 of the Harriet build set (V1 → V2 → V3 → V4). V1 left
us the app shell, `site.config.ts` single-source, the theme/token system + lightswitch,
and the nav/footer chrome. This log builds the **home experience**: the landing screen you
open on, and the collection wall you scroll into.

**A Collection = one trip (Africa, United States 2026, Japan 2025), rendered as a
full-bleed hero card with stacked Place cards beneath, themed by its accent-by-place hue.**

This log builds only the landing section, the collection/place card components, and the
journal home page + routing into essays. It does **not** build essay bodies or the
lightbox (V3) or the Photos board / real image pipeline (V4). Where a real photo isn't
available yet, components render the honest `.ph-*` gradient stand-in — never a fabricated
image — and swap to `next/image` in V4.

## Decisions
- **Landing:** full-viewport hero from `config.landing` — a **blurred** `backdropImage`
  (with `backdropBlur` px) on its own layer, the grain texture + dark scrim on top, then
  the eyebrow + serif wordmark + tagline + subline + a scroll cue that smooth-scrolls to
  the wall. Falls back to the `backdrop` gradient class when `backdropImage` is "".
- **Collection wall:** a hero card (top-left "Collection" eyebrow, serif title, stat line
  with the mono figure) stacked over thin Place cards (name + meta + hover arrow). The
  whole collection is wrapped in its `.acc-<hue>` class so its stat number + arrows pick
  up the accent-by-place colour — three different hues visible on the wall at once.
- **Routing:** real App Router routes. Home `/` = landing + wall. Each collection/place
  links to the essay route `app/journal/[collection]/page.tsx` (built in V3; a titled stub
  is fine as the link target this log). Use `collection.essay` as the slug.
- **Images:** card + landing components accept an optional image; with none, render the
  `.ph-*` stand-in. Keep the `next/image` swap trivial for V4 (same props).
- **Reuse:** pull all copy/data from `site.config` — no hardcoded strings in components.
- **Medium feature: four stages.**

---

# Stage 1 — Landing section

```
Build the full-screen landing from config.landing.

1. components/landing.tsx: a min-100vh section that pulls up under the sticky nav
   (negative margin like the prototype). Render, bottom-to-top: a blurred backdrop-img
   layer (background-image = config.landing.backdropImage, filter: blur(backdropBlur px),
   scale 1.18 to hide edges) when set, else the config.landing.backdrop gradient class;
   the .photo grain + a dark scrim for legibility; then the content — eyebrow, serif
   wordmark (config.landing.title), tagline, subline.
2. Add the scroll cue button (config.landing.cue) that smooth-scrolls to the collection
   wall anchor. Animate the chevron bob; disable under prefers-reduced-motion.
3. Both themes: legible over a bright or dark blurred photo (the scrim handles it).

Verify: `npx tsc --noEmit`; `npm run build`; "/" shows the landing full-screen with the
blurred backdrop + grain, the scroll cue scrolls to the wall, and it reads well in both
modes. Report how the blurred layer is isolated from the sharp overlays.
```

## Stage 1 Report

_Pending._

---

# Stage 2 — Collection + Place cards

```
Build the two card components that make up the wall.

1. components/collection-card.tsx: the full-bleed hero card — .photo hero (gradient
   stand-in from collection.hero for now), top-left "Collection" eyebrow, serif title,
   and the stat line with the leading number in the mono face (accent-coloured via the
   collection's .acc-<hue> wrapper). Links to the essay route.
2. components/place-card.tsx: a thin stacked card — .photo (place.cls), serif place name
   with a strong text-shadow, a right-aligned meta label, and a hover arrow that uses
   var(--accent). Links to the essay route.
3. Both accept an optional real image prop (unused until V4) and fall back to the .ph-*
   class. Hover: subtle lift on the hero, arrow reveal on place cards; respect reduced
   motion.

Verify: `npx tsc --noEmit`; `npm run build`; render both cards on a scratch page for all
three collections and confirm each collection shows its own accent hue on the stat number
+ arrows. Report the three hue assignments observed.
```

## Stage 2 Report

_Pending._

---

# Stage 3 — Journal home page

```
Assemble the home page: landing + intro + the collection wall, wired to config.

1. app/page.tsx: render <Landing />, then the "The collections" intro band, then the wall
   — map config.collections to <CollectionCard> + its <PlaceCard> stack, each collection
   wrapped in its acc-<hue> class. Add the scroll anchor the landing cue targets.
2. Ensure every collection/place links to app/journal/[collection]/page.tsx using
   collection.essay as the slug. Create that route as a titled stub (real essay is V3) so
   links resolve in the static export.
3. No hardcoded copy — everything from site.config.

Verify: `npx tsc --noEmit`; `npm run build` (home + all journal/[collection] stubs export);
scroll from landing → wall → click a card → lands on the essay stub. Report the exported
route list.
```

## Stage 3 Report

_Pending._

---

# Stage 4 — Coherence + Verify + NOW.md

```
Prove the home experience end to end and update the living doc.

1. Full run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
2. Literal walkthrough: open "/", read the landing, use the scroll cue, scan the wall
   (three accent hues), flip the lightswitch (landing + cards read in both modes), click
   into each collection's essay stub.
3. Update NOW.md: move "Landing & Journal" into the functional list; note essays +
   lightbox + Photos board still pending.

Verify: build/export green; walkthrough clean in both themes. Paste the updated NOW.md
build-state rows into this report.
```

## Stage 4 Report

_Pending._

---

# After These Stages
- The home is real: a blurred-photo landing that scrolls into a colour-coded collection
  wall, every card routing toward its essay — all from `site.config`.
- Deferred on purpose (see `NOW.md`): the essay reading view + the shared lightbox (V3),
  and swapping the gradient stand-ins for real photos (V4).
- Next: **V3 — Essays & Lightbox** builds the photo-essay template and ports the shared
  fullscreen lightbox.
