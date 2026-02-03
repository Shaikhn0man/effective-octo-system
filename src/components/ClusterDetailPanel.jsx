export function ClusterDetailPanel({ cluster, dependencyInfo }) {
  if (!cluster) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.3)",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div style={{ 
          fontSize: "64px", 
          marginBottom: "16px",
          opacity: 0.3,
        }}>
          ⬡
        </div>
        <p style={{ fontSize: "14px", margin: 0 }}>Select a cluster to view details</p>
        <p style={{ fontSize: "12px", margin: "8px 0 0 0", opacity: 0.6 }}>
          Click on any hexagon to explore
        </p>
      </div>
    );
  }

  const getTypeStyles = (type) => {
    if (type === "CLEAN_CUT") {
      return {
        gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.3)",
        bg: "rgba(16, 185, 129, 0.1)",
      };
    }
    return {
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.3)",
      bg: "rgba(245, 158, 11, 0.1)",
    };
  };

  const typeStyles = getTypeStyles(cluster.type);

  const metrics = [
    { 
      label: "Flows", 
      value: cluster.flow_count, 
      icon: "⟳",
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    { 
      label: "Screens", 
      value: cluster.screen_count, 
      icon: "◫",
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.1)",
    },
    { 
      label: "Programs", 
      value: cluster.program_count, 
      icon: "◈",
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.1)",
    },
    { 
      label: "Tables", 
      value: cluster.table_count, 
      icon: "▤",
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div style={{ padding: "24px", color: "#ffffff" }}>
      {/* Header */}
      <div 
        style={{ 
          marginBottom: "24px",
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "flex-start", 
          justifyContent: "space-between",
          marginBottom: "12px",
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: "16px", 
            fontWeight: "700",
            lineHeight: "1.3",
            maxWidth: "70%",
            color: "#ffffff",
          }}>
            {cluster.cluster_id}
          </h3>
          <span
            style={{
              background: typeStyles.gradient,
              color: "#ffffff",
              padding: "4px 14px",
              borderRadius: "14px",
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: `0 4px 12px ${typeStyles.glow}`,
            }}
          >
            {cluster.type.replace("_", " ")}
          </span>
        </div>
        
        {/* Topic */}
        <p style={{ 
          margin: 0, 
          fontSize: "13px", 
          color: "rgba(255,255,255,0.5)",
          lineHeight: "1.5",
        }}>
          {cluster.topic}
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ 
          margin: "0 0 14px 0", 
          fontSize: "11px", 
          color: "rgba(255,255,255,0.4)",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}>
          Metrics
        </h4>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "12px",
        }}>
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "14px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Accent bar */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "3px",
                background: metric.color,
              }} />
              
              <div style={{ 
                fontSize: "10px", 
                color: "rgba(255,255,255,0.4)",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span style={{ color: metric.color }}>{metric.icon}</span>
                {metric.label}
              </div>
              <div style={{ 
                fontSize: "24px", 
                fontWeight: "700", 
                color: metric.color,
              }}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dependencies Section */}
      {dependencyInfo && (
        <div>
          <h4
            style={{
              margin: "0 0 14px 0",
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "14px" }}>⬡</span> Dependencies
          </h4>

          {/* Depends On */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#ef4444",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ 
                width: "18px", 
                height: "18px", 
                background: "rgba(239, 68, 68, 0.15)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}>↑</span>
              Depends On ({dependencyInfo.depends_on?.count || 0})
            </div>
            
            {dependencyInfo.depends_on && dependencyInfo.depends_on.count > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {dependencyInfo.depends_on.clusters.map((dep, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ 
                      fontWeight: "600", 
                      color: "#fca5a5",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}>
                      {dep.cluster_id}
                    </div>
                    <div style={{ 
                      color: "rgba(255,255,255,0.4)", 
                      fontSize: "10px",
                      fontFamily: "monospace",
                    }}>
                      Table: {dep.table}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  padding: "12px",
                  borderRadius: "8px",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "11px",
                  textAlign: "center",
                }}
              >
                No dependencies
              </div>
            )}
          </div>

          {/* Depended By */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#22c55e",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ 
                width: "18px", 
                height: "18px", 
                background: "rgba(34, 197, 94, 0.15)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}>↓</span>
              Depended By ({dependencyInfo.depended_by?.count || 0})
            </div>
            
            {dependencyInfo.depended_by && dependencyInfo.depended_by.count > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {dependencyInfo.depended_by.clusters.map((depCluster, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(34, 197, 94, 0.08)",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <div style={{ 
                      fontWeight: "600", 
                      color: "#86efac",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}>
                      {depCluster.cluster_id}
                    </div>
                    <div style={{ 
                      fontSize: "10px", 
                      color: "rgba(255,255,255,0.4)",
                    }}>
                      <span style={{ 
                        background: "rgba(255,255,255,0.1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        marginRight: "8px",
                      }}>
                        {depCluster.type}
                      </span>
                      Flows: {depCluster.flow_count} | Screens: {depCluster.screen_count}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  padding: "12px",
                  borderRadius: "8px",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "11px",
                  textAlign: "center",
                }}
              >
                No clusters depend on this one
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
