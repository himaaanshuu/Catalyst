const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default function sitemap() {
  const routes = [
    "",
    "/features",
    "/templates",
    "/Authentication/login",
    "/Authentication/signup",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
