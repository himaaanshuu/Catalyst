"use client";

import { useState } from "react";
import { supabase } from "@/Library/Supabase";
import { useRouter } from "next/navigation";

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

    @keyframes floatOrb {
      0%,100% { transform: translateY(0) scale(1); }
      50%      { transform: translateY(-30px) scale(1.06); }
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
      animation: glowPulse 3s ease-in-out infinite;
      position: relative; overflow: hidden;
    }
    .c-btn-red:hover { transform: translateY(-2px); background: #c9211a; }
    .c-btn-red:active { transform: scale(0.98); }
    .c-btn-red:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .c-btn-red::after {
      content:''; position:absolute; inset:0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
      pointer-events:none;
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
   ANIMATED BACKGROUND
───────────────────────────────────────────── */
function AnimatedBG() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1 }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
      <div style={{
        position: "absolute", top: "15%", left: "10%",
        width: 350, height: 350,
        background: "radial-gradient(circle, rgba(229,40,30,0.15) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)",
        animation: "floatOrb 8s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "15%",
        width: 280, height: 280,
        background: "radial-gradient(circle, rgba(229,40,30,0.12) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(50px)",
        animation: "floatOrb 10s ease-in-out infinite 2s"
      }} />
    </div>
  );
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
   SIGNUP PAGE
───────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", fullName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim()
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setMessage("Account created! Check your email to verify your account.");
        setTimeout(() => {
          router.push("/Authentication/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ email: err.message || "Failed to create account. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="page-enter" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden"
      }}>
        <AnimatedBG />

        <div style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 480,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "48px 40px",
          backdropFilter: "blur(20px)"
        }}>
          {/* Logo/Brand */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <BrandMark scale={1} />
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 12 }}>
              Create your account
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div style={{
              background: "rgba(40,200,80,0.12)",
              border: "1px solid rgba(40,200,80,0.3)",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 24,
              color: "#28c850",
              fontSize: "0.85rem",
              textAlign: "center"
            }}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                placeholder="Enter your name"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                disabled={loading}
              />
              {errors.fullName && (
                <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: 6 }}>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
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
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                disabled={loading}
              />
              {errors.email && (
                <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: 6 }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: 8,
                color: "var(--white)"
              }}>
                Password
              </label>
              <input
                type="password"
                className="c-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                disabled={loading}
              />
              {errors.password && (
                <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: 6 }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: 8,
                color: "var(--white)"
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                className="c-input"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: 6 }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="c-btn-red"
              style={{ width: "100%", marginTop: 8, animation: loading ? "none" : undefined }}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "32px 0"
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Social Signup - Google */}
          <button
            type="button"
            className="c-btn-ghost"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            onClick={async () => {
              try {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/dashboard/business`
                  }
                });
                if (error) throw error;
              } catch (err) {
                console.error("Google signup error:", err);
                alert("Failed to signup with Google. Please enable Google OAuth in Supabase.");
              }
            }}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <div style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Already have an account?{" "}
              <a
                href="/Authentication/login"
                style={{
                  color: "var(--red)",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.opacity = "0.8"}
                onMouseLeave={(e) => e.target.style.opacity = "1"}
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
