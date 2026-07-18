import type { MDXComponents } from "mdx/types";

// Required by @next/mdx (App Router). Essay prose will be styled globally via a
// prose wrapper in app/globals.css (design-system serif headings, reading
// measure) once essays land in V3, so element-level overrides aren't needed
// here — the MDX maps straight to semantic HTML. Kept as the documented empty
// map; per-element components can be added later if a body needs one.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
