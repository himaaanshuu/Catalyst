import "./globals.css";

export const metadata = {
  title: "Catalyst - Product Catalog Platform",
  description: "Create beautiful product catalogs with WhatsApp ordering integration. Perfect for small businesses and entrepreneurs.",
  keywords: "catalog, products, whatsapp, business, ecommerce, small business",
  authors: [{ name: "Himanshu" }],
  openGraph: {
    title: "Catalyst - Product Catalog Platform",
    description: "Create beautiful product catalogs with WhatsApp ordering integration",
    type: "website",
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
