export function ClusterDependencySection({ depends_on, depended_by }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h4
        style={{
          margin: "0 0 12px 0",
          fontSize: "12px",
          color: "#666",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        📊 Dependencies
      </h4>

      {/* Depends On */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            color: "#d32f2f",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ⬆️ Depends On ({depends_on?.count || 0})
        </div>
        {depends_on && depends_on.count > 0 ? (
          <div style={{ paddingLeft: "0px" }}>
            {depends_on.clusters.map((dep, idx) => (
              <div
                key={idx}
                style={{
                  background: "#ffebee",
                  border: "1px solid #ef5350",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "6px",
                  fontSize: "11px",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#c62828" }}>
                  {dep.cluster_id}
                </div>
                <div style={{ color: "#666", fontSize: "10px", marginTop: "4px" }}>
                  Table: <span style={{ fontFamily: "monospace" }}>{dep.table}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "4px",
              color: "#999",
              fontSize: "11px",
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
            fontWeight: "bold",
            color: "#388e3c",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ⬇️ Depended By ({depended_by?.count || 0})
        </div>
        {depended_by && depended_by.count > 0 ? (
          <div>
            {depended_by.clusters.map((cluster, idx) => (
              <div
                key={idx}
                style={{
                  background: "#e8f5e9",
                  border: "1px solid #66bb6a",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "6px",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#2e7d32", fontSize: "11px" }}>
                  {cluster.cluster_id}
                </div>
                <div style={{ fontSize: "10px", color: "#666", marginTop: "4px" }}>
                  Type: <span style={{ fontWeight: "600" }}>{cluster.type}</span> | Flows:{" "}
                  {cluster.flow_count} | Screens: {cluster.screen_count}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "4px",
              color: "#999",
              fontSize: "11px",
            }}
          >
            No clusters depend on this one
          </div>
        )}
      </div>
    </div>
  );
}
