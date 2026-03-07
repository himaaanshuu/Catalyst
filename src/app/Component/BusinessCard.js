export default function BusinessCard({ business, onEdit, onDelete, onView }) {
  return (
    <div className="feature-card" style={{
      display: "flex",
      flexDirection: "column",
      minHeight: 220
    }}>
      {/* Business Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: "flex",
          alignItems: "start",
          gap: 12,
          marginBottom: 12
        }}>
          {/* Logo */}
          {business.logo ? (
            <img
              src={business.logo}
              alt={business.business_name}
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                objectFit: "cover",
                border: "1px solid var(--border)"
              }}
            />
          ) : (
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(229,40,30,0.15) 0%, rgba(229,40,30,0.05) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(229,40,30,0.2)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--red)",
              fontFamily: "'Syne', sans-serif"
            }}>
              {business.business_name?.charAt(0).toUpperCase() || "B"}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "var(--white)",
              fontFamily: "'Syne', sans-serif",
              margin: "0 0 4px 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {business.business_name || "Untitled Business"}
            </h3>
            
            {business.created_at && (
              <div style={{
                fontSize: "0.72rem",
                color: "var(--muted)",
                fontFamily: "'Outfit', sans-serif"
              }}>
                Created {new Date(business.created_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {business.description && (
          <p style={{
            fontSize: "0.85rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {business.description}
          </p>
        )}
      </div>

      {/* Contact Info */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 16,
        flexWrap: "wrap"
      }}>
        {business.phone && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 6,
            fontSize: "0.72rem",
            color: "var(--muted)"
          }}>
            📞 {business.phone}
          </div>
        )}
        {business.whatsapp && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "rgba(37,211,102,0.08)",
            borderRadius: 6,
            fontSize: "0.72rem",
            color: "#25D366"
          }}>
            💬 WhatsApp
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: "flex",
        gap: 8,
        marginTop: "auto"
      }}>
        <button
          onClick={onView}
          className="c-btn-red"
          style={{
            flex: 1,
            padding: "10px 16px",
            fontSize: "0.82rem",
            animation: "none"
          }}
        >
          View Catalog
        </button>
        <button
          onClick={onEdit}
          style={{
            padding: "10px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--white)",
            fontSize: "0.82rem",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "all 0.2s"
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
          ✏️
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: "10px 16px",
            background: "rgba(229,40,30,0.08)",
            border: "1px solid rgba(229,40,30,0.22)",
            borderRadius: 10,
            color: "var(--red)",
            fontSize: "0.82rem",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(229,40,30,0.15)";
            e.currentTarget.style.borderColor = "rgba(229,40,30,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(229,40,30,0.08)";
            e.currentTarget.style.borderColor = "rgba(229,40,30,0.22)";
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
