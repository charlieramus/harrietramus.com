import type { Theme } from "@/site.config";

// The one place the palette in site.config.ts becomes CSS. `themeToCss(theme)`
// emits the two per-mode custom-property blocks — [data-mode="dark"] and
// [data-mode="light"] — that every component reads through var(--…). It's
// injected once via a <style> in app/layout.tsx, so there are no hand-copied
// hexes anywhere in globals.css: edit a value in site.config's `theme` and the
// tokens regenerate on the next build.
//
// Token contract (consumed across the app + globals.css):
//   --bg --bg2 --ink --ink-soft --ink-faint --accent --accent-ink
//   --c-tomato --c-teal --c-mustard --line --nav-bg --plate
// The trio (--c-tomato/teal/mustard) is the accent-by-place set; --accent is the
// default hue (theme.defaultAccent). Dark mode uses the bright `postcard` trio;
// light mode uses the deepened `accentLight` trio.

function block(selector: string, tokens: Record<string, string>): string {
  const body = Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `${selector} {\n${body}\n}`;
}

export function themeToCss(theme: Theme): string {
  const { dark, light, defaultAccent } = theme;
  const darkTrio = theme.palettes.postcard;
  const lightTrio = theme.palettes.accentLight;

  const darkTokens: Record<string, string> = {
    "--bg": dark.bg,
    "--bg2": dark.bg2,
    "--ink": dark.ink,
    "--ink-soft": dark.inkSoft,
    "--ink-faint": dark.inkFaint,
    "--accent": darkTrio[defaultAccent],
    "--accent-ink": dark.accentInk,
    "--c-tomato": darkTrio.tomato,
    "--c-teal": darkTrio.teal,
    "--c-mustard": darkTrio.mustard,
    "--line": dark.line,
    "--nav-bg": dark.navBg,
    "--plate": dark.plate,
  };

  const lightTokens: Record<string, string> = {
    "--bg": light.bg,
    "--bg2": light.bg2,
    "--ink": light.ink,
    "--ink-soft": light.inkSoft,
    "--ink-faint": light.inkFaint,
    "--accent": lightTrio[defaultAccent],
    "--accent-ink": light.accentInk,
    "--c-tomato": lightTrio.tomato,
    "--c-teal": lightTrio.teal,
    "--c-mustard": lightTrio.mustard,
    "--line": light.line,
    "--nav-bg": light.navBg,
    "--plate": light.plate,
  };

  return [
    block('[data-mode="dark"]', darkTokens),
    block('[data-mode="light"]', lightTokens),
  ].join("\n\n");
}
