import { wordmark, collections } from "@/site.config";

// V1 Stage 2 proof: render the wordmark + the collection names straight from
// site.config to show the typed config resolves. The real landing + wall land
// in V2.
export default function Home() {
  return (
    <main>
      <h1>{wordmark}</h1>
      <ul>
        {collections.map((c) => (
          <li key={c.essay}>{c.name}</li>
        ))}
      </ul>
    </main>
  );
}
