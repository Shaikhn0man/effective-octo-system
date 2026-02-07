import { useState } from 'react';
import { clusterData } from '../data/clusterData.jsx';

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
      setApprovedIds(new Set(clusters.map(c => c.id)));
    }
  };

  const selectedCluster = clusters.find(c => c.id === selectedId);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#020617',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(2, 6, 23, 0.95)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>Structural Cuts Management</h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
            }}>Review and approve structural cuts</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: 'rgba(2, 6, 23, 0.8)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: '600', textTransform: 'uppercase' }}>{approvedIds.size} Approved</span>
              </div>
              <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} />
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>{clusters.length - approvedIds.size} Pending</span>
              </div>
            </div>

            <button
              onClick={approveAll}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: isAllApproved ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)',
                color: isAllApproved ? '#fff' : '#3b82f6',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {isAllApproved ? 'Reset All' : 'Approve All Cuts'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        }}>
          <thead>
            <tr style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
            }}>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>Seq</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>Topic</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>Description</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>Status</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((c) => {
              const isApproved = approvedIds.has(c.id);
              const isSelected = selectedId === c.id;

              return (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  style={{
                    background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#64748b',
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px',
                  }}>
                    {c.cut_seq_no}
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#e2e8f0',
                  }}>
                    {c.topic}
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '13px',
                    color: '#94a3b8',
                    maxWidth: '400px',
                  }}>
                    {c.description}
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    textAlign: 'center',
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      background: isApproved ? 'rgba(34, 197, 94, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      color: isApproved ? '#22c55e' : '#64748b',
                      border: `1px solid ${isApproved ? 'rgba(34, 197, 94, 0.3)' : 'rgba(100, 116, 139, 0.3)'}`,
                    }}>
                      {isApproved ? '✓ Approved' : 'Pending'}
                    </span>
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    textAlign: 'right',
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                  }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleApproval(c.id);
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: isApproved ? '#22c55e' : 'rgba(59, 130, 246, 0.1)',
                          color: isApproved ? '#fff' : '#3b82f6',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isApproved ? 'Unapprove' : 'Approve'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Modify ${c.id}`);
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'transparent',
                          color: '#64748b',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Modify
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
