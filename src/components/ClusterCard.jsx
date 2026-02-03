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
        <h4 style={{ margin: "0", fontSize: "13px", fontWeight: "600" }}>
          {cluster.cluster_id}
        </h4>
        <span
          style={{
            background: getTypeColor(cluster.type),
            color: "white",
            padding: "3px 8px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {cluster.type}
        </span>
      </div>

      <p
        style={{
          margin: "6px 0",
          fontSize: "11px",
          color: "#666",
          lineHeight: "1.3",
        }}
      >
        {cluster.topic}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          fontSize: "11px",
          marginTop: "8px",
        }}
      >
        <div style={{ background: "#f5f5f5", padding: "4px 6px", borderRadius: "4px" }}>
          <strong>Flows:</strong> {cluster.flow_count}
        </div>
        <div style={{ background: "#f5f5f5", padding: "4px 6px", borderRadius: "4px" }}>
          <strong>Screens:</strong> {cluster.screen_count}
        </div>
        <div style={{ background: "#f5f5f5", padding: "4px 6px", borderRadius: "4px" }}>
          <strong>Programs:</strong> {cluster.program_count}
        </div>
        <div style={{ background: "#f5f5f5", padding: "4px 6px", borderRadius: "4px" }}>
          <strong>Tables:</strong> {cluster.table_count}
        </div>
      </div>
    </div>
  );
}
