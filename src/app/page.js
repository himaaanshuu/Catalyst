"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/Component/Navbar";
import { CATALOG_TEMPLATES } from "@/Library/catalogTemplates";

const GlobalStyles = () => (
  <style>{`
    :root {
      --red: #e5281e;
      --white: #f5f3ef;
      --muted: rgba(245,243,239,0.5);
      --bg: #060608;
      --card: rgba(255,255,255,0.04);
      --border: rgba(255,255,255,0.1);
    }

    .home-grid-bg {
      background-image:
        linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
      background-size: 54px 54px;
    }

    .plan-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    }

    .plan-card:hover {
      transform: translateY(-4px);
      border-color: rgba(229,40,30,0.45);
      box-shadow: 0 18px 40px rgba(229,40,30,0.12);
    }

    .plan-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.68);
      backdrop-filter: blur(8px);
      z-index: 1200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .plan-popup {
      width: min(880px, 100%);
      max-height: 90vh;
      overflow: auto;
      border-radius: 20px;
      background: #0d0f13;
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 26px 70px rgba(0,0,0,0.5);
      padding: 22px;
    }
  `}</style>
);

export default function Home() {
  const router = useRouter();
  const [showPlanPopup, setShowPlanPopup] = useState(true);

  const plans = useMemo(() => CATALOG_TEMPLATES, []);

  const selectPlan = (planKey) => {
    window.localStorage.setItem("selectedCatalogTemplate", planKey);
    router.push("/dashboard/business?start=register");
  };

  return (
    <>
      <GlobalStyles />
      <Navbar />

      <main
        className="home-grid-bg"
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--white)",
          paddingTop: 100
        }}
      >
        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 800, marginBottom: 16, lineHeight: 1.05 }}>
            Build your catalog,
            <span style={{ color: "var(--red)" }}> pick your plan</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: 700, lineHeight: 1.6, marginBottom: 26 }}>
            Launch with Free, or unlock more product limits and premium capabilities with Basic, Standard, and Pro.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setShowPlanPopup(true)}
              style={{
                background: "var(--red)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 18px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Select Plan
            </button>
            <button
              onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "12px 18px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              View Pricing
            </button>
          </div>
        </section>

        <section id="pricing-section" style={{ maxWidth: 1120, margin: "0 auto", padding: "10px 24px 90px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 8 }}>Pricing</h2>
          <p style={{ color: "var(--muted)", marginBottom: 18 }}>Choose the plan that fits your catalog size and growth stage.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {plans.map((plan) => (
              <article key={plan.key} className="plan-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{plan.emoji} {plan.name}</span>
                  <span style={{ color: plan.color, fontWeight: 800, fontSize: "1.2rem" }}>{plan.priceLabel}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: 12 }}>{plan.description}</p>
                <ul style={{ listStyle: "none", display: "grid", gap: 7, padding: 0, marginBottom: 16 }}>
                  {plan.features?.map((feature) => (
                    <li key={feature} style={{ fontSize: "0.87rem", color: "var(--muted)" }}>• {feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => selectPlan(plan.key)}
                  style={{
                    width: "100%",
                    background: "rgba(229,40,30,0.18)",
                    border: "1px solid rgba(229,40,30,0.35)",
                    color: "#ffb3ae",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Choose {plan.name}
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      {showPlanPopup && (
        <div className="plan-popup-overlay" onClick={() => setShowPlanPopup(false)}>
          <div className="plan-popup" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: "1.4rem", margin: 0 }}>Choose a Catalog Plan</h3>
              <button
                onClick={() => setShowPlanPopup(false)}
                style={{ background: "transparent", color: "var(--white)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {plans.map((plan) => (
                <div key={plan.key} className="plan-card" style={{ padding: 16 }}>
                  <div style={{ marginBottom: 6, fontWeight: 700 }}>{plan.emoji} {plan.name}</div>
                  <div style={{ marginBottom: 8, fontWeight: 800, color: plan.color }}>{plan.priceLabel}</div>
                  <button
                    onClick={() => selectPlan(plan.key)}
                    style={{
                      width: "100%",
                      background: "var(--red)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}