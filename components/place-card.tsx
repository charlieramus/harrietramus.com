import Link from "next/link";
import type { Place } from "@/site.config";

// A thin stacked card — one place inside a collection. The whole card IS a
// `.photo` (so it carries the vignette + grain) filled with the place's `.ph-*`
// gradient stand-in; the serif place name (with a strong text-shadow), a
// right-aligned mono meta label, and a hover arrow in `var(--accent)` sit over it.
// The `.acc-<hue>` wrapper from the wall (Stage 3) colours that arrow to the
// collection's hue. Links to the same essay route as its collection.
//
// `image` is the optional real photograph (unused until V4); with none the
// gradient stands in, and the swap keeps these exact props.

export default function PlaceCard({
  place,
  essay,
  image,
}: {
  place: Place;
  essay: string;
  image?: string;
}) {
  return (
    <Link
      href={`/journal/${essay}`}
      className={image ? "place-card photo" : `place-card photo ${place.cls}`}
    >
      {/* V4: swapped for next/image (same props); dormant until images exist. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image ? <img src={image} alt="" className="place-img" /> : null}
      <span className="scrim place-scrim" />
      <span className="place-name">{place.name}</span>
      <span className="place-meta mono">{place.meta}</span>
      <span className="place-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
