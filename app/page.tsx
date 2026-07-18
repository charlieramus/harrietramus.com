import Landing from "@/components/landing";

// Home / — the journal home. Stage 1 renders the full-screen <Landing />; the
// intro band, the collection wall, and the #collections anchor the cue targets
// are assembled around it in Stage 3.
export default function Home() {
  return (
    <main>
      <Landing />
    </main>
  );
}
