import { useState } from "react";
import { clusterData } from "../data/clusterData.jsx";
import { clusterSpecificDependencyData } from "../data/clusterDependencyData";
import { ClusterDetailPanel } from "./ClusterDetailPanel";

export function HexagonalStackView() {
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Extract cut number from cluster_id (e.g., "Cut_15_..." -> 15)
  const getCutNumber = (clusterId) => {
    const match = clusterId.match(/Cut_(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Sort clusters by cut number (order)
  const sortedClusters = [...clusterData.clusters].sort(
    (a, b) => getCutNumber(a.cluster_id) - getCutNumber(b.cluster_id)
  );

  // Get min and max screen counts for scaling
  const screenCounts = sortedClusters.map((c) => c.screen_count);
  const minScreens = Math.min(...screenCounts);
  const maxScreens = Math.max(...screenCounts);
  const screenRange = maxScreens - minScreens || 1;

  // Calculate hexagon size based on screen count
  const getHexagonSize = (screenCount) => {
    // Min size: 80px, Max size: 200px
    const minSize = 80;
    const maxSize = 200;
    const normalized = (screenCount - minScreens) / screenRange;
    return minSize + normalized * (maxSize - minSize);
  };

  const getTypeColor = (type) => {
    return type === "CLEAN_CUT" ? "#4caf50" : "#ff9800";
  };

  // Get dependency info for selected cluster
  const getDependencyInfo = (clusterId) => {
    if (clusterId === "Cut_2_SEC-USER-DATA") {
      return clusterSpecificDependencyData;
    }
    return null;
  };

  return (
    <div style={{ display: "flex", height: "100%", background: "#f9f9f9" }}>
      {/* Left Panel - Hexagonal Stack Visualization */}
      <div
        style={{
          flex: "0 0 900px",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Info Header */}
        <div style={{ padding: "16px", borderBottom: "1px solid #ddd", background: "white" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700" }}>
            📐 Hexagonal Stack View
          </h3>
          <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
            Clusters arranged by cut order. Size indicates number of screens (larger = more screens)
          </p>
        </div>

        {/* Hexagonal Stack Container */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            padding: "40px",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {sortedClusters.map((cluster, idx) => {
            const size = getHexagonSize(cluster.screen_count);
            const typeColor = getTypeColor(cluster.type);
            const isSelected = selectedCluster?.cluster_id === cluster.cluster_id;

            return (
              <div
                key={cluster.cluster_id}
                onClick={() => setSelectedCluster(cluster)}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  perspective: "1000px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {/* Hexagon Container */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    transition: "all 0.3s ease",
                    transform: isSelected ? "scale(1.15) rotateZ(10deg)" : "scale(1)",
                  }}
                >
                  {/* Hexagon Shape */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      background: typeColor,
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      opacity: 0.15,
                      transition: "all 0.3s ease",
                    }}
                  />

                  {/* Content Container */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background: isSelected ? "#e3f2fd" : "#fff",
                      border: isSelected ? `3px solid ${typeColor}` : `2px solid ${typeColor}60`,
                      boxShadow: isSelected
                        ? `0 12px 24px ${typeColor}40`
                        : "0 6px 12px rgba(0,0,0,0.15)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px",
                      boxSizing: "border-box",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Inner Content */}
                    <div
                      style={{
                        textAlign: "center",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: size > 120 ? "6px" : "3px",
                      }}
                    >
                      {/* Cut Number */}
                      <div
                        style={{
                          fontSize: size > 120 ? "24px" : "16px",
                          fontWeight: "700",
                          color: typeColor,
                        }}
                      >
                        {getCutNumber(cluster.cluster_id)}
                      </div>

                      {/* Type Badge */}
                      {size > 100 && (
                        <span
                          style={{
                            background: typeColor,
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            fontSize: "10px",
                            fontWeight: "700",
                          }}
                        >
                          {cluster.type === "CLEAN_CUT" ? "CLEAN" : "READ"}
                        </span>
                      )}

                      {/* Screen Count */}
                      <div
                        style={{
                          fontSize: size > 120 ? "18px" : "14px",
                          fontWeight: "700",
                          color: "#2196f3",
                        }}
                      >
                        📺 {cluster.screen_count}
                      </div>

                      {/* Additional Metrics - only for larger hexagons */}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          lineHeight: "1.2",
                        }}
                      >
                        <div>🔄 {cluster.flow_count}</div>
                        <div>💾 {cluster.table_count}</div>
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect on Hover */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background: typeColor,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      pointerEvents: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.opacity = "0.15";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Footer */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid #ddd",
            background: "white",
            fontSize: "12px",
            color: "#666",
            display: "flex",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#4caf50",
                borderRadius: "2px",
              }}
            />
            Clean Cut
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#ff9800",
                borderRadius: "2px",
              }}
            />
            Read Only Cut
          </div>
          <div>Total: {sortedClusters.length} Clusters</div>
        </div>
      </div>

      {/* Right Panel - Cluster Details */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "white",
        }}
      >
        <ClusterDetailPanel
          cluster={selectedCluster}
          dependencyInfo={selectedCluster ? getDependencyInfo(selectedCluster.cluster_id) : null}
        />
      </div>
    </div>
  );
}
