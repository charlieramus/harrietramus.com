"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
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
export function Shot({
  index,
  className,
  label,
}: {
  index: number;
  className: string;
  label: string;
}) {
  const openAt = useContext(OpenAtContext);
  if (!openAt) {
    return <div className={className} role="img" aria-label={label} />;
  }
  return (
    <button
      type="button"
      className={className}
      aria-label={`Open photograph: ${label}`}
      onClick={() => openAt(index)}
    />
  );
}
