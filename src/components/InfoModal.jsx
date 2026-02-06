import { Info, Map, X } from 'lucide-react';
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#60a5fa' }}>
              <Info size={24} strokeWidth={2} />
            </div>
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
          {/* Overview Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            marginBottom: '24px',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '12px' }}>
              CardDemo - Mainframe Credit Card Management System
            </h3>
            <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>
              A comprehensive mainframe credit card management system designed to simulate real-world banking operations.
              Serves as a reference application for mainframe modernization, migration testing, and technology evaluation
              on AWS and partner platforms.
            </p>
          </div>

          {/* Functional Domains Grid */}
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
            Functional Domains
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { title: 'User Management & Security', desc: 'Control access and user authentication with CICS transaction processing', color: '#ef4444' },
              { title: 'Account Management', desc: 'Manage customer accounts and account information via VSAM files', color: '#f59e0b' },
              { title: 'Credit Card Management', desc: 'Manage credit cards associated with accounts', color: '#eab308' },
              { title: 'Transaction Processing', desc: 'Record, manage, and report on financial transactions', color: '#22c55e' },
              { title: 'Bill Payment Processing', desc: 'Handle bill payments and payment tracking', color: '#06b6d4' },
              { title: 'Customer Management', desc: 'Maintain customer master data and relationships', color: '#3b82f6' },
              { title: 'Authorization Management', desc: 'Process credit card authorization requests (Optional: IMS/DB2/MQ)', color: '#8b5cf6' },
              { title: 'Transaction Type Management', desc: 'Maintain transaction type reference data (Optional: DB2)', color: '#d946ef' },
              { title: 'Batch Processing', desc: 'Execute scheduled and on-demand batch jobs via JCL', color: '#64748b' },
            ].map((domain, i) => (
              <div key={i} style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = domain.color + '40';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: domain.color,
                  marginBottom: '12px'
                }} />
                <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                  {domain.title}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>
                  {domain.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Key Features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div style={{
              padding: '24px',
              background: 'rgba(34, 197, 94, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}>
              <h4 style={{ color: '#22c55e', fontSize: '14px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Technical Features
              </h4>
              <ul style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                <li>CICS Transaction Processing</li>
                <li>JCL Batch Processing</li>
                <li>VSAM KSDS with Alternate Indexes</li>
                <li>Optional DB2, IMS, MQ Integration</li>
                <li>COMP & COMP-3 numeric formats</li>
              </ul>
            </div>

            <div style={{
              padding: '24px',
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}>
              <h4 style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Security Model
              </h4>
              <ul style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                <li>User ID & password validation</li>
                <li>Role-based access control</li>
                <li>RACF integration</li>
                <li>Transaction-level security</li>
                <li>Audit trail logging</li>
              </ul>
            </div>
          </div>

          {/* Data Model */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '24px',
          }}>
            <h4 style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Core Data Model
            </h4>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: '14px',
              color: '#94a3b8',
              lineHeight: '1.6',
              whiteSpace: 'pre'
            }}>
              {`CUSTOMER → ACCOUNT → CREDIT CARD → TRANSACTION
   ↓           ↓
CARD XREF  (Balance, Status)`}
            </div>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { file: 'USRSEC.PS', type: 'User security', size: '80' },
                { file: 'ACCTDATA.PS', type: 'Account master', size: '300' },
                { file: 'CARDDATA.PS', type: 'Card master', size: '150' },
                { file: 'CUSTDATA.PS', type: 'Customer master', size: '500' },
                { file: 'TRANSACT.KSDS', type: 'Transaction data', size: '350' },
                { file: 'CARDXREF.PS', type: 'Cross-reference', size: '50' },
              ].map((file, i) => (
                <div key={i} style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}>
                  <div style={{ color: '#3b82f6', fontWeight: '700', marginBottom: '4px', fontFamily: 'var(--font-family)' }}>
                    {file.file}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '600' }}>
                    {file.type} ({file.size}B)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modernization Scenarios */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}>
            <h4 style={{ color: '#8b5cf6', fontSize: '14px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Modernization Use Cases
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                'Discovery & Analysis',
                'Migration Assessment',
                'Refactoring',
                'Replatforming',
                'Augmentation',
                'Service Enablement',
                'Performance Testing'
              ].map((scenario, i) => (
                <div key={i} style={{
                  padding: '12px 16px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#e2e8f0',
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  {scenario}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
