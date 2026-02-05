import { useState } from 'react';
import { cutExplorerData } from '../data/cutExplorerData';

// Tab Components
function SystemOverview({ data, cutId }) {
  return (
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

      {/* Business Summary */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)',
        padding: '32px',
        borderRadius: '24px',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
          Business Summary
        </h2>
        <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>
          {getBusinessSummary(cutId, data)}
        </div>
      </section>

      {/* Architecture Pattern */}
      <section style={{
        background: 'rgba(15, 23, 42, 0.5)',
        padding: '24px',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
          Architecture Pattern
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>TYPE</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{data.type.replace('_', ' ')}</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>TIER</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
              {cutId <= 2 ? 'Online Interactive' : 'Batch Processing'}
            </div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>OPERATIONS</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
              {cutId <= 2 ? 'read + write' : 'read-only'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FlowDiagram({ data, cutId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Flow Sequence */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)',
        padding: '32px',
        borderRadius: '24px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '32px' }}>
          {cutId <= 2 ? 'Screen Flow Sequence' : 'Batch Process Flow'}
        </h2>
        
        {data.sequence && Array.isArray(data.sequence) && data.sequence.length > 0 ? (
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
        ) : data.batchFlow && Array.isArray(data.batchFlow) ? (
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '24px', 
            borderRadius: '12px', 
            fontFamily: 'monospace', 
            color: '#22c55e',
            borderLeft: '4px solid #22c55e'
          }}>
            <div style={{ marginBottom: '8px', color: '#64748b' }}>// BATCH FLOW STEPS</div>
            {data.batchFlow.map((f, i) => <div key={i} style={{ marginBottom: '4px' }}>PROCESS: {f}</div>)}
            {data.steps?.map((p, i) => (
              <div key={i} style={{ marginTop: '16px' }}>
                <div style={{ color: '#f59e0b' }}>{p.process}:</div>
                {p.steps.map((s, j) => <div key={j} style={{ paddingLeft: '20px' }}>└─ {s}</div>)}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>No sequence or batch flow data available.</div>
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
      {data.interactions && data.interactions.length > 0 && (
        <section>
          <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
            Database & Screen Interactions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {data.interactions.map((int, i) => (
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
                  {int.reads && int.reads.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '9px', fontWeight: '900', color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>READ</span>
                      {int.reads.map(r => <span key={r} style={{ fontSize: '10px', color: '#94a3b8' }}>{r}</span>)}
                    </div>
                  )}
                  {int.writes && int.writes.length > 0 && (
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
      )}
    </div>
  );
}

function DatabaseMap({ data, cutId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Master Tables */}
      <section style={{
          background: 'rgba(15, 23, 42, 0.5)',
          padding: '24px',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
          Master Tables (Write Operations)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.tables.master?.map(t => (
            <div key={t.name} style={{ 
              borderBottom: '1px solid rgba(255,255,255,0.05)', 
              paddingBottom: '12px',
              background: 'rgba(239, 68, 68, 0.05)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>&lt;{t.name}&gt;</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
                <span style={{ color: '#ef4444' }}>◄══ WRITE ══</span> {t.writes}
              </div>
              {t.reads && (
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  <span style={{ color: '#22c55e' }}>──► READ ──►</span> {t.reads}
                </div>
              )}
            </div>
          ))}
          {(!data.tables.master || data.tables.master.length === 0) && 
            <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>No Master Table Operations</div>}
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
          Reference Tables (Read Operations)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.tables.reference?.map(t => (
            <div key={t.name} style={{ 
              borderBottom: '1px solid rgba(255,255,255,0.05)', 
              paddingBottom: '12px',
              background: 'rgba(34, 197, 94, 0.05)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>{`{${t.name}}`}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                <span style={{ color: '#22c55e' }}>──► READ ──►</span> {t.reads}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-Cut Dependencies */}
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
  );
}

function ASCIIChart({ data, cutId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '32px',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#e2e8f0',
        overflow: 'auto'
      }}>
        <div style={{ marginBottom: '24px', color: '#3b82f6', fontSize: '14px', fontWeight: '800' }}>
          ASCII SYSTEM FLOW CHART - CUT {cutId}
        </div>
        
        <div style={{ whiteSpace: 'pre-wrap' }}>
{getASCIIChart(cutId, data)}
        </div>
      </section>
    </div>
  );
}

// Helper functions
function getBusinessSummary(cutId, data) {
  const summaries = {
    1: "Primary interactive system for credit card account management. Handles all customer-facing operations including account creation, card management, transaction processing, and billing. Serves as the main data entry point for the entire system with 14 integrated screens managing the complete customer lifecycle.",
    2: "Security and user access management system. Controls user authentication, authorization, and administrative functions. Provides secure access controls for all system users and maintains audit trails for security compliance.",
    3: "Automated loan account processing and reporting system. Generates comprehensive transaction reports and manages customer loan account data through batch processing operations.",
    4: "Sequential cardholder record processing system. Performs systematic review and reporting of all cardholder records for compliance and audit purposes.",
    5: "Cross-reference file processing with status tracking. Maintains data integrity across system components by processing and validating cross-reference relationships.",
    6: "Batch processing utility for execution timing control. Manages scheduling delays and timing coordination for batch job sequences.",
    7: "Multi-format account data output system. Transforms account records into various output formats for different reporting and integration requirements.",
    8: "Automated monthly interest calculation and accrual processing. Critical financial system component that computes and applies interest charges to customer accounts.",
    9: "Customer record retrieval and display system. Provides systematic access to customer information for reporting and analysis purposes.",
    10: "Comprehensive financial data export system. Creates consolidated export files containing all customer, account, and transaction data for external systems.",
    11: "Customer data import processing system. Handles incoming customer data from external sources and integrates it into the main system databases.",
    12: "Entity update processing for statement generation. Manages data processes required for customer statement generation and entity updates.",
    13: "Daily transaction verification system. Validates and verifies all daily card transactions to ensure data integrity and compliance."
  };
  return summaries[cutId] || "System component for specialized processing operations.";
}

function getASCIIChart(cutId, data) {
  // This would contain the full ASCII charts from the markdown file
  // For brevity, showing a simplified version
  const charts = {
    1: `================================================================================
TYPE: CLEAN_CUT (Interactive/Online)
FLOWS: 14 Screen-based flows
TABLES: 11 (8 Master/Write-Heavy, 3 Reference/Read-Heavy)
================================================================================

SCREEN FLOW SEQUENCE:
┌────────────────────────────────────────────────────────────────────────┐
│  [CCRDLIA] → [COTRN0A] → [CTRTUPA] → [CACTVWA] → [COBIL0A] → [CTRTLIA]│
│      ↓                                                                  │
│  [CCRDUPA] → [CORPT0A] → [COMEN1A] → [COSGN0A] → [COTRN2A] → [CACTUPA]│
│      ↓                                                                  │
│  [COTRN1A] → [CCRDSLA]                                                 │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ/WRITE Operations
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES                                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  MASTER TABLES (Write-Heavy):                                          │
│    <ACCOUNT-RECORD>        ◄══ WRITE ══ All Screens                    │
│                            ──► READ  ──► All Screens                   │
│                                                                         │
│    <CARD-RECORD>           ◄══ WRITE ══ CCRDUPA                        │
│                            ──► READ  ──► CCRDLIA, CCRDSLA, CACTVWA     │
│                                                                         │
│  REFERENCE TABLES (Read-Heavy):                                        │
│    {CARD-XREF-RECORD}      ──► READ  ──► CCRDLIA, CCRDSLA              │
│    {SEC-USER-DATA}         ──► READ  ──► COSGN0A (from Cut 2)          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

DEPENDENCIES:
  ◄── Reads from: Cut_2 (SEC-USER-DATA)`,
    2: `================================================================================
TYPE: CLEAN_CUT (Interactive/Online)
FLOWS: 7 Screen-based flows
TABLES: 5 (1 Master/Write-Heavy, 4 Reference/Read-Heavy)
================================================================================

SCREEN FLOW SEQUENCE:
┌────────────────────────────────────────────────────────────────────────┐
│  [COADM1A] → [COUSR2A] → [COPAU1A] → [COSGN0A] → [COUSR0A]            │
│      ↓                                                                  │
│  [COUSR3A] → [COPAU0A]                                                 │
└────────────────────────────────────────────────────────────────────────┘

DEPENDENCIES:
  ◄── Reads from: Cut_1 (ACCOUNT-RECORD, CUSTOMER-RECORD)
  ──► Provides to: Cut_1 (SEC-USER-DATA)`
  };
  
  return charts[cutId] || `================================================================================
TYPE: ${data.type}
FLOWS: ${data.stats.flows} flows
TABLES: ${data.stats.tables} tables
================================================================================

${data.batchFlow ? 'BATCH PROCESS: ' + data.batchFlow.join(' → ') : 'INTERACTIVE SCREENS'}

${data.dependencies ? 
  `DEPENDENCIES:
  ${data.dependencies.readsFrom ? '◄── Reads from: ' + data.dependencies.readsFrom : ''}
  ${data.dependencies.providesTo ? '──► Provides to: ' + data.dependencies.providesTo : ''}` : 
  'No cross-cut dependencies'
}`;
}

export function CutExplorer({ clusterId, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const cutId = parseInt(clusterId.match(/Cut_(\d+)_/)?.[1]);
  const data = cutExplorerData[cutId];

  if (!data) return null;

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: '📊' },
    { id: 'flow', label: 'Flow Diagram', icon: '🔄' },
    { id: 'database', label: 'Database Map', icon: '🗄️' },
    { id: 'ascii', label: 'ASCII Chart', icon: '📋' }
  ];

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

      {/* Navigation Tabs */}
      <div style={{
        padding: '0 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(2, 6, 23, 0.3)'
      }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? '#3b82f6' : '#94a3b8',
                padding: '16px 24px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={e => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = '#e2e8f0';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '40px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%'
      }}>
        {activeTab === 'overview' && <SystemOverview data={data} cutId={cutId} />}
        {activeTab === 'flow' && <FlowDiagram data={data} cutId={cutId} />}
        {activeTab === 'database' && <DatabaseMap data={data} cutId={cutId} />}
        {activeTab === 'ascii' && <ASCIIChart data={data} cutId={cutId} />}
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