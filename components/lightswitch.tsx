"use client";

import { useCallback, useSyncExternalStore } from "react";

// The fixed bottom-right wall-switch. Flips `data-mode` on <html> between "dark"
// (deep-ink) and "light" (warm-cream), and persists the choice to localStorage
// under "harriet-mode". The FIRST paint is already correct because the inline
// script in app/layout.tsx reads that key and sets data-mode before this
// component (or any CSS) runs — so this only reflects the DOM's current mode and
// handles clicks; it never sets the initial theme itself (which would flash).
//
// The mode lives on <html data-mode>, an external system, so it's read with
// useSyncExternalStore rather than useState+useEffect: getServerSnapshot keeps
// SSR + hydration on the layout default ("dark"), then React reconciles to the
// real DOM value after hydration — no setState-in-effect, no hydration mismatch.

const STORAGE_KEY = "harriet-mode";
type Mode = "dark" | "light";

// Module-level subscriber list — the store is the single <html> data-mode.
let listeners: Array<() => void> = [];
function subscribe(cb: () => void): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}
function emit(): void {
  for (const l of listeners) l();
}

function getSnapshot(): Mode {
  return document.documentElement.dataset.mode === "light" ? "light" : "dark";
}
function getServerSnapshot(): Mode {
  return "dark"; // matches the <html data-mode="dark"> layout default
}

export default function Lightswitch() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Mode = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private-mode / storage-disabled: the toggle still works for the session.
    }
    emit();
  }, []);

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
