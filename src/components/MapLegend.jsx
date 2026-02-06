import { useState } from 'react';

export function MapLegend({ onSizeFilterChange = () => { } }) {
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
        width: isExpanded ? '260px' : 'auto',
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
              hoverColor: '#fff',
            }}
          >
            ×
          </button>
        )}
      </h4>

      {/* Expanded Content */}
      <div style={{
        maxHeight: isExpanded ? '500px' : '0',
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
              { value: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
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
                    border: `1px solid ${isActive ? filter.color : 'rgba(255,255,255,0.1)'}`,
                    background: isActive ? `${filter.color}20` : 'transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: isActive ? filter.color : '#64748b',
                    transition: 'all 0.2s ease',
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
            fontSize: '11px',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            lineHeight: '1.5',
          }}>
            <strong>SM:</strong> Small territories (Low complexity)<br />
            <strong>MD:</strong> Medium territories (Moderate complexity)<br />
            <strong>LG:</strong> Large territories (High complexity)
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{
                background: '#3b82f6',
                color: 'white',
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 6px',
                borderRadius: '4px',
              }}>S</span>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Screen Flow</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{
                background: '#f97316',
                color: 'white',
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 6px',
                borderRadius: '4px',
              }}>B</span>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Batch Flow</span>
            </div>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { color: '#22c55e', label: 'Clean Cut', desc: 'Isolated functionality' },
            { color: '#f59e0b', label: 'Read Only', desc: 'Limited write operations' },
          ].map(type => (
            <div key={type.label} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                background: type.color,
                marginTop: '2px',
                boxShadow: `0 0 8px ${type.color}40`,
              }} />
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#e2e8f0',
                  fontWeight: '600',
                }}>{type.label}</div>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                }}>{type.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
