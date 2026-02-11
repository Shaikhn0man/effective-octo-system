import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactFlow, {
    Background,
    Controls,
    Handle,
    MarkerType,
    Position,
    useEdgesState,
    useNodesState,
    useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import remarkGfm from 'remark-gfm';
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

const DependenciesIcon = () => (
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
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const DataIcon = () => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="9" y1="21" x2="9" y2="9"></line>
  </svg>
);

const TestsIcon = () => (
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
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
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

const SparklesIcon = () => (
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
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="m5 3 1 2"></path>
    <path d="m19 21 1-2"></path>
    <path d="m5 21 1-2"></path>
    <path d="m19 3 1-2"></path>
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
          border: "1px solid rgba(59, 130, 246, 0.15)",
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
          border: "1px solid rgba(59, 130, 246, 0.15)",
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
              border: "1px solid rgba(59, 130, 246, 0.1)",
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
              border: "1px solid rgba(59, 130, 246, 0.1)",
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
              border: "1px solid rgba(59, 130, 246, 0.1)",
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
  onExpandFlow,
}) {
  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: isActive ? "rgba(59, 130, 246, 0.2)" : "transparent",
        color: isActive ? "#3b82f6" : "#94a3b8",
        border: isActive ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        fontWeight: "700",
        fontSize: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
          e.currentTarget.style.color = "#60a5fa";
          e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#94a3b8";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        }
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "#1e293b",
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
            gap: "12px",
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "10px",
            padding: "6px",
            border: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        >
          <TabButton
            id="executionTrace"
            label="Execution Trace"
            isActive={activeTab === "executionTrace"}
            onClick={() => onTabChange("executionTrace")}
          />
          <TabButton
            id="programs"
            label="Programs"
            isActive={activeTab === "programs"}
            onClick={() => onTabChange("programs")}
          />
        </div>
      </div>


    </div>
  );
}
const DatabasePopup = ({ isOpen, onClose, tableName, tableType, tableData, referenceLink }) => {
  if (!isOpen) return null;

  console.log('DatabasePopup rendered with:', { tableName, referenceLink, hasReferenceLink: !!referenceLink });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.6)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '85vh',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: '#fffdf5'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div style={{
                background: '#fcd34d',
                color: '#78350f',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {tableName}
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{tableName}</h2>
              <div style={{
                background: '#0f172a',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {tableType || 'MASTER'}
              </div>
              {referenceLink && (
                <a
                  href={referenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: '#3b82f6',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  VIEW
                </a>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
              {tableData.business_context || "Database Table Information"}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '24px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={e => e.target.style.color = '#0f172a'}
            onMouseLeave={e => e.target.style.color = '#94a3b8'}
          >
            ✕
          </button>
        </div>

        {/* Content - Table */}
        <div style={{
          padding: '0',
          overflow: 'auto',
          flex: 1,
          background: '#fff'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px 32px', color: '#94a3b8', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px' }}>Field Name</th>
                <th style={{ textAlign: 'center', padding: '16px 24px', color: '#94a3b8', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px' }}>Usage</th>
                <th style={{ textAlign: 'left', padding: '16px 24px', color: '#94a3b8', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px' }}>Type of Usage</th>
                <th style={{ textAlign: 'left', padding: '16px 32px', color: '#94a3b8', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px' }}>Business Context</th>
              </tr>
            </thead>
            <tbody>
              {tableData.fields && tableData.fields.map((field, idx) => {
                let usageBg = '#f3f4f6';
                let usageColor = '#6b7280';
                const usage = (field.usage || 'NONE').toUpperCase();

                if (usage === 'HEAVY') { usageBg = '#fecaca'; usageColor = '#ef4444'; }
                else if (usage === 'MEDIUM') { usageBg = '#fef3c7'; usageColor = '#f59e0b'; }
                else if (usage === 'LOW') { usageBg = '#dcfce7'; usageColor = '#22c55e'; }

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px 32px', fontWeight: '700', color: '#334155', fontFamily: 'monospace' }}>{field.name}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <span style={{
                        background: usageBg,
                        color: usageColor,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '800',
                        letterSpacing: '0.5px'
                      }}>
                        {usage}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#3b82f6', fontWeight: '600', fontFamily: 'monospace' }}>{field.type_of_usage}</td>
                    <td style={{ padding: '16px 32px', color: '#64748b' }}>{field.business_context}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {(!tableData.fields || tableData.fields.length === 0) && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No field data available for this table.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ScreenPopup = ({ isOpen, onClose, nodeName, asciiArt, topic, onNext, onPrev, hasNext, hasPrev }) => {
  if (!isOpen) return null;

  // Clean up the ASCII string if it's formatted as a JSON string array
  let lines = [];
  try {
    if (typeof asciiArt === 'string') {
      if (asciiArt.startsWith('[') && asciiArt.endsWith(']')) {
        // It's a string representation of a JSON array
        // Some are double escaped or have weird formatting in the data
        const cleaned = asciiArt.replace(/\\"/g, '"').replace(/\n/g, '');
        lines = JSON.parse(cleaned);
      } else {
        lines = asciiArt.split('\\n');
        if (lines.length === 1) {
          lines = asciiArt.split('\n');
        }
      }
    } else if (Array.isArray(asciiArt)) {
      lines = asciiArt;
    }
  } catch (e) {
    console.error("Error parsing ASCII art", e);
    lines = [asciiArt];
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.9)',
      backdropFilter: 'blur(16px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }} onClick={onClose}>
      <div style={{
        background: '#020617',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1300px',
        maxHeight: '90vh',
        boxShadow: '0 40px 100px -12px rgba(0, 0, 0, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(59, 130, 246, 0.05)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', fontSize: '10px', fontWeight: '900', letterSpacing: '1px' }}>
                CICS UI PREVIEW
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>{nodeName}</h2>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', fontWeight: '600' }}>{topic}</p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94a3b8',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              transition: 'all 0.2s',
              lineHeight: 1
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '40px',
          overflow: 'auto',
          background: '#000',
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'relative',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 100%)'
        }}>
          <pre style={{
            fontFamily: "'Fira Code', 'Roboto Mono', monospace",
            fontSize: '13px',
            lineHeight: '1.3',
            color: '#10b981', // Terminal green
            margin: 0,
            padding: '24px',
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '16px',
            border: '2px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15)',
            textShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
            whiteSpace: 'pre',
            width: '100%',
            maxWidth: '100%',
            overflow: 'auto',
            boxSizing: 'border-box'
          }}>
            {lines.join('\n')}
          </pre>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(2, 6, 23, 0.8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
            Press <kbd style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#fff' }}>ESC</kbd> or click outside to dismiss
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Previous Button */}
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              style={{
                background: hasPrev ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: hasPrev ? '#fff' : '#64748b',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: hasPrev ? 'pointer' : 'not-allowed',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: hasPrev ? 1 : 0.5,
              }}
              onMouseEnter={e => {
                if (hasPrev) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateX(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (hasPrev) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              PREV
            </button>

            {/* Next Button */}
            <button
              onClick={onNext}
              disabled={!hasNext}
              style={{
                background: hasNext ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.03)',
                border: hasNext ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: hasNext ? 'pointer' : 'not-allowed',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: hasNext ? 1 : 0.5,
                boxShadow: hasNext ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
              }}
              onMouseEnter={e => {
                if (hasNext) {
                  e.currentTarget.style.transform = 'translateX(2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.5)';
                }
              }}
              onMouseLeave={e => {
                if (hasNext) {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                }
              }}
            >
              NEXT
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomDatabaseNode = ({ data }) => (
  <div
    onClick={() => data.onNodeClick && data.onNodeClick(data, data.nodeId)}
    style={{
      background: 'rgba(251, 191, 36, 0.08)',
      border: '3px solid #fbbf24',
      borderRadius: '16px',
      padding: '16px 20px',
      width: '240px',
      position: 'relative',
      boxShadow: '0 12px 48px rgba(251, 191, 36, 0.15)',
      backdropFilter: 'blur(12px)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.borderColor = '#fcd34d';
      e.currentTarget.style.boxShadow = '0 20px 60px rgba(251, 191, 36, 0.3)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#fbbf24';
      e.currentTarget.style.boxShadow = '0 12px 48px rgba(251, 191, 36, 0.15)';
    }}
  >
    <Handle type="target" position={Position.Bottom} style={{ background: '#fbbf24', border: 'none', width: '10px', height: '10px' }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <div style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
        <DatabaseIcon />
      </div>
      <div style={{
        background: 'rgba(251, 191, 36, 0.2)',
        color: 'black',
        fontSize: '10px',
        fontWeight: '900',
        padding: '2px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {data.type || 'MASTER'}
      </div>
    </div>
    <div style={{ fontSize: '18px', fontWeight: '900', color: '#854d0e', letterSpacing: '0.5px', wordBreak: 'break-word', wordWrap: 'break-word', whiteSpace: 'normal', overflow: 'hidden' }}>{data.label}</div>
    <div style={{ fontSize: '12px', color: '#854d0e', marginTop: '6px', fontWeight: '700', opacity: 0.8, wordBreak: 'break-word', wordWrap: 'break-word', whiteSpace: 'normal', overflow: 'hidden' }}>{data.sublabel}</div>
  </div>
);

const CustomScreenNode = ({ data }) => {
  const color = data.domainColor || '#3b82f6';
  
  return (
    <div
      onClick={() => data.onNodeClick && data.onNodeClick(data, data.nodeId)}
      style={{
        background: 'rgba(30, 41, 59, 0.8)',
        border: `3px solid ${color}`,
        borderRadius: '16px',
        padding: '20px',
        width: '240px',
        boxShadow: `0 12px 48px rgba(0, 0, 0, 0.5)`,
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 20px 60px ${color}40`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.5)';
      }}
    >
      <Handle type="source" position={Position.Top} style={{ background: color, border: 'none', width: '10px', height: '10px' }} />
      <Handle type="target" position={Position.Left} style={{ background: color, border: 'none', width: '10px', height: '10px' }} />
      <Handle type="source" position={Position.Right} style={{ background: color, border: 'none', width: '10px', height: '10px' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ color: color, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>
          CICS SCREEN
        </div>
        <div style={{ color: color, background: `${color}10`, padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: '800', border: `1px solid ${color}30` }}>
          VIEW UI
        </div>
      </div>
      <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '0.5px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', color: '#fff', marginTop: '6px', fontWeight: '700' }}>{data.sublabel}</div>
    </div>
  );
};

const CustomBatchNode = ({ data }) => (
  <div
    onClick={() => data.onNodeClick && data.onNodeClick(data, data.nodeId)}
    style={{
      background: 'rgba(124, 45, 18, 0.3)',
      border: '3px solid #ea580c',
      borderRadius: '16px',
      padding: '20px',
      width: '240px',
      boxShadow: '0 12px 48px rgba(234, 88, 12, 0.2)',
      backdropFilter: 'blur(12px)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.borderColor = '#fb923c';
      e.currentTarget.style.boxShadow = '0 20px 60px rgba(234, 88, 12, 0.3)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#ea580c';
      e.currentTarget.style.boxShadow = '0 12px 48px rgba(234, 88, 12, 0.2)';
    }}
  >
    <Handle type="source" position={Position.Top} style={{ background: '#ea580c', border: 'none', width: '10px', height: '10px' }} />
    <Handle type="target" position={Position.Left} style={{ background: '#ea580c', border: 'none', width: '10px', height: '10px' }} />
    <Handle type="source" position={Position.Right} style={{ background: '#ea580c', border: 'none', width: '10px', height: '10px' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <div style={{ color: '#fb923c', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>
        BATCH
      </div>
      <div style={{ color: '#ea580c', background: 'rgba(234, 88, 12, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: '800' }}>
        VIEW LOGIC
      </div>
    </div>
    <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '0.5px' }}>{data.label}</div>
    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', fontWeight: '700' }}>{data.sublabel}</div>
  </div>
);

const CustomEntityNode = ({ data }) => {
  const color = data.color || '#6366f1';
  const isActive = data.isActive;

  return (
    <div
      onClick={() => data.onNodeClick && data.onNodeClick(data.entity)}
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: `2px solid ${color}${isActive ? '80' : '40'}`,
        borderRadius: '16px',
        padding: '0',
        width: '240px',
        boxShadow: isActive ? `0 12px 48px ${color}30` : 'none',
        backdropFilter: 'blur(12px)',
        cursor: isActive ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        opacity: isActive ? 1 : 0.6
      }}
      onMouseEnter={e => {
        if (isActive) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.boxShadow = `0 20px 60px ${color}40`;
        }
      }}
      onMouseLeave={e => {
        if (isActive) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = `${color}80`;
          e.currentTarget.style.boxShadow = `0 12px 48px ${color}30`;
        }
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: color, border: 'none', width: '8px', height: '8px' }} />
      <div style={{
        background: `${color}15`,
        padding: '12px 16px',
        borderBottom: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: color, borderRadius: '50%' }} />
          <span style={{ color: '#fff', fontWeight: '900', fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {data.label}
          </span>
        </div>
        {isActive && (
          <div style={{
            fontSize: '9px',
            fontWeight: '900',
            color: color,
            padding: '2px 6px',
            borderRadius: '4px',
            background: `${color}20`,
            border: `1px solid ${color}40`
          }}>CUT</div>
        )}
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.fields?.slice(0, 5).map((field, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span style={{ color: color, fontWeight: '700', fontSize: '14px' }}>•</span>
            <span style={{ color: '#cbd5e1', fontFamily: 'monospace', fontWeight: '500' }}>{field.name}</span>
          </div>
        ))}
        {data.fields?.length > 5 && (
          <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', paddingLeft: '14px' }}>
            + {data.fields.length - 5} more fields
          </div>
        )}
      </div>
      <div style={{
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: '9px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {data.entity.type.replace(/_/g, ' ')}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, border: 'none', width: '8px', height: '8px' }} />
    </div>
  );
};

const DomainGroupNode = ({ data, isFullscreen }) => {
  return (
    <div style={{
      padding: isFullscreen ? '40px' : '30px',
      borderRadius: '24px',
      border: `2px dashed ${data.color}80`,
      background: `linear-gradient(135deg, ${data.color}08, ${data.color}15)`,
      minWidth: data.width,
      minHeight: data.height,
      position: 'relative',
      boxShadow: `0 20px 50px -12px ${data.color}10`,
      pointerEvents: 'none',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        position: 'absolute',
        top: isFullscreen ? '-45px' : '-35px',
        left: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 20px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        border: `1px solid ${data.color}40`,
        boxShadow: `0 10px 20px -5px rgba(0,0,0,0.5)`,
        zIndex: 10
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          background: data.color,
          borderRadius: '3px',
          boxShadow: `0 0 10px ${data.color}`
        }} />
        <span style={{
          fontSize: isFullscreen ? '16px' : '14px',
          fontWeight: '900',
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '1.5px'
        }}>
          {data.label}
        </span>
        <div style={{
          background: `${data.color}20`,
          padding: '2px 8px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '900',
          color: data.color,
          border: `1px solid ${data.color}30`
        }}>
          {data.screenCount} screens
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  database: CustomDatabaseNode,
  screen: CustomScreenNode,
  batch: CustomBatchNode,
  entity: CustomEntityNode,
  domainGroup: DomainGroupNode,
};

const SCREEN_DOMAINS = {
  // Card Management
  'CCRDLIA': 'Card Management',
  'CCRDUPA': 'Card Management',
  'CCRDSLA': 'Card Management',
  'COCRDLIC': 'Card Management',
  'COCRDUPC': 'Card Management',
  'COCRDSLC': 'Card Management',

  // Transaction Processing
  'COTRN0A': 'Transaction Processing',
  'COTRN1A': 'Transaction Processing',
  'COTRN2A': 'Transaction Processing',
  'CTRTUPA': 'Transaction Processing',
  'CTRTLIA': 'Transaction Processing',
  'COTRN00C': 'Transaction Processing',
  'COTRTUPC': 'Transaction Processing',
  'COTRTLIC': 'Transaction Processing',
  'COTRN02C': 'Transaction Processing',
  'COTRN01C': 'Transaction Processing',

  // Account Management
  'CACTVWA': 'Account Management',
  'COBIL0A': 'Account Management',
  'CACTUPA': 'Account Management',
  'COACTVWC': 'Account Management',
  'COBIL00C': 'Account Management',
  'COACTUPC': 'Account Management',

  // Customer Management
  'COMEN1A': 'Customer Management',
  'COMEN01C': 'Customer Management',

  // Security & Admin
  'COSGN0A': 'Security & Admin',
  'CORPT0A': 'Security & Admin',
  'COSGN00C': 'Security & Admin',
  'CORPT00C': 'Security & Admin',
};

const DOMAIN_STYLES = {
  'Card Management': { color: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' },
  'Transaction Processing': { color: '#a855f7', background: 'rgba(168, 85, 247, 0.05)' },
  'Account Management': { color: '#22c55e', background: 'rgba(34, 197, 94, 0.05)' },
  'Customer Management': { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.05)' },
  'Security & Admin': { color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' },
  'Default': { color: '#94a3b8', background: 'rgba(148, 163, 184, 0.05)' }
};

const SystemViewFlow = ({ systemView, showDataOps, setShowDataOps, isFullscreen = false, onExitFullscreen, onEnterFullscreen, flows = [] }) => {
  const [popupNode, setPopupNode] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [popupDatabaseNode, setPopupDatabaseNode] = useState(null);
  const [screenOrder, setScreenOrder] = useState([]);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [groupByDomain, setGroupByDomain] = useState(false);

  // Filter states
  const [nodeFilters, setNodeFilters] = useState({
    screens: true,
    batches: true,
    tables: true,
  });
  const [connectionFilters, setConnectionFilters] = useState({
    screenFlow: true,
    batchFlow: true,
    dataOps: true,
    read: true,
    write: true,
    both: true,
  });

  if (!systemView || !systemView.screens || !systemView.flow_connections) {
    return null;
  }

  // Build screen order from flow connections
  useEffect(() => {
    const orderedScreenNames = [];
    const connections = systemView.flow_connections;
    if (connections && connections.length > 0) {
      const targets = new Set(connections.map(c => c.target));
      const startConn = connections.find(c => !targets.has(c.source)) || connections[0];
      let current = startConn.source;
      orderedScreenNames.push(current);

      let safetyCounter = 0;
      while (safetyCounter < systemView.screens.length * 2) {
        const nextConn = connections.find(c => c.source === current);
        if (nextConn && !orderedScreenNames.includes(nextConn.target)) {
          current = nextConn.target;
          orderedScreenNames.push(current);
        } else {
          break;
        }
        safetyCounter++;
      }
    }

    // Fallback for screens not in connections
    const missingScreens = systemView.screens
      .map(s => s.name)
      .filter(name => !orderedScreenNames.includes(name));
    const finalOrderedScreenNames = [...orderedScreenNames, ...missingScreens];

    setScreenOrder(finalOrderedScreenNames);
  }, [systemView]);

  const handleNavigateNext = () => {
    if (currentScreenIndex < screenOrder.length - 1) {
      const nextScreenName = screenOrder[currentScreenIndex + 1];
      setCurrentScreenIndex(currentScreenIndex + 1);
      // Trigger click on next screen
      const nextScreen = systemView.screens.find(s => s.name === nextScreenName);
      if (nextScreen) {
        handleNodeClick({ label: nextScreenName, sublabel: nextScreen.topic }, `screen-${nextScreenName}`);
      }
    }
  };

  const handleNavigatePrev = () => {
    if (currentScreenIndex > 0) {
      const prevScreenName = screenOrder[currentScreenIndex - 1];
      setCurrentScreenIndex(currentScreenIndex - 1);
      // Trigger click on previous screen
      const prevScreen = systemView.screens.find(s => s.name === prevScreenName);
      if (prevScreen) {
        handleNodeClick({ label: prevScreenName, sublabel: prevScreen.topic }, `screen-${prevScreenName}`);
      }
    }
  };

  const handleNodeClick = (nodeData, nodeId) => {
    if (focusMode) {
      setFocusedNodeId(nodeId);
      return;
    }

    // Database node click handling
    if (nodeId && nodeId.startsWith('table-')) {
      const tableName = nodeData.label;
      const tableData = (systemView.field_matrix && systemView.field_matrix[tableName]) || {
        business_context: "No field details available.",
        fields: []
      };

      // Extract reference_link - search in clusterData sub_cuts data_domain
      let referenceLink = null;
      const clusters = Array.isArray(clusterData.clusters)
        ? clusterData.clusters
        : Object.values(clusterData.clusters);

      for (const cluster of clusters) {
        if (cluster.sub_cuts) {
          for (const subCut of cluster.sub_cuts) {
            if (subCut.data_domain) {
              const masterTable = subCut.data_domain.master_tables?.find(t => t.name === tableName);
              if (masterTable?.reference_link) {
                referenceLink = masterTable.reference_link;
                break;
              }
              const refTable = subCut.data_domain.reference_tables?.find(t => t.name === tableName);
              if (refTable?.reference_link) {
                referenceLink = refTable.reference_link;
                break;
              }
            }
          }
          if (referenceLink) break;
        }
      }

      console.log('Database node clicked:', { tableName, referenceLink, hasReferenceLink: !!referenceLink });

      setPopupDatabaseNode({
        name: tableName,
        type: nodeData.type,
        data: tableData,
        referenceLink
      });
      return;
    }

    // ASCII popup for other nodes
    if (!nodeData.label) {
      return;
    }

    // Track current screen index for navigation
    const screenIndex = screenOrder.indexOf(nodeData.label);
    if (screenIndex >= 0) {
      setCurrentScreenIndex(screenIndex);
    }

    // Attempt to find ASCII art in multiple locations
    let asciiArt = null;
    let topic = nodeData.sublabel;

    // 1. First, check flows prop
    const findInFlows = (flowsList) => {
      if (!flowsList) return null;
      for (const f of flowsList) {
        if (f.screens) {
          const screen = f.screens.find(s => s.name === nodeData.label);
          if (screen && screen.ascii_look_feel) {
            return { ascii: screen.ascii_look_feel, topic: screen.topic };
          }
        }
      }
      return null;
    };

    let result = findInFlows(flows);

    // 2. Fallback: Search in all clusters (including sub_cuts)
    if (!result) {
      const clusters = Array.isArray(clusterData.clusters)
        ? clusterData.clusters
        : Object.values(clusterData.clusters);

      for (const cluster of clusters) {
        // Check top-level flows
        if (cluster.flows) {
          result = findInFlows(cluster.flows);
          if (result) break;
        }
        // Check sub_cuts flows
        if (cluster.sub_cuts) {
          for (const subCut of cluster.sub_cuts) {
            if (subCut.flows) {
              result = findInFlows(subCut.flows);
              if (result) break;
            }
          }
          if (result) break;
        }
      }
    }

    if (result) {
      asciiArt = result.ascii;
      topic = result.topic || topic;
    }

    // Always show popup (with or without ASCII art)
    setPopupNode({
      name: nodeData.label,
      asciiArt: asciiArt || 'No ASCII preview available for this screen.',
      topic
    });
  };

  // Group data operations by screen name
  const dataOpsByScreen = {};
  if (systemView.data_ops && systemView.data_ops.data_connections) {
    systemView.data_ops.data_connections.forEach(conn => {
      if (!dataOpsByScreen[conn.source]) {
        dataOpsByScreen[conn.source] = {
          tables: [],
          connections: []
        };
      }
      if (conn.target_type === 'DATABASE_TABLE') {
        dataOpsByScreen[conn.source].tables.push(conn);
      } else {
        dataOpsByScreen[conn.source].connections.push(conn);
      }
    });
  }

  // Create a map for screen details
  const screenMap = {};
  systemView.screens.forEach(s => {
    screenMap[s.name] = s;
  });

  // Create initial nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // 0. Determine Screen Order for Sequence
    const orderedScreenNames = [];
    const connections = systemView.flow_connections;
    if (connections && connections.length > 0) {
      const targets = new Set(connections.map(c => c.target));
      const startConn = connections.find(c => !targets.has(c.source)) || connections[0];
      let current = startConn.source;
      orderedScreenNames.push(current);

      let safetyCounter = 0;
      while (safetyCounter < systemView.screens.length * 2) {
        const nextConn = connections.find(c => c.source === current);
        if (nextConn && !orderedScreenNames.includes(nextConn.target)) {
          current = nextConn.target;
          orderedScreenNames.push(current);
        } else {
          break;
        }
        safetyCounter++;
      }
    }

    // Fallback for screens not in connections
    const missingScreens = systemView.screens
      .map(s => s.name)
      .filter(name => !orderedScreenNames.includes(name));
    const finalOrderedScreenNames = [...orderedScreenNames, ...missingScreens];

    // 1. Process Database Tables (Top Layer)
    if (showDataOps && nodeFilters.tables && systemView.data_ops && systemView.data_ops.database_tables) {
      systemView.data_ops.database_tables.forEach((table, idx) => {
        const hasActiveConnection = systemView.data_ops.data_connections?.some(conn => {
          if (conn.target !== table.name) return false;
          const isReadOp = conn.operation === 'READ';
          const isWriteOp = conn.operation === 'WRITE';
          const isBothOp = conn.operation === 'BOTH';
          return (isReadOp && connectionFilters.read) ||
            (isWriteOp && connectionFilters.write) ||
            (isBothOp && connectionFilters.both);
        });

        if (hasActiveConnection) {
          nodes.push({
            id: `table-${table.name}`,
            type: 'database',
            data: { label: table.name, sublabel: table.name, type: table.type || 'MASTER', onNodeClick: handleNodeClick, nodeId: `table-${table.name}` },
            position: { x: idx * 350, y: groupByDomain ? -100 : 0 },
          });
        }
      });
    }

    // 2. Process Domain Groups and Screens
    if (groupByDomain && nodeFilters.screens) {
      const screensByDomain = {};
      finalOrderedScreenNames.forEach(name => {
        const screen = screenMap[name];
        if (screen) {
          const domain = SCREEN_DOMAINS[name] || screen.domain || 'Default';
          if (!screensByDomain[domain]) screensByDomain[domain] = [];
          screensByDomain[domain].push({ name, screen });
        }
      });

      let currentX = 0;
      Object.entries(screensByDomain).forEach(([domain, screens], groupIdx) => {
        const style = DOMAIN_STYLES[domain] || DOMAIN_STYLES.Default;
        const groupWidth = Math.max(400, screens.length * 320);
        const groupId = `group-${domain.replace(/\s+/g, '-')}`;

        // Add parent group node
        nodes.push({
          id: groupId,
          type: 'domainGroup',
          data: {
            label: domain,
            color: style.color,
            screenCount: screens.length,
            width: groupWidth,
            height: 250
          },
          position: { x: currentX, y: 350 },
          style: { width: groupWidth, height: 250, zIndex: -1 },
          draggable: true,
        });

        // Add child screens
        screens.forEach((item, screenIdx) => {
          nodes.push({
            id: `screen-${item.name}`,
            type: 'screen',
            data: {
              label: item.name,
              sublabel: item.screen.topic,
              onNodeClick: handleNodeClick,
              nodeId: `screen-${item.name}`,
              domainColor: style.color
            },
            position: { x: 50 + (screenIdx * 320), y: 60 },
            parentNode: groupId,
            extent: 'parent',
          });
        });

        currentX += groupWidth + 100;
      });
    } else if (nodeFilters.screens) {
      // Original sequence layout
      finalOrderedScreenNames.forEach((name, idx) => {
        const screen = screenMap[name];
        if (screen) {
          nodes.push({
            id: `screen-${name}`,
            type: 'screen',
            data: { label: name, sublabel: screen.topic, onNodeClick: handleNodeClick, nodeId: `screen-${name}` },
            position: { x: idx * 350, y: 400 },
          });
        }
      });
    }

    // 3. Process Batch Processes
    if (nodeFilters.batches && systemView.batch_processes) {
      systemView.batch_processes.forEach((batch, idx) => {
        const xPos = groupByDomain ? nodes.filter(n => n.type === 'domainGroup').reduce((acc, n) => acc + (n.data.width || 0) + 100, 0) + (idx * 350) : (finalOrderedScreenNames.length + idx) * 350;
        nodes.push({
          id: `batch-${batch.name}`,
          type: 'batch',
          data: { label: batch.name, sublabel: batch.topic, onNodeClick: handleNodeClick, nodeId: `batch-${batch.name}` },
          position: { x: xPos, y: 400 },
        });
      });
    }

    // 4. Sequence Connections
    if (connectionFilters.screenFlow && nodeFilters.screens) {
      for (let i = 0; i < finalOrderedScreenNames.length - 1; i++) {
        edges.push({
          id: `seq-screen-${i}`,
          source: `screen-${finalOrderedScreenNames[i]}`,
          target: `screen-${finalOrderedScreenNames[i + 1]}`,
          type: 'straight',
          style: { stroke: '#3b82f6', strokeWidth: 3, opacity: 0.6 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });
      }
    }

    // Batch and other connections...
    if (connectionFilters.screenFlow && nodeFilters.screens && nodeFilters.batches && finalOrderedScreenNames.length > 0 && systemView.batch_processes && systemView.batch_processes.length > 0) {
      edges.push({
        id: `seq-screen-batch`,
        source: `screen-${finalOrderedScreenNames[finalOrderedScreenNames.length - 1]}`,
        target: `batch-${systemView.batch_processes[0].name}`,
        type: 'straight',
        style: { stroke: '#3b82f6', strokeWidth: 3, opacity: 0.6 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      });
    }

    if (connectionFilters.batchFlow && nodeFilters.batches && systemView.batch_processes && systemView.batch_processes.length > 1) {
      for (let i = 0; i < systemView.batch_processes.length - 1; i++) {
        edges.push({
          id: `seq-batch-${i}`,
          source: `batch-${systemView.batch_processes[i].name}`,
          target: `batch-${systemView.batch_processes[i + 1].name}`,
          type: 'straight',
          style: { stroke: '#ea580c', strokeWidth: 3, opacity: 0.6 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' },
        });
      }
    }

    // 5. Data Connections
    if (showDataOps && connectionFilters.dataOps && systemView.data_ops && systemView.data_ops.data_connections) {
      systemView.data_ops.data_connections.forEach((conn, idx) => {
        const sourceId = conn.source_type === 'BATCH' ? `batch-${conn.source}` : `screen-${conn.source}`;
        const targetId = `table-${conn.target}`;
        const isReadOp = conn.operation === 'READ';
        const isWriteOp = conn.operation === 'WRITE';
        const isBothOp = conn.operation === 'BOTH';
        const operationAllowed = (isReadOp && connectionFilters.read) || (isWriteOp && connectionFilters.write) || (isBothOp && connectionFilters.both);

        if (!operationAllowed) return;

        edges.push({
          id: `data-edge-${idx}`,
          source: sourceId,
          target: targetId,
          label: conn.operation,
          animated: true,
          type: 'default',
          style: {
            stroke: conn.operation === 'READ' ? '#22c55e' : conn.operation === 'WRITE' ? '#ef4444' : '#3b82f6',
            strokeWidth: 2,
            strokeDasharray: '5,5',
          },
          labelStyle: { fill: '#fff', fontSize: 10, fontWeight: 900 },
          labelBgStyle: { fill: '#1e293b', fillOpacity: 0.8 },
          markerEnd: { type: MarkerType.ArrowClosed, color: conn.operation === 'READ' ? '#22c55e' : conn.operation === 'WRITE' ? '#ef4444' : '#3b82f6' },
        });
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [systemView, showDataOps, nodeFilters, connectionFilters, groupByDomain]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when initialNodes or initialEdges change
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Apply focus styling when focus mode is active
  // Apply focus styling when focus mode is active
  useEffect(() => {
    if (!focusMode || !focusedNodeId) {
      // Reset all nodes and edges to normal opacity
      setNodes(prevNodes => prevNodes.map(node => ({
        ...node,
        style: { ...node.style, opacity: 1, filter: 'none' }
      })));
      setEdges(prevEdges => prevEdges.map(edge => ({
        ...edge,
        style: { ...edge.style, opacity: edge.style?.opacity || 1, filter: 'none' }
      })));
      return;
    }

    // Find all connected nodes
    const connectedNodeIds = new Set([focusedNodeId]);
    const connectedEdgeIds = new Set();

    // Find edges connected to focused node
    initialEdges.forEach(edge => {
      if (edge.source === focusedNodeId || edge.target === focusedNodeId) {
        connectedEdgeIds.add(edge.id);
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
      }
    });

    // Apply focus styling
    setNodes(prevNodes => prevNodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: connectedNodeIds.has(node.id) ? 1 : 0.2,
        filter: connectedNodeIds.has(node.id) ? 'none' : 'blur(2px)'
      }
    })));

    setEdges(prevEdges => prevEdges.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        opacity: connectedEdgeIds.has(edge.id) ? (edge.style?.opacity || 1) : 0.1,
        filter: connectedEdgeIds.has(edge.id) ? 'none' : 'blur(2px)'
      }
    })));
  }, [focusMode, focusedNodeId, initialEdges, setNodes, setEdges]);

  const containerHeight = isFullscreen ? '100vh' : '600px';
  const containerStyle = isFullscreen ? {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
    background: '#020617',
  } : {
    height: containerHeight,
    width: '100%',
    background: '#020617',
    borderRadius: '24px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      {/* Header with Controls */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: isFullscreen ? '80px' : '60px',
        background: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isFullscreen ? '20px 40px' : '16px 24px',
        zIndex: 20,
        pointerEvents: 'auto'
      }}>
        {/* Left: Title & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
            <h3 style={{ fontSize: isFullscreen ? '16px' : '14px', fontWeight: '900', color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>SYSTEM VIEW</h3>
          </div>
          <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
            HYBRID EXECUTION: CICS ONLINE & BATCH SYNC
          </p>

          {/* Data Ops Checkbox - Inline with title */}
          {!isFullscreen && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '10px',
                fontWeight: '700',
                color: '#94a3b8',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <input
                type="checkbox"
                checked={showDataOps}
                onChange={(e) => setShowDataOps(e.target.checked)}
                style={{ cursor: 'pointer', width: '14px', height: '14px' }}
              />
              SHOW DATA OPS
            </label>
          )}
        </div>

        {/* Right: Legend & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isFullscreen ? '32px' : '16px' }}>
          {/* Data Ops Checkbox - Only in fullscreen */}
          {isFullscreen && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#94a3b8',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <input
                type="checkbox"
                checked={showDataOps}
                onChange={(e) => setShowDataOps(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              SHOW DATA OPS
            </label>
          )}

          {/* Group By Domain Toggle */}
          <button
            onClick={() => setGroupByDomain(!groupByDomain)}
            style={{
              background: groupByDomain ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.02)',
              border: groupByDomain ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255,255,255,0.08)',
              color: groupByDomain ? '#a855f7' : '#64748b',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '900',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!groupByDomain) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              if (!groupByDomain) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              background: groupByDomain ? '#a855f7' : '#64748b',
              borderRadius: '2px',
              boxShadow: groupByDomain ? '0 0 10px #a855f7' : 'none'
            }} />
            GROUP BY DOMAIN
          </button>

          {/* Connection Type Filters */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(2, 6, 23, 0.6)', padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            {[
              { key: 'screenFlow', label: 'FLOW', color: '#3b82f6' },
              { key: 'read', label: 'READ', color: '#22c55e' },
              { key: 'write', label: 'WRITE', color: '#ef4444' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => {
                  if (filter.key === 'screenFlow') {
                    const newValue = !connectionFilters.screenFlow;
                    setConnectionFilters(prev => ({
                      ...prev,
                      screenFlow: newValue,
                      batchFlow: newValue,
                      both: newValue
                    }));
                  } else {
                    setConnectionFilters(prev => ({ ...prev, [filter.key]: !prev[filter.key] }));
                  }
                }}
                style={{
                  background: connectionFilters[filter.key] ? `${filter.color}20` : 'rgba(255,255,255,0.02)',
                  border: connectionFilters[filter.key] ? `1px solid ${filter.color}40` : '1px solid rgba(255,255,255,0.08)',
                  color: connectionFilters[filter.key] ? filter.color : '#64748b',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '9px',
                  fontWeight: '700',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (connectionFilters[filter.key]) {
                    e.currentTarget.style.opacity = '0.8';
                  } else {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (connectionFilters[filter.key]) {
                    e.currentTarget.style.opacity = '1';
                  } else {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
              >
                {connectionFilters[filter.key] ? '✓' : '○'} {filter.label}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: isFullscreen ? '20px' : '14px',
            background: 'rgba(2, 6, 23, 0.6)',
            padding: isFullscreen ? '12px 20px' : '8px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(4px)'
          }}>
            {[
              { label: 'ONLINE SCREEN', color: '#3b82f6' },
              { label: 'BATCH PROCESS', color: '#ea580c' },
              { label: 'DATABASE TABLE', color: '#fbbf24' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '7px', height: '7px', background: item.color, borderRadius: '2px' }}></div>
                <span style={{ fontSize: isFullscreen ? '9px' : '8px', fontWeight: '900', color: '#e5ebf3', letterSpacing: '0.5px' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {!isFullscreen && (
            <button
              onClick={onEnterFullscreen}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3b82f6',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
              }}
            >
              EXPAND
            </button>
          )}

          {isFullscreen && (
            <button
              onClick={onExitFullscreen}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              Exit Fullscreen
            </button>
          )}
        </div>
      </div>

      {/* ReactFlow Container */}
      <div style={{
        position: 'absolute',
        top: isFullscreen ? '80px' : '60px',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.1}
          maxZoom={4}
        >
          <Background color="#1e293b" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <ScreenPopup
        isOpen={!!popupNode}
        onClose={() => setPopupNode(null)}
        nodeName={popupNode?.name}
        asciiArt={popupNode?.asciiArt}
        topic={popupNode?.topic}
        onNext={handleNavigateNext}
        onPrev={handleNavigatePrev}
        hasNext={currentScreenIndex < screenOrder.length - 1}
        hasPrev={currentScreenIndex > 0}
      />

      <DatabasePopup
        isOpen={!!popupDatabaseNode}
        onClose={() => setPopupDatabaseNode(null)}
        tableName={popupDatabaseNode?.name}
        tableType={popupDatabaseNode?.type}
        tableData={popupDatabaseNode?.data}
        referenceLink={popupDatabaseNode?.referenceLink}
      />
    </div>
  );
};

function FlowDiagram({ data, cutId, cutData }) {
  const [activeTab, setActiveTab] = useState("executionTrace");
  const [showDataOps, setShowDataOps] = useState(false);
  const [showTechDebt, setShowTechDebt] = useState(false);
  const [isFlowFullscreen, setIsFlowFullscreen] = useState(false);

  // Flatten flows from all cutData sources (flows and sub_cuts)
  const allFlows = useMemo(() => {
    if (!cutData) return [];
    let flows = cutData.flows || [];
    if (cutData.sub_cuts) {
      cutData.sub_cuts.forEach(sc => {
        if (sc.flows) {
          flows = [...flows, ...sc.flows];
        }
      });
    }
    return flows;
  }, [cutData]);

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

  const getProgramFlows = () => {
    if (!cutData?.sub_cuts) return <div style={{ color: "#64748b", fontStyle: "italic" }}>No data available</div>;

    // Build a map of method names to reference links
    const methodLinkMap = {};
    cutData.sub_cuts.forEach(sc => {
      sc.flows?.forEach(flow => {
        flow.programs?.forEach(pgm => {
          pgm.methods?.forEach(method => {
            if (method.reference_link) {
              methodLinkMap[method.name] = method.reference_link;
            }
          });
        });
      });
    });

    const allFlowsHtml = cutData.sub_cuts
      .flatMap(sc => sc.flows || [])
      .filter(flow => flow.program_flows)
      .map(flow => {
        let text = flow.program_flows;
        
        // Build debt map
        const debtMap = {};
        flow.programs?.forEach(pgm => {
          pgm.methods?.forEach(method => {
            if (method.method_metadata?.tech_debt) {
              debtMap[method.name] = method.method_metadata.tech_debt;
            }
          });
        });

        text = text.split('\n').map(line => {
          const pgmMatch = line.match(/([A-Z0-9-]+)\[/);
          if (pgmMatch) {
            const methodName = pgmMatch[1];
            const referenceLink = methodLinkMap[methodName];
            
            // Add clickable link if reference exists
            if (referenceLink) {
              line = line.replace(
                methodName,
                `<a href="${referenceLink}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline; cursor: pointer; font-weight: 700;">${methodName}</a>`
              );
            }
            
            // Add tech debt indicator if enabled
            if (showTechDebt) {
              const debtKey = debtMap[methodName];
              if (debtKey) {
                const config = debtColorMap[debtKey] || { label: debtKey, color: "#ef4444" };
                line = `${line}  <span style="color: ${config.color}; font-weight: 800; opacity: 0.9;">!! ${config.label}</span>`;
              }
            }
          }
          return line;
        }).join('\n');
        
        return text;
      })
      .join("\n\n---\n\n");

    if (!allFlowsHtml) return <div style={{ color: "#64748b", fontStyle: "italic" }}>No program flows available</div>;

    return (
      <pre
        style={{
          margin: 0,
          padding: "24px",
          color: "#e2e8f0",
          fontFamily: "'Fira Code', 'Roboto Mono', monospace",
          fontSize: "13px",
          lineHeight: "1.5",
          overflowX: "auto",
          whiteSpace: "pre-wrap"
        }}
        dangerouslySetInnerHTML={{ __html: allFlowsHtml }}
      />
    );
  };

  return (
    <div>
      <PulsateStyle />
      {!isFlowFullscreen && (
        <FlowsTabHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showDataOps={showDataOps}
          setShowDataOps={setShowDataOps}
          onExpandFlow={() => setIsFlowFullscreen(true)}
        />
      )}

      {isFlowFullscreen ? (
        <SystemViewFlow
          systemView={cutData?.system_view}
          flows={allFlows}
          showDataOps={showDataOps}
          setShowDataOps={setShowDataOps}
          isFullscreen={true}
          onExitFullscreen={() => setIsFlowFullscreen(false)}
        />
      ) : activeTab === "executionTrace" ? (
        <div>
          {/* Existing Flow Diagram content */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {/* Flow Sequence / System View */}
            {cutData?.system_view ? (
              <SystemViewFlow
                systemView={cutData.system_view}
                flows={allFlows}
                showDataOps={showDataOps}
                setShowDataOps={setShowDataOps}
                onEnterFullscreen={() => setIsFlowFullscreen(true)}
              />
            ) : (
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
            )}

            {/* Interactive Table Interactions */}
            {/* {data.interactions && data.interactions.length > 0 && (
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
                        border: "1px solid rgba(59, 130, 246, 0.15)",
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
            )} */}
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
                SHOW TECH DEBT
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
                }} />
              </button>
            </div>
          </div>

          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "20px",
            padding: "8px",
            border: "1px solid rgba(59, 130, 246, 0.1)"
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
          border: "1px solid rgba(239, 68, 68, 0.15)",
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
          border: "1px solid rgba(34, 197, 94, 0.15)",
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
          border: "1px solid rgba(59, 130, 246, 0.15)",
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
function DependenciesTab({ data, currentCutName: propCutName }) {
  if (!data || !data.dependencies) {
    return <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>No dependencies data available.</div>;
  }

  const { upstream_incoming, downstream_outgoing } = data.dependencies;
  const currentCutName = propCutName || data.topic || `CUT ${data.cut_id?.replace(/^Cut_/, '') || ''}`;

  const DependencyItem = ({ item, isIncoming }) => (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        width: '100%',
        maxWidth: '300px',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.borderColor = isIncoming ? 'rgba(148, 163, 184, 0.3)' : 'rgba(99, 102, 241, 0.3)';
        e.currentTarget.style.transform = isIncoming ? 'translateX(8px)' : 'translateX(-8px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isIncoming ? '#94a3b8' : '#6366f1',
          boxShadow: isIncoming ? '0 0 10px rgba(148, 163, 184, 0.6)' : '0 0 10px rgba(99, 102, 241, 0.6)'
        }} />
        <span style={{
          fontWeight: '800',
          color: '#f8fafc',
          fontSize: '13px',
          fontFamily: 'monospace',
          letterSpacing: '0.5px'
        }}>
          {item.cut_id ? `cut_${item.cut_id.replace(/^Cut_/, '').split('_')[0]}` : 'UNK'}
        </span>
      </div>
      <span style={{
        color: '#94a3b8',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '1.4',
        display: '-webkit-box',
        WebkitLineClamp: '2',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {item.topic}
      </span>
    </div>
  );

  const FlowArrow = ({ direction = 'right', color = '#94a3b8', label = '' }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
      opacity: 0.6
    }}>
      {label && (
        <span style={{
          fontSize: '9px',
          fontWeight: '800',
          color: color,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '8px'
        }}>
          {label}
        </span>
      )}
      <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
        <path
          d={direction === 'right' ? "M0 12H52M52 12L44 4M52 12L44 20" : "M60 12H8M8 12L16 4M8 12L16 20"}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0',
        flex: 1
      }}>
        {/* Upstream/Incoming Section */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'flex-end',
          maxHeight: '500px',
          overflowY: 'auto',
          paddingRight: '10px'
        }}>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '900',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '8px',
            alignSelf: 'flex-end',
            marginRight: '20px'
          }}>Upstream (Incoming)</h3>

          {(!upstream_incoming || upstream_incoming.length === 0) ? (
            <div style={{ color: '#475569', fontSize: '13px', fontStyle: 'italic', marginRight: '20px' }}>No incoming dependencies</div>
          ) : (
            upstream_incoming.map((item, idx) => (
              <DependencyItem key={idx} item={item} isIncoming={true} />
            ))
          )}
        </div>

        {/* Transition Arrows Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
          <FlowArrow color="#94a3b8" label="FEEDS INTO" />
        </div>

        {/* Central Cut Node */}
        <div style={{
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)',
          border: '2px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '240px',
          maxWidth: '300px',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(99, 102, 241, 0.1)',
          position: 'relative',
          zIndex: 2,
          textAlign: 'center'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            background: '#6366f1',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '900',
            padding: '4px 12px',
            borderRadius: '20px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>Active Cut</div>

          <h2 style={{
            fontSize: '16px',
            fontWeight: '900',
            color: '#fff',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {currentCutName}
          </h2>

          <div style={{
            height: '2px',
            width: '40px',
            background: 'rgba(99, 102, 241, 0.5)',
            marginBottom: '12px'
          }} />

          <p style={{
            fontSize: '11px',
            color: '#818cf8',
            fontWeight: '700',
            margin: 0,
            opacity: 0.8
          }}>
            Core Processing Unit
          </p>
        </div>

        {/* Transition Arrows Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
          <FlowArrow color="#6366f1" label="PROVIDES TO" />
        </div>

        {/* Downstream/Outgoing Section */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'flex-start',
          maxHeight: '500px',
          overflowY: 'auto',
          paddingLeft: '10px'
        }}>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '900',
            color: '#6366f1',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '8px',
            marginLeft: '20px'
          }}>Downstream (Outgoing)</h3>

          {(!downstream_outgoing || downstream_outgoing.length === 0) ? (
            <div style={{ color: '#475569', fontSize: '13px', fontStyle: 'italic', marginLeft: '20px' }}>No outgoing dependencies</div>
          ) : (
            downstream_outgoing.map((item, idx) => (
              <DependencyItem key={idx} item={item} isIncoming={false} />
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        textAlign: 'center',
        fontSize: '11px',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '20px'
      }}>
        Visualizing data flow across modularized system cuts
      </div>
    </div>
  );
}


function DataTab({ data }) {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [viewMode, setViewMode] = useState('diagram');
  const erdData = data?.system_view?.erd || data?.erd;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'CORE_ENTITY': return '#6366f1';
      case 'TRANSACTION': return '#f59e0b';
      case 'REFERENCE': return '#1a5ebdff';
      default: return '#1a5ebdff';
    }
  };

  const fieldMatrix = data?.system_view?.field_matrix || {};

  const handleEntityClick = (entity) => {
    if (!entity.active_in_cut) return;
    let richData = fieldMatrix[entity.name];
    if (!richData) {
      richData = {
        business_context: "Extended usage data not available.",
        fields: entity.fields?.map(f => ({
          name: f.name,
          usage: "NONE",
          type_of_usage: f.type || "Unknown",
          business_context: "-"
        })) || []
      };
    }
    setSelectedEntity({
      name: entity.name,
      type: entity.type,
      data: richData
    });
  };

  useEffect(() => {
    if (!erdData?.entities) return;

    const { entities, relationships = [] } = erdData;
    
    // Categorize entities for layout
    const core = entities.filter(e => e.type === 'CORE_ENTITY');
    const trans = entities.filter(e => e.type === 'TRANSACTION');
    const refs = entities.filter(e => e.type !== 'CORE_ENTITY' && e.type !== 'TRANSACTION');

    const newNodes = [];
    const spacingX = 350;
    const spacingY = 300;

    // Layout Core Entities (Top)
    core.forEach((e, i) => {
      newNodes.push({
        id: `entity-${e.name}`,
        type: 'entity',
        position: { x: i * spacingX, y: 0 },
        data: {
          label: e.name,
          color: getTypeColor(e.type),
          fields: e.fields,
          entity: e,
          isActive: e.active_in_cut,
          onNodeClick: handleEntityClick
        }
      });
    });

    // Layout Transactions (Middle)
    trans.forEach((e, i) => {
      newNodes.push({
        id: `entity-${e.name}`,
        type: 'entity',
        position: { x: i * spacingX, y: spacingY },
        data: {
          label: e.name,
          color: getTypeColor(e.type),
          fields: e.fields,
          entity: e,
          isActive: e.active_in_cut,
          onNodeClick: handleEntityClick
        }
      });
    });

    // Layout References/Others (Bottom)
    refs.forEach((e, i) => {
      newNodes.push({
        id: `entity-${e.name}`,
        type: 'entity',
        position: { x: i * spacingX, y: spacingY * 2 },
        data: {
          label: e.name,
          color: getTypeColor(e.type),
          fields: e.fields,
          entity: e,
          isActive: e.active_in_cut,
          onNodeClick: handleEntityClick
        }
      });
    });

    const newEdges = relationships.map((rel, i) => ({
      id: `edge-${i}`,
      source: `entity-${rel.from}`,
      target: `entity-${rel.to}`,
      label: rel.via_field,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
      style: { stroke: '#64748b', strokeWidth: 2, opacity: 0.6 },
      labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 700 }
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [erdData]);

  if (!erdData?.entities) {
    return <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>No entity model available.</div>;
  }

  const { title, context, stats, entities } = erdData;

  return (
    <div style={{ padding: '0 20px 40px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '900', color: '#f8fafc', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>
            {title || 'Global Entity Model'}
          </h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
            CONTEXT: {data.topic || context}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', background: 'rgba(2, 6, 23, 0.6)', padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {[
            { id: 'diagram', label: 'DIAGRAM', icon: '📊' },
            { id: 'grid', label: 'GRID', icon: '⊞' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              style={{
                background: viewMode === mode.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: viewMode === mode.id ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                color: viewMode === mode.id ? '#6366f1' : '#64748b',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'diagram' ? (
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          height: '740px',
          position: 'relative'
        }}>
          <ReactFlow
            nodes={nodes.filter(n => !n.data.label?.includes('CARD_XREF'))}
            edges={edges.filter(e => !e.source.includes('CARD_XREF') && !e.target.includes('CARD_XREF'))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            style={{ borderRadius: '16px', background: 'rgba(2, 6, 23, 0.3)' }}
          >
            <Background color="#1e293b" gap={20} />
            <Controls />
          </ReactFlow>

          {/* Legend Overlay */}
          <div style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            background: 'rgba(2, 6, 23, 0.8)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
            width: '200px'
          }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>Legend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Core Entity', color: '#6366f1' },
                { label: 'Transaction', color: '#f59e0b' },
                { label: 'Reference', color: '#1a5ebdff' }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', background: `${item.color}20`, border: `2px solid ${item.color}80`, borderRadius: '4px' }} />
                  <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: '600' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {stats && (
              <>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />
                <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Entities</span>
                    <span style={{ color: '#fff', fontWeight: '700' }}>{stats.total_entities}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Core</span>
                    <span style={{ color: '#6366f1', fontWeight: '700' }}>{stats.core_entities}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Trans</span>
                    <span style={{ color: '#f59e0b', fontWeight: '700' }}>{stats.transactions}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Relationships</span>
                    <span style={{ color: '#fff', fontWeight: '700' }}>{stats.relationships}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            background: 'rgba(99, 102, 241, 0.15)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontSize: '11px',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10
          }}>
            <SparklesIcon />
            <span>Click an entity to explore its fields and business context</span>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px'
        }}>
          {entities.filter(e => e.name !== 'CARD_XREF').map((entity, idx) => {
            const isActive = entity.active_in_cut;
            const color = getTypeColor(entity.type);
            return (
              <div key={idx}
                onClick={() => handleEntityClick(entity)}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  opacity: isActive ? 1 : 0.5,
                  border: `1px solid ${isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}`,
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease',
                  cursor: isActive ? 'pointer' : 'default'
                }}
                onMouseEnter={e => {
                  if (isActive) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
                  }
                }}
                onMouseLeave={e => {
                  if (isActive) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                  }
                }}
              >
                <div style={{
                  background: `${color}20`,
                  padding: '12px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${color}30`
                }}>
                  <span style={{ color: '#fff', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase' }}>{entity.name}</span>
                  {isActive && (
                    <span style={{
                      background: color,
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>CUT</span>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{entity.display_name}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {entity.fields?.slice(0, 5).map((field, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                        <div style={{ width: '4px', height: '4px', background: color, borderRadius: '50%' }} />
                        <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{field.name}</span>
                      </div>
                    ))}
                    {entity.fields?.length > 5 && (
                      <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', marginTop: '4px', paddingLeft: '12px' }}>
                        + {entity.fields.length - 5} more fields...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DatabasePopup
        isOpen={!!selectedEntity}
        onClose={() => setSelectedEntity(null)}
        tableName={selectedEntity?.name}
        tableType={selectedEntity?.type}
        tableData={selectedEntity?.data || {}}
      />
    </div>
  );
}

function TestsTab({ data }) {
  const testScenarios = data?.test_scenarios;

  if (!testScenarios) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        No test scenarios available for this cut.
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '24px',
      border: '4px solid #6366f1',
      padding: '40px',
      color: '#1e293b',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px'
      }}>
        <div>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '900',
            color: '#1e293b',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: '0 0 8px 0'
          }}>
            TEST SPECIFICATION BASIS
          </h2>
          <p style={{
            fontSize: '12px',
            color: '#94a3b8',
            margin: 0
          }}>
            Basis: {testScenarios.basis || "Automated Gherkin definitions extracted from execution paths"}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {testScenarios.total_features && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              fontSize: '12px',
              fontWeight: '700',
              color: '#3b82f6'
            }}>
              {testScenarios.total_features} FEATURES
            </div>
          )}
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '12px',
            fontWeight: '700',
            color: '#6366f1'
          }}>
            {testScenarios.total_scenarios || testScenarios.scenarios?.length || 0} SCENARIOS
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {testScenarios.scenarios?.map((scenario, idx) => {
          const scenarioName = scenario.scenario || scenario.name;
          const prevScenario = testScenarios.scenarios[idx - 1];
          const showFeature = scenario.feature && (!prevScenario || prevScenario.feature !== scenario.feature);

          return (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {showFeature && (
                <div style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#6366f1',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(99, 102, 241, 0.05)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(99, 102, 241, 0.1)'
                }}>
                  <div style={{ width: '4px', height: '16px', background: '#6366f1', borderRadius: '2px' }} />
                  FEATURE: {scenario.feature}
                </div>
              )}

              <div style={{
                borderLeft: '4px solid #6366f1',
                paddingLeft: '24px',
                position: 'relative',
                marginLeft: scenario.feature ? '12px' : '0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#1e293b',
                    margin: 0,
                    fontFamily: 'monospace',
                    lineHeight: '1.4',
                    maxWidth: '70%'
                  }}>
                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>Scenario: </span>
                    {scenarioName}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                    {scenario.tags?.map((tag, tIdx) => (
                      <span key={tIdx} style={{
                        fontSize: '10px',
                        background: 'rgba(99, 102, 241, 0.05)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        color: '#6366f1',
                        fontWeight: '700',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        letterSpacing: '0.5px'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {scenario.steps?.map((step, sIdx) => {
                    let keyword = "";
                    let stepText = "";

                    if (typeof step === 'string') {
                      const parts = step.trim().split(/\s+/);
                      keyword = parts[0];
                      stepText = parts.slice(1).join(' ');
                    } else {
                      keyword = step.keyword;
                      stepText = step.step;
                    }

                    return (
                      <div key={sIdx} style={{ display: 'flex', gap: '24px', alignItems: 'baseline' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '900',
                          color: '#6366f1',
                          textTransform: 'uppercase',
                          width: '60px',
                          textAlign: 'left',
                          fontFamily: 'monospace'
                        }}>
                          {keyword}
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: '#64748b',
                          fontFamily: 'monospace',
                          lineHeight: '1.4',
                          flex: 1
                        }}>
                          {stepText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModernPossibilitiesTab({ cutId }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const modules = import.meta.glob('../data/modern_possibilities/*.md', { query: '?raw', import: 'default' });
        const filePath = Object.keys(modules).find(path => path.includes(`Cut_${cutId}_`));
        if (filePath) {
          const mod = await modules[filePath]();
          setContent(mod);
        } else {
          setContent('# No Modern Possibilities\n\nNo modern possibilities documented for this cut yet.');
        }
      } catch (err) {
        console.error('Error loading markdown:', err);
        setContent('# Error\n\nFailed to load modern possibilities for this cut.');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [cutId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#94a3b8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(59, 130, 246, 0.1)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#3b82f6' }}>ANALYZING MODERN POSSIBILITIES...</div>
        </div>
      </div>
    );
  }

  // Parse content to extract sections
  const sections = content.split(/^## /m).filter(s => s.trim());
  const title = sections[0]?.split('\n')[0] || 'Modern Possibilities';
  const subtitle = sections[0]?.split('\n')[1]?.replace(/^### /, '') || '';

  const colors = [
    { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', accent: '#3b82f6', icon: '🏗️' },
    { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', accent: '#10b981', icon: '⚡' },
    { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', accent: '#8b5cf6', icon: '🔧' },
    { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', accent: '#f59e0b', icon: '📊' },
  ];

  const DetailModal = ({ section, index, onClose }) => {
    if (!section) return null;

    const lines = section.trim().split('\n');
    const sectionTitle = lines[0]?.replace(/^#+\s/, '') || `Section ${index + 1}`;
    const sectionContent = lines.slice(1).join('\n').trim();
    const color = colors[index % colors.length];

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(16px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 40px 100px -12px rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${color.accent}20 0%, ${color.accent}10 100%)`,
              borderBottom: `1px solid ${color.border}`,
              padding: '40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '20px',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
              <span style={{ fontSize: '32px', lineHeight: 1 }}>{color.icon}</span>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#fff',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px'
                }}>
                  {sectionTitle}
                </h2>
                <p style={{
                  fontSize: '12px',
                  color: color.accent,
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  margin: 0
                }}>
                  DETAILED EXPLORATION
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Modal Content */}
          <div style={{ padding: '40px' }}>
            <div style={{
              fontSize: '14px',
              color: '#cbd5e1',
              lineHeight: '1.8',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {sectionContent.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  return (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: color.accent, fontWeight: '700', marginTop: '2px', flexShrink: 0 }}>•</span>
                      <span>{trimmed.replace(/^[-*]\s/, '')}</span>
                    </div>
                  );
                }

                return (
                  <p key={i} style={{ margin: 0 }}>
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div
              style={{
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: `1px solid ${color.border}`,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}
            >
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        borderRadius: '32px',
        padding: '60px 48px',
        color: '#fff',
        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, fontSize: '200px', fontWeight: '900', lineHeight: 1 }}>✨</div>
        <h2 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '-1px' }}>
          {title}
        </h2>
        <p style={{ fontSize: '14px', fontWeight: '700', margin: 0, opacity: 0.95, textTransform: 'uppercase', letterSpacing: '2px' }}>
          {subtitle}
        </p>
      </div>

      {/* Content Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {sections.slice(1).map((section, idx) => {
          const lines = section.trim().split('\n');
          const sectionTitle = lines[0]?.replace(/^#+\s/, '') || `Section ${idx + 1}`;
          const sectionContent = lines.slice(1).join('\n').trim();
          const color = colors[idx % colors.length];

          return (
            <div
              key={idx}
              style={{
                background: color.bg,
                border: `2px solid ${color.border}`,
                borderRadius: '24px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.3s ease',
                cursor: 'default',
                backdropFilter: 'blur(8px)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = color.accent;
                e.currentTarget.style.boxShadow = `0 12px 32px ${color.accent}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = color.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{color.icon}</span>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#fff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  {sectionTitle}
                </h3>
              </div>

              <div style={{
                fontSize: '13px',
                color: '#cbd5e1',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {sectionContent.split('\n').slice(0, 3).map((line, i) => (
                  line.trim() && (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: color.accent, fontWeight: '700', marginTop: '2px' }}>•</span>
                      <span>{line.replace(/^[-*]\s/, '')}</span>
                    </div>
                  )
                ))}
              </div>

              <div
                onClick={() => setSelectedSection({ content: section, index: idx })}
                style={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  borderTop: `1px solid ${color.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: color.accent,
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.gap = '12px';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.gap = '8px';
                }}
              >
                EXPLORE
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Content Section */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '24px',
        padding: '48px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#e2e8f0',
        lineHeight: '1.8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '4px', height: '24px', background: '#6366f1', borderRadius: '2px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            DETAILED SPECIFICATIONS
          </h3>
        </div>

        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '24px', color: '#fff', letterSpacing: '-0.5px' }} {...props} />,
              h2: ({ node, ...props }) => <h2 style={{ fontSize: '20px', fontWeight: '800', marginTop: '32px', marginBottom: '16px', color: '#60a5fa', letterSpacing: '-0.5px' }} {...props} />,
              h3: ({ node, ...props }) => <h3 style={{ fontSize: '16px', fontWeight: '700', marginTop: '24px', marginBottom: '12px', color: '#93c5fd' }} {...props} />,
              p: ({ node, ...props }) => <p style={{ marginBottom: '16px', fontSize: '14px', color: '#cbd5e1' }} {...props} />,
              ul: ({ node, ...props }) => <ul style={{ marginBottom: '20px', paddingLeft: '0', listStyleType: 'none' }} {...props} />,
              li: ({ node, ...props }) => (
                <li style={{ marginBottom: '12px', color: '#cbd5e1', position: 'relative', paddingLeft: '24px', fontSize: '14px' }}>
                  <span style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', background: '#6366f1', borderRadius: '50%' }}></span>
                  {props.children}
                </li>
              ),
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const isBlock = !node.properties?.inline && (match || children?.toString().includes('\n'));

                if (!isBlock) {
                  return <code style={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    color: '#c7d2fe',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.9em',
                    fontWeight: '600',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }} {...props}>{children}</code>;
                }

                return (
                  <pre style={{
                    background: 'rgba(2, 6, 23, 0.6)',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    overflowX: 'auto',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    margin: '24px 0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}>
                    <code style={{
                      fontFamily: "'Fira Code', monospace",
                      fontSize: '13px',
                      color: '#94a3b8',
                      lineHeight: '1.5'
                    }} className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              strong: ({ node, ...props }) => <strong style={{ color: '#fff', fontWeight: '800' }} {...props} />,
              blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '4px solid #6366f1', background: 'rgba(99, 102, 241, 0.08)', padding: '20px 24px', margin: '24px 0', borderRadius: '0 12px 12px 0', color: '#93c5fd', fontSize: '14px' }} {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Modal */}
      {selectedSection && (
        <DetailModal
          section={selectedSection.content}
          index={selectedSection.index}
          onClose={() => setSelectedSection(null)}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

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
              minWidth: '200px',
              maxWidth: '260px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              color: '#fff',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)',
              overflow: 'hidden'
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0 }}>
                <div style={{ width: '32px', height: '32px', minWidth: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexShrink: 0 }}>
                  <CodeIcon />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', wordBreak: 'break-word', wordWrap: 'break-word', whiteSpace: 'normal' }}>{sub.topic}</span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4', margin: 0, wordBreak: 'break-word', wordWrap: 'break-word', whiteSpace: 'normal' }}>
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
          {(cluster?.system_view?.data_ops?.database_tables || [])
            .filter(table => {
              const tableName = table.name.toLowerCase();
              return (tableName === 'customer' || tableName === 'account' || tableName === 'card');
            })
            .map((table, i) => (
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
              {table.name}
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
            {(() => {
              const desc = cluster?.description || data.description || "Manages the complete lifecycle of system operations, providing an integrated platform for data processing and business logic execution.";

              return desc;
            })()}
          </p>

          {/* Detailed Stats Horizontal Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: 'auto' }}>
            {[
              { label: 'SCREENS', value: stats.screen_count || stats.flows || 0 },
              { label: 'PROGRAMS', value: stats.program_count || 17 },
              { label: 'TABLES', value: cluster?.system_view?.data_ops?.database_tables?.length || 0 },
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
  const cutData = clusterData.clusters.find(c => c.id === clusterId);

  if (!data) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <OverviewIcon /> },
    { id: 'dependencies', label: 'Dependencies', icon: <DependenciesIcon /> },
    { id: 'flow', label: 'Flows', icon: <FlowIcon /> },
    { id: 'data', label: 'Data', icon: <DataIcon /> },
    { id: 'tests', label: 'Tests', icon: <TestsIcon /> },
    { id: 'modern', label: 'Modern Possibilities', icon: <SparklesIcon /> },
    // { id: 'ascii', label: 'ASCII Chart', icon: <CodeIcon /> }
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => {
              const cutIdParam = clusterId;
              const runIdParam = clusterId;
              const url = `http://localhost:7898/?cutId=${cutIdParam}&runId=${runIdParam}`;
              window.open(url, "_blank");
            }}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              border: "none",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "700",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            EXPLORE
          </button>
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
        {activeTab === 'dependencies' && <DependenciesTab data={cutData} currentCutName={data.name} />}
        {activeTab === 'flow' && <FlowDiagram data={data} cutId={cutId} cutData={cutData} />}
        {activeTab === 'data' && <DataTab data={cutData} />}
        {activeTab === 'modern' && <ModernPossibilitiesTab cutId={cutId} />}
        {activeTab === 'tests' && <TestsTab data={cutData} />}
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
