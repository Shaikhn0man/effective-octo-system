export function ClusterCard({ cluster, isSelected, onClick }) {
  const getTypeColor = (type) => {
    return type === "CLEAN_CUT" ? "#4caf50" : "#ff9800";
  };

  return (
    <div
      onClick={onClick}
      style={{
        padding: "16px",
        margin: "8px",
        border: isSelected ? "3px solid #2196f3" : "1px solid #ddd",
        borderRadius: "8px",
        cursor: "pointer",
        background: isSelected ? "#e3f2fd" : "#fff",
        transition: "all 0.3s ease",
        boxShadow: isSelected ? "0 4px 12px rgba(33,150,243,0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "8px",
        }}
      >
        <h4 style={{ margin: "0", fontSize: "14px", fontWeight: "700" }}>
          {cluster.cluster_id}
        </h4>
        <span
          style={{
            background: getTypeColor(cluster.type),
            color: "white",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          {cluster.type}
        </span>
      </div>

      <p
        style={{
          margin: "8px 0",
          fontSize: "13px",
          color: "#666",
          lineHeight: "1.4",
        }}
      >
        {cluster.topic}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          fontSize: "14px",
          marginTop: "12px",
        }}
      >
        <div style={{ background: "#f5f5f5", padding: "6px 10px", borderRadius: "4px" }}>
          <strong style={{ fontSize: "12px", color: "#64748b" }}>FLOWS:</strong> <span style={{ fontSize: "16px", fontWeight: "700" }}>{cluster.flow_count}</span>
        </div>
        <div style={{ background: "#f5f5f5", padding: "6px 10px", borderRadius: "4px" }}>
          <strong style={{ fontSize: "12px", color: "#64748b" }}>SCREENS:</strong> <span style={{ fontSize: "16px", fontWeight: "700" }}>{cluster.screen_count}</span>
        </div>
        <div style={{ background: "#f5f5f5", padding: "6px 10px", borderRadius: "4px" }}>
          <strong style={{ fontSize: "12px", color: "#64748b" }}>PROGRAMS:</strong> <span style={{ fontSize: "16px", fontWeight: "700" }}>{cluster.program_count}</span>
        </div>
        <div style={{ background: "#f5f5f5", padding: "6px 10px", borderRadius: "4px" }}>
          <strong style={{ fontSize: "12px", color: "#64748b" }}>TABLES:</strong> <span style={{ fontSize: "16px", fontWeight: "700" }}>{cluster.table_count}</span>
        </div>
      </div>
    </div>
  );
}
