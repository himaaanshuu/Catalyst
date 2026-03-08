import { getSiteUrl } from "../Library/siteUrl";

const siteUrl = getSiteUrl();

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
