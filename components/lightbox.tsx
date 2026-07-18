"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Shared fullscreen lightbox — ported from charlieramus.comv2 unchanged in
 * behaviour. It is the single viewer for both essay figures (V3) and the loose
 * Photos board (V4); do NOT fork a second copy.
 *
 * Controlled: the parent owns the open `index` (null = closed) and gets `onIndex`
 * / `onClose`. A11y: `role="dialog"` + `aria-modal`, Escape closes, ← / → step
 * with wraparound, a Tab focus-trap inside the dialog, body-scroll lock while
 * open, and focus returned to whatever element opened it (captured on open).
 * All transitions are disabled under `prefers-reduced-motion` (see .lightbox in
 * globals.css).
 *
 * Photos land in V4, so each item renders its `.ph-*` gradient stand-in in a
 * `.lb-shot` div sized by the item's `ratio`, instead of next/image — behind the
 * same LightboxItem shape (`src` / `blurDataURL` already carried, dormant) so V4
 * swaps the div for <Image src=…> with no API change.
 */
export type LightboxItem = {
  /** .ph-* gradient stand-in class (the honest placeholder until V4) */
  cls: string;
  alt: string;
  /** intrinsic width/height ratio — drives the rendered box so nothing crops */
  ratio: number;
  caption?: string;
  /** small monospace badge (photo `#code`) — optional */
  code?: string;
  /** V4: the real image path that replaces `cls` (dormant now) */
  src?: string;
  /** V4: the tiny blur placeholder (dormant now) */
  blurDataURL?: string;
};

export default function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const prev = useCallback(() => {
    if (index === null) return;
    onIndex((index - 1 + items.length) % items.length);
  }, [index, items.length, onIndex]);
  const next = useCallback(() => {
    if (index === null) return;
    onIndex((index + 1) % items.length);
  }, [index, items.length, onIndex]);

  // Keyboard: Escape / arrows / Tab focus-trap. Bound only while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, prev, next]);

  // On open: capture the opener, lock body scroll, focus Close. On close: unlock
  // + return focus to the opener. Runs only when `open` flips (nav keeps state).
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      openerRef.current?.focus?.();
    };
  }, [open]);

  const item = index !== null ? items[index] : null;
  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || item.alt}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="lightbox-inner"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="lightbox-btn lightbox-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {items.length > 1 && (
          <button
            type="button"
            className="lightbox-btn lightbox-prev"
            onClick={prev}
            aria-label="Previous"
          >
            ‹
          </button>
        )}

        <figure className="lightbox-figure">
          {/* V4: swapped for <Image src={item.src} …> (same LightboxItem shape). */}
          <div
            className={`lb-shot photo ${item.cls}`}
            style={{ ["--r" as string]: item.ratio }}
            role="img"
            aria-label={item.alt}
          />
          {(item.caption || item.code) && (
            <figcaption className="lightbox-cap">
              {item.code && <span className="lightbox-code">#{item.code}</span>}
              {item.caption && <span>{item.caption}</span>}
            </figcaption>
          )}
        </figure>

        {items.length > 1 && (
          <button
            type="button"
            className="lightbox-btn lightbox-next"
            onClick={next}
            aria-label="Next"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
