export const screenFlowData = {
  systemDiagram: `flowchart TD
    %% ============ LEGEND ============
    subgraph LEGEND["🎨 LEGEND & COLOR GUIDE"]
        direction LR
        L1["🔄 Batch Process<br/>All batch cuts"]
        L2["💻 Screen Process<br/>Interactive cuts"]
        L3[("🗄️ Data Store<br/>Files & Databases")]
        L4["📊 System Overview<br/>Statistics"]
    end
    
    %% ============ DATA FOUNDATION LAYER ============
    subgraph DATA_FOUNDATION["💾 DATA FOUNDATION LAYER"]
        direction LR
        B11["🔄 Cut 11: Data Import<br/>CBIMPORT<br/>Import customer data"]
        
        B9["🔄 Cut 9: Customer Records<br/>CBCUS01C<br/>Customer data management"]
        
        B10["🔄 Cut 10: Data Export<br/>CBEXPORT<br/>Export financial data"]
        
        DB_FOUNDATION[("🗄️ VSAM Files<br/>CUSTFILE<br/>ACCTDATA<br/>CARDDATA")]
    end
    
    %% ============ CORE PROCESSING LAYER ============
    subgraph CORE_PROCESSING["🔄 CORE PROCESSING LAYER"]
        direction LR
        
        B7["🔄 Cut 7: Account Records<br/>CBACT01C<br/>Multi-format output"]
        
        B4["🔄 Cut 4: Cardholder Records<br/>CBACT02C<br/>Sequential processing"]
        
        B5["🔄 Cut 5: Cross-Reference<br/>CBACT03C<br/>Data linking & tracking"]
        
        DB_CORE[("🗄️ Processing Files<br/>ACCTFILE<br/>CARDFILE<br/>XREFFILE")]
    end
    
    %% ============ BUSINESS LOGIC LAYER ============
    subgraph BUSINESS_LOGIC["💰 BUSINESS LOGIC LAYER"]
        direction LR
        
        B8["🔄 Cut 8: Interest Accrual<br/>CBACT04C<br/>Monthly calculations"]
        
        S1["💻 Cut 1: Transaction Validation<br/>COTRN00C (CT00)<br/>Real-time validation"]
        
        B3["🔄 Cut 3: Daily Transactions<br/>CBTRN01C/02C/03C<br/>Transaction processing"]
        
        DB_BUSINESS[("🗄️ Transaction Data<br/>TRANSACT<br/>DALYTRAN<br/>TCATBALF")]
    end
    
    %% ============ REPORTING & CONTROL LAYER ============
    subgraph REPORTING_CONTROL["📋 REPORTING & CONTROL LAYER"]
        direction LR
        
        B12["🔄 Cut 12: Entity Updates<br/>CBSTM03A/B<br/>Statement processing"]
        
        B6["🔄 Cut 6: Execution Control<br/>COBSWAIT/MVSWAIT<br/>Batch synchronization"]
        
        B13["🔄 Cut 13: Daily Card Transactions<br/>CBTRN03C<br/>Transaction verification"]
        
        DB_REPORTS[("🗄️ Report Data<br/>STATEMENTS<br/>REPORTS<br/>INDEXES")]
    end
    
    %% ============ MODULAR EXTENSIONS ============
    subgraph EXTENSIONS["🔀 MODULAR EXTENSIONS"]
        direction TB
        
        subgraph AUTH_MODULE["🔐 Cut 2: Authorization Module"]
            direction LR
            M2_SCREEN["💻 Auth Screens<br/>CP00: Process Auth MQ<br/>CPVS: Auth Summary<br/>CPVD: Auth Details<br/>CPVF: Mark Fraud"]
            
            M2_BATCH["🔄 Auth Batch<br/>CBPAUP0C<br/>Purge Expired Auth"]
            
            M2_DATA[("🗄️ Multi-Tech Store<br/>IMS: DBPAUTP0<br/>DB2: AUTHFRDS<br/>MQ: Queues<br/>VSAM: Account/Card")]
        end
        
        subgraph TRANTYPE_MODULE["📋 Cut 1: Transaction Type Module"]
            direction LR
            M1_SCREEN["💻 TranType Screens<br/>CTLI: List/Update/Delete<br/>CTTU: Add/Edit Types"]
            
            M1_BATCH["🔄 TranType Batch<br/>DSNTEP4: Create DB2<br/>COBTUPDT: Maintenance<br/>DSNTIAUL: Extract VSAM"]
            
            M1_DATA[("🗄️ Dual Storage<br/>DB2: TRNTYPE<br/>VSAM: TRANTYPE<br/>Synchronized")]
        end
    end
    
    %% ============ SYSTEM OVERVIEW ============
    STATS["📊 CARDDEMO SYSTEM OVERVIEW<br/>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>🎯 Total Business Cuts: 13<br/>📊 Read-Only Cuts: 11 (10 Batch + 1 Screen)<br/>🔀 Modular Extensions: 2<br/>💻 Total Screens: 7 | 🔄 Total Batch: 15<br/>🗄️ Technologies: VSAM, IMS, DB2, MQ"]
    
    %% ============ FLOW CONNECTIONS ============
    %% Data Foundation Flow
    B11 -->|imports data| DB_FOUNDATION
    B9 <-->|manages| DB_FOUNDATION
    B10 -->|exports from| DB_FOUNDATION
    
    %% Core Processing Flow
    DB_FOUNDATION -->|feeds| B7
    B7 -->|processes| DB_CORE
    B4 <-->|manages| DB_CORE
    B5 <-->|links| DB_CORE
    
    %% Business Logic Flow
    DB_CORE -->|account data| B8
    DB_CORE -->|validates| S1
    B8 -->|interest updates| DB_BUSINESS
    S1 -->|validated transactions| DB_BUSINESS
    B3 <-->|processes| DB_BUSINESS
    
    %% Reporting Flow
    DB_BUSINESS -->|transaction data| B12
    B12 -->|statements| DB_REPORTS
    B6 -->|controls| DB_REPORTS
    B13 -->|verifies| DB_REPORTS
    
    %% Extension Integration
    DB_CORE -.->|account/card data| M2_DATA
    M2_SCREEN <-->|processes| M2_DATA
    M2_BATCH -->|purges| M2_DATA
    
    DB_BUSINESS -.->|transaction types| M1_DATA
    M1_SCREEN <-->|maintains| M1_DATA
    M1_BATCH -->|synchronizes| M1_DATA
    
    %% Control Flow
    B6 -.->|controls timing| B7
    B6 -.->|controls timing| B8
    B6 -.->|controls timing| B12
    
    %% Statistics Connection
    EXTENSIONS -.->|extends| STATS
    REPORTING_CONTROL -.->|reports to| STATS
    
    %% ============ CONSISTENT COLOR STYLING ============
    classDef batchProcess fill:#E3F2FD,stroke:#1976D2,stroke-width:3px,color:#0D47A1,font-weight:bold
    classDef screenProcess fill:#E8F5E8,stroke:#388E3C,stroke-width:3px,color:#1B5E20,font-weight:bold
    classDef dataStore fill:#FFF3E0,stroke:#F57C00,stroke-width:3px,color:#E65100,font-weight:bold
    classDef systemStats fill:#F3E5F5,stroke:#7B1FA2,stroke-width:4px,color:#4A148C,font-weight:bold
    classDef legend fill:#FAFAFA,stroke:#424242,stroke-width:2px,color:#212121,font-weight:bold
    
    %% Apply consistent styles
    class B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,M2_BATCH,M1_BATCH batchProcess
    class S1,M2_SCREEN,M1_SCREEN screenProcess
    class DB_FOUNDATION,DB_CORE,DB_BUSINESS,DB_REPORTS,M2_DATA,M1_DATA dataStore
    class STATS systemStats
    class L1,L2,L3,L4 legend`,

  businessDiagram: `graph TB
    subgraph "LEGEND"
        L1[Batch Process Cut]
        L2[Screen/Online Cut]
        L3[Mixed Batch + Screen]
        L4[(Data Store)]
    end

    subgraph "BATCH-ONLY CUTS - Read-Only Processing"
        subgraph "Account & Card Processing"
            B1[Cut 1: Process Account Records<br/>CBACT01C - Multi-Format Output<br/>Tables: ACCTFILE, ARRY-FILE, OUT-FILE, VBRC-FILE]
            B2[Cut 2: Manage Cardholder Records<br/>CBACT02C - Sequential Processing<br/>Tables: CARDFILE-FILE]
            B3[Cut 3: Manage Cross-Reference<br/>CBACT03C - Status Tracking<br/>Tables: XREFFILE-FILE]
            B4[Cut 4: Accrue Monthly Interest<br/>CBACT04C - Interest Calculation<br/>Tables: ACCTDATA, TCATBALF]
        end

        subgraph "Customer & Data Management"
            B5[Cut 5: Manage Customer Records<br/>CBCUS01C - Retrieval & Display<br/>Tables: CUSTFILE-FILE]
            B6[Cut 6: Export Financial Data<br/>CBEXPORT - Comprehensive Export<br/>Tables: ACCTDATA, CARDDATA, CUSTDATA, CARDXREF, TRANSACT]
            B7[Cut 7: Import Customer Data<br/>CBIMPORT - Data Import<br/>Tables: ACCTDATA, CARDDATA, CUSTDATA, CARDXREF, TRANSACT]
            B8[Cut 8: Manage Entity Updates<br/>CBSTM03A/B - Statement Processing<br/>Tables: ACCTDATA, TRANSACT]
        end

        subgraph "Transaction & Control"
            B10A[Cut 10: Manage Loan Accounts<br/>CBTRN01C - Transaction List<br/>Tables: TRANSACT, DALYTRAN]
            B10B[Cut 10: Manage Loan Accounts<br/>CBTRN02C - Post Transactions<br/>Tables: TRANSACT, DALYTRAN]
            B10C[Cut 10: Manage Loan Accounts<br/>CBTRN03C - Transaction Reports<br/>Tables: TRANSACT, DALYTRAN]
            B11[Cut 11: Control Execution Timing<br/>COBSWAIT/MVSWAIT - Delay Control<br/>System Timer]
        end
    end

    subgraph "SCREEN-ONLY CUT"
        S9[Cut 9: Validate Card Transactions<br/>━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>Screen: COTRN00C - CT00<br/>Transaction Validation<br/>━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>Tables: TRANSACT, ACCTDATA<br/>Type: CLEAN_CUT]
    end

    subgraph "MIXED CUTS - Screens + Batch"
        subgraph "Cut 12: Authorization Module - IMS-DB2-MQ"
            M12_SCREEN[Screens 4<br/>━━━━━━━━━━━━━━<br/>CP00: COPAUA0C - Process Auth MQ<br/>CPVS: COPAUS0C - Auth Summary<br/>CPVD: COPAUS1C - Auth Details<br/>Fraud: COPAUS2C - Mark Fraud]
            M12_BATCH[Batch 1<br/>━━━━━━━━━━━━━━<br/>CBPAUP0C - Purge Expired Auth]
            M12_DATA[(Data Stores<br/>━━━━━━━━━━━━━━<br/>IMS: DBPAUTP0/DBPAUTX0<br/>DB2: AUTHFRDS<br/>MQ: Request/Response Queues<br/>VSAM: ACCTDATA, CARDDATA)]
        end

        subgraph "Cut 13: Transaction Type Module - DB2"
            M13_SCREEN[Screens 2<br/>━━━━━━━━━━━━━━<br/>CTLI: COTRTLIC - List/Update/Delete<br/>CTTU: COTRTUPC - Add/Edit Types]
            M13_BATCH[Batch 3<br/>━━━━━━━━━━━━━━<br/>DSNTEP4 - Create DB2 Tables<br/>COBTUPDT - Batch Maintenance<br/>DSNTIAUL - Extract to VSAM]
            M13_DATA[(Data Stores<br/>━━━━━━━━━━━━━━<br/>DB2: TRNTYPE, TRNTYCAT<br/>VSAM: TRANTYPE, TRANCATG<br/>Synced)]
        end
    end

    subgraph "SUMMARY STATISTICS"
        STATS[Total Cuts: 13<br/>━━━━━━━━━━━━━━━━━━━━<br/>Read-Only Cuts: 11<br/>  - Batch Only: 10<br/>  - Screen Only: 1<br/>━━━━━━━━━━━━━━━━━━━━<br/>Clean Cuts: 2<br/>  - Cut 12: 4 Screens + 1 Batch<br/>  - Cut 13: 2 Screens + 3 Batch<br/>━━━━━━━━━━━━━━━━━━━━<br/>Total Screens: 7<br/>Total Batch: 15]
    end

    %% Connections
    M12_SCREEN --> M12_DATA
    M12_BATCH --> M12_DATA
    M13_SCREEN --> M13_DATA
    M13_BATCH --> M13_DATA

    %% Styling
    classDef batchCut fill:#87CEEB,stroke:#4682B4,stroke-width:2px,color:#000
    classDef screenCut fill:#98FB98,stroke:#228B22,stroke-width:2px,color:#000
    classDef mixedScreen fill:#FF6B6B,stroke:#C92A2A,stroke-width:2px,color:#fff
    classDef mixedBatch fill:#FFB6C1,stroke:#DC143C,stroke-width:2px,color:#000
    classDef mixedScreen2 fill:#51CF66,stroke:#2F9E44,stroke-width:2px,color:#fff
    classDef mixedBatch2 fill:#B2F2BB,stroke:#2F9E44,stroke-width:2px,color:#000
    classDef dataStore fill:#FFE4B5,stroke:#DAA520,stroke-width:2px,color:#000
    classDef stats fill:#E6E6FA,stroke:#4B0082,stroke-width:3px,color:#000,font-size:14px
    classDef legend fill:#F0F0F0,stroke:#808080,stroke-width:1px,color:#000

    class B1,B2,B3,B4,B5,B6,B7,B8,B10A,B10B,B10C,B11 batchCut
    class S9 screenCut
    class M12_SCREEN mixedScreen
    class M12_BATCH mixedBatch
    class M13_SCREEN mixedScreen2
    class M13_BATCH mixedBatch2
    class M12_DATA,M13_DATA dataStore
    class STATS stats
    class L1,L2,L3,L4 legend`
};
