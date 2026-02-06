import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

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

const DependencyVisualizer = ({ dependsOn, dependedBy, currentClusterId }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 464;
    const nodeHeight = 40;
    const nodeWidth = 140;
    const verticalGap = 20;
    const xPadding = 20;

    // Calculate height based on max dependencies on either side
    const maxItems = Math.max(dependsOn.length, dependedBy.length, 1);
    const height = Math.max(300, maxItems * (nodeHeight + verticalGap) + 40);
    const centerY = height / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#64748b");

    const g = svg.append("g");

    // Helper to clean ID
    const cleanId = (id) => id.replace(/^Cut_\d+_/, '').replace(/_/g, ' ');

    // --- Nodes Data ---
    const nodes = [];

    // Central Node
    nodes.push({
      id: currentClusterId,
      x: width / 2 - nodeWidth / 2,
      y: centerY - nodeHeight / 2,
      type: 'current',
      label: cleanId(currentClusterId)
    });

    // Left Nodes (Depends On)
    dependsOn.forEach((dep, i) => {
      // Stack from center outwards or simple top-down centered
      const totalHeight = dependsOn.length * (nodeHeight + verticalGap) - verticalGap;
      const startY = centerY - totalHeight / 2;
      nodes.push({
        id: `prev-${i}`,
        x: xPadding,
        y: startY + i * (nodeHeight + verticalGap),
        type: 'source',
        label: cleanId(dep.cluster_id),
        meta: dep.table ? `Table: ${dep.table}` : null
      });
    });

    // Right Nodes (Depended By)
    dependedBy.forEach((dep, i) => {
      const totalHeight = dependedBy.length * (nodeHeight + verticalGap) - verticalGap;
      const startY = centerY - totalHeight / 2;
      nodes.push({
        id: `next-${i}`,
        x: width - nodeWidth - xPadding,
        y: startY + i * (nodeHeight + verticalGap),
        type: 'target',
        label: cleanId(dep.cluster_id),
        meta: dep.table ? `Table: ${dep.table}` : null
      });
    });

    // --- Links Data ---
    const links = [];
    nodes.forEach(node => {
      if (node.type === 'source') {
        links.push({
          source: { x: node.x + nodeWidth, y: node.y + nodeHeight / 2 },
          target: { x: width / 2 - nodeWidth / 2, y: centerY },
          id: `link-${node.id}`
        });
      } else if (node.type === 'target') {
        links.push({
          source: { x: width / 2 + nodeWidth / 2, y: centerY },
          target: { x: node.x, y: node.y + nodeHeight / 2 },
          id: `link-${node.id}`
        });
      }
    });

    // Draw Links
    g.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("d", d => {
        const sx = d.source.x, sy = d.source.y;
        const tx = d.target.x, ty = d.target.y;
        return d3.linkHorizontal()({ source: [sx, sy], target: [tx, ty] });
      })
      .attr("fill", "none")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowhead)")
      .attr("opacity", 0)
      .transition().duration(600).delay((d, i) => i * 50)
      .attr("opacity", 1);


    // Draw Nodes
    const nodeGroups = g.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("opacity", 0);

    nodeGroups.transition().duration(500).delay((d, i) => i * 50)
      .attr("opacity", 1);

    // Node Rects
    nodeGroups.append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("rx", 6)
      .attr("fill", d => {
        if (d.type === 'current') return 'rgba(59, 130, 246, 0.1)';
        if (d.type === 'source') return 'rgba(239, 68, 68, 0.05)';
        return 'rgba(34, 197, 94, 0.05)';
      })
      .attr("stroke", d => {
        if (d.type === 'current') return 'rgba(59, 130, 246, 0.5)';
        if (d.type === 'source') return 'rgba(239, 68, 68, 0.3)';
        return 'rgba(34, 197, 94, 0.3)';
      })
      .style("cursor", "pointer");

    // Type Labels (Inside nodes at top)
    nodeGroups.append("text")
      .attr("x", nodeWidth / 2)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(d => {
        if (d.type === 'source') return 'READS FROM';
        if (d.type === 'target') return 'READ BY';
        return 'CURRENT';
      })
      .attr("fill", d => {
        if (d.type === 'current') return '#3b82f6';
        if (d.type === 'source') return '#ef4444';
        return '#22c55e';
      })
      .attr("font-size", "7px")
      .attr("font-weight", 900)
      .attr("opacity", 0.6)
      .style("pointer-events", "none");

    // Node Text (Main Label)
    nodeGroups.append("text")
      .attr("x", nodeWidth / 2)
      .attr("y", nodeHeight / 2 + 2)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle")
      .text(d => d.label)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "10px")
      .attr("font-weight", 700)
      .style("pointer-events", "none")
      .each(function (d) {
        // Truncate if too long
        const self = d3.select(this);
        let textLength = self.node().getComputedTextLength();
        let text = d.label;
        while (textLength > nodeWidth - 16 && text.length > 0) {
          text = text.slice(0, -1);
          self.text(text + "...");
          textLength = self.node().getComputedTextLength();
        }
      });

    // Tooltip on hover
    nodeGroups.append("title")
      .text(d => d.label);

    // Meta Tables (Bottom - with better spacing)
    nodeGroups.each(function (d) {
      if (d.meta) {
        d3.select(this).append("text")
          .attr("x", nodeWidth / 2)
          .attr("y", nodeHeight + 16)
          .attr("text-anchor", "middle")
          .text(d.meta)
          .attr("fill", "#64748b")
          .attr("font-size", "8px")
          .attr("font-family", "monospace");
      }
    });

  }, [dependsOn, dependedBy, currentClusterId]);

  return (
    <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', display: 'flex', justifyContent: 'center' }}>
      <svg ref={svgRef} width={464} height={Math.max(300, Math.max(dependsOn.length, dependedBy.length) * 60 + 40)} />
    </div>
  );
};

