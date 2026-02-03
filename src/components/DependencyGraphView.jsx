import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { clusterDependencyMapData } from "../data/clusterDependencyData";

export function DependencyGraphView() {
  const generateNodesAndEdges = () => {
    const nodes = [];
    const edges = [];
    const clustersWithDeps = clusterDependencyMapData.dependency_map.filter(
      (c) => c.depends_on_count > 0
    );

    // Create nodes
    const nodeMap = {};
    clusterDependencyMapData.dependency_map.forEach((cluster, idx) => {
      const hasOutgoing = cluster.depends_on_count > 0;
      const color =
        cluster.type === "CLEAN_CUT"
          ? hasOutgoing
            ? "#ff6b6b"
            : "#4caf50"
          : "#ff9800";

      nodes.push({
        id: cluster.cluster_id,
        data: {
          label: cluster.cluster_id.replace("Cut_", "C_"),
        },
        position: {
          x: (idx % 5) * 300,
          y: Math.floor(idx / 5) * 200,
        },
        style: {
          background: color,
          color: "white",
          border: `2px solid ${color}`,
          borderRadius: "8px",
          padding: "10px",
          fontSize: "11px",
          fontWeight: "bold",
          textAlign: "center",
          width: "140px",
        },
      });
      nodeMap[cluster.cluster_id] = cluster;
    });

    // Create edges
    clusterDependencyMapData.dependency_map.forEach((cluster) => {
      cluster.depends_on.forEach((dep) => {
        edges.push({
          id: `${cluster.cluster_id}->${dep.cluster_id}`,
          source: cluster.cluster_id,
          target: dep.cluster_id,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: {
            stroke: "#666",
            strokeWidth: 2,
          },
          label: dep.table ? dep.table : "",
          labelStyle: { fontSize: "10px", background: "white", padding: "4px" },
        });
      });
    });

    return { nodes, edges };
  };

  const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(255,255,255,0.9)",
          padding: "12px",
          borderRadius: "6px",
          fontSize: "11px",
          zIndex: 10,
          maxWidth: "250px",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Cluster Dependency Graph</div>
        <div style={{ color: "#666", fontSize: "10px", lineHeight: "1.5" }}>
          <div>🟢 Green = Clean Cut (No dependencies)</div>
          <div>🔴 Red = Clean Cut (Has dependencies)</div>
          <div>🟠 Orange = Read Only Cut</div>
          <div style={{ marginTop: "8px" }}>Arrows show dependency direction</div>
        </div>
      </div>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
