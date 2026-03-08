import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Catalyst - Product Catalog Platform",
  description: "Create beautiful product catalogs with WhatsApp ordering integration. Perfect for small businesses and entrepreneurs.",
  keywords: "catalog, products, whatsapp, business, ecommerce, small business",
  authors: [{ name: "Himanshu" }],
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "Catalyst - Product Catalog Platform",
    description: "Create beautiful product catalogs with WhatsApp ordering integration",
    type: "website",
    url: siteUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
