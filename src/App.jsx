import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";
import { ScreenFlowView } from "./components/ScreenFlowView";
import { ClusterView } from "./components/ClusterView";
import { HexagonalStackView } from "./components/HexagonalStackView";
import { DependencyGraphView } from "./components/DependencyGraphView";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState("screen-flow");

  const tabs = [
    { id: "screen-flow", label: "Screen Flow", icon: "🔄" },
    { id: "cluster", label: "Cluster View", icon: "📊" },
    // { id: "hexagonal", label: "Hexagonal Stack", icon: "📐" },
    { id: "dependencies", label: "Dependency Graph", icon: "🔗" },
    { id: "dashboard", label: "Dashboard", icon: "📈" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #ddd",
          background: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "14px 20px",
              border: "none",
              background: activeTab === tab.id ? "white" : "#f5f5f5",
              borderBottom: activeTab === tab.id ? "3px solid #2196f3" : "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeTab === tab.id ? "600" : "500",
              color: activeTab === tab.id ? "#2196f3" : "#666",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <ReactFlowProvider>
          {activeTab === "screen-flow" && <ScreenFlowView />}
          {activeTab === "cluster" && <ClusterView />}
          {activeTab === "hexagonal" && <HexagonalStackView />}
          {activeTab === "dependencies" && <DependencyGraphView />}
          {activeTab === "dashboard" && <Dashboard />}
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
