"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox, { type LightboxItem } from "./lightbox";
import type { Photo } from "@/data/photos";

/**
 * The loose Photos board (V4 Stage 2) — the client half of /photos. It owns the
 * open-lightbox index and renders the shared <Lightbox> (from V3) over the WHOLE
 * board set, so clicking any tile opens it there and ← / → walk every frame.
 *
 * The tiles themselves are a CSS-columns masonry of next/image, each sized by its
 * intrinsic `ratio` (from data/photos.ts) so nothing crops, with a blur-up
 * placeholder and a hover location caption. When the manifest is empty (the
 * shipped state until Harriet runs sync-gallery) it shows an honest "coming soon"
 * state instead of a broken grid.
 */
export default function PhotosBoard({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="board-empty">
        <p className="board-empty-title mono">Photos coming soon</p>
        <p className="board-empty-note">
          New frames land here as they&rsquo;re developed — the unfiled ones that
          didn&rsquo;t need a story to be worth keeping. Check back.
        </p>
      </div>
    );
  }

  // The lightbox set mirrors the board order 1:1, so a tile's index opens the same
  // frame. `src` / `blurDataURL` carry the real image (the lightbox renders it in
  // Stage 3); `loc` is the caption, `code` the mono #badge. `cls` stays "" — these
  // are real photos, not gradient stand-ins.
  const items: LightboxItem[] = photos.map((p) => ({
    cls: "",
    alt: p.loc,
    caption: p.loc,
    code: p.code,
    ratio: p.ratio,
    src: p.src,
    blurDataURL: p.blurDataURL,
  }));

  return (
    <>
      <div className="board-grid">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className="board-tile"
            style={{ ["--r" as string]: p.ratio }}
            aria-label={`Open photograph: ${p.loc}`}
            onClick={() => setIndex(i)}
          >
            <span className="board-frame photo">
              <Image
                src={p.src}
                alt={p.loc}
                fill
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                className="board-img"
                placeholder={p.blurDataURL ? "blur" : "empty"}
                blurDataURL={p.blurDataURL}
              />
              <span className="board-cap-scrim" />
              <span className="board-cap mono">{p.loc}</span>
            </span>
          </button>
        ))}
      </div>
      <Lightbox
        items={items}
        index={index}
        onClose={() => setIndex(null)}
        onIndex={setIndex}
      />
    </>
  );
}
