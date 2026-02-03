export function MapLegend() {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255,255,255,0.06)',
      width: '100%',
    }}>
      <h4 style={{
        fontSize: '10px',
        fontWeight: '800',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '10px' }}>◇</span>
        Cartographic Legend
      </h4>

      {/* Area Size info */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '9px',
          fontWeight: '700',
          color: '#94a3b8',
          marginBottom: '6px',
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
          Area Size
        </div>
        <div style={{
          fontSize: '8px',
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Territory coverage
        </div>
      </div>

      {/* Flow Types */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '9px',
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
              fontSize: '8px',
              fontWeight: '800',
              padding: '3px 6px',
              borderRadius: '4px',
            }}>S</span>
            <span style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase' }}>Screen Flow</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              background: '#f97316',
              color: 'white',
              fontSize: '8px',
              fontWeight: '800',
              padding: '3px 6px',
              borderRadius: '4px',
            }}>B</span>
            <span style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase' }}>Batch Flow</span>
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
        fontSize: '9px',
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
                fontSize: '10px',
                color: '#e2e8f0',
                fontWeight: '600',
              }}>{type.label}</div>
              <div style={{
                fontSize: '8px',
                color: '#64748b',
              }}>{type.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
