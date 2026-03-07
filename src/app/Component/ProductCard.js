export default function ProductCard({ product, onEdit, onDelete, showActions = false }) {
  const handleWhatsAppOrder = () => {
    const message = `Hi! I'm interested in ${product.name}${product.price ? ` - ₹${product.price}` : ''}`;
    const phone = product.whatsapp || product.phone;
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="product-card">
      {/* Product Image */}
      <div style={{
        width: "100%",
        height: 200,
        background: product.image 
          ? `url(${product.image}) center/cover` 
          : "linear-gradient(135deg, rgba(229,40,30,0.1) 0%, rgba(229,40,30,0.05) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}>
        {!product.image && (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,239,0.2)" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        )}
        
        {/* Category Badge */}
        {product.category && (
          <div style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(6,6,8,0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "var(--white)",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            {product.category}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: "16px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: 8
        }}>
          <h3 style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--white)",
            fontFamily: "'Outfit', sans-serif",
            margin: 0
          }}>
            {product.name || "Untitled Product"}
          </h3>
          
          {product.price && (
            <span style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--red)",
              fontFamily: "'Syne', sans-serif"
            }}>
              ₹{product.price}
            </span>
          )}
        </div>

        {product.description && (
          <p style={{
            fontSize: "0.82rem",
            color: "var(--muted)",
            lineHeight: 1.5,
            margin: "0 0 16px 0",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {product.description}
          </p>
        )}

        {/* Actions */}
        {showActions ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onEdit}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--white)",
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
              Edit
            </button>
            <button
              onClick={onDelete}
              style={{
                flex: 1,
                background: "rgba(229,40,30,0.08)",
                border: "1px solid rgba(229,40,30,0.22)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--red)",
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
              Delete
            </button>
          </div>
        ) : (
          <button className="wa-btn" onClick={handleWhatsAppOrder}>
            <span style={{ marginRight: 6 }}>💬</span>
            Order on WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
