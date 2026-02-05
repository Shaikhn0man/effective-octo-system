import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

// Type colors configuration
const TYPE_COLORS = {
  CLEAN_CUT: {
    main: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.4)',
    label: 'Clean Cut',
  },
  READ_ONLY_CUT: {
    main: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    label: 'Read Only',
  },
};

export function VoronoiMap({ clusters, onSelect, onDeselect, selectedId, dependencyMap, approvedIds = new Set() }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { polygons, sites } = useMemo(() => {
    const width = dimensions.width;
    const height = dimensions.height;

    // Filter out clusters without IDs just in case
    const validClusters = clusters.filter(c => c.cluster_id);

    // 40% Programs, 35% Flows, 25% Screens
    const calculateScore = (c) => {
      const programCount = c.program_count || 0;
      const flowCount = c.flow_count || 0;
      const screenCount = c.screen_count || 0;
      return Math.max(1, (programCount * 0.40) + (flowCount * 0.35) + (screenCount * 0.25));
    };

    // Filter and sort clusters by size (descending) for spiral layout
    const scoredClusters = clusters
      .filter(c => c.cluster_id)
      .map(c => ({ ...c, score: calculateScore(c) }))
      .sort((a, b) => b.score - a.score);

    // Initial positions using Phyllotaxis Spiral (Sunflower pattern)
    // This naturally packs larger items in the center if we sort by size desc
    const initialSites = scoredClusters.map((c, i) => {
      // Phyllotaxis formula
      const radiusScale = Math.min(width, height) * 0.04; // Adjust spacing factor
      const angle = i * 2.4; // Golden angle approx (radians)
      const r = radiusScale * Math.sqrt(i) * 6; // Spread factor
      
      const x = width / 2 + r * Math.cos(angle);
      const y = height / 2 + r * Math.sin(angle);

      // Determine size category
      let sizeCategory = 'SM';
      if (c.score >= 8) sizeCategory = 'LG';
      else if (c.score >= 3) sizeCategory = 'MD';

      return {
        id: c.cluster_id,
        x: Math.max(70, Math.min(width - 70, x)), // Keep within bounds
        y: Math.max(70, Math.min(height - 70, y)),
        cluster: c,
        score: c.score,
        sizeCategory
      };
    });

    // Calculate cluster size based on weighted combination of metrics
    const simulation = d3.forceSimulation(initialSites)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => {
        // Calculate radius with more aggressive scaling for visual impact
        // Formula: radius = Math.max(70, 25 + (complexityScore^0.65 × 28))
        const radius = Math.max(70, 25 + (Math.pow(d.score, 0.65) * 28));
        const minRadius = 50; 
        return Math.max(radius, minRadius);
      }).strength(0.8)) // Slightly reduced strength for smoother packing
      .force('x', d3.forceX(width / 2).strength(0.1)) // Gentle pull to center
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-200)) // Repel to prevent overlap
      .stop();

    // Run simulation synchronously for a stable layout
    for (let i = 0; i < 180; ++i) simulation.tick(); // Increased ticks for stability

    const sites = initialSites;

    // Generate Voronoi diagram from force-placed sites
    const delaunay = d3.Delaunay.from(sites.map(s => [s.x, s.y]));
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    const polygonData = sites.map((s, i) => ({
      path: voronoi.renderCell(i),
      center: s,
      cluster: s.cluster,
      sizeCategory: s.sizeCategory
    }));

    return { polygons: polygonData, sites };
  }, [clusters, dimensions]);

  // Get dependencies for selected cluster
  const selectedCluster = clusters.find(c => c.cluster_id === selectedId);

  // Compute both outgoing and incoming dependencies
  const { outgoingDeps, incomingDeps, allDependencyIds } = useMemo(() => {
    if (!selectedId) return { outgoingDeps: [], incomingDeps: [], allDependencyIds: new Set() };

    // OUTGOING: This cluster reads from others (Depends On)
    const selectedClusterData = clusters.find(c => c.cluster_id === selectedId);
    const outgoing = (selectedClusterData?.dependencies?.reads_from_cuts || []).map(str => {
      const match = str.match(/^(.*?) \(Table: (.*?)\)$/);
      if (match) return { cluster_id: match[1], table: match[2] };
      return { cluster_id: str, table: null };
    });

    // INCOMING: Other clusters read from this one (Depended By)
    const incoming = [];
    clusters.forEach(c => {
      if (c.cluster_id === selectedId) return;

      const reads = c.dependencies?.reads_from_cuts || [];
      reads.forEach(readStr => {
        const match = readStr.match(/^(.*?) \(Table: (.*?)\)$/);
        const targetId = match ? match[1] : readStr;
        const targetTable = match ? match[2] : null;

        if (targetId === selectedId) {
          incoming.push({
            cluster_id: c.cluster_id,
            table: targetTable
          });
        }
      });
    });

    const allIds = new Set([
      ...outgoing.map(d => d.cluster_id),
      ...incoming.map(d => d.cluster_id)
    ]);

    return { outgoingDeps: outgoing, incomingDeps: incoming, allDependencyIds: allIds };
  }, [selectedId, clusters]);

  const dependencyIds = allDependencyIds;

  // Get short name for display (truncated to 3 words)
  const getShortName = (clusterId) => {
    // Extract meaningful part from cluster ID
    const parts = clusterId.split('_');
    if (parts.length >= 3) {
      const fullName = parts.slice(2).join(' ').replace(/_/g, ' ').split('-')[0];
      const words = fullName.split(' ').filter(w => w.length > 0);

      // Truncate to 3 words and add ellipsis if needed
      if (words.length > 3) {
        return words.slice(0, 3).join(' ').toUpperCase() + '...';
      }
      return fullName.toUpperCase();
    }
    return clusterId.slice(0, 12);
  };

  // Get full name for tooltip
  const getFullName = (clusterId) => {
    const parts = clusterId.split('_');
    if (parts.length >= 3) {
      return parts.slice(2).join(' ').replace(/_/g, ' ').split('-')[0];
    }
    return clusterId;
  };

  const handleBackgroundClick = (e) => {
    // Only trigger if clicking the direct SVG background, not a polygon
    if (e.target.tagName === 'svg' || e.target.id === 'bg-rect') {
      onDeselect && onDeselect();
    }
  };

  return (
    <div ref={containerRef} style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: '#020617',
      overflow: 'hidden',
    }}>
      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{ position: 'relative', zIndex: 10, outline: 'none' }}
        onClick={handleBackgroundClick}
      >
        <rect id="bg-rect" width="100%" height="100%" fill="transparent" />
        <defs>
          {/* Arrow markers for dependency lines */}
          <marker id="arrowhead-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#ef4444" opacity="0.8" />
          </marker>
          <marker id="arrowhead-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#22c55e" opacity="0.8" />
          </marker>
          <marker id="arrowhead-slate" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" opacity="0.6" />
          </marker>
          {/* Topographic pattern */}
          <pattern id="topo" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M0 15 Q 7.5 7.5 15 15 T 30 15" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Render polygons */}
        {polygons.map((p) => {
          const isSelected = selectedId === p.cluster.cluster_id;
          const isDependency = dependencyIds.has(p.cluster.cluster_id);
          const isDimmed = selectedId && !isSelected && !isDependency;
          const isApproved = approvedIds.has(p.cluster.cluster_id);
          const colors = TYPE_COLORS[p.cluster.type] || TYPE_COLORS.READ_ONLY_CUT;

          return (
            <g
              key={p.cluster.cluster_id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(p.cluster);
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* Main polygon */}
              <path
                d={p.path}
                fill={colors.main}
                fillOpacity={isApproved ? 0.4 : (isSelected ? 0.4 : isDependency ? 0.3 : isDimmed ? 0.02 : 0.15)}
                stroke={isApproved ? colors.main : (colors.main)}
                strokeWidth={isApproved ? 3 : (isSelected ? 4 : isDependency ? 2 : 1)}
                strokeOpacity={isApproved ? 0.9 : (isSelected ? 0.8 : isDimmed ? 0.05 : 0.4)}
                filter={isApproved ? 'url(#glow)' : ''}
                style={{
                  transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animation: isApproved ? 'approvedPulse 3s ease-in-out infinite' : 'none'
                }}
              />
              {/* Topographic texture */}
              <path d={p.path} fill="url(#topo)" style={{ pointerEvents: 'none', opacity: 0.2 }} />

              {/* Center point and labels */}
              <g
                transform={`translate(${p.center.x}, ${p.center.y})`}
                style={{
                  pointerEvents: 'none',
                  transition: 'opacity 0.6s ease',
                  opacity: isDimmed ? 0.1 : 1,
                }}
              >
                {/* Center dot */}
                <circle
                  r={isSelected ? 7 : 4}
                  fill={isSelected ? '#fff' : colors.main}
                  style={isSelected ? { filter: `drop-shadow(0 0 10px ${colors.main})` } : {}}
                />
                {!isSelected && <circle r="1.5" fill="white" />}

                {/* Sequence Number */}
                <text
                  textAnchor="middle"
                  y={-10}
                  fontSize="14"
                  fontWeight="bold"
                  fill={isSelected ? '#fff' : 'rgba(255,255,255,0.9)'}
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {p.cluster.cut_seq_no}
                </text>

                {/* Flow type indicators (S/B badges) + Size Indicator */}
                {/* Separate opacity control to keep badges visible even when dimmed */}
                <g transform="translate(0, 26)" style={{ opacity: isDimmed ? 0.6 : 1 }}>
                  <g display="flex" style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    {/* Size Badge */}
                    <g transform="translate(-24, 0)">
                       <rect x="-10" y="-8" width="20" height="16" rx="4" fill="#1e293b" fillOpacity="0.8" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                       <text textAnchor="middle" dy="4" fontSize="9" fontWeight="bold" fill="#94a3b8">{p.sizeCategory}</text>
                    </g>

                    {/* S/B Badges - Adjust positions dynamically */}
                    {p.cluster.screen_count > 0 && p.cluster.flow_count > 0 ? (
                      <>
                        <g transform="translate(0, 0)">
                          <rect x="-12" y="-10" width="24" height="20" rx="6" fill="#3b82f6" fillOpacity="0.9" />
                          <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="white">S</text>
                        </g>
                        <g transform="translate(26, 0)">
                          <rect x="-12" y="-10" width="24" height="20" rx="6" fill="#f97316" fillOpacity="0.9" />
                          <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="white">B</text>
                        </g>
                      </>
                    ) : p.cluster.screen_count > 0 ? (
                      <g transform="translate(14, 0)">
                        <rect x="-12" y="-10" width="24" height="20" rx="6" fill="#3b82f6" fillOpacity="0.9" />
                        <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="white">S</text>
                      </g>
                    ) : p.cluster.flow_count > 0 ? (
                      <g transform="translate(14, 0)">
                        <rect x="-12" y="-10" width="24" height="20" rx="6" fill="#f97316" fillOpacity="0.9" />
                        <text textAnchor="middle" dy="5" fontSize="12" fontWeight="900" fill="white">B</text>
                      </g>
                    ) : null}
                  </g>
                </g>

                {/* Cluster name */}
                <g transform="translate(0, -32)">
                  <text
                    textAnchor="middle"
                    fontSize={isSelected ? 18 : 12}
                    fontWeight="900"
                    fill={isSelected ? 'white' : '#64748b'}
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: isSelected ? '1px' : '0.5px',
                      transition: 'all 0.4s ease',
                      cursor: 'pointer',
                    }}
                  >
                    {getShortName(p.cluster.cluster_id)}
                    {/* Tooltip with full name */}
                    <title>{getFullName(p.cluster.cluster_id)}</title>
                  </text>
                </g>
              </g>
            </g>
          );
        })}

        {/* Render dependency paths for selected cluster */}
        {selectedId && polygons.map((p) => {
          if (p.cluster.cluster_id !== selectedId) return null;

          return (
            <g key={`deps-${p.cluster.cluster_id}`} style={{ pointerEvents: 'none' }}>
              {/* OUTGOING DEPENDENCIES (Red - This cluster reads from others) */}
              {outgoingDeps.map((dep) => {
                const targetPolygon = polygons.find(target => target.cluster.cluster_id === dep.cluster_id);
                if (!targetPolygon) return null;

                const x1 = p.center.x;
                const y1 = p.center.y;
                const x2 = targetPolygon.center.x;
                const y2 = targetPolygon.center.y;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const dr = Math.sqrt(dx * dx + dy * dy) * 1.3;
                const pathStr = `M${x1},${y1} A${dr},${dr} 0 0,1 ${x2},${y2}`;

                return (
                  <g key={`outgoing-${p.cluster.cluster_id}-${dep.cluster_id}`}>
                    {/* Main path */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeOpacity={0.7}
                      markerEnd="url(#arrowhead-red)"
                    />
                    {/* Label */}
                    <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2 - 15})`}>
                      <rect
                        x="-45"
                        y="-10"
                        width="90"
                        height="20"
                        rx="6"
                        fill="#0f172a"
                        stroke="#ef4444"
                        strokeOpacity="0.3"
                      />
                      <text
                        textAnchor="middle"
                        dy="5"
                        fontSize="8"
                        fontWeight="bold"
                        fill="#ef4444"
                        style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                      >
                        {dep.table || 'READS FROM'}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* INCOMING DEPENDENCIES (Green - Others read from this cluster) */}
              {incomingDeps.map((dep, index) => {
                const pathStr = `M${dep.sourceX},${dep.sourceY} L${dep.targetX},${dep.targetY}`; // Define pathStr dynamically
                return (
                  <path
                    key={`incoming-${dep.source}-${dep.target}-${index}`}
                    d={pathStr}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={4}
                    strokeOpacity={0.15}
                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    markerEnd="url(#arrowhead-green)"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes approvedPulse {
            0% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.5)); stroke-opacity: 0.9; }
            50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.8)); stroke-opacity: 1; stroke-width: 4px; }
            100% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.5)); stroke-opacity: 0.9; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @keyframes ping {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
