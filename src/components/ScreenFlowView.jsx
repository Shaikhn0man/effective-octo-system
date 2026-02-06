import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { screenFlowData } from "../data/screenFlowData";

export function ScreenFlowView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(screenFlowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(screenFlowData.edges);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
