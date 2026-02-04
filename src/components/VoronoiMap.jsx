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

export function VoronoiMap({ clusters, onSelect, onDeselect, selectedId, dependencyMap }) {
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

    // Create sites for each cluster in a circular pattern with some randomness
    const sites = clusters.map((c, i) => {
      const angle = (i / clusters.length) * 2 * Math.PI + (Math.random() * 0.3);
      const radius = Math.min(width, height) * 0.35 * (0.8 + Math.random() * 0.4);

      return {
        id: c.cluster_id,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        cluster: c,
      };
    });

    // Generate Voronoi diagram
    const delaunay = d3.Delaunay.from(sites.map(s => [s.x, s.y]));
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    const polygonData = sites.map((s, i) => ({
      path: voronoi.renderCell(i),
      center: s,
      cluster: s.cluster,
    }));

    return { polygons: polygonData, sites };
  }, [clusters, dimensions]);

  // Get dependencies for selected cluster
  const selectedCluster = clusters.find(c => c.cluster_id === selectedId);
  const activeDependencies = useMemo(() => {
    if (!selectedId || !dependencyMap) return [];
    const clusterDep = dependencyMap.find(d => d.cluster_id === selectedId);
    return clusterDep?.depends_on || [];
  }, [selectedId, dependencyMap]);

  const dependencyIds = new Set(activeDependencies.map(d => d.cluster_id));

  // Get short name for display
  const getShortName = (clusterId) => {
    // Extract meaningful part from cluster ID
    const parts = clusterId.split('_');
    if (parts.length >= 3) {
      return parts.slice(2).join(' ').split('-')[0].toUpperCase();
    }
    return clusterId.slice(0, 12);
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
                fillOpacity={isSelected ? 0.4 : isDependency ? 0.3 : isDimmed ? 0.02 : 0.15}
                stroke={colors.main}
                strokeWidth={isSelected ? 4 : isDependency ? 2 : 1}
                strokeOpacity={isSelected ? 0.8 : isDimmed ? 0.05 : 0.4}
                style={{
                  transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
                  fontSize="10"
                  fontWeight="bold"
                  fill={isSelected ? '#fff' : 'rgba(255,255,255,0.9)'}
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {p.cluster.cut_seq_no}
                </text>

                {/* Flow type indicators (S/B badges) */}
                <g transform="translate(0, 20)">
                  <g transform="translate(-14, 0)">
                    {p.cluster.screen_count > 0 && (
                      <g>
                        <rect x="-10" y="-8" width="20" height="16" rx="5" fill="#3b82f6" fillOpacity="0.9" />
                        <text textAnchor="middle" dy="4.5" fontSize="10" fontWeight="900" fill="white">S</text>
                      </g>
                    )}
                  </g>
                  <g transform="translate(14, 0)">
                    {p.cluster.flow_count > 0 && (
                      <g>
                        <rect x="-10" y="-8" width="20" height="16" rx="5" fill="#f97316" fillOpacity="0.9" />
                        <text textAnchor="middle" dy="4.5" fontSize="10" fontWeight="900" fill="white">B</text>
                      </g>
                    )}
                  </g>
                </g>

                {/* Cluster name */}
                <g transform="translate(0, -32)">
                  <text
                    textAnchor="middle"
                    fontSize={isSelected ? 14 : 9}
                    fontWeight="900"
                    fill={isSelected ? 'white' : '#64748b'}
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: isSelected ? '1px' : '0.5px',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    {getShortName(p.cluster.cluster_id)}
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
              {activeDependencies.map((dep) => {
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
                  <g key={`${p.cluster.cluster_id}-${dep.cluster_id}`}>
                    {/* Glow path */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth={4}
                      strokeOpacity={0.15}
                      style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    />
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
                        fill="#94a3b8"
                        style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                      >
                        {dep.table || 'DEPENDENCY'}
                      </text>
                    </g>
                    {/* Target ping */}
                    <circle
                      cx={x2}
                      cy={y2}
                      r="8"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                      style={{ animation: 'ping 1.5s ease-out infinite' }}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* CSS Animations */}
      <style>
        {`
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
