import { getSiteUrl } from "../Library/siteUrl";

const siteUrl = getSiteUrl();

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
