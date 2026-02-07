import { useState } from 'react';

export function MapLegend({ 
  onSizeFilterChange = () => { }, 
  typeFilter = "ALL", 
  onTypeFilterChange = () => { },
  flowFilter = "ALL",
  onFlowFilterChange = () => { }
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sizeFilter, setSizeFilter] = useState('ALL');

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '28px',
        left: '28px',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(16px)',
        borderRadius: isExpanded ? '16px' : '20px',
        padding: isExpanded ? '24px' : '10px 16px',
        border: '1px solid rgba(255,255,255,0.08)',
        width: isExpanded ? '260px' : '260px',
        zIndex: 15,
        pointerEvents: 'auto',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: isExpanded ? 'default' : 'pointer',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {/* Header / Pill Content */}
      <h4 style={{
        fontSize: '14px',
        fontWeight: '700',
        color: isExpanded ? '#64748b' : '#3b82f6',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: isExpanded ? '16px' : '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        margin: 0,
        transition: 'color 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>{isExpanded ? '◇' : '🗺️'}</span>
          <span>{isExpanded ? 'Cartographic Legend' : 'Map Legend'}</span>
        </div>

        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
            }}
          >
            ×
          </button>
        )}
      </h4>

      {/* Expanded Content */}
      <div style={{
        maxHeight: isExpanded ? '800px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Area Size Filter */}
        <div style={{ marginBottom: '16px', marginTop: '4px' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#94a3b8',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              width: '16px',
              height: '12px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
              borderRadius: '3px',
            }} />
            Territory Size
          </div>
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
          }}>
            {[
              { value: 'ALL', label: 'All', color: '#64748b' },
              { value: 'SMALL', label: 'Small', color: '#3b82f6' },
              { value: 'LARGE', label: 'Large', color: '#22c55e' },
            ].map(filter => {
              const isActive = sizeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSizeFilter(filter.value);
                    onSizeFilterChange(filter.value);
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: isActive ? `1px solid ${filter.color}` : '1px solid rgba(255,255,255,0.1)',
                    background: isActive ? `${filter.color}20` : 'transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: isActive ? filter.color : '#64748b',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = `${filter.color}60`;
                      e.currentTarget.style.background = `${filter.color}10`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Area Size info */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: "12px",
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            lineHeight: "1.5",
          }}>
            <strong>SM:</strong> Small territories<br />
            <strong>LG:</strong> Large territories
          </div>
        </div>

        {/* Flow Types */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#94a3b8',
            marginBottom: '10px',
          }}>
            Flow Types
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '-8px', marginRight: '-8px' }}>
            {[
              { value: 'SCREEN', color: '#3b82f6', icon: 'S', label: 'Screen Flow' },
              { value: 'BATCH', color: '#f97316', icon: 'B', label: 'Batch Flow' },
            ].map(flow => {
              const isActive = flowFilter === flow.value;
              return (
                <button
                  key={flow.value}
                  onClick={() => {
                    const nextFilter = isActive ? "ALL" : flow.value;
                    onFlowFilterChange(nextFilter);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    background: isActive ? `${flow.color}15` : 'transparent',
                    border: '1px solid transparent',
                    borderColor: isActive ? `${flow.color}40` : 'transparent',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{
                    background: flow.color,
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    width: '18px',
                    textAlign: 'center',
                    opacity: isActive ? 1 : 0.7,
                  }}>{flow.icon}</span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: isActive ? flow.color : '#e2e8f0', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    flex: 1
                  }}>{flow.label}</span>
                  {isActive && (
                    <div style={{
                      color: flow.color,
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          margin: '16px 0',
        }} />

        {/* Cut Types */}
        <div style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#94a3b8',
          marginBottom: '12px',
        }}>
          Modernization Readiness
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '-8px', marginRight: '-8px' }}>
          {[
            { value: 'CLEAN_CUT', color: '#22c55e', label: 'Clean Cut', desc: 'Isolated functionality' },
            { value: 'READ_ONLY_CUT', color: '#f59e0b', label: 'Read Only', desc: 'Limited write operations' },
          ].map(type => {
            const isActive = typeFilter === type.value;
            return (
              <button
                key={type.label}
                onClick={() => {
                  const nextFilter = isActive ? "ALL" : type.value;
                  onTypeFilterChange(nextFilter);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px',
                  background: isActive ? `${type.color}15` : 'transparent',
                  border: '1px solid transparent',
                  borderColor: isActive ? `${type.color}40` : 'transparent',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  background: type.color,
                  marginTop: '4px',
                  boxShadow: `0 0 8px ${type.color}40`,
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.6,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'color 0.2s ease',
                  }}>{type.label}</div>
                  <div style={{
                    fontSize: '11px',
                    color: '#64748b',
                  }}>{type.desc}</div>
                </div>
                {isActive && (
                  <div style={{
                    color: type.color,
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>✓</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