export function ClusterSidebar({ cluster, onClose, dependencyInfo, filterType, setFilterType, filterButtons, clusterData, onOpenExplorer }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [techDebtFilter, setTechDebtFilter] = useState('ALL');

  // Compute Dependencies from clusterData
  const computedDependencies = useMemo(() => {
    if (!cluster) return { dependsOn: [], dependedBy: [] };

    // OUTGOING: This cluster reads from others (Depends On)
    const dependsOnRaw = cluster.dependencies?.reads_from_cuts || [];
    const dependsOn = dependsOnRaw.map(str => {
      const match = str.match(/^(.*?) \(Table: (.*?)\)$/);
      if (match) return { cluster_id: match[1], table: match[2] };
      return { cluster_id: str, table: null };
    });

    // INCOMING: Other clusters read from this one (Depended By)
    const dependedBy = [];
    if (clusterData?.clusters) {
      clusterData.clusters.forEach(c => {
        if (c.cluster_id === cluster.cluster_id) return;

        const reads = c.dependencies?.reads_from_cuts || [];
        reads.forEach(readStr => {
          const match = readStr.match(/^(.*?) \(Table: (.*?)\)$/);
          const targetId = match ? match[1] : readStr;
          const targetTable = match ? match[2] : null;

          if (targetId === cluster.cluster_id) {
            dependedBy.push({
              cluster_id: c.cluster_id, // The one reading
              table: targetTable // The table being read
            });
          }
        });
      });
    }

    return { dependsOn, dependedBy };
  }, [cluster, clusterData]);


  const StatsFooter = () => {
    const stats = [
      { label: 'TOTAL CUTS', value: `${clusterData.total_clusters} Clusters`, color: '#3b82f6', progress: 75 },
      { label: 'COMPLEXITY', value: '4.2M LOC', color: '#f59e0b', progress: 85 },
    ];

    return (
      <div style={{
        padding: '16px 20px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        marginTop: 'auto',
        zIndex: 50,
      }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '12px 14px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                fontSize: '8px',
                fontWeight: '800',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '6px',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '900',
                color: '#ffffff',
                fontFamily: 'monospace',
                marginBottom: '8px',
              }}>
                {stat.value}
              </div>
              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${stat.progress}%`,
                  height: '100%',
                  background: stat.color,
                  borderRadius: '2px',
                  transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          padding: "4px",
          borderRadius: "10px",
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
                  fontSize: "8px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  border: "none",
                  background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  borderRadius: "7px",
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
  };

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

        </div>
        <StatsFooter />
      </div>
    );
  }

  const colors = TYPE_COLORS[cluster.type] || TYPE_COLORS.READ_ONLY_CUT;
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'subcuts', label: 'Subcuts' },
    { id: 'programs', label: 'Programs' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'dependencies', label: 'Dependencies' },
  ];

  // Enhanced Subcuts Visualization
  const SubcutHierarchy = ({ subCuts, mainClusterId }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [expandedFlows, setExpandedFlows] = useState({});

    if (!Array.isArray(subCuts)) return null;

    const toggleFlowExpand = (subCutId) => {
      setExpandedFlows(prev => ({
        ...prev,
        [subCutId]: !prev[subCutId]
      }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {subCuts.map((subCut, index) => {
          const isExpanded = expandedId === subCut.id;
          const flowsExpanded = expandedFlows[subCut.id];
          const masterTableCount = subCut.data_domain?.master_tables?.length || 0;
          const refTableCount = subCut.data_domain?.reference_tables?.length || 0;
          const totalTables = masterTableCount + refTableCount;
          const flowCount = subCut.stats?.flow_count || 0;
          const screenCount = subCut.stats?.screen_flows || 0;

          return (
            <div
              key={`${mainClusterId}-${subCut.id}-${index}`}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : subCut.id)}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: subCut.type === 'CLEAN_SUBCUT' ? '#22c55e' : '#e2e8f0',
                    letterSpacing: '-0.3px',
                    marginBottom: '4px',
                  }}>
                    {subCut.id}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#94a3b8',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {subCut.topic}
                  </div>
                </div>

                {/* Metrics Pills */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: 'rgba(249, 115, 22, 0.1)',
                    borderRadius: '6px',
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#f97316',
                  }}>
                    <span>⟳</span>
                    <span>{flowCount}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '6px',
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#3b82f6',
                  }}>
                    <span>◫</span>
                    <span>{screenCount}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '6px',
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#22c55e',
                  }}>
                    <span>▤</span>
                    <span>{totalTables}</span>
                  </div>

                  {/* Expand Icon */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    transition: 'transform 0.2s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#64748b' }}>
                      <path d="M19 14l-7-7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{
                  padding: '12px 16px',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  {/* Data Domain Section */}
                  {(masterTableCount > 0 || refTableCount > 0) && (
                    <div>
                      <div style={{
                        fontSize: '8px',
                        fontWeight: '800',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                      }}>
                        Data Domain
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {masterTableCount > 0 && (
                          <div style={{
                            padding: '6px 10px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '6px',
                            fontSize: '9px',
                            color: '#c4b5fd',
                            fontWeight: '600',
                          }}>
                            {masterTableCount} Master
                          </div>
                        )}
                        {refTableCount > 0 && (
                          <div style={{
                            padding: '6px 10px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '6px',
                            fontSize: '9px',
                            color: '#93c5fd',
                            fontWeight: '600',
                          }}>
                            {refTableCount} Reference
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Flows Preview */}
                  {subCut.flows && subCut.flows.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: '8px',
                        fontWeight: '800',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                      }}>
                        Flows ({subCut.flows.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(flowsExpanded ? subCut.flows : subCut.flows.slice(0, 2)).map((flow, idx) => (
                          <div key={idx} style={{
                            padding: '8px 10px',
                            background: 'rgba(249, 115, 22, 0.05)',
                            borderRadius: '6px',
                            fontSize: '9px',
                            color: '#fed7aa',
                            lineHeight: '1.3',
                          }}>
                            {flow.topic}
                          </div>
                        ))}
                        {subCut.flows.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlowExpand(subCut.id);
                            }}
                            style={{
                              fontSize: '8px',
                              color: '#3b82f6',
                              fontWeight: '700',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '6px 10px',
                              textAlign: 'left',
                              transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                            onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}
                          >
                            {flowsExpanded ? `▼ Show less` : `▶ +${subCut.flows.length - 2} more flows`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

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

        {/* Cut Explorer Button */}
        <button
          onClick={onOpenExplorer}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            cursor: 'pointer',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.4)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          Deep Dive: Cut Explorer
        </button>

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
            {/* Business Summary */}
            <section style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#3b82f6',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>Business Summary</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {(() => {
                  // Convert description to bullet points
                  const description = cluster.description || '';
                  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
                  
                  return sentences.map((sentence, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#cbd5e1',
                      lineHeight: '1.6',
                    }}>
                      <span style={{
                        color: '#3b82f6',
                        fontSize: '8px',
                        marginTop: '6px',
                        flexShrink: 0,
                      }}>●</span>
                      <span>{sentence.trim()}</span>
                    </div>
                  ));
                })()}
              </div>
            </section>

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

        {activeTab === 'subcuts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px',
              }}>Functional Containment ({cluster.sub_cut_count} Subcuts)</h3>
              <SubcutHierarchy subCuts={cluster.sub_cuts} mainClusterId={cluster.cluster_id} />
            </section>

            {cluster.dependencies?.reads_from_cuts?.length > 0 && (
              <section>
                <h3 style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#3b82f6',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                  Shared Infrastructure
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cluster.dependencies.reads_from_cuts.map((dep, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(59, 130, 246, 0.05)',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      fontSize: '11px',
                      color: '#94a3b8',
                      lineHeight: '1.5',
                    }}>
                      {dep}
                    </div>
                  ))}
                </div>
              </section>
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

        {activeTab === 'programs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Tech Debt Filter */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{
                fontSize: '8px',
                fontWeight: '800',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Filter by Tech Debt
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}>
                {['ALL', 'DEAD_CODE_LIKELY', 'DUPLICATED_LOGIC', 'COMPLEX_CONTROL_FLOW', 'SHARED_STATE', 'MISSING_ERROR_HANDLING'].map(debt => {
                  const isActive = techDebtFilter === debt;
                  return (
                    <button
                      key={debt}
                      onClick={() => setTechDebtFilter(debt)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '8px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: isActive ? '#ffffff' : '#64748b',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }
                      }}
                    >
                      {debt === 'ALL' ? 'All' : debt.replace(/_/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Programs Display */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {(() => {
                // Extract all methods from programs in flows
                const allMethods = [];
                const techDebtCounts = {
                  'DEAD_CODE_LIKELY': 0,
                  'DUPLICATED_LOGIC': 0,
                  'COMPLEX_CONTROL_FLOW': 0,
                  'SHARED_STATE': 0,
                  'MISSING_ERROR_HANDLING': 0,
                };

                if (cluster.sub_cuts && Array.isArray(cluster.sub_cuts)) {
                  cluster.sub_cuts.forEach(subCut => {
                    if (subCut.flows && Array.isArray(subCut.flows)) {
                      subCut.flows.forEach(flow => {
                        if (flow.programs && Array.isArray(flow.programs)) {
                          flow.programs.forEach(program => {
                            if (program.methods && Array.isArray(program.methods)) {
                              program.methods.forEach(method => {
                                const techDebt = method.method_metadata?.tech_debt;
                                if (techDebt && techDebtCounts.hasOwnProperty(techDebt)) {
                                  techDebtCounts[techDebt]++;
                                }
                                
                                if (techDebtFilter === 'ALL' || techDebt === techDebtFilter) {
                                  allMethods.push({
                                    programPath: program.path,
                                    methodName: method.name,
                                    techDebt: techDebt,
                                    complexity: method.method_metadata?.complexity,
                                    criticality: method.method_metadata?.business_criticality,
                                    tags: method.method_metadata?.classification_tags,
                                    flowTopic: flow.topic,
                                    subCutId: subCut.id
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }

                // Show tech debt overview when ALL is selected
                if (techDebtFilter === 'ALL') {
                  const techDebtConfig = {
                    'DEAD_CODE_LIKELY': { 
                      color: '#ef4444', 
                      label: 'Dead Code', 
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#ef4444' }}>
                          <path d="M3 6h18M8 6v12M16 6v12M4 18h16M6 9h12M6 12h12M6 15h12" />
                        </svg>
                      ),
                      desc: 'Unused or unreachable code' 
                    },
                    'DUPLICATED_LOGIC': { 
                      color: '#f97316', 
                      label: 'Duplicated Logic', 
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#f97316' }}>
                          <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3m8-18h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3m-8-4h8m-8-4h8" />
                        </svg>
                      ),
                      desc: 'Repeated code patterns' 
                    },
                    'COMPLEX_CONTROL_FLOW': { 
                      color: '#a855f7', 
                      label: 'Complex Flow', 
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#a855f7' }}>
                          <path d="M12 3v6m0 6v6M3 12h6m6 0h6M7 7l4.24 4.24M12.76 12.76L17 17M17 7l-4.24 4.24M7 17l4.24-4.24" />
                        </svg>
                      ),
                      desc: 'Hard to follow logic' 
                    },
                    'SHARED_STATE': { 
                      color: '#3b82f6', 
                      label: 'Shared State', 
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#3b82f6' }}>
                          <circle cx="6" cy="6" r="2" />
                          <circle cx="18" cy="6" r="2" />
                          <circle cx="12" cy="18" r="2" />
                          <path d="M8 8l4 8M16 8l-4 8M6 8v4M18 8v4" />
                        </svg>
                      ),
                      desc: 'Global variable usage' 
                    },
                    'MISSING_ERROR_HANDLING': { 
                      color: '#f59e0b', 
                      label: 'Error Handling', 
                      icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#f59e0b' }}>
                          <path d="M12 2L2 20h20L12 2zm0 5v5m0 4v2" />
                        </svg>
                      ),
                      desc: 'Missing error checks' 
                    },
                  };

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        color: '#e2e8f0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                      }}>
                        Tech Debt Overview ({allMethods.length} methods total)
                      </div>
                      
                      {Object.entries(techDebtConfig).map(([key, config]) => {
                        const count = techDebtCounts[key];
                        const percentage = allMethods.length > 0 ? Math.round((count / allMethods.length) * 100) : 0;
                        
                        return (
                          <div
                            key={key}
                            onClick={() => setTechDebtFilter(key)}
                            style={{
                              padding: '16px 18px',
                              background: `linear-gradient(135deg, ${config.color}15 0%, ${config.color}08 100%)`,
                              border: `1px solid ${config.color}30`,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = `linear-gradient(135deg, ${config.color}25 0%, ${config.color}15 100%)`;
                              e.currentTarget.style.borderColor = `${config.color}50`;
                              e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = `linear-gradient(135deg, ${config.color}15 0%, ${config.color}08 100%)`;
                              e.currentTarget.style.borderColor = `${config.color}30`;
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            {/* Progress bar background */}
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: `${percentage}%`,
                              background: `${config.color}10`,
                              transition: 'width 0.8s ease',
                            }} />
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px' }}>
                                {config.icon}
                              </div>
                              <div>
                                <div style={{
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  color: config.color,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  marginBottom: '2px',
                                }}>
                                  {config.label}
                                </div>
                                <div style={{
                                  fontSize: '9px',
                                  color: '#94a3b8',
                                  lineHeight: '1.3',
                                }}>
                                  {config.desc}
                                </div>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                              <div style={{
                                fontSize: '8px',
                                color: '#64748b',
                                fontWeight: '600',
                              }}>
                                {percentage}%
                              </div>
                              <div style={{
                                fontSize: '20px',
                                fontWeight: '900',
                                color: config.color,
                                fontFamily: 'monospace',
                              }}>
                                {count}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // Show filtered methods
                if (allMethods.length === 0) {
                  return (
                    <div style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '11px',
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}>🔍</div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>No methods found</div>
                      <div>Try selecting a different tech debt filter</div>
                    </div>
                  );
                }

                const techDebtColors = {
                  'DEAD_CODE_LIKELY': { bg: 'rgba(239, 68, 68, 0.08)', border: '#ef444430', text: '#fca5a5' },
                  'DUPLICATED_LOGIC': { bg: 'rgba(249, 115, 22, 0.08)', border: '#f9731630', text: '#fed7aa' },
                  'COMPLEX_CONTROL_FLOW': { bg: 'rgba(168, 85, 247, 0.08)', border: '#a855f730', text: '#e9d5ff' },
                  'SHARED_STATE': { bg: 'rgba(59, 130, 246, 0.08)', border: '#3b82f630', text: '#93c5fd' },
                  'MISSING_ERROR_HANDLING': { bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b30', text: '#fcd34d' },
                };

                const complexityColors = {
                  'LOW': '#22c55e',
                  'MEDIUM': '#f59e0b',
                  'HIGH': '#ef4444',
                };

                const criticalityColors = {
                  'CORE': '#ef4444',
                  'SUPPORT': '#3b82f6',
                  'UTILITY': '#22c55e',
                  'DEAD': '#64748b',
                };

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      color: '#e2e8f0',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '8px',
                    }}>
                      {techDebtFilter.replace(/_/g, ' ')} Methods ({allMethods.length})
                    </div>
                    
                    {allMethods.map((method, idx) => {
                      const colors = techDebtColors[method.techDebt] || { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#94a3b8' };
                      
                      return (
                        <div
                          key={idx}
                          style={{
                            background: colors.bg,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '12px',
                            padding: '14px 16px',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = colors.bg.replace('0.08', '0.12');
                            e.currentTarget.style.transform = 'translateX(2px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = colors.bg;
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          {/* Header */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '10px',
                          }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                color: '#e2e8f0',
                                letterSpacing: '-0.3px',
                                marginBottom: '3px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {method.programPath}
                              </div>
                              <div style={{
                                fontSize: '9px',
                                color: colors.text,
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {method.methodName}
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          {method.tags && (
                            <div style={{
                              fontSize: '8px',
                              color: '#94a3b8',
                              lineHeight: '1.4',
                              marginBottom: '10px',
                              fontStyle: 'italic',
                            }}>
                              {method.tags}
                            </div>
                          )}

                          {/* Metadata badges */}
                          <div style={{
                            display: 'flex',
                            gap: '6px',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                          }}>
                            <div style={{
                              padding: '4px 8px',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: '4px',
                              fontSize: '8px',
                              fontWeight: '600',
                              color: complexityColors[method.complexity] || '#94a3b8',
                            }}>
                              {method.complexity}
                            </div>
                            <div style={{
                              padding: '4px 8px',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: '4px',
                              fontSize: '8px',
                              fontWeight: '600',
                              color: criticalityColors[method.criticality] || '#94a3b8',
                            }}>
                              {method.criticality}
                            </div>
                            <div style={{
                              padding: '4px 8px',
                              background: 'rgba(255,255,255,0.03)',
                              borderRadius: '4px',
                              fontSize: '7px',
                              fontWeight: '500',
                              color: '#64748b',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '120px',
                            }}>
                              {method.flowTopic}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Summary */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 12px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#ef4444', margin: 0 }}>{computedDependencies.dependsOn.length}</p>
                <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}>Inputs</p>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#22c55e', margin: 0 }}>{computedDependencies.dependedBy.length}</p>
                <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}>Outputs</p>
              </div>
            </div>

            {/* Visualization */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '20px 0',
              minHeight: '300px'
            }}>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>Data Lineage Map</h3>

              <DependencyVisualizer
                dependsOn={computedDependencies.dependsOn}
                dependedBy={computedDependencies.dependedBy}
                currentClusterId={cluster.cluster_id}
              />
            </div>
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