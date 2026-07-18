import Link from "next/link";
import type { Collection } from "@/site.config";

// The full-bleed hero card that heads each collection on the wall. Everything is
// config-driven: the gradient stand-in comes from `collection.hero`, the title
// from `collection.name`, the stat from `collection.stat`, and the link target is
// the essay route `/journal/<essay>`. The stat's LEADING number renders in the
// mono face and picks up `var(--accent)` — which the ancestor `.acc-<hue>` wrapper
// (added by the wall in Stage 3) remaps to this collection's place-hue, so three
// different accents show on the wall at once.
//
// `image` is the optional real photograph (unused until V4). With none, the
// `.ph-*` gradient stands in; when it lands the swap is a one-liner (drop the
// image in as the first child of `.photo`, keep every other prop).

export default function CollectionCard({
  collection,
  image,
}: {
  collection: Collection;
  image?: string;
}) {
  // The leading whitespace-delimited token of the stat is the mono/accent number
  // (e.g. "12" of "12 days · 3 countries"); the remainder stays in body type.
  const [statNum, ...statTail] = collection.stat.split(" ");
  const statRest = statTail.join(" ");

  return (
    <Link href={`/journal/${collection.essay}`} className="collection-card">
      <div className={image ? "photo collection-hero" : `photo collection-hero ${collection.hero}`}>
        {image ? (
          // V4: this raw <img> is swapped for next/image (blurDataURL) with the
          // same props; until then the branch is dormant (no images exist yet).
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="collection-img" />
        ) : null}
        <span className="scrim" />
        <p className="collection-eyebrow mono">Collection</p>
        <div className="collection-foot">
          <h2 className="collection-title">{collection.name}</h2>
          <p className="collection-stat">
            <span className="stat-num mono">{statNum}</span>
            {statRest ? ` ${statRest}` : ""}
          </p>
        </div>
      </div>
    </Link>
  );
}
