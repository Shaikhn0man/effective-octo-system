import { useState } from 'react';
import { clusterData } from '../data/clusterData.jsx';
import { VoronoiMap } from './VoronoiMap';

export function Dashboard() {
  const [selectedId, setSelectedId] = useState(null);
  const [approvedIds, setApprovedIds] = useState(new Set());

  const clusters = clusterData.clusters;
  const isAllApproved = approvedIds.size === clusters.length;

  const toggleApproval = (id) => {
    setApprovedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const approveAll = () => {
    if (isAllApproved) {
      setApprovedIds(new Set());
    } else {
      setApprovedIds(new Set(clusters.map(c => c.cluster_id)));
    }
  };

  const selectedCluster = clusters.find(c => c.cluster_id === selectedId);

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      background: '#020617',
      overflow: 'hidden',
    }}>
      {/* Sidebar - Cluster Approval List */}
      <div style={{
        width: '400px',
        background: 'rgba(2, 6, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.01)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '800',
            color: '#fff',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>Review & Approve</h2>
          <p style={{
            fontSize: '11px',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '20px',
          }}>Structural Cuts Management</p>

          <button
            onClick={approveAll}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: isAllApproved ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)',
              color: isAllApproved ? '#fff' : '#3b82f6',
              fontSize: '10px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {isAllApproved ? 'Reset All' : 'Approve All Cuts'}
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {clusters.map((c) => {
            const isApproved = approvedIds.has(c.cluster_id);
            const isSelected = selectedId === c.cluster_id;

            return (
              <div
                key={c.cluster_id}
                onClick={() => setSelectedId(c.cluster_id)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#e2e8f0',
                    letterSpacing: '-0.2px',
                    maxWidth: '180px',
                  }}>
                    {c.cluster_id.split('_').slice(2).join(' ').replace(/-/g, ' ')}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '900',
                    color: '#64748b',
                    fontFamily: 'monospace',
                  }}>SEQ.{c.cut_seq_no}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleApproval(c.cluster_id);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isApproved ? '#22c55e' : 'rgba(255,255,255,0.05)',
                      color: isApproved ? '#fff' : '#94a3b8',
                      fontSize: '9px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    {isApproved ? '✓ Approved' : 'Approve'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Modify ${c.cluster_id}`);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'transparent',
                      color: '#64748b',
                      fontSize: '9px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Modify
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main View Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <VoronoiMap
          clusters={clusters}
          selectedId={selectedId}
          approvedIds={approvedIds}
          onSelect={(c) => setSelectedId(c.cluster_id)}
          onDeselect={() => setSelectedId(null)}
        />
        
        {/* Sync Indicator */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'rgba(2, 6, 23, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '10px', color: '#fff', fontWeight: '700', textTransform: 'uppercase' }}>{approvedIds.size} Approved</span>
          </div>
          <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} />
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{clusters.length - approvedIds.size} Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
