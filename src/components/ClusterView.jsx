import { useMemo, useState } from "react";
import { clusterData } from "../data/clusterData";
import { clusterDependencyMapData, clusterSpecificDependencyData } from "../data/clusterDependencyData";
import { ClusterSidebar } from "./ClusterSidebar";
import { CutExplorer } from "./CutExplorer";
import { MapLegend } from "./MapLegend";
import { VoronoiMap } from "./VoronoiMap";

export function ClusterView() {
  const [selectedClusterId, setSelectedClusterId] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  const filteredClusters = useMemo(() => (
    filterType === "ALL"
      ? [...clusterData.clusters]
      : clusterData.clusters.filter((c) => c.type === filterType)
  ).sort((a, b) => a.cut_seq_no - b.cut_seq_no), [filterType]);

  // Get dependency info for selected cluster
  const getDependencyInfo = (clusterId) => {
    if (!clusterId) return null;

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

  const handleClusterSelect = (cluster) => {
    if (selectedClusterId === cluster.cluster_id) {
      setSelectedClusterId(null);
    } else {
      setSelectedClusterId(cluster.cluster_id);
    }
  };

  const handleClose = () => {
    setSelectedClusterId(null);
  };

  const selectedCluster = clusterData.clusters.find(c => c.cluster_id === selectedClusterId);
  const dependencyInfo = getDependencyInfo(selectedClusterId);

  const filterButtons = [
    { type: "ALL", label: "All Clusters", icon: "◇" },
    { type: "CLEAN_CUT", label: "Clean Cut", icon: "◈", color: "#22c55e" },
    { type: "READ_ONLY_CUT", label: "Read Only", icon: "◇", color: "#f59e0b" },
  ];

  const cleanCutCount = clusterData.clusters.filter(c => c.type === "CLEAN_CUT").length;
  const readOnlyCount = clusterData.clusters.filter(c => c.type === "READ_ONLY_CUT").length;

  return (
    <div style={{
      display: "flex",
      height: "100%",
      width: "100%",
      background: "#020617",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* Header Overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        pointerEvents: "none",
        zIndex: 20,
      }}>
        {/* Title */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{
              width: "20px",
              height: "20px",
              background: "#3b82f6",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
            }}>
              <div style={{ width: "6px", height: "6px", background: "white", borderRadius: "50%" }} />
            </div>
            <h1 style={{
              fontSize: "16px",
              fontWeight: "800",
              color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase",
              letterSpacing: "-0.3px",
              marginTop: "40px",
            }}>
              Structural Cuts Visualizer
              <span style={{
                marginLeft: "8px",
                color: "#3b82f6",
                fontWeight: "300",
                fontSize: "12px",
                opacity: 0.6,
              }}>v4.2</span>
            </h1>
          </div>
          <p style={{
            fontSize: "9px",
            color: "#64748b",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "2px",
            margin: 0,
          }}>
            Enterprise Core Modernization Mapping
          </p>
        </div>

      </div>

      {/* Main Map Area */}
      <main style={{ flex: 1, position: "relative" }}>
        <VoronoiMap
          clusters={filteredClusters}
          onSelect={handleClusterSelect}
          onDeselect={handleClose}
          selectedId={selectedClusterId}
          dependencyMap={clusterDependencyMapData.dependency_map}
        />

        {/* Map Legend (Floating) */}
        <MapLegend />

        {/* Friction Alert */}
        <div style={{
          position: "absolute",
          top: "90px",
          right: "28px",
          pointerEvents: "none",
          zIndex: 15,
        }}>
          <div style={{
            background: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            backdropFilter: "blur(12px)",
            padding: "12px 16px",
            borderRadius: "12px",
            pointerEvents: "auto",
            cursor: "help",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#ef4444",
                animation: "pulse 2s ease-in-out infinite",
              }} />
              <p style={{
                fontSize: "9px",
                fontWeight: "800",
                color: "#f87171",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: 0,
              }}>Modernization Friction Detected</p>
            </div>
            <p style={{
              fontSize: "8px",
              color: "rgba(239, 68, 68, 0.6)",
              marginTop: "4px",
              textTransform: "uppercase",
              fontWeight: "600",
              margin: "4px 0 0 0",
            }}>Resolve Auth & Settlements Priority</p>
          </div>
        </div>
      </main>

      {/* Detail Sidebar */}
      <ClusterSidebar
        cluster={selectedCluster}
        onClose={handleClose}
        dependencyInfo={dependencyInfo}
        filterType={filterType}
        setFilterType={setFilterType}
        filterButtons={filterButtons}
        clusterData={clusterData}
        onOpenExplorer={() => setIsExplorerOpen(true)}
      />

      {isExplorerOpen && selectedClusterId && (
        <CutExplorer 
          clusterId={selectedClusterId} 
          onClose={() => setIsExplorerOpen(false)} 
        />
      )}

      {/* Subtle background grid */}
      <div style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.02,
        zIndex: -1,
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>
    </div>
  );
}
