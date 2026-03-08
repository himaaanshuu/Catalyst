import { supabase } from "@/Library/Supabase";

export default async function sitemap() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");

  const staticRoutes = ["", "/templates", "/features"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path ? 0.7 : 1.0
  }));

  const { data } = await supabase.from("businesses").select("slug, updated_at");

  const catalogRoutes = (data || [])
    .filter((b) => b.slug)
    .map((b) => ({
      url: `${siteUrl}/catalog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: "daily",
      priority: 0.8
    }));

  return [...staticRoutes, ...catalogRoutes];
}
