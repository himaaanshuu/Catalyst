export const CATALOG_TEMPLATES = [
  {
    key: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean and elegant design for fashion, jewelry, and lifestyle products.",
    emoji: "🎨",
    color: "#e5281e",
    previewImage: "/template-previews/modern-minimalist.svg",
    theme: {
      primary: "#e5281e",
      text: "#f5f3ef",
      muted: "rgba(245,243,239,0.45)",
      bg: "#060608",
      card: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.08)",
      whatsapp: "#25D366"
    }
  },
  {
    key: "bold-vibrant",
    name: "Bold & Vibrant",
    description: "Eye-catching layouts ideal for food, restaurants, and creative businesses.",
    emoji: "🍕",
    color: "#ff6b35",
    previewImage: "/template-previews/bold-vibrant.svg",
    theme: {
      primary: "#ff6b35",
      text: "#fff7ef",
      muted: "rgba(255,247,239,0.5)",
      bg: "#0f0a08",
      card: "rgba(255,255,255,0.05)",
      border: "rgba(255,255,255,0.09)",
      whatsapp: "#25D366"
    }
  },
  {
    key: "professional",
    name: "Professional",
    description: "Corporate-friendly design for services, consulting, and B2B catalogs.",
    emoji: "💼",
    color: "#4ecdc4",
    previewImage: "/template-previews/professional.svg",
    theme: {
      primary: "#4ecdc4",
      text: "#eef8f7",
      muted: "rgba(238,248,247,0.48)",
      bg: "#061011",
      card: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.1)",
      whatsapp: "#25D366"
    }
  },
  {
    key: "elegant-luxury",
    name: "Elegant Luxury",
    description: "Premium aesthetic for high-end products and boutique catalogs.",
    emoji: "💎",
    color: "#d4af37",
    previewImage: "/template-previews/elegant-luxury.svg",
    theme: {
      primary: "#d4af37",
      text: "#f9f2dc",
      muted: "rgba(249,242,220,0.48)",
      bg: "#100d06",
      card: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.1)",
      whatsapp: "#25D366"
    }
  },
  {
    key: "tech-gadgets",
    name: "Tech & Gadgets",
    description: "Modern design language for electronics, devices, and digital products.",
    emoji: "📱",
    color: "#667eea",
    previewImage: "/template-previews/tech-gadgets.svg",
    theme: {
      primary: "#667eea",
      text: "#edf0ff",
      muted: "rgba(237,240,255,0.48)",
      bg: "#080b14",
      card: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.1)",
      whatsapp: "#25D366"
    }
  },
  {
    key: "organic-natural",
    name: "Organic & Natural",
    description: "Earthy template for organic products, wellness, and eco brands.",
    emoji: "🌿",
    color: "#68d391",
    previewImage: "/template-previews/organic-natural.svg",
    theme: {
      primary: "#68d391",
      text: "#ecfff3",
      muted: "rgba(236,255,243,0.5)",
      bg: "#08110a",
      card: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.1)",
      whatsapp: "#25D366"
    }
  }
];

export const DEFAULT_TEMPLATE_KEY = "modern-minimalist";

export function getTemplateByKey(templateKey) {
  return (
    CATALOG_TEMPLATES.find((template) => template.key === templateKey) ||
    CATALOG_TEMPLATES.find((template) => template.key === DEFAULT_TEMPLATE_KEY) ||
    CATALOG_TEMPLATES[0]
  );
}
