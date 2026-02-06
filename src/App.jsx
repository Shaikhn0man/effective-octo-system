import { Info, LayoutDashboard, Network, Workflow } from "lucide-react";
import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";
import { ClusterView } from "./components/ClusterView";
import { Dashboard } from "./components/Dashboard";
import { HexagonalStackView } from "./components/HexagonalStackView";
import { InfoModal } from "./components/InfoModal";
import { ScreenFlowView } from "./components/ScreenFlowView";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to Dashboard for better first impression
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "screen-flow", label: "Screen Flow", icon: <Workflow size={18} /> },
    { id: "cluster", label: "Cluster View", icon: <Network size={18} /> },
    // { id: "hexagonal", label: "Hexagonal Stack", icon: "📐" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#020617" }}>
      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: "64px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(2, 6, 23, 0.8)",
          backdropFilter: "blur(12px)",
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            marginRight: '32px', 
            fontWeight: '900', 
            fontSize: '16px', 
            color: '#fff', 
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }} />
            RapidX
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "99px",
                    border: "1px solid",
                    borderColor: isActive ? "rgba(59, 130, 246, 0.5)" : "transparent",
                    background: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#fff" : "#94a3b8",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#e2e8f0";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Button - Subtle design */}
        <button
          onClick={() => setIsInfoOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <Info size={16} strokeWidth={2} />
          <span>About</span>
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <ReactFlowProvider>
          {activeTab === "screen-flow" && <ScreenFlowView />}
          {activeTab === "cluster" && <ClusterView />}
          {activeTab === "hexagonal" && <HexagonalStackView />}
          {activeTab === "dashboard" && <Dashboard />}
        </ReactFlowProvider>
      </div>

      {/* Info Modal */}
      {isInfoOpen && <InfoModal onClose={() => setIsInfoOpen(false)} />}
    </div>
  );
}

export default App;
