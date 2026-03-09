"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/Library/Supabase";
import { useParams } from "next/navigation";
import Link from "next/link";

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

    .pdf-export .export-hide { display: none !important; }
    .pdf-export .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .pdf-export * { transition: none !important; animation: none !important; }

    @media (max-width: 900px) {
      .pdf-export .product-grid { grid-template-columns: 1fr !important; }
    }

    .checkout-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 4, 12, 0.72);
      backdrop-filter: blur(8px);
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .checkout-modal {
      width: min(520px, 100%);
      border-radius: 18px;
      background: #0f1118;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
      overflow: hidden;
    }

    .checkout-modal input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 12px 14px;
      color: var(--white);
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      outline: none;
    }

    .checkout-modal input:focus {
      border-color: rgba(18,109,235,0.65);
      background: rgba(18,109,235,0.10);
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   PRODUCT CARD FOR CUSTOMERS
───────────────────────────────────────────── */
function ProductCard({ product, businessName, whatsappNumber, onPayNow, isPdfMode, isPaying }) {
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
          className="export-hide"
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

        {!isPdfMode && (
          <button
            onClick={() => onPayNow(product)}
            className="export-hide"
            disabled={isPaying}
            style={{
              width: "100%",
              background: isPaying ? "rgba(18,109,235,0.28)" : "rgba(18,109,235,0.18)",
              color: "#8fc2ff",
              border: "1px solid rgba(18,109,235,0.35)",
              borderRadius: 10,
              padding: "12px 20px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: isPaying ? "not-allowed" : "pointer",
              fontFamily: "'Outfit', sans-serif",
              transition: "background 0.2s, transform 0.15s",
              marginTop: 10,
              opacity: isPaying ? 0.9 : 1
            }}
            onMouseEnter={e => {
              if (!isPaying) {
                e.currentTarget.style.background = "rgba(18,109,235,0.28)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={e => {
              if (!isPaying) {
                e.currentTarget.style.background = "rgba(18,109,235,0.18)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {isPaying ? "Opening Razorpay..." : "Pay with Razorpay"}
          </button>
        )}
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
  const catalogRef = useRef(null);

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [isPayingProductId, setIsPayingProductId] = useState(null);
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", phone: "" });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-checkout-script")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadCatalog = useCallback(async () => {
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
  }, [businessSlug]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

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

  const downloadCatalogPdf = async () => {
    if (!catalogRef.current) return;

    setIsPdfMode(true);
    await new Promise(resolve => setTimeout(resolve, 250));
    setIsGeneratingPdf(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ]);

      const canvas = await html2canvas(catalogRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#060608",
        windowWidth: document.documentElement.scrollWidth,
        scrollY: -window.scrollY
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pdfWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      let remainingHeight = imageHeight;
      let position = 0;

      pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight, undefined, "FAST");
      remainingHeight -= pdfHeight;

      while (remainingHeight > 0) {
        position = remainingHeight - imageHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight, undefined, "FAST");
        remainingHeight -= pdfHeight;
      }

      const fileSlug = business?.slug || businessSlug || "catalog";
      pdf.save(`${fileSlug}-catalog.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
      setIsPdfMode(false);
    }
  };

  const openCheckoutModal = (product) => {
    setSelectedProduct(product);
    setCheckoutForm({
      name: "",
      email: "",
      phone: business?.phone || ""
    });
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => {
    if (isPayingProductId) return;
    setIsCheckoutModalOpen(false);
    setSelectedProduct(null);
  };

  const startRazorpayPayment = async () => {
    try {
      if (!selectedProduct) return;

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady) {
        alert("Unable to load Razorpay checkout. Please try again.");
        return;
      }

      const customerName = checkoutForm.name.trim();
      if (!customerName) {
        alert("Please enter your name.");
        return;
      }

      const email = checkoutForm.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const phone = checkoutForm.phone.trim();
      if (!phone) {
        alert("Please enter your phone number.");
        return;
      }

      setIsPayingProductId(selectedProduct.id);
      setCheckoutStatus(null);

      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price
          },
          business: {
            id: business.id,
            slug: business.slug,
            name: business.business_name
          },
          customer: {
            name: customerName,
            email,
            phone
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Could not start Razorpay checkout.");
      }

      const razorpayOptions = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: business.business_name,
        description: selectedProduct.name,
        order_id: data.order.id,
        prefill: {
          name: data.customer.name,
          email: data.customer.email,
          contact: data.customer.contact
        },
        theme: {
          color: "#e5281e"
        },
        handler: async (paymentResponse) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...paymentResponse,
              metadata: {
                businessId: business.id,
                businessSlug: business.slug,
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                amount: selectedProduct.price,
                currency: "INR",
                customerName,
                customerEmail: email,
                customerPhone: phone
              }
            })
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.verified) {
            throw new Error(verifyData?.error || "Payment verification failed.");
          }

          setCheckoutStatus({
            type: "success",
            message: `Payment successful. Payment ID: ${verifyData.paymentId}`
          });
          setIsCheckoutModalOpen(false);
          setSelectedProduct(null);
        },
        modal: {
          ondismiss: () => {
            setCheckoutStatus({
              type: "failed",
              message: "Payment cancelled by user."
            });
          }
        }
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.on("payment.failed", (event) => {
        const reason = event?.error?.description || "Payment failed.";
        setCheckoutStatus({ type: "failed", message: reason });
      });

      razorpay.open();
    } catch (err) {
      console.error("Razorpay checkout error:", err);
      setCheckoutStatus({ type: "failed", message: err.message || "Unable to start payment right now." });
      alert(err.message || "Unable to start payment right now.");
    } finally {
      setIsPayingProductId(null);
    }
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
            <Link
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
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div
        ref={catalogRef}
        className={`page-enter ${isPdfMode ? "pdf-export" : ""}`}
        style={{
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
            <div className="export-hide" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
              <button
                onClick={downloadCatalogPdf}
                disabled={isGeneratingPdf}
                style={{
                  background: isGeneratingPdf ? "rgba(100,150,255,0.2)" : "rgba(100,150,255,0.12)",
                  border: "1px solid rgba(100,150,255,0.25)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  color: "#8cb0ff",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: isGeneratingPdf ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "background 0.2s, opacity 0.2s",
                  opacity: isGeneratingPdf ? 0.85 : 1
                }}
                onMouseEnter={e => {
                  if (!isGeneratingPdf) e.currentTarget.style.background = "rgba(100,150,255,0.2)";
                }}
                onMouseLeave={e => {
                  if (!isGeneratingPdf) e.currentTarget.style.background = "rgba(100,150,255,0.12)";
                }}
              >
                {isGeneratingPdf ? "⏳ Generating PDF..." : "📄 Download PDF"}
              </button>
            </div>

            {checkoutStatus && (
              <div
                className="export-hide"
                style={{
                  marginTop: 18,
                  background: checkoutStatus.type === "success" ? "rgba(37,211,102,0.14)" : "rgba(229,40,30,0.14)",
                  border: checkoutStatus.type === "success" ? "1px solid rgba(37,211,102,0.3)" : "1px solid rgba(229,40,30,0.35)",
                  color: checkoutStatus.type === "success" ? "#67f09f" : "#ff8d87",
                  borderRadius: 10,
                  padding: "10px 14px",
                  maxWidth: 680,
                  fontSize: "0.9rem"
                }}
              >
                {checkoutStatus.message}
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
          {/* Search Bar */}
          {products.length > 0 && (
            <div className="export-hide" style={{ marginBottom: 32 }}>
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
            <div className="product-grid" style={{
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
                  onPayNow={openCheckoutModal}
                  isPdfMode={isPdfMode}
                  isPaying={isPayingProductId === product.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="export-hide" style={{
          textAlign: "center",
          padding: "40px 24px",
          borderTop: "1px solid var(--border)",
          color: "var(--muted)",
          fontSize: "0.85rem"
        }}>
          <p>
            Powered by{" "}
            <Link
              href="/"
              style={{
                color: "var(--red)",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Catalyst
            </Link>
          </p>
        </footer>
      </div>

      {isCheckoutModalOpen && selectedProduct && (
        <div className="checkout-overlay export-hide" onClick={closeCheckoutModal}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", marginBottom: 6 }}>
                Checkout with Razorpay
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
                {selectedProduct.name} • ₹{selectedProduct.price}
              </p>
            </div>

            <div style={{ padding: 20, display: "grid", gap: 12 }}>
              <input
                type="text"
                placeholder="Full name"
                value={checkoutForm.name}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                disabled={!!isPayingProductId}
              />
              <input
                type="email"
                placeholder="Email address"
                value={checkoutForm.email}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                disabled={!!isPayingProductId}
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={checkoutForm.phone}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!!isPayingProductId}
              />
            </div>

            <div style={{
              padding: "16px 20px",
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              borderTop: "1px solid rgba(255,255,255,0.08)"
            }}>
              <button
                onClick={closeCheckoutModal}
                disabled={!!isPayingProductId}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 10,
                  color: "var(--white)",
                  padding: "10px 14px",
                  cursor: !!isPayingProductId ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Cancel
              </button>
              <button
                onClick={startRazorpayPayment}
                disabled={!!isPayingProductId}
                style={{
                  background: "rgba(18,109,235,0.24)",
                  border: "1px solid rgba(18,109,235,0.44)",
                  borderRadius: 10,
                  color: "#9cc9ff",
                  padding: "10px 14px",
                  cursor: !!isPayingProductId ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600
                }}
              >
                {isPayingProductId ? "Starting checkout..." : "Continue to Razorpay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
