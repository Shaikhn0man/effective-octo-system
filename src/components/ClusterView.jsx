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
                  color: isActive ? (btn.color) : "rgba(255,255,255,0.6)",
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
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              padding: "40px",
              width: "100%",
              maxWidth: "1400px",
            }}
          >
            {filteredClusters.map((cluster) => {
              // No row/col calculation needed for flex layout
              return (
                <HoneycombCard
                  key={cluster.cluster_id}
                  cluster={cluster}
                  isSelected={selectedCluster?.cluster_id === cluster.cluster_id}
                  onClick={(e) => handleClusterClick(cluster, e)}
                  // Pass dummies for now as they are not used for positioning anymore
                  rowIndex={0}
                  colIndex={0}
                />
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

          {/* Standard Rectangular Popup with Expansion Effect */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 101,
              animation: isAnimating
                ? `rectExpand 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
                : undefined,
              "--start-x": `${clickPosition.x - window.innerWidth / 2}px`,
              "--start-y": `${clickPosition.y - window.innerHeight / 2}px`,
            }}
          >
            {/* Rectangular Container */}
            <div
              style={{
                position: "relative",
                width: "500px",
                maxWidth: "90vw",
                background: "#1e1e2fab", // slightly transparent dark bg
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px ${getTypeStyles(selectedCluster.type).color}30`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header Bar */}
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                background: `linear-gradient(90deg, ${getTypeStyles(selectedCluster.type).color}10 0%, transparent 100%)`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span
                      style={{
                        background: getTypeStyles(selectedCluster.type).gradient,
                        color: "#ffffff",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        boxShadow: `0 2px 8px ${getTypeStyles(selectedCluster.type).glow}`,
                      }}
                    >
                      {selectedCluster.type.replace("_", " ")}
                    </span>
                  </div>
                  <h3 style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#ffffff",
                    lineHeight: "1.4",
                  }}>
                    {selectedCluster.cluster_id}
                  </h3>
                </div>

                {/* Close Button - Top Right */}
                <button
                  onClick={handleClose}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "16px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Body Content */}
              <div style={{ padding: "24px" }}>
                <p style={{
                  margin: "0 0 24px 0",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: "1.5",
                  background: "rgba(0,0,0,0.2)",
                  padding: "12px",
                  borderRadius: "12px",
                }}>
                  {selectedCluster.topic}
                </p>

                {/* Metrics Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "12px",
                  marginBottom: "24px",
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
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${metric.color}20`,
                        borderRadius: "16px",
                        padding: "16px 8px",
                        textAlign: "center",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", marginBottom: "4px" }}>
                        {metric.value}
                      </div>
                      <div style={{
                        fontSize: "10px",
                        color: metric.color,
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}>
                        <span>{metric.icon}</span> {metric.label}
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
                      background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                      borderRadius: "16px",
                      padding: "20px",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      <div style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "16px",
                        fontWeight: "600",
                        textAlign: "center",
                      }}>
                        Dependency Analysis
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "20px", alignItems: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#ef4444",
                            marginBottom: "4px"
                          }}>
                            {depInfo.depends_on?.count || 0}
                          </div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                            Incoming Dependencies
                          </div>
                        </div>
                        <div style={{ height: "40px", background: "rgba(255,255,255,0.1)" }} />
                        <div style={{ textAlign: "center" }}>
                          <div style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#22c55e",
                            marginBottom: "4px"
                          }}>
                            {depInfo.depended_by?.count || 0}
                          </div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                            Outgoing Dependencies
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
          @keyframes rectExpand {
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
