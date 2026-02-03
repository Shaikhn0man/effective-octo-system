import { useRef, useState } from "react";
import { clusterData } from "../data/clusterData";
import { clusterDependencyMapData, clusterSpecificDependencyData } from "../data/clusterDependencyData";
import { HoneycombCard } from "./HoneycombCard";

export function ClusterView() {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const filteredClusters =
    filterType === "ALL"
      ? clusterData.clusters
      : clusterData.clusters.filter((c) => c.type === filterType);

  // Get dependency info for selected cluster
  const getDependencyInfo = (clusterId) => {
    if (clusterId === "Cut_2_SEC-USER-DATA") {
      return clusterSpecificDependencyData;
    }
    
    const clusterDep = clusterDependencyMapData.dependency_map.find(
      (c) => c.cluster_id === clusterId
    );
    
    if (clusterDep) {
      return {
        depends_on: {
          count: clusterDep.depends_on_count,
          clusters: clusterDep.depends_on,
        },
        depended_by: {
          count: 0,
          clusters: [],
        },
      };
    }
    return null;
  };

  const handleClusterClick = (cluster, event) => {
    if (selectedCluster?.cluster_id === cluster.cluster_id) {
      handleClose();
      return;
    }
    
    // Get click position relative to viewport
    const rect = event.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    
    setIsAnimating(true);
    setSelectedCluster(cluster);
    
    // Animation complete
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedCluster(null);
      setIsAnimating(false);
    }, 300);
  };

  const filterButtons = [
    { type: "ALL", label: "All Clusters", icon: "◇" },
    { type: "CLEAN_CUT", label: "Clean Cut", icon: "◈", color: "#10b981" },
    { type: "READ_ONLY_CUT", label: "Read Only", icon: "◇", color: "#f59e0b" },
  ];

  // Calculate grid layout
  const columns = 6;
  const hexWidth = 140;
  const hexHeight = 160;
  const horizontalSpacing = hexWidth * 0.92;
  const verticalSpacing = hexHeight * 0.78;

  const getTypeStyles = (type) => {
    if (type === "CLEAN_CUT") {
      return {
        gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.4)",
      };
    }
    return {
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.4)",
    };
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: "flex", 
        flexDirection: "column",
        height: "100%", 
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Ambient Background Effects */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />

      {/* Header Section */}
      <div 
        style={{ 
          padding: "20px 32px",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Title */}
        <div>
          <h2 style={{ 
            margin: "0 0 4px 0", 
            fontSize: "20px", 
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: "-0.3px",
          }}>
            Cluster Architecture
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: "12px", 
            color: "rgba(255,255,255,0.5)",
          }}>
            Explore and analyze domain clusters • {clusterData.total_clusters} clusters
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          {filterButtons.map((btn) => {
            const isActive = filterType === btn.type;
            return (
              <button
                key={btn.type}
                onClick={() => setFilterType(btn.type)}
                style={{
                  padding: "8px 18px",
                  fontSize: "12px",
                  fontWeight: "600",
                  border: isActive 
                    ? `1px solid ${btn.color || "rgba(255,255,255,0.3)"}` 
                    : "1px solid rgba(255,255,255,0.1)",
                  background: isActive 
                    ? `linear-gradient(135deg, ${btn.color || "rgba(255,255,255,0.15)"}20 0%, ${btn.color || "rgba(255,255,255,0.1)"}10 100%)`
                    : "rgba(255,255,255,0.03)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  color: isActive ? (btn.color || "#ffffff") : "rgba(255,255,255,0.6)",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: isActive ? `0 4px 15px ${btn.color || "rgba(255,255,255,0.2)"}30` : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }
                }}
              >
                <span style={{ fontSize: "14px" }}>{btn.icon}</span>
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Honeycomb Grid Container - Full Width */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          padding: "50px",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {filteredClusters.length === 0 ? (
          <div style={{ 
            padding: "60px", 
            textAlign: "center", 
            color: "rgba(255,255,255,0.4)",
            fontSize: "14px",
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}>◇</div>
            No clusters found
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: `${columns * horizontalSpacing + 120}px`,
              height: `${Math.ceil(filteredClusters.length / columns) * verticalSpacing + 100}px`,
            }}
          >
            {filteredClusters.map((cluster, idx) => {
              const row = Math.floor(idx / columns);
              const col = idx % columns;
              const isEvenRow = row % 2 === 0;
              const offsetX = isEvenRow ? 0 : horizontalSpacing / 2;
              
              return (
                <div
                  key={cluster.cluster_id}
                  style={{
                    position: "absolute",
                    left: `${col * horizontalSpacing + offsetX}px`,
                    top: `${row * verticalSpacing}px`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <HoneycombCard
                    cluster={cluster}
                    isSelected={selectedCluster?.cluster_id === cluster.cluster_id}
                    onClick={(e) => handleClusterClick(cluster, e)}
                    rowIndex={row}
                    colIndex={col}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div
        style={{
          padding: "14px 32px",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "32px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ 
          display: "flex", 
          gap: "24px",
          fontSize: "12px",
          color: "rgba(255,255,255,0.5)",
        }}>
          <span>
            <strong style={{ color: "#ffffff", marginRight: "4px" }}>{clusterData.total_clusters}</strong>
            Total
          </span>
          <span>
            <strong style={{ color: "#10b981", marginRight: "4px" }}>
              {clusterData.clusters.filter(c => c.type === "CLEAN_CUT").length}
            </strong>
            Clean Cut
          </span>
          <span>
            <strong style={{ color: "#f59e0b", marginRight: "4px" }}>
              {clusterData.clusters.filter(c => c.type === "READ_ONLY_CUT").length}
            </strong>
            Read Only
          </span>
        </div>
        <div style={{ 
          fontSize: "11px", 
          color: "rgba(255,255,255,0.3)",
        }}>
          Showing {filteredClusters.length} clusters
        </div>
      </div>

      {/* Hexagonal Popup Overlay with Expansion Animation */}
      {selectedCluster && (
        <>
          {/* Backdrop */}
          <div
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 100,
              animation: isAnimating && selectedCluster ? "fadeIn 0.3s ease" : "fadeOut 0.3s ease",
            }}
          />
          
          {/* Hexagonal Popup with Expansion Effect */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 101,
              animation: isAnimating 
                ? `hexExpand 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
                : undefined,
              "--start-x": `${clickPosition.x - window.innerWidth / 2}px`,
              "--start-y": `${clickPosition.y - window.innerHeight / 2}px`,
            }}
          >
            {/* Hexagonal Container */}
            <div
              style={{
                position: "relative",
                width: "400px",
                height: "440px",
                background: "linear-gradient(145deg, rgba(25, 25, 45, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 80px ${getTypeStyles(selectedCluster.type).glow}`,
                border: `2px solid ${getTypeStyles(selectedCluster.type).color}50`,
              }}
            >
              {/* Inner glow border effect */}
              <div
                style={{
                  position: "absolute",
                  inset: "3px",
                  background: "linear-gradient(145deg, rgba(30, 30, 55, 0.95) 0%, rgba(20, 20, 45, 0.95) 100%)",
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              />

              {/* Content Inside Hexagon */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "300px",
                  textAlign: "center",
                  padding: "20px",
                  zIndex: 2,
                }}
              >
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  style={{
                    position: "absolute",
                    top: "-30px",
                    right: "-10px",
                    background: "rgba(255,255,255,0.1)",
                    border: `1px solid ${getTypeStyles(selectedCluster.type).color}40`,
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = getTypeStyles(selectedCluster.type).color + "40";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  ✕
                </button>

                {/* Header */}
                <div style={{ marginBottom: "16px" }}>
                  <span
                    style={{
                      background: getTypeStyles(selectedCluster.type).gradient,
                      color: "#ffffff",
                      padding: "5px 14px",
                      borderRadius: "14px",
                      fontSize: "10px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      display: "inline-block",
                      marginBottom: "10px",
                      boxShadow: `0 4px 15px ${getTypeStyles(selectedCluster.type).glow}`,
                    }}
                  >
                    {selectedCluster.type.replace("_", " ")}
                  </span>
                  <h3 style={{ 
                    margin: "0 0 6px 0", 
                    fontSize: "16px", 
                    fontWeight: "700",
                    color: "#ffffff",
                    lineHeight: "1.3",
                  }}>
                    {selectedCluster.cluster_id}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "11px", 
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: "1.4",
                  }}>
                    {selectedCluster.topic}
                  </p>
                </div>

                {/* Metrics Grid - Hexagonal arrangement */}
                <div style={{ 
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}>
                  {[
                    { label: "Flows", value: selectedCluster.flow_count, icon: "⟳", color: "#10b981" },
                    { label: "Screens", value: selectedCluster.screen_count, icon: "◫", color: "#3b82f6" },
                    { label: "Programs", value: selectedCluster.program_count, icon: "◈", color: "#8b5cf6" },
                    { label: "Tables", value: selectedCluster.table_count, icon: "▤", color: "#f59e0b" },
                  ].map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}08 100%)`,
                        border: `1px solid ${metric.color}30`,
                        borderRadius: "12px",
                        padding: "10px 16px",
                        minWidth: "70px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: metric.color, marginBottom: "2px" }}>
                        {metric.icon}
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>
                        {metric.value}
                      </div>
                      <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", marginTop: "1px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dependencies Summary */}
                {(() => {
                  const depInfo = getDependencyInfo(selectedCluster.cluster_id);
                  if (!depInfo) return null;
                  return (
                    <div style={{ 
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "14px",
                      padding: "14px 20px",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{ 
                        fontSize: "9px", 
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "10px",
                        fontWeight: "600",
                      }}>
                        Dependencies
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
                        <div>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            gap: "6px",
                            marginBottom: "4px",
                          }}>
                            <span style={{ 
                              width: "18px", 
                              height: "18px", 
                              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              color: "#ef4444",
                            }}>↑</span>
                            <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: "600" }}>
                              Depends On
                            </span>
                          </div>
                          <div style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff" }}>
                            {depInfo.depends_on?.count || 0}
                          </div>
                        </div>
                        <div style={{ width: "1px", background: "rgba(255,255,255,0.1)" }} />
                        <div>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            gap: "6px",
                            marginBottom: "4px",
                          }}>
                            <span style={{ 
                              width: "18px", 
                              height: "18px", 
                              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 100%)",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              color: "#22c55e",
                            }}>↓</span>
                            <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: "600" }}>
                              Depended By
                            </span>
                          </div>
                          <div style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff" }}>
                            {depInfo.depended_by?.count || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(20px, -20px) scale(1.1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes hexExpand {
            0% {
              transform: translate(var(--start-x), var(--start-y)) scale(0.15);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
          }
          @keyframes hexCollapse {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--start-x), var(--start-y)) scale(0.15);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
