"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/Library/Supabase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("businesses");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/Authentication/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/Authentication/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            border: "3px solid var(--border)",
            borderTopColor: "var(--red)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px"
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: "rgba(255,255,255,0.02)",
        borderRight: "1px solid var(--border)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 40, padding: "0 8px" }}>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.5rem",
            letterSpacing: "-0.02em",
            color: "#f5f3ef"
          }}>Catalyst</span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <SidebarItem
            icon={<DashboardIcon />}
            label="Businesses"
            active={activeSection === "businesses"}
            onClick={() => setActiveSection("businesses")}
          />
          <SidebarItem
            icon={<ProductIcon />}
            label="Products"
            active={activeSection === "products"}
            onClick={() => setActiveSection("products")}
          />
          <SidebarItem
            icon={<AnalyticsIcon />}
            label="Analytics"
            active={activeSection === "analytics"}
            onClick={() => setActiveSection("analytics")}
          />
          <SidebarItem
            icon={<SettingsIcon />}
            label="Settings"
            active={activeSection === "settings"}
            onClick={() => setActiveSection("settings")}
          />
        </nav>

        {/* User Section */}
        <div style={{
          marginTop: "auto",
          padding: "16px 12px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--red) 0%, #c9211a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#fff",
            fontFamily: "'Syne', sans-serif"
          }}>
            {user.email?.substring(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--white)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {user.user_metadata?.full_name || "User"}
            </div>
            <button
              onClick={handleSignOut}
              style={{
                background: "none",
                border: "none",
                color: "var(--red)",
                fontSize: "0.72rem",
                fontWeight: 500,
                cursor: "pointer",
                padding: 0,
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 12px",
        marginBottom: 4,
        background: active ? "rgba(229,40,30,0.12)" : "transparent",
        border: active ? "1px solid rgba(229,40,30,0.25)" : "1px solid transparent",
        borderRadius: 10,
        color: active ? "var(--red)" : "var(--muted)",
        fontSize: "0.875rem",
        fontWeight: active ? 600 : 500,
        fontFamily: "'Outfit', sans-serif",
        cursor: "pointer",
        transition: "all 0.2s",
        textAlign: "left"
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.color = "var(--white)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--muted)";
        }
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
    </svg>
  );
}
