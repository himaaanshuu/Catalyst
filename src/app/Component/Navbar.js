"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/Library/Supabase";
import { useRouter } from "next/navigation";

export default function Navbar({ onNavigate, transparent = false }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.push("/");
  };

  const getInitials = (email, fullName) => {
    if (fullName) {
      const names = fullName.split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return fullName.substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div 
        onClick={() => onNavigate ? onNavigate("landing") : router.push("/dashboard/business")}
        style={{ cursor: "pointer" }}
      >
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "1.5rem",
          letterSpacing: "-0.02em",
          color: "#f5f3ef"
        }}>Catalyst</span>
      </div>

      {/* Nav Links (center) */}
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Features Button */}
        <button
          onClick={() => router.push("/features")}
          style={{
            background: "rgba(229,40,30,0.08)",
            border: "1px solid rgba(229,40,30,0.22)",
            borderRadius: 8, padding: "7px 16px",
            color: "rgba(229,40,30,0.9)", fontSize: "0.85rem", fontWeight: 600,
            fontFamily: "'Outfit', sans-serif", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            transition: "background 0.2s, border-color 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(229,40,30,0.15)";
            e.currentTarget.style.borderColor = "rgba(229,40,30,0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(229,40,30,0.08)";
            e.currentTarget.style.borderColor = "rgba(229,40,30,0.22)";
          }}
        >
          <span style={{ width: 6, height: 6, background: "var(--red)", borderRadius: "50%", animation: "glowPulse 2s infinite" }} />
          Features
        </button>

        {/* Templates Button */}
        <button
          onClick={() => router.push("/templates")}
          style={{
            background: "rgba(229,40,30,0.08)",
            border: "1px solid rgba(229,40,30,0.22)",
            borderRadius: 8, padding: "7px 16px",
            color: "rgba(229,40,30,0.9)", fontSize: "0.85rem", fontWeight: 600,
            fontFamily: "'Outfit', sans-serif", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            transition: "background 0.2s, border-color 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(229,40,30,0.15)";
            e.currentTarget.style.borderColor = "rgba(229,40,30,0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(229,40,30,0.08)";
            e.currentTarget.style.borderColor = "rgba(229,40,30,0.22)";
          }}
        >
          <span style={{ width: 6, height: 6, background: "var(--red)", borderRadius: "50%", animation: "glowPulse 2s infinite" }} />
          Templates
        </button>

        {/* How to Generate */}
        <button
          onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            background: "rgba(229,40,30,0.08)",
            border: "1px solid rgba(229,40,30,0.22)",
            borderRadius: 8, padding: "7px 16px",
            color: "rgba(229,40,30,0.9)", fontSize: "0.85rem", fontWeight: 600,
            fontFamily: "'Outfit', sans-serif", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            transition: "background 0.2s, border-color 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(229,40,30,0.15)";
            e.currentTarget.style.borderColor = "rgba(229,40,30,0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(229,40,30,0.08)";
            e.currentTarget.style.borderColor = "rgba(229,40,30,0.22)";
          }}
        >
          <span style={{ width: 6, height: 6, background: "var(--red)", borderRadius: "50%", animation: "glowPulse 2s infinite" }} />
          How to Generate
        </button>
      </div>

      {/* Auth Buttons / User Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user ? (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            {/* User Profile Button */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                borderRadius: 50,
                padding: "6px 14px 6px 6px",
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              {/* Avatar Circle */}
              <div style={{
                width: 36,
                height: 36,
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
                {getInitials(user.email, user.user_metadata?.full_name)}
              </div>
              
              {/* User Name */}
              <span style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--white)",
                fontFamily: "'Outfit', sans-serif"
              }}>
                {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
              </span>

              {/* Dropdown Arrow */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ 
                transition: "transform 0.2s",
                transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)"
              }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: 220,
                background: "rgba(15,15,20,0.98)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "8px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                backdropFilter: "blur(20px)",
                zIndex: 1000
              }}>
                {/* User Info */}
                <div style={{
                  padding: "12px 12px 8px",
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 8
                }}>
                  <div style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--white)",
                    marginBottom: 4
                  }}>
                    {user.user_metadata?.full_name || "User"}
                  </div>
                  <div style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)"
                  }}>
                    {user.email}
                  </div>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    if (onNavigate) {
                      onNavigate("dashboard");
                    } else {
                      router.push("/dashboard/business");
                    }
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: "var(--white)",
                    fontSize: "0.85rem",
                    fontFamily: "'Outfit', sans-serif",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    router.push("/settings");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: "var(--white)",
                    fontSize: "0.85rem",
                    fontFamily: "'Outfit', sans-serif",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                  </svg>
                  Settings
                </button>

                <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />

                <button
                  onClick={handleSignOut}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: "var(--red)",
                    fontSize: "0.85rem",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.2s",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(229,40,30,0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button 
              className="c-btn-ghost" 
              style={{ padding: "9px 20px", fontSize: "0.85rem" }}
              onClick={() => router.push("/Authentication/login")}
            >Login</button>

          </>
        )}
      </div>
    </nav>
  );
}
