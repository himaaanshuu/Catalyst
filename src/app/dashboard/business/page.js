"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { supabase } from "@/Library/Supabase";
import Navbar from "@/app/Component/Navbar";
import {
  CATALOG_TEMPLATES,
  DEFAULT_TEMPLATE_KEY,
  getPersistedTemplateKey,
  getTemplateByKey
} from "@/Library/catalogTemplates";

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
    body, #root {
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

    .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    @keyframes glowPulse {
      0%,100% { box-shadow: 0 0 20px var(--red-glow); }
      50%      { box-shadow: 0 0 40px rgba(229,40,30,0.55); }
    }
    @keyframes floatOrb {
      0%,100% { transform: translateY(0) scale(1); }
      50%      { transform: translateY(-30px) scale(1.06); }
    }
    @keyframes floatOrbSlow {
      0%,100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-20px) rotate(8deg); }
    }
    @keyframes wordPop {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
    @keyframes dotPop {
      0%,100% { transform: scale(1); box-shadow: 0 0 6px var(--red); }
      50%      { transform: scale(1.5); box-shadow: 0 0 16px var(--red); }
    }
    @keyframes catalogBuild {
      0%   { opacity:0; transform:scale(0.9) translateY(10px); }
      100% { opacity:1; transform:scale(1) translateY(0); }
    }

    .grid-bg {
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .d1{transition-delay:0.05s} .d2{transition-delay:0.12s}
    .d3{transition-delay:0.19s} .d4{transition-delay:0.26s}

    /* ── Ticker marquee ── */
    .ticker-wrap { overflow: hidden; width: 100%; position: relative; }
    .ticker-track {
      display: flex; width: max-content;
      animation: tickerScroll 30s linear infinite;
    }
    .ticker-wrap:hover .ticker-track { animation-play-state: paused; }
    @keyframes tickerScroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    /* ── Inputs ── */
    .c-input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 16px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      color: var(--white);
      outline: none;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    }
    .c-input::placeholder { color: rgba(245,243,239,0.25); }
    .c-input:focus {
      border-color: var(--red);
      background: rgba(229,40,30,0.06);
      box-shadow: 0 0 0 3px rgba(229,40,30,0.12);
    }
    textarea.c-input { resize: vertical; min-height: 100px; line-height: 1.6; }

    /* ── Buttons ── */
    .c-btn-red {
      background: var(--red); color: #fff; border: none;
      border-radius: 10px; padding: 14px 28px;
      font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
      animation: glowPulse 3s ease-in-out infinite;
      position: relative; overflow: hidden;
    }
    .c-btn-red:hover { transform: translateY(-2px); background: #c9211a; }
    .c-btn-red:active { transform: scale(0.98); }
    .c-btn-red::after {
      content:''; position:absolute; inset:0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
      pointer-events:none;
    }
    .c-btn-ghost {
      background: transparent; color: var(--white);
      border: 1px solid var(--border); border-radius: 10px;
      padding: 13px 28px;
      font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 500;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s, transform 0.15s;
    }
    .c-btn-ghost:hover {
      border-color: rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.06);
      transform: translateY(-1px);
    }

    /* ── Feature cards ── */
    .feature-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 18px; padding: 32px 28px;
      transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s;
      position: relative; overflow: hidden;
    }
    .feature-card::before {
      content:''; position:absolute; top:-60px; right:-60px;
      width:140px; height:140px;
      background: radial-gradient(circle, var(--red-glow) 0%, transparent 70%);
      opacity: 0; transition: opacity 0.4s; pointer-events:none;
    }
    .feature-card:hover {
      transform: translateY(-6px) scale(1.01);
      border-color: rgba(229,40,30,0.35);
      box-shadow: 0 16px 48px rgba(229,40,30,0.12), 0 4px 16px rgba(0,0,0,0.4);
    }
    .feature-card:hover::before { opacity: 1; }

    /* ── Product cards ── */
    .product-card {
      background: rgba(255,255,255,0.04); border: 1px solid var(--border);
      border-radius: 14px; overflow: hidden;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.5); }
    .wa-btn {
      background: #25D366; color: #fff; border:none; border-radius: 8px;
      padding: 9px 14px; font-size: 0.78rem; font-weight: 600;
      cursor: pointer; width: 100%;
      font-family: 'Outfit', sans-serif; transition: background 0.2s;
    }
    .wa-btn:hover { background: #1da851; }

    /* ── Navbar ── */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 48px;
      background: rgba(6,6,8,0.82);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      transition: padding 0.3s;
    }
    @media(max-width:768px){
      .navbar { padding: 14px 20px; }
      .nav-links { display: none !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function tr(lang, enText, hiText) {
  return lang === "hi" ? hiText : enText;
}

/* ─────────────────────────────────────────────
   BRAND WORDMARK
───────────────────────────────────────────── */
function BrandMark({ scale = 1 }) {
  const base = 1.5 * scale;
  return (
    <span style={{
      fontFamily: "'Syne', sans-serif",
      fontWeight: 800,
      fontSize: `${base}rem`,
      letterSpacing: "-0.02em",
      color: "#f5f3ef"
    }}>Catalyst</span>
  );
}

/* ─────────────────────────────────────────────
   TICKER BAR — animated professional tagline
───────────────────────────────────────────── */
const tickerItems = [
  "Product Catalogs", "WhatsApp Integration", "Instant Deploy",
  "No Code Required", "Mobile Optimized", "SEO Ready",
  "Custom Domains", "Real-time Updates", "Analytics Built-in",
  "Multi-language Support", "Zero Downtime", "Team Collaboration"
];

function TickerBar() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div style={{
      width: "100%",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(229,40,30,0.03)",
      padding: "11px 0",
      position: "relative", overflow: "hidden"
    }}>
      {/* Fade masks */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 100,
        background: "linear-gradient(to right, var(--bg), transparent)",
        zIndex: 2, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 100,
        background: "linear-gradient(to left, var(--bg), transparent)",
        zIndex: 2, pointerEvents: "none"
      }} />

      <div className="ticker-wrap">
        <div className="ticker-track">
          {doubled.map((item, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 18,
              paddingRight: 36,
              fontSize: "0.72rem", fontWeight: 500,
              letterSpacing: "0.13em", textTransform: "uppercase",
              color: i % 4 === 0 ? "rgba(229,40,30,0.9)" : "rgba(245,243,239,0.28)",
              whiteSpace: "nowrap"
            }}>
              <span style={{
                display: "inline-block", width: 3, height: 3,
                background: i % 4 === 0 ? "var(--red)" : "rgba(255,255,255,0.15)",
                borderRadius: "50%"
              }} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO BACKGROUND
───────────────────────────────────────────── */
function HeroBG() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.55 }} />
      <div style={{
        position: "absolute", top: "8%", left: "12%", width: 520, height: 520,
        background: "radial-gradient(circle, rgba(229,40,30,0.18) 0%, transparent 65%)",
        borderRadius: "50%", animation: "floatOrb 8s ease-in-out infinite", filter: "blur(40px)"
      }} />
      <div style={{
        position: "absolute", bottom: "5%", right: "8%", width: 380, height: 380,
        background: "radial-gradient(circle, rgba(229,40,30,0.10) 0%, transparent 65%)",
        borderRadius: "50%", animation: "floatOrbSlow 11s ease-in-out infinite", filter: "blur(60px)"
      }} />
      <div style={{
        position: "absolute", top: "42%", right: "22%", width: 200, height: 200,
        background: "radial-gradient(circle, rgba(229,40,30,0.07) 0%, transparent 70%)",
        borderRadius: "50%", animation: "floatOrb 14s ease-in-out infinite reverse", filter: "blur(30px)"
      }} />
      {[18, 52, 82].map((pct, i) => (
        <div key={i} style={{
          position: "absolute", top: `${pct}%`, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg, transparent 0%, rgba(229,40,30,${0.06 + i * 0.02}) 40%, rgba(229,40,30,${0.06 + i * 0.02}) 60%, transparent 100%)`
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(6,6,8,0.75) 100%)"
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection({ onNavigate, lang }) {
  const [activeWord, setActiveWord] = useState(null);
  const words = lang === "hi" ? ["बनाएं.", "बढ़ाएं.", "सफल हों."] : ["Build.", "Scale.", "Succeed."];

  const handleWordClick = (word) => {
    setActiveWord(word);
    setTimeout(() => onNavigate("register"), 600);
  };

  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden"
    }}>
      <HeroBG />

      <div style={{
        position: "relative", zIndex: 2, textAlign: "center",
        maxWidth: 880, padding: "120px 24px 80px",
        width: "100%"
      }}>
        {/* Beta badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(229,40,30,0.12)",
          border: "1px solid rgba(229,40,30,0.25)",
          borderRadius: 100, padding: "6px 16px",
          fontSize: "0.75rem", fontWeight: 600,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "#e5281e", marginBottom: 32
        }}>
          <span style={{ width: 6, height: 6, background: "#e5281e", borderRadius: "50%", animation: "glowPulse 2s infinite" }} />
          {tr(lang, "Now in Beta", "बीटा में उपलब्ध")}
        </div>

        {/* Headline — clickable words */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
          fontWeight: 800, lineHeight: 0.95,
          letterSpacing: "-0.04em", marginBottom: 32,
          display: "flex", flexWrap: "wrap",
          justifyContent: "center", gap: "0.2em"
        }}>
          {words.map((w) => (
            <span key={w} onClick={() => handleWordClick(w)}
              style={{
                display: "inline-block",
                color: activeWord === w ? "var(--red)" : "var(--white)",
                cursor: "pointer",
                transition: "color 0.3s ease, text-shadow 0.3s ease",
                textShadow: activeWord === w ? "0 0 40px rgba(229,40,30,0.6)" : "none",
                animation: activeWord === w ? "wordPop 0.4s ease" : "none",
                userSelect: "none"
              }}
              onMouseEnter={e => {
                if (activeWord !== w) {
                  e.target.style.color = "rgba(229,40,30,0.7)";
                  e.target.style.textShadow = "0 0 30px rgba(229,40,30,0.3)";
                }
              }}
              onMouseLeave={e => {
                if (activeWord !== w) {
                  e.target.style.color = "var(--white)";
                  e.target.style.textShadow = "none";
                }
              }}
            >{w}</span>
          ))}
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          fontWeight: 300, lineHeight: 1.7, color: "var(--muted)",
          maxWidth: 520, margin: "0 auto 48px", letterSpacing: "0.01em"
        }}>
          {tr(lang, "Create a professional product catalog for your business", "अपने व्यवसाय के लिए प्रोफेशनल प्रोडक्ट कैटलॉग बनाएं")}<br />
          {tr(lang, "in seconds. No code. No design skills needed.", "कुछ सेकंड में। बिना कोड। बिना डिजाइन स्किल्स।")}
        </p>

        {/* Single primary CTA — See Demo removed */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="c-btn-red"
            style={{ fontSize: "1rem", padding: "16px 40px" }}
            onClick={() => onNavigate("register")}
          >
            {tr(lang, "Create Your Catalyst", "अपना Catalyst बनाएं")} →
          </button>
        </div>

        {/* Social proof */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 44 }}>
          <div style={{ display: "flex" }}>
            {["#e5281e","#c9211a","#a01a14","#7a1410"].map((c, i) => (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: "50%",
                background: `linear-gradient(135deg, ${c} 0%, #1a1a1a 100%)`,
                border: "2px solid var(--bg)", marginLeft: i > 0 ? -8 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.6rem", fontWeight: 700, color: "#fff"
              }}>{["JK","AM","SR","PL"][i]}</div>
            ))}
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            {tr(lang, "Trusted by", "दुनिया भर में भरोसा किया गया")} <strong style={{ color: "var(--white)" }}>12,000+</strong> {tr(lang, "businesses worldwide", "व्यवसायों द्वारा")}
          </span>
        </div>
      </div>

      {/* ── Animated ticker bar at bottom of hero ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3 }}>
        <TickerBar />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURES — How to Generate section
───────────────────────────────────────────── */
function FeaturesSection({ onNavigate, lang }) {
  const ref = useReveal();
  const features = [
    { icon: "⬆", title: tr(lang, "Add Your Products", "अपने प्रोडक्ट जोड़ें"), desc: tr(lang, "Upload products, descriptions and high-res images in seconds. Drag, drop, done.", "कुछ सेकंड में प्रोडक्ट, विवरण और इमेज अपलोड करें।"), tag: tr(lang, "Upload", "अपलोड") },
    { icon: "◈", title: tr(lang, "Choose Catalog Style", "कैटलॉग स्टाइल चुनें"), desc: tr(lang, "Select from 20+ modern, conversion-optimized catalog templates built for your industry.", "अपने उद्योग के लिए आधुनिक टेम्पलेट चुनें।"), tag: tr(lang, "Design", "डिज़ाइन") },
    { icon: "⚡", title: tr(lang, "Generate Your Catalog", "अपना कैटलॉग जनरेट करें"), desc: tr(lang, "Instantly create a shareable, SEO-ready catalog website — live in under 60 seconds.", "60 सेकंड से कम समय में शेयर करने योग्य कैटलॉग वेबसाइट बनाएं।"), tag: tr(lang, "Deploy", "डिप्लॉय") }
  ];

  return (
    <section id="how-it-works" style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Section header + CTA at top */}
      <div className="reveal d1" ref={ref} style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{
          display: "inline-block", fontSize: "0.72rem", letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--red)", fontWeight: 600, marginBottom: 14
        }}>{tr(lang, "How It Works", "यह कैसे काम करता है")}</div>

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          fontWeight: 800, letterSpacing: "-0.03em",
          color: "var(--white)", lineHeight: 1.1, marginBottom: 28
        }}>
          {tr(lang, "Three steps to your", "आपके लिए 3 आसान कदम")}<br />
          <span style={{ color: "var(--red)" }}>{tr(lang, "perfect catalog.", "परफेक्ट कैटलॉग।")}</span>
        </h2>

        {/* Generate button — at the TOP of the section as requested */}
        <button
          className="c-btn-red"
          style={{ fontSize: "0.95rem", padding: "13px 32px" }}
          onClick={() => onNavigate("register")}
        >
          ⚡ {tr(lang, "Generate Your Catalog Now", "अभी कैटलॉग बनाएं")}
        </button>
      </div>

      {/* Feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag, index }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`feature-card reveal d${index + 1}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{
          width: 48, height: 48, background: "var(--red-soft)",
          border: "1px solid rgba(229,40,30,0.25)", borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem"
        }}>{icon}</div>
        <span style={{
          fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--red)", fontWeight: 600, background: "var(--red-soft)",
          border: "1px solid rgba(229,40,30,0.2)", padding: "4px 10px", borderRadius: 100
        }}>{tag}</span>
      </div>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700,
        color: "var(--white)", marginBottom: 10, letterSpacing: "-0.02em"
      }}>{title}</div>
      <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
      <div style={{ marginTop: 28, height: 1, background: "linear-gradient(90deg, var(--red) 0%, transparent 100%)", opacity: 0.3 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT PREVIEW SECTION
───────────────────────────────────────────── */
const mockProducts = [
  { name: "Velocity Chair", price: "$349", emoji: "🪑", cat: "Furniture" },
  { name: "Lens Pro X", price: "$899", emoji: "📷", cat: "Electronics" },
  { name: "Nomad Backpack", price: "$189", emoji: "🎒", cat: "Accessories" },
  { name: "Alpine Watch", price: "$599", emoji: "⌚", cat: "Watches" },
  { name: "Studio Desk", price: "$729", emoji: "🖥", cat: "Furniture" },
  { name: "Signal Earbuds", price: "$249", emoji: "🎧", cat: "Electronics" },
];
const prodBgs = ["#1a0a0a","#0a0a1a","#0a1a0a","#1a1a0a","#1a0a0f","#0a1a1a"];

function ProductCard({ name, price, emoji, cat, idx }) {
  return (
    <div className="product-card">
      <div style={{
        height: 160,
        background: `radial-gradient(circle at 50% 60%, ${prodBgs[idx % prodBgs.length]} 0%, #0d0d10 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "3.5rem", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4))" }} />
        <span style={{ position: "relative", zIndex: 1 }}>{emoji}</span>
        <span style={{
          position: "absolute", top: 10, right: 10,
          fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
          background: "rgba(0,0,0,0.6)", color: "var(--muted)",
          padding: "3px 8px", borderRadius: 100, border: "1px solid var(--border)"
        }}>{cat}</span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>{name}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--red)", marginBottom: 12 }}>{price}</div>
        <button className="wa-btn">💬 Inquire on WhatsApp</button>
      </div>
    </div>
  );
}

function PreviewSection({ lang }) {
  const ref = useReveal();
  return (
    <section style={{ padding: "80px 48px 100px", background: "linear-gradient(to bottom, transparent, rgba(229,40,30,0.04), transparent)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" ref={ref} style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-block", fontSize: "0.72rem", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--red)", fontWeight: 600, marginBottom: 16
          }}>{tr(lang, "Live Preview", "लाइव प्रीव्यू")}</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1
          }}>
            {tr(lang, "What your catalog", "आपका कैटलॉग")}<br /><span style={{ color: "var(--red)" }}>{tr(lang, "will look like.", "कैसा दिखेगा।")}</span>
          </h2>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(229,40,30,0.1)"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.04)", padding: "12px 20px",
            display: "flex", alignItems: "center", gap: 12,
            borderBottom: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", gap: 7 }}>
              {["#ff5f57","#ffbd2e","#28c840"].map((c, i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.8 }} />
              ))}
            </div>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
              borderRadius: 7, padding: "5px 12px", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "monospace"
            }}>
              catalyst.app/store/<span style={{ color: "var(--red)" }}>your-business</span>
            </div>
          </div>
          <div style={{ padding: "28px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 }}>
              {mockProducts.map((p, i) => (
                <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                  <ProductCard {...p} idx={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer({ lang }) {
  return (
    <footer style={{
      borderTop: "1px solid transparent",
      borderImage: "linear-gradient(90deg, transparent 0%, var(--red) 50%, transparent 100%) 1",
      padding: "40px 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 20,
      background: "rgba(6,6,8,0.98)"
    }}>
      <BrandMark />
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        {[tr(lang, "About", "हमारे बारे में"), tr(lang, "Privacy", "प्राइवेसी"), tr(lang, "Contact", "संपर्क"), "Twitter", "GitHub"].map(l => (
          <button key={l} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--muted)", fontSize: "0.82rem",
            fontFamily: "'Outfit', sans-serif", transition: "color 0.2s"
          }}
          onMouseEnter={e => e.target.style.color = "var(--white)"}
          onMouseLeave={e => e.target.style.color = "var(--muted)"}
          >{l}</button>
        ))}
      </div>
      <div style={{ fontSize: "0.72rem", color: "rgba(245,243,239,0.2)" }}>
        © {new Date().getFullYear()} Catalyst. {tr(lang, "All rights reserved.", "सर्वाधिकार सुरक्षित।")}
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────── */
function LandingPage({ onNavigate, lang }) {
  return (
    <div className="page-enter">
      <HeroSection onNavigate={onNavigate} lang={lang} />
      <FeaturesSection onNavigate={onNavigate} lang={lang} />
      <PreviewSection lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   CATALOG CREATION ANIMATION
───────────────────────────────────────────── */
function CatalogCreating({ businessName, onDone, lang }) {
  const [step, setStep] = useState(0);
  const steps = useMemo(() => [
    tr(lang, "Initializing workspace...", "वर्कस्पेस तैयार हो रहा है..."), tr(lang, "Processing business profile...", "बिजनेस प्रोफाइल प्रोसेस हो रही है..."),
    tr(lang, "Selecting optimal template...", "सबसे अच्छा टेम्पलेट चुना जा रहा है..."), tr(lang, "Generating product pages...", "प्रोडक्ट पेज बनाए जा रहे हैं..."),
    tr(lang, "Deploying to Catalyst CDN...", "Catalyst CDN पर डिप्लॉय हो रहा है..."), tr(lang, "Your catalog is live!", "आपका कैटलॉग लाइव है!") + " 🎉"
  ], [lang]);

  useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 700);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onDone, 1200);
      return () => clearTimeout(t);
    }
  }, [onDone, step, steps.length]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 40, textAlign: "center", background: "var(--bg)",
      position: "relative", overflow: "hidden"
    }}>
      <HeroBG />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 500, width: "100%" }}>
        <div style={{
          width: 80, height: 80, margin: "0 auto 32px",
          background: "var(--red-soft)", border: "2px solid rgba(229,40,30,0.4)",
          borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem",
          animation: step < steps.length - 1 ? "floatOrb 2s ease-in-out infinite" : "catalogBuild 0.4s ease"
        }}>
          {step < steps.length - 1 ? "⚡" : "✅"}
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
          {step < steps.length - 1 ? tr(lang, "Building Your Catalog", "आपका कैटलॉग बनाया जा रहा है") : tr(lang, "Catalog is Live!", "कैटलॉग लाइव है!")}
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 40, fontSize: "0.9rem" }}>{businessName || tr(lang, "Your Business", "आपका व्यवसाय")}</p>
        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 100, height: 6, overflow: "hidden", marginBottom: 24 }}>
          <div style={{
            height: "100%", width: `${((step + 1) / steps.length) * 100}%`,
            background: "linear-gradient(90deg, #e5281e, #ff6b5a)", borderRadius: 100,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 0 12px rgba(229,40,30,0.6)"
          }} />
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--muted)", minHeight: 24 }}>{steps[step]}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i <= step ? 20 : 6, height: 6, borderRadius: 100,
              background: i <= step ? "var(--red)" : "rgba(255,255,255,0.1)",
              transition: "width 0.3s, background 0.3s"
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function getCatalogPath(slug) {
  const safeSlug = String(slug || "").trim() || "my-business";
  return `/catalog/${safeSlug}`;
}

function getBaseSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const raw = process.env.NEXT_PUBLIC_SITE_URL.trim();
    if (raw) {
      const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      return normalized.replace(/\/$/, "");
    }
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

function getCatalogUrl(slug) {
  const base = getBaseSiteUrl();
  const path = getCatalogPath(slug);
  return base ? `${base}${path}` : path;
}

/* ─────────────────────────────────────────────
   SUCCESS PAGE
───────────────────────────────────────────── */
function SuccessPage({ businessName, catalogSlug, onNavigate, lang }) {
  const normalizedSlug = (catalogSlug || (businessName || "my-business").toLowerCase().replace(/\s+/g, "-")).trim() || "my-business";
  const catalogPath = getCatalogPath(normalizedSlug);
  const catalogUrl = getCatalogUrl(normalizedSlug);

  return (
    <div className="page-enter" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 40, textAlign: "center", position: "relative", overflow: "hidden"
    }}>
      <HeroBG />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 560 }}>
        <div style={{
          width: 96, height: 96, margin: "0 auto 32px",
          background: "rgba(40,200,80,0.12)", border: "2px solid rgba(40,200,80,0.3)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem"
        }}>✅</div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
          {tr(lang, "You're", "आप") } <span style={{ color: "var(--red)" }}>{tr(lang, "live!", "लाइव हैं!")}</span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 40 }}>
          <strong style={{ color: "var(--white)" }}>{businessName || tr(lang, "Your business", "आपका व्यवसाय")}</strong> {tr(lang, "catalog has been created and deployed.", "का कैटलॉग बनकर डिप्लॉय हो गया है।")}
        </p>
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "16px 20px",
          display: "flex", alignItems: "center", gap: 12, marginBottom: 32, textAlign: "left"
        }}>
          <span style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>URL</span>
          <a
            href={catalogPath}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              fontSize: "0.88rem",
              fontFamily: "monospace",
              color: "var(--white)",
              textDecoration: "none"
            }}
          >
            <span style={{ color: "var(--red)" }}>{catalogUrl}</span>
          </a>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(catalogUrl);
                alert("Catalog URL copied to clipboard");
              } catch {
                alert(`Copy failed. URL: ${catalogUrl}`);
              }
            }}
            style={{
            background: "var(--red-soft)", border: "1px solid rgba(229,40,30,0.3)",
            borderRadius: 7, padding: "6px 12px", color: "var(--red)",
            fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif"
          }}
          >{tr(lang, "Copy", "कॉपी")}</button>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={catalogPath}
            target="_blank"
            rel="noopener noreferrer"
            className="c-btn-red"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            {tr(lang, "Open Catalog", "कैटलॉग खोलें")}
          </a>
          <button className="c-btn-red" onClick={() => onNavigate("dashboard")}>{tr(lang, "View Dashboard", "डैशबोर्ड देखें")}</button>
          <button className="c-btn-ghost" onClick={() => onNavigate("register")}>{tr(lang, "Create Another", "एक और बनाएं")}</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BUSINESS DASHBOARD - Manage all businesses
───────────────────────────────────────────── */
function BusinessDashboard({ onNavigate, lang }) {
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [editModal, setEditModal] = useState(null); // { type: 'business'|'product', data: {...} }
  const [productModal, setProductModal] = useState(null); // businessId for adding products
  const [selectedBusiness, setSelectedBusiness] = useState(null); // for viewing products

  async function loadBusinesses(userId) {
    setLoading(true);
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading businesses:", error);
    } else {
      setBusinesses(data || []);
    }
    setLoading(false);
  }

  // Check auth and load data
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/Authentication/login";
        return;
      }
      setCurrentUser(session.user);
      await loadBusinesses(session.user.id);
    };
    init();
  }, []);

  const loadProducts = async (businessId) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error loading products:", error);
    } else {
      setProducts(data || []);
    }
  };

  const deleteBusiness = async (id) => {
    if (!confirm("Are you sure you want to delete this business? All products will also be deleted.")) return;
    
    const { error } = await supabase.from("businesses").delete().eq("id", id);
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      setBusinesses(businesses.filter(b => b.id !== id));
      if (selectedBusiness === id) setSelectedBusiness(null);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const viewProducts = async (businessId) => {
    setSelectedBusiness(businessId);
    await loadProducts(businessId);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: 16 }}>⚡</div>
          <p style={{ color: "var(--muted)" }}>{tr(lang, "Loading your businesses...", "आपके व्यवसाय लोड हो रहे हैं...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.5rem", fontWeight: 800, marginBottom: 8 }}>
            {tr(lang, "My", "मेरे")} <span style={{ color: "var(--red)" }}>{tr(lang, "Businesses", "व्यवसाय")}</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem" }}>
            {tr(lang, "Manage your catalogs, products, and settings", "अपने कैटलॉग, प्रोडक्ट और सेटिंग्स मैनेज करें")}
          </p>
        </div>

        {/* Action Bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <button className="c-btn-red" onClick={() => onNavigate("register")}>
            + {tr(lang, "Create New Business", "नया व्यवसाय बनाएं")}
          </button>
          {selectedBusiness && (
            <>
              <button className="c-btn-ghost" onClick={() => setProductModal(selectedBusiness)}>
                + {tr(lang, "Add Product", "प्रोडक्ट जोड़ें")}
              </button>
              <button className="c-btn-ghost" onClick={() => setSelectedBusiness(null)}>
                ← {tr(lang, "Back to Businesses", "व्यवसायों पर वापस")}
              </button>
            </>
          )}
        </div>

        {/* Business List or Product List */}
        {!selectedBusiness ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {businesses.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 24px",
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed var(--border)",
                borderRadius: 16
              }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>📦</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", marginBottom: 8 }}>No businesses yet</h3>
                <p style={{ color: "var(--muted)", marginBottom: 24 }}>Create your first catalog to get started</p>
                <button className="c-btn-red" onClick={() => onNavigate("register")}>Create Business</button>
              </div>
            ) : (
              businesses.map(business => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  lang={lang}
                  onEdit={() => setEditModal({ type: 'business', data: business })}
                  onDelete={() => deleteBusiness(business.id)}
                  onViewProducts={() => viewProducts(business.id)}
                />
              ))
            )}
          </div>
        ) : (
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", marginBottom: 24 }}>
              Products for <span style={{ color: "var(--red)" }}>{businesses.find(b => b.id === selectedBusiness)?.business_name}</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {products.length === 0 ? (
                <div style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "60px 24px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px dashed var(--border)",
                  borderRadius: 16
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🛍️</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", marginBottom: 8 }}>No products yet</h3>
                  <p style={{ color: "var(--muted)", marginBottom: 24 }}>Add your first product to this catalog</p>
                  <button className="c-btn-red" onClick={() => setProductModal(selectedBusiness)}>Add Product</button>
                </div>
              ) : (
                products.map(product => (
                  <ProductCardDashboard
                    key={product.id}
                    product={product}
                    lang={lang}
                    onEdit={() => setEditModal({ type: 'product', data: product })}
                    onDelete={() => deleteProduct(product.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modals */}
      {editModal && (
        <EditModal
          data={editModal}
          lang={lang}
          onClose={() => setEditModal(null)}
          onSave={async (updated) => {
            if (editModal.type === 'business') {
              const { error } = await supabase
                .from("businesses")
                .update(updated)
                .eq("id", editModal.data.id);
              
              if (error) {
                alert("Failed to update: " + error.message);
              } else {
                setBusinesses(businesses.map(b => b.id === editModal.data.id ? { ...b, ...updated } : b));
                setEditModal(null);
              }
            } else {
              const { error } = await supabase
                .from("products")
                .update(updated)
                .eq("id", editModal.data.id);
              
              if (error) {
                alert("Failed to update: " + error.message);
              } else {
                setProducts(products.map(p => p.id === editModal.data.id ? { ...p, ...updated } : p));
                setEditModal(null);
              }
            }
          }}
        />
      )}

      {/* Add Product Modal */}
      {productModal && (
        <AddProductModal
          businessId={productModal}
          lang={lang}
          onClose={() => setProductModal(null)}
          onAdd={async (productData) => {
            const { data, error } = await supabase
              .from("products")
              .insert([{ ...productData, business_id: productModal }])
              .select();
            
            if (error) {
              alert("Failed to add product: " + error.message);
            } else {
              setProducts([...products, data[0]]);
              setProductModal(null);
            }
          }}
        />
      )}
    </div>
  );
}

/* ── Business Card Component ── */
function BusinessCard({ business, onEdit, onDelete, onViewProducts, lang }) {
  const activeTemplate = getTemplateByKey(business.template_key);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 24,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 48,
          height: 48,
          background: "var(--red-soft)",
          border: "2px solid rgba(229,40,30,0.3)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "var(--red)"
        }}>
          {business.business_name?.charAt(0)?.toUpperCase() || "B"}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 2 }}>
            {business.business_name}
          </h3>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            {new Date(business.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p style={{
        color: "var(--muted)",
        fontSize: "0.9rem",
        lineHeight: 1.6,
        marginBottom: 16,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }}>
        {business.description}
      </p>

      <div style={{ marginBottom: 16 }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 10px",
          borderRadius: 100,
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 600,
          background: "var(--red-soft)",
          border: "1px solid rgba(229,40,30,0.25)",
          color: "var(--red)"
        }}>
          <span>{activeTemplate.emoji}</span>
          {activeTemplate.name}
        </span>
      </div>

      {(business.phone || business.whatsapp) && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {business.phone && (
            <span style={{
              fontSize: "0.75rem",
              background: "rgba(100,150,255,0.12)",
              color: "#7ea5ff",
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid rgba(100,150,255,0.2)"
            }}>
              📞 {business.phone}
            </span>
          )}
          {business.whatsapp && (
            <span style={{
              fontSize: "0.75rem",
              background: "rgba(37,211,102,0.12)",
              color: "#4de88b",
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid rgba(37,211,102,0.2)"
            }}>
              💬 {business.whatsapp}
            </span>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          onClick={onViewProducts}
          style={{
            flex: 1,
            background: "var(--red)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#c9211a"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--red)"}
        >
          {tr(lang, "Manage Products", "प्रोडक्ट मैनेज करें")}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!business.slug) {
              alert(tr(lang, "This business does not have a public catalog slug yet. Please edit and save the business once.", "इस व्यवसाय का पब्लिक कैटलॉग स्लग अभी नहीं है। कृपया एक बार एडिट करके सेव करें।"));
              return;
            }
            window.open(getCatalogUrl(business.slug), '_blank', 'noopener,noreferrer');
          }}
          style={{
            background: "rgba(37,211,102,0.12)",
            color: "#4de88b",
            border: "1px solid rgba(37,211,102,0.2)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(37,211,102,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(37,211,102,0.12)";
          }}
          title={tr(lang, "View public catalog", "पब्लिक कैटलॉग देखें")}
        >
          🌐
        </button>
      </div>
      
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          style={{
            flex: 1,
            background: "rgba(100,150,255,0.12)",
            color: "#7ea5ff",
            border: "1px solid rgba(100,150,255,0.2)",
            borderRadius: 8,
            padding: "10px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(100,150,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(100,150,255,0.12)"}
        >
          ✏️ {tr(lang, "Edit", "एडिट")}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{
            flex: 1,
            background: "rgba(255,80,80,0.12)",
            color: "#ff6b6b",
            border: "1px solid rgba(255,80,80,0.2)",
            borderRadius: 8,
            padding: "10px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,80,80,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,80,80,0.12)"}
        >
          🗑️ {tr(lang, "Delete", "डिलीट")}
        </button>
      </div>
    </div>
  );
}

/* ── Product Card for Dashboard ── */
function ProductCardDashboard({ product, onEdit, onDelete, lang }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      overflow: "hidden",
      transition: "transform 0.2s"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      {product.image_url && (
        <div style={{
          width: "100%",
          height: 180,
          background: `url(${product.image_url}) center/cover`,
          backgroundColor: "rgba(255,255,255,0.05)"
        }} />
      )}
      <div style={{ padding: 16 }}>
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
          {product.name}
        </h4>
        {product.description && (
          <p style={{
            color: "var(--muted)",
            fontSize: "0.85rem",
            lineHeight: 1.5,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {product.description}
          </p>
        )}
        {product.price && (
          <div style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "var(--red)",
            marginBottom: 12,
            fontFamily: "'Syne', sans-serif"
          }}>
            ₹{product.price}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1,
              background: "rgba(100,150,255,0.12)",
              color: "#7ea5ff",
              border: "1px solid rgba(100,150,255,0.2)",
              borderRadius: 8,
              padding: "8px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            {tr(lang, "Edit", "एडिट")}
          </button>
          <button
            onClick={onDelete}
            style={{
              flex: 1,
              background: "rgba(255,80,80,0.12)",
              color: "#ff6b6b",
              border: "1px solid rgba(255,80,80,0.2)",
              borderRadius: 8,
              padding: "8px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            {tr(lang, "Delete", "डिलीट")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Modal ── */
function EditModal({ data, onClose, onSave, lang }) {
  const [form, setForm] = useState(
    data.type === 'business'
      ? {
          business_name: data.data.business_name || '',
          description: data.data.description || '',
          phone: data.data.phone || '',
          whatsapp: data.data.whatsapp || '',
          template_key: data.data.template_key || DEFAULT_TEMPLATE_KEY
        }
      : {
          name: data.data.name || '',
          description: data.data.description || '',
          price: data.data.price || '',
          image_url: data.data.image_url || ''
        }
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }} onClick={onClose}>
      <div style={{
        background: "rgba(20,20,25,0.95)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: 32,
        maxWidth: 500,
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto"
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", marginBottom: 24 }}>
          {tr(lang, "Edit", "एडिट")} {data.type === 'business' ? tr(lang, 'Business', 'व्यवसाय') : tr(lang, 'Product', 'प्रोडक्ट')}
        </h2>

        {data.type === 'business' ? (
          <>
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Business Name", "व्यवसाय का नाम")}</span>
              <input
                className="c-input"
                value={form.business_name}
                onChange={e => set('business_name', e.target.value)}
              />
            </label>
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Description", "विवरण")}</span>
              <textarea
                className="c-input"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
              />
            </label>
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Phone", "फोन")}</span>
              <input
                className="c-input"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder={tr(lang, "Optional", "वैकल्पिक")}
              />
            </label>
            <label style={{ display: "block", marginBottom: 24 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>WhatsApp</span>
              <input
                className="c-input"
                value={form.whatsapp}
                onChange={e => set('whatsapp', e.target.value)}
                placeholder={tr(lang, "Optional", "वैकल्पिक")}
              />
            </label>

            <label style={{ display: "block", marginBottom: 24 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Catalog Plan", "कैटलॉग प्लान")}</span>
              <select
                className="c-input"
                value={form.template_key}
                onChange={e => set('template_key', e.target.value)}
              >
                {CATALOG_TEMPLATES.map((template) => (
                  <option key={template.key} value={template.key}>
                    {template.emoji} {template.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Product Name", "प्रोडक्ट नाम")}</span>
              <input
                className="c-input"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </label>
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Description", "विवरण")}</span>
              <textarea
                className="c-input"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
              />
            </label>
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Price (₹)", "कीमत (₹)")}</span>
              <input
                className="c-input"
                type="number"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder={tr(lang, "Optional", "वैकल्पिक")}
              />
            </label>
            <label style={{ display: "block", marginBottom: 24 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Image URL", "इमेज URL")}</span>
              <input
                className="c-input"
                value={form.image_url}
                onChange={e => set('image_url', e.target.value)}
                placeholder={tr(lang, "Optional", "वैकल्पिक")}
              />
            </label>
          </>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button className="c-btn-red" onClick={() => onSave(form)} style={{ flex: 1 }}>
            {tr(lang, "Save Changes", "सेव करें")}
          </button>
          <button className="c-btn-ghost" onClick={onClose}>
            {tr(lang, "Cancel", "रद्द करें")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Add Product Modal ── */
function AddProductModal({ businessId, onClose, onAdd, lang }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }} onClick={onClose}>
      <div style={{
        background: "rgba(20,20,25,0.95)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: 32,
        maxWidth: 500,
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto"
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", marginBottom: 24 }}>
          {tr(lang, "Add New Product", "नया प्रोडक्ट जोड़ें")}
        </h2>

        <label style={{ display: "block", marginBottom: 16 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Product Name *", "प्रोडक्ट नाम *")}</span>
          <input
            className="c-input"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder={tr(lang, "Enter product name", "प्रोडक्ट नाम दर्ज करें")}
          />
        </label>
        <label style={{ display: "block", marginBottom: 16 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Description", "विवरण")}</span>
          <textarea
            className="c-input"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder={tr(lang, "Describe your product", "प्रोडक्ट का विवरण लिखें")}
            rows={3}
          />
        </label>
        <label style={{ display: "block", marginBottom: 16 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Price (₹)", "कीमत (₹)")}</span>
          <input
            className="c-input"
            type="number"
            value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="0.00"
          />
        </label>
        <label style={{ display: "block", marginBottom: 24 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 6, display: "block" }}>{tr(lang, "Image URL", "इमेज URL")}</span>
          <input
            className="c-input"
            value={form.image_url}
            onChange={e => set('image_url', e.target.value)}
            placeholder={tr(lang, "https://example.com/image.jpg", "https://example.com/image.jpg")}
          />
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="c-btn-red"
            onClick={() => {
              if (!form.name.trim()) {
                alert(tr(lang, "Product name is required", "प्रोडक्ट नाम आवश्यक है"));
                return;
              }
              onAdd(form);
            }}
            style={{ flex: 1 }}
          >
            {tr(lang, "Add Product", "प्रोडक्ट जोड़ें")}
          </button>
          <button className="c-btn-ghost" onClick={onClose}>
            {tr(lang, "Cancel", "रद्द करें")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REGISTER PAGE
───────────────────────────────────────────── */
function RegisterPage({ onNavigate, lang }) {
  const initialPlanState = (() => {
    let templateKey = DEFAULT_TEMPLATE_KEY;
    let locked = false;

    if (typeof window !== "undefined") {
      const fromTemplates = window.localStorage.getItem("selectedCatalogTemplate");
      if (fromTemplates) {
        templateKey = fromTemplates;
        locked = true;
        window.localStorage.removeItem("selectedCatalogTemplate");
      }
    }

    return { templateKey, locked };
  })();

  const [form, setForm] = useState(() => {
    return {
      businessName: "",
      description: "",
      phone: "",
      whatsapp: "",
      logo: null,
      templateKey: initialPlanState.templateKey
    };
  });
  const [isPlanLocked, setIsPlanLocked] = useState(initialPlanState.locked);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [page, setPage] = useState("form");
  const [createdSlug, setCreatedSlug] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existing = document.getElementById("razorpay-checkout-script");
      if (existing) {
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

  const processPlanPayment = async ({ plan, user, businessSlug }) => {
    if (!plan?.price || plan.price <= 0) return;

    const configRes = await fetch("/api/razorpay/create-order", { method: "GET" });
    const configData = await configRes.json();
    if (!configRes.ok || !configData?.enabled) {
      const missing = configData?.missing?.length ? configData.missing.join(", ") : "RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET";
      throw new Error(`Payment setup incomplete. Missing: ${missing}. Please configure these in deployment env vars.`);
    }

    const scriptReady = await loadRazorpayScript();
    if (!scriptReady) {
      throw new Error("Could not load Razorpay checkout script.");
    }

    const customerName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Catalog Owner";
    const customerEmail = user.email || "";
    const customerPhone = form.phone?.trim() || "";

    const orderRes = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: {
          id: plan.key,
          name: `${plan.name} Catalog Plan`,
          price: plan.price
        },
        business: {
          id: user.id,
          slug: businessSlug,
          name: form.businessName.trim()
        },
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone
        }
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      throw new Error(orderData?.error || "Unable to create Razorpay order.");
    }

    await new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Catalyst",
        description: `${plan.name} Plan`,
        order_id: orderData.order.id,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone
        },
        theme: {
          color: "#e5281e"
        },
        handler: async (paymentResponse) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...paymentResponse,
                metadata: {
                  businessId: user.id,
                  businessSlug,
                  productId: plan.key,
                  productName: `${plan.name} Catalog Plan`,
                  amount: plan.price,
                  currency: "INR",
                  customerName,
                  customerEmail,
                  customerPhone
                }
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.verified) {
              reject(new Error(verifyData?.error || "Payment verification failed."));
              return;
            }

            resolve(true);
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled."))
        }
      });

      razorpay.on("payment.failed", (event) => {
        reject(new Error(event?.error?.description || "Payment failed."));
      });

      razorpay.open();
    });
  };

  // Check if user is logged in when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        console.log("User is logged in:", session.user.email);
      } else {
        console.log("User is not logged in");
      }
    };
    checkAuth();
  }, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  // Generate URL-friendly slug from business name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/-+/g, '-')           // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    // Save to Supabase
    try {
      setIsSubmitting(true);
      setErrors({});

      // First check if there's a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setErrors({ businessName: "You must be logged in to create a business. Please sign up or log in first." });
        // Redirect to login
        setTimeout(() => window.location.href = "/Authentication/login", 2000);
        return;
      }

      // Get the user from the session
      const user = session.user;
      
      if (!user) {
        setErrors({ businessName: "Session found but user not available. Please log in again." });
        setTimeout(() => window.location.href = "/Authentication/login", 2000);
        return;
      }

      // Generate slug, pre-check uniqueness, then insert.
      // If a concurrent insert still creates a slug conflict (409/23505), we retry with a new slug.
      const baseSlug = generateSlug(form.businessName) || "business";
      const selectedPlan = getTemplateByKey(form.templateKey || DEFAULT_TEMPLATE_KEY);

      if ((selectedPlan?.price || 0) > 0) {
        await processPlanPayment({
          plan: selectedPlan,
          user,
          businessSlug: baseSlug
        });
      }

      const maxInsertAttempts = 6;
      let insertError = null;
      let insertedSlug = "";

      for (let attempt = 0; attempt < maxInsertAttempts; attempt++) {
        const candidateSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;

        const { data: existingBusiness, error: slugError } = await supabase
          .from("businesses")
          .select("id")
          .eq("slug", candidateSlug)
          .maybeSingle();

        if (slugError) throw slugError;
        if (existingBusiness) continue;

        const payload = {
          business_name: form.businessName.trim(),
          description: form.description.trim(),
          phone: form.phone?.trim() || null,
          whatsapp: form.whatsapp?.trim() || null,
          user_id: user.id,
          slug: candidateSlug,
          template_key: getPersistedTemplateKey(form.templateKey || DEFAULT_TEMPLATE_KEY)
        };

        let insertResult = await supabase.from("businesses").insert([payload]);
        insertError = insertResult.error;

        const insertMessage = (insertError?.message || "").toLowerCase();
        const missingTemplateKey =
          insertMessage.includes("template_key") &&
          (insertMessage.includes("column") || insertMessage.includes("schema") || insertMessage.includes("not found"));

        if (insertError && missingTemplateKey) {
          const { template_key, ...fallbackPayload } = payload;
          insertResult = await supabase.from("businesses").insert([fallbackPayload]);
          insertError = insertResult.error;
        }

        if (!insertError) {
          insertedSlug = candidateSlug;
          break;
        }

        const isSlugConflict =
          insertError.code === "23505" ||
          (insertError.message || "").toLowerCase().includes("duplicate key") ||
          (insertError.message || "").toLowerCase().includes("businesses_slug_unique");

        if (isSlugConflict) {
          continue;
        }

        break;
      }

      if (insertError) {
        console.error("Insert error:", insertError);

        const message = (insertError.message || "").toLowerCase();
        if (message.includes("row-level security") || message.includes("permission denied")) {
          setErrors({ businessName: "Failed to create business: database permission denied (RLS). Please update your Supabase policies for inserts on businesses." });
        } else if (insertError.code === "23505" || message.includes("businesses_slug_unique")) {
          setErrors({ businessName: "Failed to create business: slug already exists. Please try again with a slightly different business name." });
        } else if (message.includes("template_key")) {
          setErrors({ businessName: "Failed to create business: template key constraint mismatch. Run add_business_template_key.sql (or update allowed keys) and try again." });
        } else {
          setErrors({ businessName: `Failed to create business: ${insertError.message}` });
        }
        return;
      }

      setCreatedSlug(insertedSlug || baseSlug);

      // Success - proceed to creating page
      setPage("creating");
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrors({ businessName: err.message || "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogo = (e) => {
    const file = e.target.files[0]; if (!file) return;
    set("logo", file);
    const r = new FileReader();
    r.onload = ev => setLogoPreview(ev.target.result);
    r.readAsDataURL(file);
  };

  if (page === "creating") return <CatalogCreating businessName={form.businessName} onDone={() => setPage("success")} lang={lang} />;
  if (page === "success") return <SuccessPage businessName={form.businessName} catalogSlug={createdSlug} onNavigate={onNavigate} lang={lang} />;

  const selectedPlan = getTemplateByKey(form.templateKey || DEFAULT_TEMPLATE_KEY);

  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <HeroBG />
      <button onClick={() => onNavigate("landing")} style={{
        position: "absolute", top: 28, left: 40,
        background: "none", border: "none", cursor: "pointer",
        color: "var(--muted)", fontSize: "0.85rem",
        fontFamily: "'Outfit', sans-serif",
        display: "flex", alignItems: "center", gap: 6,
        zIndex: 10, transition: "color 0.2s"
      }}
      onMouseEnter={e => e.currentTarget.style.color = "var(--white)"}
      onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
      >← {tr(lang, "Back to Home", "होम पर वापस")}</button>

      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px" }}>
        <div style={{
          width: "100%", maxWidth: 560,
          background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
          borderRadius: 24, padding: "48px 40px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(229,40,30,0.06)"
        }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            {/* Logged in indicator */}
            {currentUser && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(40,200,80,0.12)", border: "1px solid rgba(40,200,80,0.25)",
                borderRadius: 100, padding: "5px 14px",
                fontSize: "0.7rem", letterSpacing: "0.08em",
                color: "#28c850", fontWeight: 600, marginBottom: 16
              }}>
                <span style={{ width: 5, height: 5, background: "#28c850", borderRadius: "50%" }} />
                {tr(lang, "Logged in as", "लॉगिन किया गया है")} {currentUser.email}
              </div>
            )}
            
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--red-soft)", border: "1px solid rgba(229,40,30,0.2)",
              borderRadius: 100, padding: "5px 14px",
              fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--red)", fontWeight: 600, marginBottom: 20
            }}>
              <span style={{ width: 5, height: 5, background: "var(--red)", borderRadius: "50%", animation: "glowPulse 2s infinite" }} />
              {tr(lang, "Free Forever · No Credit Card", "हमेशा फ्री · बिना क्रेडिट कार्ड")}
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1.1 }}>
              {tr(lang, "Create Your", "अपना")} <span style={{ color: "var(--red)" }}>Catalyst</span>
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{tr(lang, "Set up your business profile and go live in 60 seconds.", "अपना बिजनेस प्रोफाइल सेट करें और 60 सेकंड में लाइव हो जाएं।")}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { key: "businessName", label: tr(lang, "Business Name *", "व्यवसाय का नाम *"), ph: tr(lang, "e.g. Acme Electronics", "उदा. शर्मा इलेक्ट्रॉनिक्स"), type: "input" },
              { key: "description", label: tr(lang, "Business Description *", "व्यवसाय विवरण *"), ph: tr(lang, "Tell customers what you sell and what makes you unique...", "ग्राहकों को बताएं कि आप क्या बेचते हैं और क्या खास है..."), type: "textarea" }
            ].map(({ key, label, ph, type }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,243,239,0.5)", marginBottom: 8 }}>{label}</label>
                {type === "input"
                  ? <input className="c-input" placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} style={errors[key] ? { borderColor: "#e5281e" } : {}} />
                  : <textarea className="c-input" placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} style={errors[key] ? { borderColor: "#e5281e" } : {}} />
                }
                {errors[key] && <div style={{ color: "#ff6b5a", fontSize: "0.75rem", marginTop: 6 }}>⚠ {errors[key]}</div>}
              </div>
            ))}

            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(245,243,239,0.2)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />{tr(lang, "Optional", "वैकल्पिक")}<div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["phone", "Phone", "+1 555 000 000"], ["whatsapp", "WhatsApp", "+1 555 000 000"]].map(([k, l, ph]) => (
                <div key={k}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,243,239,0.35)", marginBottom: 8 }}>{l}</label>
                  <input className="c-input" placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)} />
                </div>
              ))}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,243,239,0.35)", marginBottom: 10 }}>{tr(lang, "Catalog Plan", "कैटलॉग प्लान")}</label>

              {isPlanLocked ? (
                <div style={{
                  border: "1px solid rgba(229,40,30,0.35)",
                  background: "rgba(229,40,30,0.09)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  marginBottom: 18
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700 }}>{selectedPlan.emoji} {selectedPlan.name}</div>
                    <div style={{ color: selectedPlan.color, fontWeight: 800 }}>{selectedPlan.priceLabel}</div>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{selectedPlan.description}</div>
                  <button
                    type="button"
                    onClick={() => setIsPlanLocked(false)}
                    style={{
                      marginTop: 10,
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--white)",
                      borderRadius: 8,
                      padding: "7px 10px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}
                  >
                    Change Plan
                  </button>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 10,
                  marginBottom: 18
                }}>
                  {CATALOG_TEMPLATES.map((template) => {
                    const isActive = form.templateKey === template.key;
                    return (
                      <button
                        key={template.key}
                        type="button"
                        onClick={() => set("templateKey", template.key)}
                        style={{
                          textAlign: "left",
                          background: isActive ? "rgba(229,40,30,0.16)" : "rgba(255,255,255,0.02)",
                          border: isActive ? "1px solid rgba(229,40,30,0.45)" : "1px solid var(--border)",
                          borderRadius: 10,
                          padding: "8px",
                          color: "var(--white)",
                          cursor: "pointer",
                          overflow: "hidden"
                        }}
                      >
                        <div style={{
                          width: "100%",
                          height: 74,
                          position: "relative",
                          borderRadius: 8,
                          overflow: "hidden",
                          marginBottom: 8,
                          border: "1px solid var(--border)",
                          background: "rgba(255,255,255,0.03)"
                        }}>
                          <Image
                            src={template.previewImage}
                            alt={`${template.name} preview`}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 160px"
                            style={{
                              objectFit: "cover",
                              display: "block"
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 4 }}>
                          {template.emoji} {template.name} • {template.priceLabel}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.4 }}>
                          {template.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,243,239,0.35)", marginBottom: 8 }}>{tr(lang, "Logo", "लोगो")}</label>
              <div onClick={() => fileRef.current?.click()} style={{
                border: "1px dashed rgba(229,40,30,0.25)", borderRadius: 12, padding: "20px",
                display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
                background: logoPreview ? "rgba(229,40,30,0.06)" : "rgba(255,255,255,0.02)",
                transition: "border-color 0.2s, background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(229,40,30,0.5)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(229,40,30,0.25)"}
              >
                {logoPreview
                  ? <img src={logoPreview} alt="logo" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                  : <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>🖼</div>
                }
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 500, marginBottom: 2 }}>{logoPreview ? tr(lang, "Logo selected", "लोगो चुना गया") : tr(lang, "Upload your logo", "अपना लोगो अपलोड करें")}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{logoPreview ? tr(lang, "Click to change", "बदलने के लिए क्लिक करें") : "PNG, JPG up to 5MB"}</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogo} />
              </div>
            </div>

            <button className="c-btn-red" disabled={isSubmitting} style={{ marginTop: 8, padding: "18px 24px", fontSize: "1rem", width: "100%", opacity: isSubmitting ? 0.8 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }} onClick={handleSubmit}>
              {isSubmitting ? tr(lang, "Processing...", "प्रोसेस हो रहा है...") : `${tr(lang, "Create Your Catalyst", "अपना Catalyst बनाएं")} 🚀`}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(245,243,239,0.25)" }}>
              {tr(lang, "By continuing you agree to Catalyst's Terms of Service and Privacy Policy.", "आगे बढ़कर आप Catalyst की सेवा शर्तों और प्राइवेसी पॉलिसी से सहमत होते हैं।")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("catalogLang") || "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("catalogLang", lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("start") === "register") return "register";
    }
    return "landing";
  });
  const [key, setKey] = useState(0);
  const navigate = (p) => { setKey(k => k + 1); setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); };
  return (
    <>
      <GlobalStyles />
      {page !== "register" && <Navbar onNavigate={navigate} lang={lang} onLangChange={setLang} />}
      <div key={key}>
        {page === "landing" && <LandingPage onNavigate={navigate} lang={lang} />}
        {page === "register" && <RegisterPage onNavigate={navigate} lang={lang} />}
        {page === "dashboard" && <BusinessDashboard onNavigate={navigate} lang={lang} />}
      </div>
    </>
  );
}