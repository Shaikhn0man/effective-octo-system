import { useState } from 'react';
import { cutExplorerData } from '../data/cutExplorerData';

export function CutExplorer({ clusterId, onClose }) {
  const cutId = parseInt(clusterId.match(/Cut_(\d+)_/)?.[1]);
  const data = cutExplorerData[cutId];

  if (!data) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.9)',
      backdropFilter: 'blur(16px)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease-out',
      color: '#fff',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(2, 6, 23, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: data.type === 'CLEAN_CUT' ? '#22c55e' : '#f59e0b',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '900',
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {data.type.replace('_', ' ')}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            {data.name}
          </h1>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          Exit Explorer
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '40px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Left Column: Flow & Sequences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Stats Bar */}
          <section style={{
            display: 'flex',
            gap: '32px',
            background: 'rgba(255,255,255,0.02)',
            padding: '24px 32px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {Object.entries(data.stats).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>{key}</span>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>{val}</span>
              </div>
            ))}
          </section>

          {/* Flow Sequence (The "Wow" factor) */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '32px' }}>
              Execution Sequence Flow
            </h2>
            
            {data.sequence ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {data.sequence.map((row, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     {row.map((node, j) => (
                       <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{
                           background: 'rgba(255,255,255,0.05)',
                           border: '1px solid rgba(255,255,255,0.1)',
                           padding: '12px 16px',
                           borderRadius: '8px',
                           fontSize: '12px',
                           fontWeight: '700',
                           color: '#e2e8f0',
                           fontFamily: 'monospace',
                           boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                         }}>
                           [{node}]
                         </div>
                         {j < row.length - 1 && <span style={{ color: '#334155' }}>→</span>}
                       </div>
                     ))}
                   </div>
                 ))}
               </div>
            ) : (
              <div style={{ 
                background: 'rgba(0,0,0,0.2)', 
                padding: '24px', 
                borderRadius: '12px', 
                fontFamily: 'monospace', 
                color: '#22c55e',
                borderLeft: '4px solid #22c55e'
              }}>
                <div style={{ marginBottom: '8px', color: '#64748b' }}>// BATCH FLOW STEPS</div>
                {data.batchFlow?.map((f, i) => <div key={i} style={{ marginBottom: '4px' }}>PROCESS: {f}</div>)}
                {data.steps?.map((p, i) => (
                  <div key={i} style={{ marginTop: '16px' }}>
                    <div style={{ color: '#f59e0b' }}>{p.process}:</div>
                    {p.steps.map((s, j) => <div key={j} style={{ paddingLeft: '20px' }}>└─ {s}</div>)}
                  </div>
                ))}
              </div>
            )}
            
            {/* Visual background element */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '120px',
              fontWeight: '900',
              opacity: 0.03,
              pointerEvents: 'none'
            }}>
              {cutId}
            </div>
          </section>

          {/* Interactive Table Interactions */}
          <section>
            <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
              Database & Screen Interactions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {data.interactions?.map((int, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '20px',
                  borderRadius: '16px',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={e => {
                   e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                   e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={e => {
                   e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                   e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }}>
                  <div style={{ fontWeight: '800', color: '#fff', marginBottom: '12px', fontSize: '14px' }}>{int.screen}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {int.reads.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '9px', fontWeight: '900', color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>READ</span>
                        {int.reads.map(r => <span key={r} style={{ fontSize: '10px', color: '#94a3b8' }}>{r}</span>)}
                      </div>
                    )}
                    {int.writes.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '9px', fontWeight: '900', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>WRITE</span>
                        {int.writes.map(w => <span key={w} style={{ fontSize: '10px', color: '#94a3b8' }}>{w}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Tables & Dependencies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Master Tables */}
          <section style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
              Master Tables (Writes)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.tables.master?.map(t => (
                <div key={t.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>{t.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Writes: {t.writes}</div>
                </div>
              ))}
              {(!data.tables.master || data.tables.master.length === 0) && <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>No Master Table Operations</div>}
            </div>
          </section>

          {/* Reference Tables */}
          <section style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
              Reference Tables (Reads)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.tables.reference?.map(t => (
                <div key={t.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>{t.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Reads By: {t.reads}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Integration Note */}
          {data.dependencies && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '20px',
              borderRadius: '16px',
            }}>
               <div style={{ fontSize: '11px', fontWeight: '900', color: '#3b82f6', textTransform: 'uppercase', marginBottom: '8px' }}>Cross-Cut Dependencies</div>
               <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                 {data.dependencies.readsFrom && <div>← Reads from: {data.dependencies.readsFrom}</div>}
                 {data.dependencies.providesTo && <div>→ Provides to: {data.dependencies.providesTo}</div>}
               </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
