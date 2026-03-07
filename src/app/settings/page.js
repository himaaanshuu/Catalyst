"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/Library/Supabase";
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

    .c-btn-red {
      background: var(--red); color: #fff; border: none;
      border-radius: 10px; padding: 14px 28px;
      font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
    }
    .c-btn-red:hover { transform: translateY(-2px); background: #c9211a; }
    .c-btn-red:disabled { opacity: 0.5; cursor: not-allowed; }

    @media(max-width:768px){
      .navbar { padding: 14px 20px; }
      .nav-links { display: none !important; }
    }
  `}</style>
);

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: ""
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/Authentication/login");
      } else {
        setUser(user);
        setForm({
          fullName: user.user_metadata?.full_name || "",
          email: user.email || ""
        });
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: form.fullName }
      });

      if (error) throw error;

      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
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
        <div style={{ textAlign: "center", color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <GlobalStyles />
      <Navbar />
      
      <div style={{
        minHeight: "100vh",
        paddingTop: 100,
        padding: "100px 24px 60px"
      }}>
        <div style={{
          maxWidth: 800,
          margin: "0 auto"
        }}>
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2.5rem",
              fontWeight: 800,
              marginBottom: 8
            }}>
              Account Settings
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
              Manage your profile and account preferences
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div style={{
              background: message.includes("Error") 
                ? "rgba(229,40,30,0.12)" 
                : "rgba(40,200,80,0.12)",
              border: message.includes("Error")
                ? "1px solid rgba(229,40,30,0.3)"
                : "1px solid rgba(40,200,80,0.3)",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 24,
              color: message.includes("Error") ? "var(--red)" : "#28c850",
              fontSize: "0.85rem"
            }}>
              {message}
            </div>
          )}

          {/* Settings Form */}
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 32
          }}>
            <div style={{ marginBottom: 32 }}>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: 20,
                color: "var(--white)"
              }}>
                Profile Information
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Full Name */}
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    marginBottom: 8,
                    color: "var(--white)"
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="c-input"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    marginBottom: 8,
                    color: "var(--white)"
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="c-input"
                    value={form.email}
                    disabled
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                  <p style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    marginTop: 6
                  }}>
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              className="c-btn-red"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Danger Zone */}
          <div style={{
            marginTop: 40,
            background: "rgba(229,40,30,0.05)",
            border: "1px solid rgba(229,40,30,0.2)",
            borderRadius: 16,
            padding: 32
          }}>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBottom: 12,
              color: "var(--red)"
            }}>
              Danger Zone
            </h3>
            <p style={{
              fontSize: "0.85rem",
              color: "var(--muted)",
              marginBottom: 20
            }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              style={{
                background: "transparent",
                color: "var(--red)",
                border: "1px solid var(--red)",
                borderRadius: 10,
                padding: "12px 24px",
                fontSize: "0.85rem",
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onClick={() => alert("Account deletion coming soon")}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(229,40,30,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
