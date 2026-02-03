import { useState } from "react";

export function HoneycombCard({ cluster, isSelected, onClick, rowIndex, colIndex }) {
  const [isHovered, setIsHovered] = useState(false);

  // Premium gradient color schemes
  const getGradient = (type) => {
    if (type === "CLEAN_CUT") {
      return {
        primary: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
        glow: "rgba(16, 185, 129, 0.6)",
        accent: "#10b981",
        badge: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
      };
    }
    return {
      primary: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
      glow: "rgba(245, 158, 11, 0.6)",
      accent: "#f59e0b",
      badge: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    };
  };

  const colors = getGradient(cluster.type);
  const isEvenRow = rowIndex % 2 === 0;

  // Hexagon dimensions for tighter packing
  const hexWidth = 140;
  const hexHeight = 160;
  const horizontalSpacing = hexWidth * 0.88;
  const verticalSpacing = hexHeight * 0.76;
  const rowOffset = isEvenRow ? 0 : horizontalSpacing / 2;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: `${hexWidth}px`,
        height: `${hexHeight}px`,
        cursor: "pointer",
        position: "relative",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: isHovered ? "scale(1.08) translateY(-4px)" : isSelected ? "scale(1.05)" : "scale(1)",
        zIndex: isHovered || isSelected ? 10 : 1,
        filter: isHovered ? `drop-shadow(0 20px 40px ${colors.glow})` : 
                isSelected ? `drop-shadow(0 15px 30px ${colors.glow})` : 
                "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
      }}
    >
      {/* Outer Glow Ring */}
      <div
        style={{
          position: "absolute",
          inset: "-4px",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: isSelected || isHovered ? colors.primary : "transparent",
          opacity: isSelected ? 0.8 : isHovered ? 0.5 : 0,
          transition: "all 0.4s ease",
          animation: isSelected ? "pulse 2s infinite" : "none",
        }}
      />

      {/* Main Hexagon Background */}
      <div
        style={{
          position: "absolute",
          inset: "2px",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "linear-gradient(145deg, rgba(30, 30, 50, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${isSelected ? colors.accent : "rgba(255,255,255,0.1)"}`,
          transition: "all 0.3s ease",
        }}
      />

      {/* Gradient Accent Border */}
      <div
        style={{
          position: "absolute",
          inset: "2px",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: colors.primary,
          opacity: 0.15,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Top Highlight */}
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: "25%",
          right: "25%",
          height: "30%",
          clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: "absolute",
          inset: "8px",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 12px",
          boxSizing: "border-box",
        }}
      >
        {/* Cluster Name */}
        <h4
          style={{
            margin: "0 0 8px 0",
            fontSize: "11px",
            fontWeight: "700",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: "1.2",
            maxWidth: "90%",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            letterSpacing: "0.3px",
          }}
        >
          {cluster.cluster_id.split("_").slice(1).join("_").substring(0, 18)}
        </h4>

        {/* Type Badge */}
        <span
          style={{
            background: colors.badge,
            color: "#ffffff",
            padding: "3px 10px",
            borderRadius: "12px",
            fontSize: "8px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow: `0 2px 8px ${colors.glow}`,
            marginBottom: "10px",
          }}
        >
          {cluster.type === "CLEAN_CUT" ? "CLEAN" : "READ"}
        </span>

        {/* Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "4px",
            width: "100%",
            maxWidth: "100px",
          }}
        >
          {[
            { icon: "⟳", value: cluster.flow_count, label: "Flows" },
            { icon: "◫", value: cluster.screen_count, label: "Screens" },
            { icon: "▤", value: cluster.table_count, label: "Tables" },
          ].map((metric, idx) => (
            <div
              key={idx}
              style={{
                textAlign: "center",
                padding: "2px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: colors.accent,
                  marginBottom: "1px",
                  fontWeight: "bold",
                }}
              >
                {metric.icon}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: colors.accent,
            boxShadow: `0 0 10px ${colors.accent}, 0 0 20px ${colors.accent}`,
            animation: "glow 1.5s ease-in-out infinite alternate",
          }}
        />
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.9; }
          }
          @keyframes glow {
            from { box-shadow: 0 0 10px ${colors.accent}, 0 0 20px ${colors.accent}; }
            to { box-shadow: 0 0 15px ${colors.accent}, 0 0 30px ${colors.accent}, 0 0 40px ${colors.accent}; }
          }
        `}
      </style>
    </div>
  );
}
