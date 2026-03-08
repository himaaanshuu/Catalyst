export default function robots() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/Authentication"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
