import { useState } from 'react';
import { MapLegend } from './MapLegend';

const TYPE_COLORS = {
  CLEAN_CUT: {
    main: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.4)',
    label: 'Clean Cut',
    text: 'text-green-400',
  },
  READ_ONLY_CUT: {
    main: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    label: 'Read Only',
    text: 'text-amber-400',
  },
};

export function ClusterSidebar({ cluster, onClose, dependencyInfo, filterType, setFilterType, filterButtons, clusterData }) {
  const [activeTab, setActiveTab] = useState('overview');

  const StatsFooter = () => (
    <div style={{
      padding: '20px 24px',
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginTop: 'auto',
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "7px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 2px 0" }}>Volume</p>
            <p style={{ fontSize: "11px", fontWeight: "800", color: "#e2e8f0", fontFamily: "monospace", margin: 0 }}>4.2M LOC</p>
          </div>
          <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "7px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 2px 0" }}>Cuts</p>
            <p style={{ fontSize: "11px", fontWeight: "800", color: "#e2e8f0", fontFamily: "monospace", margin: 0 }}>{clusterData.total_clusters}</p>
          </div>
          <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "7px", fontWeight: "800", color: "#ef4444", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 2px 0" }}>Risks</p>
            <p style={{ fontSize: "11px", fontWeight: "800", color: "#ef4444", fontFamily: "monospace", margin: 0 }}>3</p>
          </div>
        </div>
      </div>

      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        padding: "4px",
        borderRadius: "12px",
        display: "flex",
        gap: "4px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        {filterButtons.map((btn) => {
          const isActive = filterType === btn.type;
          return (
            <button
              key={btn.type}
              onClick={() => setFilterType(btn.type)}
              style={{
                flex: 1,
                padding: "8px",
                fontSize: "9px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                border: "none",
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                borderRadius: "8px",
                cursor: "pointer",
                color: isActive ? (btn.color || "#ffffff") : "#64748b",
                transition: "all 0.2s ease",
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!cluster) {
    // Empty state with Legend
    return (
      <div style={{
        width: '520px',
        background: 'rgba(2, 6, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <div style={{
          padding: '40px 32px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          overflowY: 'auto',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              marginBottom: '24px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute',
                inset: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '800',
              color: '#64748b',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}>Cartography View</h2>
            <p style={{
              fontSize: '10px',
              color: '#475569',
              maxWidth: '240px',
              lineHeight: '1.6',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Select a cluster to analyze boundaries and technical debt density.
            </p>
          </div>

          <MapLegend />
        </div>
        <StatsFooter />
      </div>
    );
  }

  const colors = TYPE_COLORS[cluster.type] || TYPE_COLORS.READ_ONLY_CUT;
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sub-cuts', label: 'Sub Cuts' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'dependencies', label: 'Dependencies' },
  ];

  const activeDependencyInfo = (() => {
    if (cluster?.dependencies?.reads_from_cuts) {
      const dependsOn = cluster.dependencies.reads_from_cuts.map(d => {
        const match = d.match(/^(.*?) \(Table: (.*?)\)$/);
        if (match) return { cluster_id: match[1], table: match[2] };
        return { cluster_id: d };
      });

      const dependedBy = [];
      if (clusterData?.clusters) {
        clusterData.clusters.forEach(c => {
          if (c.cluster_id === cluster.cluster_id) return;
          const reads = c.dependencies?.reads_from_cuts || [];
          if (reads.some(r => r.startsWith(cluster.cluster_id))) {
            if (!dependedBy.find(existing => existing.cluster_id === c.cluster_id)) {
              dependedBy.push({ cluster_id: c.cluster_id });
            }
          }
        });
      }

      return {
        depends_on: { count: dependsOn.length, clusters: dependsOn },
        depended_by: { count: dependedBy.length, clusters: dependedBy }
      };
    }
    return dependencyInfo;
  })();

  return (
    <div style={{
      width: '520px',
      background: 'rgba(2, 6, 23, 0.98)',
      backdropFilter: 'blur(24px)',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 0.4s ease-out',
      zIndex: 40,
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 28px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.01)',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: '#64748b',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Type badge and ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{
            fontSize: '9px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '4px 10px',
            borderRadius: '20px',
            border: `1px solid ${colors.main}`,
            color: colors.main,
          }}>
            {colors.label}
          </span>
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#334155',
          }} />
          <span style={{
            fontSize: '9px',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            {cluster.cluster_id.split('_').slice(0, 2).join('_')}
          </span>
        </div>

        {/* Cluster name */}
        <h1 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '-1px',
          marginBottom: '20px',
          lineHeight: '1.2',
        }}>
          {cluster.cluster_id.split('_').slice(2).join(' ').replace(/-/g, ' ')}
        </h1>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255,255,255,0.03)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '9px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 28px',
      }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Topic description */}
            <section style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>Functional Narrative</h3>
              <p style={{
                fontSize: '13px',
                color: '#94a3b8',
                lineHeight: '1.6',
                fontStyle: 'italic',
              }}>
                "{cluster.topic}"
              </p>
            </section>

            {/* Business Scenarios */}
            <section style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>Business Scenarios</h3>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '13px',
                color: '#94a3b8',
                lineHeight: '1.6',
              }}>
                <li>Scenario 1: Standard transaction processing flow</li>
                <li>Scenario 2: Exception handling and rollback procedures</li>
              </ul>
            </section>

            {/* Core Entities */}
            <section style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>Core Entities</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['ENTITY_A', 'ENTITY_B'].map(entity => (
                  <span key={entity} style={{
                    fontSize: '11px',
                    color: '#64748b',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600',
                  }}>
                    {entity}
                  </span>
                ))}
              </div>
            </section>

            {/* Quick stats grid optimized */}
            <section style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {[
                { label: 'Flows', value: cluster.flow_count, color: '#f97316', bg: 'rgba(249, 115, 22, 0.05)' },
                { label: 'Screens', value: cluster.screen_count, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.05)' },
                { label: 'Programs', value: cluster.program_count, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.05)' },
                { label: 'Tables', value: cluster.table_count, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.05)' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: stat.bg,
                  padding: '20px 16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    color: '#ffffff',
                    marginBottom: '4px',
                    letterSpacing: '-1px',
                  }}>{stat.value}</div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    color: stat.color,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    opacity: 0.8,
                  }}>{stat.label}</div>
                </div>
              ))}
            </section>
          </div>
        )}

        {activeTab === 'sub-cuts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cluster.sub_cuts && cluster.sub_cuts.length > 0 ? (
              cluster.sub_cuts.map((subCut, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.02)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#e2e8f0',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {subCut.sub_cut_id}
                  </h3>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    color: subCut.sub_cut_type === 'CLEAN_SUBCUT' ? '#22c55e' : '#f59e0b',
                    background: subCut.sub_cut_type === 'CLEAN_SUBCUT' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '12px',
                  }}>
                    {subCut.sub_cut_type}
                  </span>
                  <p style={{
                    fontSize: '13px',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    marginBottom: '0'
                  }}>
                    {subCut.sub_cut_topic}
                  </p>
                </div>
              ))
            ) : (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '12px',
                fontStyle: 'italic'
              }}>
                No sub-cuts defined for this cluster.
              </div>
            )}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Detailed metrics with progress bars optimized */}
            {[
              { label: 'Flow Count', value: cluster.flow_count, max: 15, color: '#f97316', icon: '⟳' },
              { label: 'Screen Count', value: cluster.screen_count, max: 20, color: '#3b82f6', icon: '◫' },
              { label: 'Program Count', value: cluster.program_count, max: 20, color: '#8b5cf6', icon: '◈' },
              { label: 'Table Count', value: cluster.table_count, max: 15, color: '#22c55e', icon: '▤' },
            ].map(metric => (
              <div key={metric.label} style={{
                background: 'rgba(255,255,255,0.01)',
                padding: '16px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '10px',
                }}>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{ fontSize: '12px', color: metric.color }}>{metric.icon}</span>
                    {metric.label}
                  </span>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                  }}>{metric.value}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${Math.min((metric.value / metric.max) * 100, 100)}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${metric.color}88, ${metric.color})`,
                    borderRadius: '2px',
                    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Depends on section */}
            <section>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '900',
                color: '#ef4444',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}>↑</span>
                Depends On ({activeDependencyInfo?.depends_on?.count || 0})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeDependencyInfo?.depends_on?.clusters?.length > 0 ? (
                  activeDependencyInfo.depends_on.clusters.map((dep, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(239, 68, 68, 0.03)',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '1px solid rgba(239, 68, 68, 0.1)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.1)'}
                    >
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '800',
                        color: '#fca5a5',
                        marginBottom: '4px',
                        letterSpacing: '-0.3px',
                      }}>{dep.cluster_id || dep}</div>
                      {dep.table && (
                        <div style={{
                          fontSize: '8px',
                          color: 'rgba(239, 68, 68, 0.5)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          fontWeight: 'bold',
                        }}>via {dep.table}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '11px', color: '#334155', fontStyle: 'italic', paddingLeft: '8px' }}>
                    No incoming dependencies detected for this cut.
                  </p>
                )}
              </div>
            </section>

            {/* Depended by section */}
            <section>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '900',
                color: '#22c55e',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}>↓</span>
                Depended By ({activeDependencyInfo?.depended_by?.count || 0})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeDependencyInfo?.depended_by?.clusters?.length > 0 ? (
                  activeDependencyInfo.depended_by.clusters.map((dep, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(34, 197, 94, 0.03)',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '1px solid rgba(34, 197, 94, 0.1)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.1)'}
                    >
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '800',
                        color: '#86efac',
                        letterSpacing: '-0.3px',
                      }}>{dep.cluster_id || dep}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '11px', color: '#334155', fontStyle: 'italic', paddingLeft: '8px' }}>
                    No outgoing dependencies detected for this cut.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
      <StatsFooter />

      {/* CSS Animations */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}
