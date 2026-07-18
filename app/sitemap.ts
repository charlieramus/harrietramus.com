import type { MetadataRoute } from "next";
import { SITE_URL, collections } from "@/site.config";

// Emit /sitemap.xml as a static file under `output: export`.
export const dynamic = "force-static";

// The static routes + one entry per collection essay, driven by the config so new
// collections are picked up automatically. `next build` emits /sitemap.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/photos`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];

  const essays: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/journal/${c.essay}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...routes, ...essays];
}
