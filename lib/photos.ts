import { photos, type Photo } from "@/data/photos";

// Resolve a `#code` to its real synced photograph. `data/photos.ts` is generated
// by `npm run sync-gallery` from the images in public/photos; every card, essay
// figure, and lightbox item that carries a `code` uses this to pull the real
// image (src + blurDataURL + ratio) when it exists. When it doesn't — no photo
// synced with that code yet, the shipped state — this returns undefined and the
// caller falls back to its `.ph-*` gradient stand-in. That's the whole
// stand-in → real-image swap contract: keyed by code, honest when empty.

const byCode = new Map<string, Photo>(photos.map((p) => [p.code, p]));

/** The real photo for a `#code`, or undefined when none is synced yet. */
export function photoByCode(code?: string): Photo | undefined {
  return code ? byCode.get(code) : undefined;
}
