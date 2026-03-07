export function Button({ children, variant = "primary", size = "md", disabled, onClick, type = "button", className = "", style = {} }) {
  const baseStyle = {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "transform 0.15s, box-shadow 0.2s, background 0.2s",
    border: "none",
    borderRadius: 10,
    ...style
  };

  const sizes = {
    sm: { padding: "8px 16px", fontSize: "0.8rem" },
    md: { padding: "14px 28px", fontSize: "0.92rem" },
    lg: { padding: "16px 32px", fontSize: "1rem" }
  };

  const variants = {
    primary: {
      background: "var(--red)",
      color: "#fff",
      animation: disabled ? "none" : "glowPulse 3s ease-in-out infinite"
    },
    ghost: {
      background: "transparent",
      color: "var(--white)",
      border: "1px solid var(--border)"
    },
    outline: {
      background: "transparent",
      color: "var(--red)",
      border: "1px solid var(--red)"
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        opacity: disabled ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === "primary") e.currentTarget.style.background = "#c9211a";
          if (variant === "ghost") {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (variant === "primary") e.currentTarget.style.background = "var(--red)";
          if (variant === "ghost") {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border)";
          }
        }
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, type = "text", placeholder, value, onChange, disabled, required, className = "", style = {} }) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: "0.85rem",
          fontWeight: 500,
          marginBottom: 8,
          color: "var(--white)",
          fontFamily: "'Outfit', sans-serif"
        }}>
          {label} {required && <span style={{ color: "var(--red)" }}>*</span>}
        </label>
      )}
      <input
        type={type}
        className={`c-input ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={style}
      />
      {error && (
        <p style={{
          color: "var(--red)",
          fontSize: "0.75rem",
          marginTop: 6,
          fontFamily: "'Outfit', sans-serif"
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({ label, error, placeholder, value, onChange, disabled, required, rows = 4, className = "", style = {} }) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: "0.85rem",
          fontWeight: 500,
          marginBottom: 8,
          color: "var(--white)",
          fontFamily: "'Outfit', sans-serif"
        }}>
          {label} {required && <span style={{ color: "var(--red)" }}>*</span>}
        </label>
      )}
      <textarea
        className={`c-input ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        style={{ minHeight: `${rows * 24}px`, ...style }}
      />
      {error && (
        <p style={{
          color: "var(--red)",
          fontSize: "0.75rem",
          marginTop: 6,
          fontFamily: "'Outfit', sans-serif"
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Card({ children, className = "", style = {}, hover = false }) {
  return (
    <div
      className={hover ? "feature-card" : ""}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        padding: "32px 28px",
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function LoadingSpinner({ size = 48, color = "var(--red)" }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: size,
        height: size,
        border: "3px solid var(--border)",
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
