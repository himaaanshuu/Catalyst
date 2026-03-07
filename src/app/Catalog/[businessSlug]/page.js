"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/Library/Supabase";
import { useParams } from "next/navigation";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --red: #e5281e;
      --red-glow: rgba(229,40,30,0.35);
      --red-soft: rgba(229,40,30,0.12);
      --white: #f5f3ef;
      --muted: rgba(245,243,239,0.45);
      --bg: #060608;
      --card: rgba(255,255,255,0.04);
      --border: rgba(255,255,255,0.08);
    }

    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--white);
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0a0a0d; }
    ::-webkit-scrollbar-thumb { background: var(--red); border-radius: 2px; }

    .page-enter { animation: pageIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    @keyframes pageIn {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes glowPulse {
      0%,100% { box-shadow: 0 0 20px var(--red-glow); }
      50%      { box-shadow: 0 0 40px rgba(229,40,30,0.55); }
    }

    .grid-bg {
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   PRODUCT CARD FOR CUSTOMERS
───────────────────────────────────────────── */
function ProductCard({ product, businessName, whatsappNumber }) {
  const handleOrder = () => {
    if (!whatsappNumber) {
      alert("WhatsApp number not available for this business.");
      return;
    }

    const message = `Hi! I'd like to order:\n\n*${product.name}*${product.price ? `\nPrice: ₹${product.price}` : ''}${product.description ? `\n\n${product.description}` : ''}\n\nFrom: ${businessName}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      overflow: "hidden",
      transition: "transform 0.3s, box-shadow 0.3s"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
    >
      {/* Product Image */}
      {product.image_url ? (
        <div style={{
          width: "100%",
          height: 200,
          background: `url(${product.image_url}) center/cover`,
          backgroundColor: "rgba(255,255,255,0.05)"
        }} />
      ) : (
        <div style={{
          width: "100%",
          height: 200,
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem"
        }}>
          📦
        </div>
      )}

      {/* Product Info */}
      <div style={{ padding: 20 }}>
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 8,
          color: "var(--white)"
        }}>
          {product.name}
        </h3>

        {product.description && (
          <p style={{
            color: "var(--muted)",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            marginBottom: 16,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {product.description}
          </p>
        )}

        {/* Price */}
        {product.price && (
          <div style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--red)",
            marginBottom: 16,
            fontFamily: "'Syne', sans-serif"
          }}>
            ₹{product.price}
          </div>
        )}

        {/* WhatsApp Order Button */}
        <button
          onClick={handleOrder}
          style={{
            width: "100%",
            background: "#25D366",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 20px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "background 0.2s, transform 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#1da851";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#25D366";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Order on WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CATALOG PAGE
───────────────────────────────────────────── */
export default function CatalogPage() {
  const params = useParams();
  const businessSlug = params.businessSlug;

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCatalog();
  }, [businessSlug]);

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch business by slug
      const { data: businessData, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", businessSlug)
        .single();

      if (businessError) throw businessError;
      if (!businessData) throw new Error("Business not found");

      setBusiness(businessData);

      // Fetch products for this business
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", businessData.id)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (err) {
      console.error("Error loading catalog:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Catalog link copied to clipboard!");
  };

  const shareOnWhatsApp = () => {
    const message = `Check out ${business.business_name} catalog!`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(message + "\n" + url)}`, '_blank');
  };

  if (loading) {
    return (
      <>
        <GlobalStyles />
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16, animation: "glowPulse 2s infinite" }}>⚡</div>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>Loading catalog...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !business) {
    return (
      <>
        <GlobalStyles />
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: 20
        }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{ fontSize: "4rem", marginBottom: 24 }}>😕</div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2rem",
              marginBottom: 12
            }}>
              Catalog Not Found
            </h1>
            <p style={{ color: "var(--muted)", marginBottom: 32 }}>
              {error || "The catalog you're looking for doesn't exist."}
            </p>
            <a
              href="/"
              style={{
                display: "inline-block",
                background: "var(--red)",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 600,
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#c9211a"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--red)"}
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="page-enter" style={{
        minHeight: "100vh",
        background: "var(--bg)",
        paddingBottom: 60
      }}>
        {/* Header Section */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid var(--border)",
          padding: "60px 24px 40px"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Business Logo/Initial */}
            <div style={{
              width: 80,
              height: 80,
              background: "var(--red-soft)",
              border: "2px solid rgba(229,40,30,0.3)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "2rem",
              color: "var(--red)",
              marginBottom: 20
            }}>
              {business.business_name?.charAt(0)?.toUpperCase() || "B"}
            </div>

            {/* Business Name */}
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              marginBottom: 12,
              letterSpacing: "-0.02em"
            }}>
              {business.business_name}
            </h1>

            {/* Business Description */}
            {business.description && (
              <p style={{
                color: "var(--muted)",
                fontSize: "1.1rem",
                lineHeight: 1.6,
                marginBottom: 20,
                maxWidth: 700
              }}>
                {business.description}
              </p>
            )}

            {/* Contact Info */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(100,150,255,0.12)",
                    color: "#7ea5ff",
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid rgba(100,150,255,0.2)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(100,150,255,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(100,150,255,0.12)"}
                >
                  📞 {business.phone}
                </a>
              )}
              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(37,211,102,0.12)",
                    color: "#4de88b",
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid rgba(37,211,102,0.2)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(37,211,102,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(37,211,102,0.12)"}
                >
                  💬 WhatsApp
                </a>
              )}
            </div>

            {/* Share Buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={copyLink}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  color: "var(--white)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                🔗 Copy Link
              </button>
              <button
                onClick={shareOnWhatsApp}
                style={{
                  background: "rgba(37,211,102,0.12)",
                  border: "1px solid rgba(37,211,102,0.2)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  color: "#4de88b",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(37,211,102,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(37,211,102,0.12)"}
              >
                📤 Share
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
          {/* Search Bar */}
          {products.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: 400,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: "0.95rem",
                  color: "var(--white)",
                  fontFamily: "'Outfit', sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s, background 0.2s"
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "var(--red)";
                  e.currentTarget.style.background = "rgba(229,40,30,0.06)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
              />
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed var(--border)",
              borderRadius: 16
            }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>
                {searchQuery ? "🔍" : "📦"}
              </div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.5rem",
                marginBottom: 8
              }}>
                {searchQuery ? "No products found" : "No products yet"}
              </h3>
              <p style={{ color: "var(--muted)" }}>
                {searchQuery
                  ? "Try searching with different keywords"
                  : "This catalog doesn't have any products yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24
            }}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  businessName={business.business_name}
                  whatsappNumber={business.whatsapp}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: "center",
          padding: "40px 24px",
          borderTop: "1px solid var(--border)",
          color: "var(--muted)",
          fontSize: "0.85rem"
        }}>
          <p>
            Powered by{" "}
            <a
              href="/"
              style={{
                color: "var(--red)",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Catalyst
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
