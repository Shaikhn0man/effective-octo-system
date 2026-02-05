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
    { id: 'metrics', label: 'Metrics' },
    { id: 'dependencies', label: 'Dependencies' },
  ];

  // Mini Hierarchy View for Subcuts Tab (Circle Pack)
  const SubcutHierarchy = ({ subCuts, mainClusterId }) => {
    if (!Array.isArray(subCuts)) return null; // Ensure subCuts is an array

    return (
      <div>
        {subCuts.map((subCut, index) => (
          <div key={`${mainClusterId}-${subCut.id}-${index}`} style={{ marginBottom: '10px' }}>
            <h4>{subCut.topic}</h4>
            <p>Type: {subCut.type}</p>
            <p>Flow Count: {subCut.stats?.flow_count || 0}</p>
            <p>Batch Flows: {subCut.stats?.batch_flows || 0}</p>
            <p>Screen Flows: {subCut.stats?.screen_flows || 0}</p>
          </div>
        ))}
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
              }}>Functional Containment (Circle Pack)</h3>
              <SubcutHierarchy subCuts={cluster.sub_cuts} mainClusterId={cluster.cluster_id} />
            </section>

            <section>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>Subcut Entities ({cluster.sub_cut_count})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cluster.sub_cuts?.map(sc => (
                  <div key={sc.sub_cut_id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: sc.sub_cut_type === 'CLEAN_SUBCUT' ? '#22c55e' : '#e2e8f0',
                        letterSpacing: '-0.3px',
                      }}>
                        {sc.sub_cut_id}
                      </span>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        color: '#64748b',
                        fontFamily: 'monospace',
                      }}>SEQ.{sc.sub_cut_seq_no}</span>
                    </div>
                    <p style={{
                      fontSize: '10px',
                      color: '#64748b',
                      lineHeight: '1.4',
                      margin: 0,
                    }}>
                      {sc.sub_cut_topic}
                    </p>
                  </div>
                ))}
              </div>
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