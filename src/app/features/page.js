"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/Component/Navbar";

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
    }

    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 48px;
      background: rgba(6,6,8,0.82);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }

    .grid-bg {
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .feature-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 18px; padding: 32px 28px;
      transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s;
    }
    .feature-card:hover {
      transform: translateY(-6px);
      border-color: rgba(229,40,30,0.35);
      box-shadow: 0 16px 48px rgba(229,40,30,0.12);
    }

    @keyframes glowPulse {
      0%,100% { box-shadow: 0 0 20px var(--red-glow); }
      50%      { box-shadow: 0 0 40px rgba(229,40,30,0.55); }
    }

    @media(max-width:768px){
      .navbar { padding: 14px 20px; }
      .nav-links { display: none !important; }
    }
  `}</style>
);

export default function FeaturesPage() {
  const router = useRouter();

  const features = [
    {
      icon: "⚡",
      title: "Instant Deployment",
      description: "Create your product catalog and go live in minutes. No technical knowledge required."
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Your catalog looks perfect on any device. Built responsive from the ground up."
    },
    {
      icon: "💬",
      title: "WhatsApp Integration",
      description: "Customers can order directly via WhatsApp with pre-filled messages for each product."
    },
    {
      icon: "🎨",
      title: "Beautiful Templates",
      description: "Choose from professionally designed templates that make your products shine."
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Track views, clicks, and orders. Understand what your customers love."
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime. Your business is always accessible."
    },
    {
      icon: "🌐",
      title: "Custom Domains",
      description: "Connect your own domain name for a professional branded experience."
    },
    {
      icon: "🚀",
      title: "SEO Optimized",
      description: "Built-in SEO features help customers find your products on search engines."
    },
    {
      icon: "🔄",
      title: "Real-time Updates",
      description: "Update products, prices, or images instantly. Changes go live immediately."
    }
  ];

  return (
    <>
      <GlobalStyles />
      <Navbar />
      
      <div style={{
        minHeight: "100vh",
        paddingTop: 100,
        position: "relative"
      }}>
        {/* Background */}
        <div className="grid-bg" style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          pointerEvents: "none"
        }} />

        {/* Content */}
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 80px",
          position: "relative",
          zIndex: 1
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 16,
              background: "linear-gradient(135deg, #f5f3ef 0%, rgba(245,243,239,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Powerful Features for Your Business
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "var(--muted)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6
            }}>
              Everything you need to create stunning product catalogs and grow your business online.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24
          }}>
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div style={{
                  fontSize: "2.5rem",
                  marginBottom: 16
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: 12,
                  color: "var(--white)"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: "0.95rem",
                  color: "var(--muted)",
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            textAlign: "center",
            marginTop: 80
          }}>
            <button
              onClick={() => router.push("/Authentication/signup")}
              style={{
                background: "var(--red)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "18px 40px",
                fontSize: "1.1rem",
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                cursor: "pointer",
                animation: "glowPulse 3s ease-in-out infinite",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "#c9211a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "var(--red)";
              }}
            >
              Start Building Your Catalog
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
