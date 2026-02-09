import { useState } from 'react';
import { clusterData } from '../data/clusterData';
import { cutExplorerData } from '../data/cutExplorerData';

// SVG Icons
const OverviewIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const FlowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6"></path>
    <path d="M17 7l-5 5-5-5"></path>
  </svg>
);

const DatabaseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const CodeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const NodeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
    <line x1="12" y1="17" x2="12" y2="22"></line>
    <line x1="8" y1="22" x2="16" y2="22"></line>
  </svg>
);

const DBInteractionIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <polyline points="9 11 12 14 15 11"></polyline>
  </svg>
);

// Tab Components
function SystemOverview({ data, cutId }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Stats Bar */}
      <section
        style={{
          display: "flex",
          gap: "32px",
          background: "rgba(255,255,255,0.02)",
          padding: "24px 32px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {Object.entries(data.stats).map(([key, val]) => (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {key}
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: "700", color: "#fff" }}
            >
              {val}
            </span>
          </div>
        ))}
      </section>

      {/* Business Summary */}
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)",
          padding: "32px",
          borderRadius: "24px",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "800",
            color: "#3b82f6",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "20px",
          }}
        >
          Business Summary
        </h2>
        <div style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: "1.6" }}>
          {getBusinessSummary(cutId, data)}
        </div>
      </section>

      {/* Architecture Pattern */}
      <section
        style={{
          background: "rgba(15, 23, 42, 0.5)",
          padding: "24px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "800",
            color: "#f59e0b",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "20px",
          }}
        >
          Architecture Pattern
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "16px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              TYPE
            </div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              {data.type.replace("_", " ")}
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              TIER
            </div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              {cutId <= 2 ? "Online Interactive" : "Batch Processing"}
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              OPERATIONS
            </div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              {cutId <= 2 ? "read + write" : "read-only"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FlowsTabHeader({
  activeTab,
  onTabChange,
  showDataOps,
  setShowDataOps,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "#1e293b", // Updated to match the dark theme
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "#3b82f6",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FlowIcon />
          </div>
          <div>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "800",
                color: "#e2e8f0",
                margin: "0",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              FLOW EXPLORATION
            </h2>
            <p
              style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "1px" }}
            >
              EXECUTION MAPPING & LOGIC HIERARCHIES
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            background: "#0f172a",
            borderRadius: "8px",
            padding: "4px",
          }}
        >
          <button
            onClick={() => onTabChange("executionTrace")}
            style={{
              padding: "8px 16px",
              background:
                activeTab === "executionTrace" ? "#3b82f6" : "transparent",
              color: activeTab === "executionTrace" ? "#fff" : "#94a3b8",
              border:
                activeTab === "executionTrace"
                  ? "1px solid #3b82f6"
                  : "1px solid transparent",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "executionTrace") {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "executionTrace") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#94a3b8";
              }
            }}
          >
            EXECUTION TRACE
          </button>
          <button
            onClick={() => onTabChange("programs")}
            style={{
              padding: "8px 16px",
              background: activeTab === "programs" ? "#3b82f6" : "transparent",
              color: activeTab === "programs" ? "#fff" : "#94a3b8",
              border:
                activeTab === "programs"
                  ? "1px solid #3b82f6"
                  : "1px solid transparent",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "programs") {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "programs") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#94a3b8";
              }
            }}
          >
            PROGRAMS
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {activeTab === "executionTrace" && (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: "700",
              color: "#94a3b8",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}
          >
            <input
              type="checkbox"
              checked={showDataOps}
              onChange={(e) => setShowDataOps(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            SHOW DATA OPS
          </label>
        )}
        {activeTab === "executionTrace" && (
          <button
            style={{
              padding: "8px 20px",
              background: "#0f172a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3b82f6";
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0f172a";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            EXPAND VIEW
          </button>
        )}
      </div>
    </div>
  );
}

function FlowDiagram({ data, cutId, cutData }) {
  const [activeTab, setActiveTab] = useState("executionTrace");
  const [showDataOps, setShowDataOps] = useState(false);
  const [showTechDebt, setShowTechDebt] = useState(false);

  const debtColorMap = {
    "GOD_MODULE": { label: "GOD MODULE", bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "rgba(239, 68, 68, 0.3)" },
    "CRITICAL_LOGIC": { label: "CRITICAL LOGIC", bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "rgba(239, 68, 68, 0.3)" },
    "DEAD_CODE": { label: "DEAD CODE", bg: "rgba(100, 116, 139, 0.15)", color: "#94a3b8", border: "rgba(100, 116, 139, 0.3)" },
    "DEAD_CODE_LIKELY": { label: "DEAD CODE", bg: "rgba(100, 116, 139, 0.15)", color: "#94a3b8", border: "rgba(100, 116, 139, 0.3)" },
    "CHATTY_DB": { label: "CHATTY DB", bg: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "rgba(59, 130, 246, 0.3)" },
    "DEEP_NESTING": { label: "DEEP NESTING", bg: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6", border: "rgba(139, 92, 246, 0.3)" },
    "TIGHT_COUPLING": { label: "TIGHT COUPLING", bg: "rgba(180, 83, 9, 0.15)", color: "#f59e0b", border: "rgba(180, 83, 9, 0.3)" },
    "HARDCODED_VALUES": { label: "HARDCODED VALUES", bg: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" },
    "SHARED_STATE": { label: "SHARED STATE", bg: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "rgba(59, 130, 246, 0.3)" },
    "MISSING_ERROR_HANDLING": { label: "MISSING ERR HANDLING", bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "rgba(239, 68, 68, 0.3)" },
    "DUPLICATED_LOGIC": { label: "DUPLICATED LOGIC", bg: "rgba(236, 72, 153, 0.15)", color: "#ec4899", border: "rgba(236, 72, 153, 0.3)" },
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const PulsateStyle = () => (
    <style>{`
      @keyframes pulse-glow {
        0% { opacity: 0.8; transform: scale(1); filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.4)); }
        50% { opacity: 1; transform: scale(1.02); filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.8)); }
        100% { opacity: 0.8; transform: scale(1); filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.4)); }
      }
      .glowing-god-tag {
        animation: pulse-glow 2s infinite ease-in-out;
        display: inline-flex;
        align-items: center;
      }
    `}</style>
  );

  const highlightFlowData = (text, debtMap) => {
    if (!text) return text;
    return text.split("\n").map((line, i) => {
      let content = line;
      // 1. Implementation of "Tab Indentation" for the Hierarchy
      content = content.replace(/^([│├└─\s]+)/, (match) => {
        // Replace single spaces with wider chunks to create the "Tab" effect from your image
        let wideIndent = match.replace(/ /g, '&nbsp;&nbsp;&nbsp;');
        // stylize the actual tree markers (│, ├, └, ─)
        return wideIndent.replace(/([│├└─])/g, '<span style="color: #3b82f6; opacity: 1; font-weight: 900; filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.4)); font-family: monospace; font-size: 18px; position: relative; top: 1px;">$1</span>');
      });

      // 2. Tech debt or error highlighting
      if (showTechDebt && content.includes("#ON-ERROR")) {
        content = content.replace("#ON-ERROR", '<span style="color: #ef4444; font-weight: 800; background: rgba(239, 68, 68, 0.1); padding: 2px 4px; border-radius: 4px;">#ON-ERROR</span>');
      }

      // 3. Highlight modules/programs and inject tech debt badges
      content = content.replace(/([A-Z0-9-]+)\[(.*?)\]/g, (match, methodName, pgmName) => {
        let replacement = `<span style="color: #fff; font-weight: 700; letter-spacing: 0.5px; margin-left: 12px;">${methodName}</span>`;
        replacement += `<span style="color: #94a3b8; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 4px; margin-left: 12px; border: 1px solid rgba(255,255,255,0.05);">[${pgmName}]</span>`;

        // Root element special handling for GOD MODULE
        if (i === 0 && showTechDebt) {
          replacement += `<span class="glowing-god-tag" style="margin-left: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 6px; background: rgba(239, 68, 68, 0.25); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.5); text-shadow: 0 0 10px rgba(239, 68, 68, 0.4);">GOD MODULE</span>`;
        }

        if (showTechDebt && debtMap && debtMap[methodName]) {
          const debtKey = debtMap[methodName];
          if (debtKey !== "GOD_MODULE") {
            const config = debtColorMap[debtKey] || { label: debtKey, bg: "rgba(255,255,255,0.05)", color: "#fff", border: "rgba(255,255,255,0.1)" };
            replacement += `<span style="margin-left: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 10px; border-radius: 4px; background: ${config.bg}; color: ${config.color}; border: 1px solid ${config.border}; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">${config.label}</span>`;
          }
        }
        return replacement;
      });

      // Highlight keywords like PROCESS, WRITE, READ if they exist
      if (content.includes("PROCESS:") || content.includes("WRITE:") || content.includes("READ:")) {
        content = content.replace(/(PROCESS:|WRITE:|READ:)/g, '<span style="color: #3b82f6; font-weight: 700; margin-right: 8px;">$1</span>');
      }

      return (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          minHeight: "36px", // Tightened for vertical line continuity
          whiteSpace: "pre",
          marginBottom: "0px",
          padding: "0 20px",
          borderRadius: "6px",
          transition: "all 0.2s ease",
          cursor: "default",
          borderLeft: "2px solid transparent"
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)";
            e.currentTarget.style.borderLeftColor = "#3b82f6";
            e.currentTarget.style.transform = "translateX(6px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderLeftColor = "transparent";
            e.currentTarget.style.transform = "translateX(0)";
          }}
          dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  const getProgramFlows = () => {
    if (!cutData || !cutData.sub_cuts) return <div style={{ color: "#64748b", fontStyle: "italic" }}>No data available</div>;

    const subCut = cutData.sub_cuts.find(
      (subCut) => subCut.flows && subCut.flows.length > 0
    );
    if (!subCut) return <div style={{ color: "#64748b", fontStyle: "italic" }}>No program flows available</div>;

    return subCut.flows.map((flow, index) => {
      // Build tech debt map for this specific flow
      const debtMap = {};
      flow.programs?.forEach(pgm => {
        pgm.methods?.forEach(method => {
          if (method.method_metadata?.tech_debt) {
            debtMap[method.name] = method.method_metadata.tech_debt;
          }
        });
      });

      return (
        <div
          key={index}
          style={{
            color: "#e2e8f0",
            background: "rgba(15, 23, 42, 0.3)",
            padding: "24px",
            borderRadius: "16px",
            overflowX: "auto",
            fontFamily: "'Fira Code', 'Roboto Mono', monospace",
            fontSize: "13px",
            lineHeight: "1.6",
            border: "1px solid rgba(255,255,255,0.03)"
          }}
        >
          {highlightFlowData(flow.program_flows, debtMap)}
        </div>
      );
    });
  };

  return (
    <div>
      <PulsateStyle />
      <FlowsTabHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showDataOps={showDataOps}
        setShowDataOps={setShowDataOps}
      />

      {activeTab === "executionTrace" ? (
        <div>
          {/* Existing Flow Diagram content */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {/* Flow Sequence */}
            <section
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)",
                padding: "32px",
                borderRadius: "24px",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "32px",
                }}
              >
                <div style={{ color: "#3b82f6" }}>
                  <NodeIcon />
                </div>
                <h2
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#3b82f6",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    margin: 0,
                  }}
                >
                  {cutId <= 2 ? "Screen Flow Sequence" : "Batch Process Flow"}
                </h2>
              </div>

              {data.sequence &&
                Array.isArray(data.sequence) &&
                data.sequence.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {data.sequence.map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      {row.map((node, j) => (
                        <div
                          key={j}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)",
                              border: "2px solid rgba(59, 130, 246, 0.3)",
                              padding: "14px 20px",
                              borderRadius: "12px",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#e2e8f0",
                              fontFamily: "var(--font-family)",
                              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              transition: "all 0.2s ease",
                              cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                              e.currentTarget.style.boxShadow =
                                "0 6px 16px rgba(59, 130, 246, 0.25)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(59, 130, 246, 0.15)";
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect
                                x="2"
                                y="7"
                                width="20"
                                height="10"
                                rx="2"
                                ry="2"
                              ></rect>
                            </svg>
                            {node}
                          </div>
                          {j < row.length - 1 && (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : data.batchFlow && Array.isArray(data.batchFlow) ? (
                <div
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    padding: "24px",
                    borderRadius: "12px",
                    fontFamily: "monospace",
                    color: "#22c55e",
                    borderLeft: "4px solid #22c55e",
                  }}
                >
                  <div style={{ marginBottom: "8px", color: "#64748b" }}>
                    // BATCH FLOW STEPS
                  </div>
                  {data.batchFlow.map((f, i) => (
                    <div key={i} style={{ marginBottom: "4px" }}>
                      PROCESS: {f}
                    </div>
                  ))}
                  {data.steps?.map((p, i) => (
                    <div key={i} style={{ marginTop: "16px" }}>
                      <div style={{ color: "#f59e0b" }}>{p.process}:</div>
                      {p.steps.map((s, j) => (
                        <div key={j} style={{ paddingLeft: "20px" }}>
                          └─ {s}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#64748b", fontStyle: "italic" }}>
                  No sequence or batch flow data available.
                </div>
              )}

              {/* Visual background element */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "120px",
                  fontWeight: "900",
                  opacity: 0.03,
                  pointerEvents: "none",
                }}
              >
                {cutId}
              </div>
            </section>

            {/* Interactive Table Interactions */}
            {data.interactions && data.interactions.length > 0 && (
              <section>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ color: "#64748b" }}>
                    <DBInteractionIcon />
                  </div>
                  <h2
                    style={{
                      fontSize: "14px",
                      fontWeight: "800",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      margin: 0,
                    }}
                  >
                    Database & Screen Interactions
                  </h2>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {data.interactions.map((int, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        padding: "20px",
                        borderRadius: "16px",
                        transition: "all 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor =
                          "rgba(59, 130, 246, 0.3)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.05)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "16px",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="7"
                            width="20"
                            height="10"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="12" y1="17" x2="12" y2="22"></line>
                          <line x1="8" y1="22" x2="16" y2="22"></line>
                        </svg>
                        <div
                          style={{
                            fontWeight: "800",
                            color: "#fff",
                            fontSize: "14px",
                          }}
                        >
                          {int.screen}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {int.reads && int.reads.length > 0 && (
                          <div
                            style={{
                              background: "rgba(34, 197, 94, 0.05)",
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "8px",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                              </svg>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#22c55e",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                Read Operations
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "6px",
                              }}
                            >
                              {int.reads.map((r) => (
                                <span
                                  key={r}
                                  style={{
                                    fontSize: "12px",
                                    color: "#94a3b8",
                                    background: "rgba(34, 197, 94, 0.1)",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontFamily: "var(--font-family)",
                                  }}
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {int.writes && int.writes.length > 0 && (
                          <div
                            style={{
                              background: "rgba(239, 68, 68, 0.05)",
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "8px",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#ef4444",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                Write Operations
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "6px",
                              }}
                            >
                              {int.writes.map((w) => (
                                <span
                                  key={w}
                                  style={{
                                    fontSize: "12px",
                                    color: "#94a3b8",
                                    background: "rgba(239, 68, 68, 0.1)",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontFamily: "var(--font-family)",
                                  }}
                                >
                                  {w}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%)",
          padding: "40px",
          borderRadius: "32px",
          border: "1px solid rgba(255,255,255,0.08)",
          minHeight: "600px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            paddingBottom: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(59, 130, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6"
              }}>
                <CodeIcon />
              </div>
              <div>
                <h2 style={{ 
                  fontSize: "14px", 
                  fontWeight: "800", 
                  color: "#fff", 
                  textTransform: "uppercase", 
                  letterSpacing: "2px",
                  margin: 0
                }}>
                  PROGRAM EXECUTION TRACE
                </h2>
                <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "1px" }}>
                  DETAILED LOGIC FLOW AND PROGRAM CALL HIERARCHIES
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: showTechDebt ? "#3b82f6" : "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
                SHOW TECH DEBT SIGNALS
              </span>
              <button
                onClick={() => setShowTechDebt(!showTechDebt)}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  background: showTechDebt ? "#3b82f6" : "#1e293b",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  padding: 0,
                  boxShadow: showTechDebt ? "0 0 12px rgba(59, 130, 246, 0.4)" : "none"
                }}
                onMouseEnter={(e) => {
                  if (!showTechDebt) {
                    e.currentTarget.style.background = "#2d3748";
                  } else {
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(59, 130, 246, 0.6)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showTechDebt) {
                    e.currentTarget.style.background = "#1e293b";
                  } else {
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(59, 130, 246, 0.4)";
                  }
                }}
              >
                <div style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: "3px",
                  left: showTechDebt ? "23px" : "3px",
                  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }} />
              </button>
            </div>
          </div>

          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "20px",
            padding: "8px",
            border: "1px solid rgba(255,255,255,0.03)"
          }}>
            {getProgramFlows()}
          </div>
        </div>
      )}

      {/* Visual background element */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "120px",
          fontWeight: "900",
          opacity: 0.03,
          pointerEvents: "none",
        }}
      >
        {cutId}
      </div>
    </div>
  );
}

function DatabaseMap({ data, cutId }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Master Tables */}
      <section
        style={{
          background: "rgba(15, 23, 42, 0.5)",
          padding: "24px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "800",
            color: "#ef4444",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "20px",
          }}
        >
          Master Tables (Write Operations)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.tables.master?.map((t) => (
            <div
              key={t.name}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: "12px",
                background: "rgba(239, 68, 68, 0.05)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  marginBottom: "8px",
                }}
              >
                &lt;{t.name}&gt;
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#ef4444",
                    fontWeight: "700",
                  }}
                >
                  ◄══ WRITE ══
                </span>{" "}
                {t.writes}
              </div>
              {t.reads && (
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#22c55e",
                      fontWeight: "700",
                    }}
                  >
                    ──► READ ──►
                  </span>{" "}
                  {t.reads}
                </div>
              )}
            </div>
          ))}
          {(!data.tables.master || data.tables.master.length === 0) && (
            <div
              style={{
                fontSize: "12px",
                color: "#475569",
                fontStyle: "italic",
              }}
            >
              No Master Table Operations
            </div>
          )}
        </div>
      </section>

      {/* Reference Tables */}
      <section
        style={{
          background: "rgba(15, 23, 42, 0.5)",
          padding: "24px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "800",
            color: "#22c55e",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "20px",
          }}
        >
          Reference Tables (Read Operations)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.tables.reference?.map((t) => (
            <div
              key={t.name}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: "12px",
                background: "rgba(34, 197, 94, 0.05)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  marginBottom: "4px",
                }}
              >{`{${t.name}}`}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#22c55e",
                    fontWeight: "700",
                  }}
                >
                  ──► READ ──►
                </span>{" "}
                {t.reads}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-Cut Dependencies */}
      {data.dependencies && (
        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#3b82f6",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Cross-Cut Dependencies
          </div>
          <div
            style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}
          >
            {data.dependencies.readsFrom && (
              <div>← Reads from: {data.dependencies.readsFrom}</div>
            )}
            {data.dependencies.providesTo && (
              <div>→ Provides to: {data.dependencies.providesTo}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ASCIIChart({ data, cutId }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <section
        style={{
          background: "rgba(0,0,0,0.3)",
          padding: "32px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "var(--font-family)",
          fontSize: "14px",
          lineHeight: "1.4",
          color: "#e2e8f0",
          overflow: "auto",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
            color: "#3b82f6",
            fontSize: "14px",
            fontWeight: "800",
          }}
        >
          ASCII SYSTEM FLOW CHART - CUT {cutId}
        </div>

        <div style={{ whiteSpace: "pre-wrap" }}>
          {getASCIIChart(cutId, data)}
        </div>
      </section>
    </div>
  );
}

// Helper functions
function DeepDiveOverview({ data, cutId, clusterId }) {
  const cluster = clusterData.clusters.find(c => c.id === clusterId);
  const stats = cluster?.stats || data.stats;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Discovery Map Section (Top) */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0'
      }}>
        {/* Root Domain Node */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '100px',
          padding: '12px 32px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 2,
          marginBottom: '40px',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3b82f6'
          }}>
            <NodeIcon />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{data.name}</span>
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>CORE DOMAIN</span>
          </div>
        </div>

        {/* Radiating Sub-nodes with Pulsating Curved Connections */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          gap: '24px',
          paddingTop: '20px',
          zIndex: 1
        }}>
          {/* SVG Overlay for curved pulsating lines - Fixed with numeric coordinates */}
          <svg 
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: '-60px',
              left: 0,
              width: '100%',
              height: '100px',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          >
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {cluster?.sub_cuts?.map((_, i) => {
              const count = cluster.sub_cuts.length;
              const spacing = 1000 / (count + 1);
              const xPos = (i + 1) * spacing;
              return (
                <g key={i}>
                  <path 
                    d={`M 500 0 C 500 40, ${xPos} 20, ${xPos} 80`}
                    stroke="rgba(59, 130, 246, 0.2)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path 
                    d={`M 500 0 C 500 40, ${xPos} 20, ${xPos} 80`}
                    stroke="url(#lineGrad)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="15 35"
                    style={{ animation: 'pulsateLines 4s infinite linear' }}
                  />
                </g>
              );
            })}
          </svg>

          {cluster?.sub_cuts?.map((sub, idx) => (
            <div key={idx} style={{
              flex: '1',
              maxWidth: '260px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              color: '#fff',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <CodeIcon />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sub.topic}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                Management of business logic and data patterns for {sub.topic.toLowerCase()}.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Entities Section (Middle) */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>CORE DOMAIN ENTITIES</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {[...(data.tables?.master || []), ...(data.tables?.reference || [])].map((table, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '30px',
              padding: '10px 24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <span style={{ color: '#3b82f6' }}><DatabaseIcon /></span>
              {table.name.split('-').shift()}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Layout: Identity & Principal Screens (Two Columns) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        marginTop: '20px'
      }}>
        {/* Identity & Scope Panel */}
        <section style={{
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '24px',
          padding: '40px',
          color: '#fff',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          backdropFilter: 'blur(8px)',
          transition: 'border-color 0.3s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.15)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#3b82f6' }}><OverviewIcon /></span>
            <span style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>IDENTITY & SCOPE</span>
          </div>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.7', fontWeight: '500' }}>
            {cluster?.description || data.description || "Manages the complete lifecycle of system operations, providing an integrated platform for data processing and business logic execution."}
          </p>

          {/* Detailed Stats Horizontal Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: 'auto' }}>
            {[
              { label: 'SCREENS', value: stats.screen_count || stats.flows || 0 },
              { label: 'PROGRAMS', value: stats.program_count || 17 },
              { label: 'TABLES', value: (data.tables?.master?.length || 0) + (data.tables?.reference?.length || 0) },
              { label: 'DB CALLS', value: '511' }
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                padding: '24px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
              >
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>{stat.value}</span>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Principal Screens Panel */}
        <section style={{
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '24px',
          padding: '40px',
          color: '#fff',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          backdropFilter: 'blur(8px)',
          transition: 'border-color 0.3s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981' }}><CodeIcon /></span>
            <span style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>PRINCIPAL SCREENS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.interactions?.length > 0 ? data.interactions.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(16, 185, 129, 0.03)',
                borderRadius: '16px',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.1)';
              }}
              >
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', letterSpacing: '0.5px' }}>{item.screen}</span>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                  {item.screen === 'COSGN0A' ? 'User Login' : 
                   item.screen === 'CCRDLIA' ? 'Card List' :
                   item.screen === 'CCRDSLA' ? 'Card Detail' :
                   item.screen === 'CCRDUPA' ? 'Card Update' : 'Screen Interface'}
                </span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '40px' }}>
                Batch Process - No Interactive Screens
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function getBusinessSummary(cutId, data) {
  const summaries = {
    1: "Primary interactive system for credit card account management. Handles all customer-facing operations including account creation, card management, transaction processing, and billing. Serves as the main data entry point for the entire system with 14 integrated screens managing the complete customer lifecycle.",
    2: "Security and user access management system. Controls user authentication, authorization, and administrative functions. Provides secure access controls for all system users and maintains audit trails for security compliance.",
    3: "Automated loan account processing and reporting system. Generates comprehensive transaction reports and manages customer loan account data through batch processing operations.",
    4: "Sequential cardholder record processing system. Performs systematic review and reporting of all cardholder records for compliance and audit purposes.",
    5: "Cross-reference file processing with status tracking. Maintains data integrity across system components by processing and validating cross-reference relationships.",
    6: "Batch processing utility for execution timing control. Manages scheduling delays and timing coordination for batch job sequences.",
    7: "Multi-format account data output system. Transforms account records into various output formats for different reporting and integration requirements.",
    8: "Automated monthly interest calculation and accrual processing. Critical financial system component that computes and applies interest charges to customer accounts.",
    9: "Customer record retrieval and display system. Provides systematic access to customer information for reporting and analysis purposes.",
    10: "Comprehensive financial data export system. Creates consolidated export files containing all customer, account, and transaction data for external systems.",
    11: "Customer data import processing system. Handles incoming customer data from external sources and integrates it into the main system databases.",
    12: "Entity update processing for statement generation. Manages data processes required for customer statement generation and entity updates.",
    13: "Daily transaction verification system. Validates and verifies all daily card transactions to ensure data integrity and compliance.",
  };
  return (
    summaries[cutId] ||
    "System component for specialized processing operations."
  );
}

