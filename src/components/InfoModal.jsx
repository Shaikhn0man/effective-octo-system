import { Map, X } from 'lucide-react';
import React from 'react';

export function InfoModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        background: '#0f172a',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.01)',
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '4px',
              letterSpacing: '-0.5px',
            }}>Application Overview</h2>
            <p style={{
              fontSize: '14px',
              color: '#94a3b8',
            }}>Birds Eye view</p>
          </div>
          
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.05)',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '32px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {/* Big Pictyre Diagram Placeholder */}
          <div style={{
            width: '100%',
            height: '400px',
            background: 'rgba(2, 6, 23, 0.5)',
            borderRadius: '16px',
            border: '2px dashed rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
          }}>
            <div style={{ marginBottom: '16px', color: 'rgba(255,255,255,0.2)' }}>
              <Map size={64} strokeWidth={1} />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#e2e8f0',
              marginBottom: '8px',
            }}>Big Picture Diagram</h3>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              maxWidth: '300px',
              textAlign: 'center',
            }}>
              High-level architectural view of the Octo System components and their interactions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Structural Cuts</h4>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                Analyze the codebase decomposition into vertical slices. Use the Cluster View to deep dive into specific functional areas.
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Screen Flows</h4>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                Visualize user journeys and screen transitions. Track navigation paths and identify potential UX bottlenecks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
