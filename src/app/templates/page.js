"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/Component/Navbar";
import { CATALOG_TEMPLATES } from "@/Library/catalogTemplates";

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

    .template-card {
      background: var(--card);
      border: 1px solid var(--border);
      borderRadius: 16px;
      overflow: hidden;
      transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s;
      cursor: pointer;
    }
    .template-card:hover {
      transform: translateY(-8px);
      border-color: rgba(229,40,30,0.4);
      box-shadow: 0 20px 48px rgba(229,40,30,0.15);
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

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = (templateKey) => {
    window.localStorage.setItem("selectedCatalogTemplate", templateKey);
    router.push("/dashboard/business?start=register");
  };

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
              Beautiful Templates
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "var(--muted)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6
            }}>
              Choose from professionally designed templates. Customize colors, layouts, and branding to match your business.
            </p>
          </div>

          {/* Templates Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32
          }}>
            {CATALOG_TEMPLATES.map((template) => (
              <div key={template.key} className="template-card">
                {/* Preview */}
                <div style={{
                  height: 240,
                  background: `linear-gradient(135deg, ${template.color}15 0%, ${template.color}05 100%)`,
                  position: "relative",
                  borderBottom: "1px solid var(--border)"
                }}>
                  <img
                    src={template.previewImage}
                    alt={`${template.name} template preview`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(6,6,8,0.72)",
                    border: "1px solid var(--border)",
                    color: "var(--white)",
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: "0.78rem",
                    fontWeight: 600
                  }}>
                    {template.emoji}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "24px" }}>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "var(--white)"
                  }}>
                    {template.name}
                  </h3>
                  <p style={{
                    fontSize: "0.95rem",
                    color: "var(--muted)",
                    lineHeight: 1.6,
                    marginBottom: 20
                  }}>
                    {template.description}
                  </p>

                  {/* Badge */}
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "rgba(229,40,30,0.1)",
                    border: "1px solid rgba(229,40,30,0.25)",
                    borderRadius: 6,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--red)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      background: "var(--red)",
                      borderRadius: "50%"
                    }} />
                    Available
                  </div>

                  <button
                    onClick={() => handleUseTemplate(template.key)}
                    style={{
                      marginTop: 16,
                      width: "100%",
                      background: "var(--red)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Outfit', sans-serif"
                    }}
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Note */}
          <div style={{
            textAlign: "center",
            marginTop: 60,
            padding: "32px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 16
          }}>
            <p style={{
              fontSize: "1rem",
              color: "var(--muted)",
              marginBottom: 8
            }}>
              More templates coming soon! Each template is fully customizable.
            </p>
            <p style={{
              fontSize: "0.85rem",
              color: "var(--muted)"
            }}>
              Can't find what you're looking for? <span style={{ color: "var(--red)", cursor: "pointer" }}>Request a custom template</span>
            </p>
          </div>

          {/* CTA */}
          <div style={{
            textAlign: "center",
            marginTop: 60
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
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
