export const CATALOG_TEMPLATES = [
  {
    key: "free",
    name: "Free",
    description: "Starter plan for small catalogs and first-time sellers.",
    emoji: "🆓",
    price: 0,
    priceLabel: "₹0",
    features: [
      "Up to 10 products",
      "Public catalog link",
      "WhatsApp order button"
    ],
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
    key: "basic",
    name: "Basic",
    description: "For growing sellers who need more products and simple branding.",
    emoji: "📦",
    price: 50,
    priceLabel: "₹50",
    features: [
      "Up to 50 products",
      "PDF catalog download",
      "Razorpay checkout"
    ],
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
    key: "standard",
    name: "Standard",
    description: "Balanced plan for established businesses with richer catalog workflows.",
    emoji: "⭐",
    price: 100,
    priceLabel: "₹100",
    features: [
      "Up to 200 products",
      "Priority template styling",
      "Payment record tracking"
    ],
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
    key: "pro",
    name: "Pro",
    description: "Full catalog power for high-volume sellers and advanced storefronts.",
    emoji: "🚀",
    price: 200,
    priceLabel: "₹200",
    features: [
      "Up to 1000 products",
      "Advanced premium theme",
      "Priority support"
    ],
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
  }
];

export const DEFAULT_TEMPLATE_KEY = "free";

const LEGACY_TEMPLATE_MAP = {
  "modern-minimalist": "free",
  "bold-vibrant": "basic",
  professional: "standard",
  "elegant-luxury": "pro",
  "tech-gadgets": "standard",
  "organic-natural": "basic"
};

const PLAN_TO_DB_TEMPLATE_MAP = {
  free: "modern-minimalist",
  basic: "bold-vibrant",
  standard: "professional",
  pro: "elegant-luxury"
};

export function getTemplateByKey(templateKey) {
  const normalizedKey = LEGACY_TEMPLATE_MAP[templateKey] || templateKey;
  return (
    CATALOG_TEMPLATES.find((template) => template.key === normalizedKey) ||
    CATALOG_TEMPLATES.find((template) => template.key === DEFAULT_TEMPLATE_KEY) ||
    CATALOG_TEMPLATES[0]
  );
}

export function getPersistedTemplateKey(templateKey) {
  return PLAN_TO_DB_TEMPLATE_MAP[templateKey] || templateKey || DEFAULT_TEMPLATE_KEY;
}
