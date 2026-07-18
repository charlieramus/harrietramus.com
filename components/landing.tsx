import { landing } from "@/site.config";

// The full-screen front door, rendered entirely from config.landing. It pulls up
// under the sticky nav (negative margin) so the blurred backdrop reads behind the
// translucent header, and fills the viewport.
//
// The layers, bottom-to-top, are deliberately SEPARATE elements so the blur only
// touches the photo:
//   0 .landing-backdrop  — the blurred backdropImage (or the `backdrop` gradient
//                          fallback when backdropImage is ""). This is the ONLY
//                          layer that carries filter: blur() + scale(1.18); the
//                          scale over-fills the box so the blur's soft edges never
//                          show at the frame.
//   1 .landing-overlay   — the sharp .photo primitive (vignette ::before + film
//                          grain ::after) plus a legibility .scrim. It sits ABOVE
//                          the blurred layer, unblurred, so the grain stays crisp
//                          (grain blurred with the photo would just disappear).
//   2 .landing-content   — eyebrow / serif wordmark / tagline / subline, always in
//                          warm-cream ink over the scrim (legible in BOTH modes —
//                          the scrim, not var(--ink), carries the contrast).
//   2 .landing-cue       — the scroll cue; an anchor to #collections (the wall,
//                          added in Stage 3) with a bobbing chevron.
//
// No client JS: the cue is a plain in-page anchor and the smooth scroll comes from
// `html { scroll-behavior: smooth }` (auto-disabled under prefers-reduced-motion).
export default function Landing() {
  const {
    eyebrow,
    title,
    tagline,
    subline,
    backdrop,
    backdropImage,
    backdropBlur,
    cue,
  } = landing;

  const hasImage = backdropImage !== "";

  return (
    <section className="landing" aria-label="Introduction">
      {/* The isolated blurred layer — the one thing that gets filter: blur(). */}
      <div
        className={hasImage ? "landing-backdrop" : `landing-backdrop ${backdrop}`}
        aria-hidden="true"
        style={
          hasImage
            ? {
                backgroundImage: `url(${backdropImage})`,
                filter: `blur(${backdropBlur}px)`,
              }
            : undefined
        }
      />

      {/* Sharp overlays: vignette + grain (.photo) and the legibility scrim. */}
      <div className="landing-overlay photo" aria-hidden="true">
        <span className="scrim landing-scrim" />
      </div>

      {/* The words on the front door. */}
      <div className="landing-content">
        <p className="landing-eyebrow mono">{eyebrow}</p>
        <h1 className="landing-title">{title}</h1>
        <p className="landing-tagline">{tagline}</p>
        <p className="landing-subline">{subline}</p>
      </div>

      {/* Scroll cue → the collection wall (#collections lands in Stage 3). */}
      <a className="landing-cue" href="#collections">
        <span className="landing-cue-label mono">{cue}</span>
        <svg
          className="landing-chevron"
          width="22"
          height="14"
          viewBox="0 0 22 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1l10 10L21 1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
