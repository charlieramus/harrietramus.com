/**
 * sync-gallery.mjs — Harriet's reproducible photography pipeline (V4 Stage 1).
 *
 * Mirrors charlieramus.comv2/scripts/sync-gallery.mjs, narrowed to Harriet's
 * board contract. It scans `public/photos`, reads each image's intrinsic ratio
 * with `image-size`, generates a base64 blur placeholder with `plaiceholder`, and
 * writes the typed manifest `data/photos.ts` (auto-generated — never hand-edited).
 *
 * data/photos.ts feeds the loose Photos board (V4 Stage 2) and any `#code`
 * lookups. The board renders next/image with the blur placeholder; the ratio
 * drives the masonry sizing so nothing crops.
 *
 * --- Adding photos (two ways) ------------------------------------------------
 *
 * 1. Sidecar (recommended — gives you control over loc + code + order):
 *    Drop the images into public/photos/ and list them in public/photos/gallery.json:
 *      [
 *        { "file": "0001.webp", "loc": "Serengeti, Tanzania", "code": "0001" },
 *        { "file": "sunset.webp", "loc": "Big Sur, California" }
 *      ]
 *    `loc` is the hover caption / lightbox location. `code` is the mono #badge;
 *    omit it and it's assigned sequentially (0001, 0002, …). Only the files listed
 *    (in this order) are included.
 *
 * 2. No sidecar (filename convention): every image file in public/photos/ is
 *    picked up alphabetically. The location is derived from the filename by
 *    dropping the extension, turning "-" into spaces and "__" into ", ", then
 *    title-casing — so `big-sur__california.webp` → "Big Sur, California".
 *    Codes are assigned sequentially.
 *
 * Either way:  npm run sync-gallery
 *
 * An empty (or missing) public/photos emits an empty array — the site then shows
 * gradient fallbacks + the board's honest "coming soon" state, and fills in as
 * Harriet adds real frames. No fabricated content is ever written.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import { imageSize } from "image-size";
import { getPlaiceholder } from "plaiceholder";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const photosDir = join(root, "public", "photos");
const galleryPath = join(photosDir, "gallery.json");
const outputPath = join(root, "data", "photos.ts");
const dataDir = dirname(outputPath);

// The raster formats image-size + plaiceholder can read. `thumbs` and the sidecar
// itself are never treated as photos.
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

// Title-case a dash/underscore filename stem into a location label:
// "big-sur__california" → "Big Sur, California".
function locFromFile(file) {
  const stem = basename(file, extname(file));
  return stem
    .split("__")
    .map((group) =>
      group
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    )
    .filter(Boolean)
    .join(", ");
}

// Resolve the ordered list of { file, loc?, code? } entries to process. Prefer the
// gallery.json sidecar; fall back to scanning the directory alphabetically.
function resolveEntries() {
  if (!existsSync(photosDir)) return [];

  if (existsSync(galleryPath)) {
    const raw = JSON.parse(readFileSync(galleryPath, "utf8"));
    if (!Array.isArray(raw)) {
      throw new Error("public/photos/gallery.json must be a JSON array of { file, loc?, code? }");
    }
    return raw.map((e) => ({ file: e.file, loc: e.loc, code: e.code }));
  }

  return readdirSync(photosDir)
    .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
    .sort()
    .map((file) => ({ file }));
}

const entries = resolveEntries();

const photos = [];
for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  const code = entry.code || String(i + 1).padStart(4, "0");
  const loc = entry.loc || locFromFile(entry.file);
  const fullPath = join(photosDir, entry.file);

  let ratio = 1.5;
  let blurDataURL = null;

  try {
    const buf = readFileSync(fullPath);
    const { width, height } = imageSize(buf);
    ratio = Math.round((width / height) * 1000) / 1000;

    try {
      const { base64 } = await getPlaiceholder(buf, { size: 10 });
      blurDataURL = base64;
    } catch {
      console.warn(`  ⚠ Could not generate blur for ${entry.file}`);
    }
  } catch {
    console.warn(`  ⚠ Could not read ${entry.file} — defaulting to ratio 1.5`);
  }

  photos.push({ src: `/photos/${entry.file}`, code, loc, ratio, blurDataURL });
}

// Serialize each photo, omitting a null blurDataURL so an unreadable frame stays lean.
const lines = photos.map((p) => {
  const parts = [
    `src: ${JSON.stringify(p.src)}`,
    `code: ${JSON.stringify(p.code)}`,
    `loc: ${JSON.stringify(p.loc)}`,
    `ratio: ${p.ratio}`,
  ];
  if (p.blurDataURL) parts.push(`blurDataURL: ${JSON.stringify(p.blurDataURL)}`);
  return `  { ${parts.join(", ")} }`;
});

const body = lines.length ? `\n${lines.join(",\n")}\n` : "";

const output = `// AUTO-GENERATED by scripts/sync-gallery.mjs — do not edit directly.
// Add images to public/photos/ (optionally list them in public/photos/gallery.json),
// then run: npm run sync-gallery
//
// The \`Photo\` type is the V4 board contract: src is the /public image path,
// ratio (width / height) drives the masonry sizing, loc is the hover caption /
// lightbox location, code is the mono #badge / lookup id, and blurDataURL feeds
// next/image's blur-up placeholder.

export type Photo = {
  /** image path in /public */
  src: string;
  /** mono #code badge / lookup id */
  code: string;
  /** location label (hover caption + lightbox) */
  loc: string;
  /** intrinsic aspect ratio, width / height (drives masonry sizing) */
  ratio: number;
  /** base64 blur placeholder for next/image */
  blurDataURL?: string;
};

export const photos: Photo[] = [${body}];
`;

mkdirSync(dataDir, { recursive: true });
writeFileSync(outputPath, output, "utf8");
console.log(
  `✓ Synced ${photos.length} photo${photos.length === 1 ? "" : "s"} → data/photos.ts` +
    (photos.length === 0 ? " (empty board — gradient fallbacks + \"coming soon\" state)" : "")
);
