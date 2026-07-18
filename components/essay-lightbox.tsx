"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Image from "next/image";
import Lightbox, { type LightboxItem } from "./lightbox";

// The small client wrapper that owns the essay's open-lightbox index and renders
// the shared <Lightbox>. It wraps the (server-rendered) MDX essay body as
// children and provides an `openAt(index)` opener through context, so each
// essay figure — a <Shot> button inside the body — can open the lightbox at its
// own index. ← / → then step through THIS essay's figures only (the item set is
// [full, pairA, pairB, end], built in the essay page and passed as `items`).

const OpenAtContext = createContext<((index: number) => void) | null>(null);

export function EssayLightbox({
  items,
  children,
}: {
  items: LightboxItem[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <OpenAtContext.Provider value={setIndex}>
      {children}
      <Lightbox
        items={items}
        index={index}
        onClose={() => setIndex(null)}
        onIndex={setIndex}
      />
    </OpenAtContext.Provider>
  );
}

// A single clickable figure box. Inside an <EssayLightbox> it's a real <button>
// (keyboard-openable, zoom-in cursor) that opens the lightbox at `index`; with no
// provider it degrades to a non-interactive image div, so the figure still
// renders. Focus lands on the button when clicked, so Escape returns focus to it.
//
// V4: when `src` resolves (the figure's #code mapped to a synced photo) a
// next/image (blur-up) fills the box; otherwise the className's `.ph-*` gradient
// stands in. The box is a `.photo` (position: relative), so fill positions cleanly.
export function Shot({
  index,
  className,
  label,
  src,
  blurDataURL,
}: {
  index: number;
  className: string;
  label: string;
  src?: string;
  blurDataURL?: string;
}) {
  const openAt = useContext(OpenAtContext);
  const img = src ? (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 1200px) 100vw, 1200px"
      className="shot-img"
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
    />
  ) : null;
  if (!openAt) {
    return (
      <div className={className} role="img" aria-label={label}>
        {img}
      </div>
    );
  }
  return (
    <button
      type="button"
      className={className}
      aria-label={`Open photograph: ${label}`}
      onClick={() => openAt(index)}
    >
      {img}
    </button>
  );
}
