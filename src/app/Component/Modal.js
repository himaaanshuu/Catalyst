"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children, maxWidth = 600 }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease"
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth,
          background: "rgba(15,15,20,0.98)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "32px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          animation: "modalSlideUp 0.3s cubic-bezier(0.22,1,0.36,1)"
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--white)",
            fontFamily: "'Syne', sans-serif",
            margin: 0
          }}>
            {title}
          </h2>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--muted)",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(229,40,30,0.12)";
              e.currentTarget.style.borderColor = "rgba(229,40,30,0.3)";
              e.currentTarget.style.color = "var(--red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--muted)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        {children}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
