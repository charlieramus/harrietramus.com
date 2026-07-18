import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/site.config";
import { photoByCode } from "@/lib/photos";

// The full-bleed hero card that heads each collection on the wall. Everything is
// config-driven: the title from `collection.name`, the stat from `collection.stat`,
// the link target `/journal/<essay>`. The stat's LEADING number renders in the
// mono face and picks up `var(--accent)` — remapped by the ancestor `.acc-<hue>`
// wrapper to this collection's place-hue, so three accents show at once.
//
// V4: the hero photo resolves from `collection.code` → data/photos.ts. When a real
// photograph is synced for that code, a next/image (blur-up) renders behind the
// overlays; until then (Harriet's shipped state) the `.ph-*` gradient stands in.

export default function CollectionCard({
  collection,
}: {
  collection: Collection;
}) {
  const photo = photoByCode(collection.code);

  // The leading whitespace-delimited token of the stat is the mono/accent number
  // (e.g. "12" of "12 days · 3 countries"); the remainder stays in body type.
  const [statNum, ...statTail] = collection.stat.split(" ");
  const statRest = statTail.join(" ");

  return (
    <Link href={`/journal/${collection.essay}`} className="collection-card">
      <div
        className={
          photo ? "photo collection-hero" : `photo collection-hero ${collection.hero}`
        }
      >
        {photo && (
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 1100px"
            className="collection-img"
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL}
          />
        )}
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
