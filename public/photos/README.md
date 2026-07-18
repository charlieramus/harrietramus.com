# public/photos — the real frames

This folder is Harriet's photo library. It's the one place you add photographs;
nothing in the code needs to change.

## Adding photos

1. Drop image files here (`.jpg`, `.png`, `.webp`, …).
2. Run `npm run sync-gallery`.

That regenerates `data/photos.ts` (the typed manifest the Photos board reads):
for every image it records the path, the aspect ratio (so the masonry lays it out
without cropping), a blur-up placeholder, a location label, and a `#code` badge.

**`data/photos.ts` is auto-generated — never hand-edit it.**

## Two ways to label a photo

**Sidecar (recommended)** — create `gallery.json` here to control the location,
code, and order:

```json
[
  { "file": "0001.webp", "loc": "Serengeti, Tanzania", "code": "0001" },
  { "file": "sunset.webp", "loc": "Big Sur, California" }
]
```

`loc` is the hover caption / lightbox location. `code` is optional (assigned
`0001`, `0002`, … in order when omitted). Only the files listed are included.

**Filename convention (no sidecar)** — every image here is picked up
alphabetically, and the location is derived from the filename: drop the extension,
turn `-` into spaces and `__` into `, `, then title-case. So
`big-sur__california.webp` → **Big Sur, California**. Codes are sequential.

## Empty is fine

With no photos (the shipped state), the board shows an honest "coming soon" and
every surface falls back to its gradient stand-in. Add frames and re-run
`sync-gallery` to fill the site in — no code changes needed.
