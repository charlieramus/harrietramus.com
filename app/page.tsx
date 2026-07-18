import Landing from "@/components/landing";
import CollectionCard from "@/components/collection-card";
import PlaceCard from "@/components/place-card";
import { collections } from "@/site.config";

// Home / — the journal home: the full-screen landing, then the "The collections"
// intro band, then the wall. The wall maps config.collections to a hero
// <CollectionCard> over its <PlaceCard> stack, each collection wrapped in its
// `.acc-<hue>` class so its stat number + arrows pick up the place hue — three
// accents on the wall at once. The `#collections` section is the anchor the
// landing scroll cue targets. All copy/data comes from site.config.
export default function Home() {
  return (
    <main>
      <Landing />

      <section id="collections" className="wall">
        <div className="wall-intro">
          <p className="wall-eyebrow mono">{collections.length} collections</p>
          <h2 className="wall-title">The collections</h2>
        </div>

        <div className="wall-list">
          {collections.map((c) => (
            <div key={c.essay} className={`collection acc-${c.accent}`}>
              <CollectionCard collection={c} />
              <div className="place-stack">
                {c.places.map((p) => (
                  <PlaceCard key={p.name} place={p} essay={c.essay} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