function getASCIIChart(cutId, data) {
  if (data?.asciiChart) {
    return data.asciiChart;
  }

  return `================================================================================
TYPE: ${data.type}
FLOWS: ${data.stats.flows} flows
TABLES: ${data.stats.tables} tables
================================================================================

${data.batchFlow ? "BATCH PROCESS: " + data.batchFlow.join(" → ") : "INTERACTIVE SCREENS"}

${data.dependencies
      ? `DEPENDENCIES:
  ${data.dependencies.readsFrom ? "◄── Reads from: " + data.dependencies.readsFrom : ""}
  ${data.dependencies.providesTo ? "──► Provides to: " + data.dependencies.providesTo : ""}`
      : "No cross-cut dependencies"
    }`;
}

export function CutExplorer({ clusterId, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const cutId = parseInt(clusterId.match(/Cut_(\d+)_/)?.[1]);
  const data = cutExplorerData[cutId];
  const cutData = clusterData.clusters.find(c => c.cut_seq_no === cutId);

  if (!data) return null;

  const tabs = [
    { id: 'overview', label: 'Deep Dive', icon: <OverviewIcon /> },
    { id: 'legacy', label: 'System Overview', icon: <OverviewIcon /> },
    { id: 'flow', label: 'Flow Diagram', icon: <FlowIcon /> },
    { id: 'database', label: 'Database Map', icon: <DatabaseIcon /> },
    { id: 'ascii', label: 'ASCII Chart', icon: <CodeIcon /> }
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2, 6, 23, 0.9)",
        backdropFilter: "blur(16px)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.3s ease-out",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(2, 6, 23, 0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              background: data.type === "CLEAN_CUT" ? "#22c55e" : "#f59e0b",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 12px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {data.type.replace("_", " ")}
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              letterSpacing: "-0.5px",
            }}
          >
            {data.name}
          </h1>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "700",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
          }
        >
          Exit Explorer
        </button>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          padding: "0 40px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(2, 6, 23, 0.3)",
        }}
      >
        <div style={{ display: "flex", gap: "0" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background:
                  activeTab === tab.id
                    ? "rgba(59, 130, 246, 0.2)"
                    : "transparent",
                border: "none",
                color: activeTab === tab.id ? "#3b82f6" : "#94a3b8",
                padding: "16px 24px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#e2e8f0";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '40px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%'
      }}>
        {activeTab === 'overview' && <DeepDiveOverview data={data} cutId={cutId} clusterId={clusterId} />}
        {activeTab === 'legacy' && <SystemOverview data={data} cutId={cutId} />}
        {activeTab === 'flow' && <FlowDiagram data={data} cutId={cutId} />}
        {activeTab === 'database' && <DatabaseMap data={data} cutId={cutId} />}
        {activeTab === 'ascii' && <ASCIIChart data={data} cutId={cutId} />}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulsateLines {
          0% { stroke-dashoffset: 30; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
