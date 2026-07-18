import Link from "next/link";
import Image from "next/image";
import type { Place } from "@/site.config";
import { photoByCode } from "@/lib/photos";

// A thin stacked card — one place inside a collection. The whole card IS a
// `.photo` (so it carries the vignette + grain); the serif place name (with a
// strong text-shadow), a right-aligned mono meta label, and a hover arrow in
// `var(--accent)` sit over it. The `.acc-<hue>` wrapper from the wall colours that
// arrow to the collection's hue. Links to the same essay route as its collection.
//
// V4: the photo resolves from `place.code` → data/photos.ts. When one is synced a
// real next/image (blur-up) renders behind the overlays; otherwise the `.ph-*`
// gradient stands in.

export default function PlaceCard({
  place,
  essay,
}: {
  place: Place;
  essay: string;
}) {
  const photo = photoByCode(place.code);

  return (
    <Link
      href={`/journal/${essay}`}
      className={photo ? "place-card photo" : `place-card photo ${place.cls}`}
    >
      {photo && (
        <Image
          src={photo.src}
          alt=""
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="place-img"
          placeholder={photo.blurDataURL ? "blur" : "empty"}
          blurDataURL={photo.blurDataURL}
        />
      )}
      <span className="scrim place-scrim" />
      <span className="place-name">{place.name}</span>
      <span className="place-meta mono">{place.meta}</span>
      <span className="place-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
