"use client";

import { useEffect, useState } from "react";

// The fixed bottom-right wall-switch. Flips `data-mode` on <html> between "dark"
// (deep-ink) and "light" (warm-cream), and persists the choice to localStorage
// under "harriet-mode". The FIRST paint is already correct because the inline
// script in app/layout.tsx reads that key and sets data-mode before this
// component (or any CSS) runs — so this only has to stay in sync and handle
// clicks, never set the initial theme itself (which would flash).

const STORAGE_KEY = "harriet-mode";
type Mode = "dark" | "light";

export default function Lightswitch() {
  // Start from whatever the pre-paint script already put on <html>. On the
  // server that attribute is "dark" (the layout default), so SSR and the first
  // client render agree; useEffect then reconciles to the real DOM value.
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const current =
      (document.documentElement.dataset.mode as Mode | undefined) ?? "dark";
    setMode(current);
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private-mode / storage-disabled: the toggle still works for the session.
    }
    setMode(next);
  }

  const lightOn = mode === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      className="lightswitch"
      // Reflects "light is on" — the switch's up position. Screen readers read
      // the pressed state; the label names the action.
      aria-pressed={lightOn}
      aria-label={lightOn ? "Switch to dark mode" : "Switch to light mode"}
      title={lightOn ? "Lights off" : "Lights on"}
    >
      <span className="ls-plate" data-on={lightOn}>
        <span className="ls-rocker" />
      </span>
    </button>
  );
}
