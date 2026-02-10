export const cutExplorerData = {
  1: {
    id: 1,
    name: "Manage Credit Card Account Operations",
    type: "CLEAN_CUT",
    stats: { flows: 14, batch: 0, screen: 14, tables: 11 },
    sequence: [
      ["CCRDLIA", "COTRN0A", "CTRTUPA", "CACTVWA", "COBIL0A", "CTRTLIA"],
      ["CCRDUPA", "CORPT0A", "COMEN1A", "COSGN0A", "COTRN2A", "CACTUPA"],
      ["COTRN1A", "CCRDSLA"]
    ],
    tables: {
      master: [
        { name: "ACCOUNT-RECORD", writes: "All Screens", reads: "All Screens" },
        { name: "ACCT-UPDATE-RECORD", writes: "COBIL0A, COTRN2A, CACTUPA", reads: "" },
        { name: "CARD-RECORD", writes: "CCRDUPA", reads: "CCRDLIA, CCRDSLA, CACTVWA" },
        { name: "CARD-UPDATE-RECORD", writes: "CCRDUPA", reads: "" },
        { name: "CUST-UPDATE-RECORD", writes: "COMEN1A, CACTUPA", reads: "" },
        { name: "CUSTOMER-RECORD", writes: "COMEN1A, CACTUPA", reads: "CACTVWA, CACTUPA, COMEN1A" },
        { name: "TRANSACTION-RECORD", writes: "COTRN2A", reads: "COTRN0A, COTRN1A, CORPT0A" },
        { name: "TRANSACTION_TYPE", writes: "CTRTUPA, CTRTLIA", reads: "Multiple Screens" }
      ],
      reference: [
        { name: "CARD-XREF-RECORD", reads: "CCRDLIA, CCRDSLA" },
        { name: "MQTM", reads: "CORPT0A" },
        { name: "SEC-USER-DATA", reads: "COSGN0A (from Cut 2)" }
      ]
    },
    interactions: [
      { screen: "CCRDLIA", reads: ["CARD-RECORD", "ACCOUNT-RECORD", "CARD-XREF-RECORD"], writes: ["CARD-UPDATE-RECORD"] },
      { screen: "COTRN0A", reads: ["TRANSACTION-RECORD", "TRANSACTION_TYPE"], writes: [] },
      { screen: "CTRTUPA", reads: ["TRANSACTION_TYPE"], writes: ["TRANSACTION_TYPE"] },
      { screen: "CACTVWA", reads: ["ACCOUNT-RECORD", "CUSTOMER-RECORD", "CARD-RECORD"], writes: [] },
      { screen: "COBIL0A", reads: ["ACCOUNT-RECORD"], writes: ["ACCOUNT-RECORD", "ACCT-UPDATE-RECORD", "TRANSACTION-RECORD"] },
      { screen: "COSGN0A", reads: ["SEC-USER-DATA (from Cut 2)"], writes: [] },
      { screen: "COTRN2A", reads: ["ACCOUNT-RECORD", "TRANSACTION_TYPE"], writes: ["TRANSACTION-RECORD", "ACCOUNT-RECORD", "ACCT-UPDATE-RECORD"] },
      { screen: "CACTUPA", reads: ["ACCOUNT-RECORD", "CUSTOMER-RECORD"], writes: ["ACCOUNT-RECORD", "ACCT-UPDATE-RECORD", "CUSTOMER-RECORD", "CUST-UPDATE-RECORD"] }
    ],
    dependencies: { readsFrom: "Cut 2 (SEC-USER-DATA)" },
    asciiChart: `================================================================================
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
│    <ACCT-UPDATE-RECORD>    ◄══ WRITE ══ COBIL0A, COTRN2A, CACTUPA      │
│                                                                         │
│    <CARD-RECORD>           ◄══ WRITE ══ CCRDUPA                        │
│                            ──► READ  ──► CCRDLIA, CCRDSLA, CACTVWA     │
│                                                                         │
│    <CARD-UPDATE-RECORD>    ◄══ WRITE ══ CCRDUPA                        │
│                                                                         │
│    <CUST-UPDATE-RECORD>    ◄══ WRITE ══ COMEN1A, CACTUPA               │
│                                                                         │
│    <CUSTOMER-RECORD>       ◄══ WRITE ══ COMEN1A, CACTUPA               │
│                            ──► READ  ──► CACTVWA, CACTUPA, COMEN1A     │
│                                                                         │
│    <TRAN-RECORD>           ◄══ WRITE ══ COTRN2A                        │
│                            ──► READ  ──► COTRN0A, COTRN1A, CORPT0A     │
│                                                                         │
│    <<CARDDEMO.TRANSACTION_TYPE>>  (Temporary)                          │
│                            ◄══ WRITE ══ CTRTUPA, CTRTLIA               │
│                            ──► READ  ──► Multiple Screens               │
│                                                                         │
│  REFERENCE TABLES (Read-Heavy):                                        │
│    {CARD-XREF-RECORD}      ──► READ  ──► CCRDLIA, CCRDSLA              │
│    {MQTM}                  ──► READ  ──► CORPT0A                       │
│    {SEC-USER-DATA}         ──► READ  ──► COSGN0A (from Cut 2)          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

KEY SCREENS & THEIR DATABASE INTERACTIONS:

[CCRDLIA - Credit Card List]
    ├─► READ:  CARD-RECORD, ACCOUNT-RECORD, CARD-XREF-RECORD
    └─► WRITE: CARD-UPDATE-RECORD

[COTRN0A - Display Transaction Listings]
    └─► READ:  TRAN-RECORD, CARDDEMO.TRANSACTION_TYPE

[CTRTUPA - Maintain Transaction Type]
    ├─► READ:  CARDDEMO.TRANSACTION_TYPE
    └─► WRITE: CARDDEMO.TRANSACTION_TYPE

[CACTVWA - View Account]
    └─► READ:  ACCOUNT-RECORD, CUSTOMER-RECORD, CARD-RECORD

[COBIL0A - Bill Payment]
    ├─► READ:  ACCOUNT-RECORD
    └─► WRITE: ACCOUNT-RECORD, ACCT-UPDATE-RECORD, TRAN-RECORD

[COSGN0A - User Sign-on]
    └─► READ:  SEC-USER-DATA (from Cut 2)

[COTRN2A - Capture Financial Transaction]
    ├─► READ:  ACCOUNT-RECORD, CARDDEMO.TRANSACTION_TYPE
    └─► WRITE: TRAN-RECORD, ACCOUNT-RECORD, ACCT-UPDATE-RECORD

[CACTUPA - Update Account Information]
    ├─► READ:  ACCOUNT-RECORD, CUSTOMER-RECORD
    └─► WRITE: ACCOUNT-RECORD, ACCT-UPDATE-RECORD, CUSTOMER-RECORD, CUST-UPDATE-RECORD

DEPENDENCIES:
  ◄── Reads from: Cut_2 (SEC-USER-DATA)`
  },
  2: {
    id: 2,
    name: "Manage User Access Security and Permissions",
    type: "CLEAN_CUT",
    stats: { flows: 7, batch: 0, screen: 7, tables: 5 },
    sequence: [
      ["COADM1A", "COUSR2A", "COPAU1A", "COSGN0A", "COUSR0A"],
      ["COUSR3A", "COPAU0A"]
    ],
    tables: {
      master: [
        { name: "SEC-USER-DATA", writes: "COUSR22A, COUSR3A", reads: "COSGN0A, COUSR0A, COPAU0A" }
      ],
      reference: [
        { name: "ACCOUNT-RECORD", reads: "from Cut 1" },
        { name: "CARD-XREF-RECORD", reads: "from Cut 1" },
        { name: "CUSTOMER-RECORD", reads: "from Cut 1" },
        { name: "MQTM", reads: "" }
      ]
    },
    interactions: [
      { screen: "COUSR2A", reads: [], writes: ["SEC-USER-DATA"] },
      { screen: "COUSR0A", reads: ["SEC-USER-DATA"], writes: [] },
      { screen: "COUSR3A", reads: [], writes: ["SEC-USER-DATA"] },
      { screen: "COPAU0A", reads: ["SEC-USER-DATA"], writes: [] },
      { screen: "COSGN0A", reads: ["SEC-USER-DATA"], writes: [] }
    ],
    dependencies: { readsFrom: "Cut 1 (ACCOUNT-RECORD, CUSTOMER-RECORD)", providesTo: "Cut 1 (SEC-USER-DATA)" },
    asciiChart: `================================================================================
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
                              │
                              │ READ/WRITE Operations
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES                                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  MASTER TABLE (Write-Heavy):                                           │
│    <SEC-USER-DATA>         ◄══ WRITE ══ COUSR2A, COUSR3A               │
│                            ──► READ  ──► COSGN0A, COUSR0A, COPAU0A     │
│                            ──► PROVIDED TO: Cut 1                       │
│                                                                         │
│  REFERENCE TABLES (Read-Heavy):                                        │
│    {ACCOUNT-RECORD}        ──► READ  ──► (from Cut 1)                  │
│    {CARD-XREF-RECORD}      ──► READ  ──► (from Cut 1)                  │
│    {CUSTOMER-RECORD}       ──► READ  ──► (from Cut 1)                  │
│    {MQTM}                  ──► READ  ──►                               │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

KEY SCREENS:

[COADM1A - Admin Menu]
    Central navigation hub for user management

[COUSR2A - Update User Records]
    └─► WRITE: SEC-USER-DATA

[COUSR0A - Manage User Data]
    └─► READ:  SEC-USER-DATA

[COUSR3A - Delete User Operations]
    └─► WRITE: SEC-USER-DATA (delete operations)

[COPAU0A - Retrieve Customer Authorization]
    └─► READ:  SEC-USER-DATA

[COSGN0A - User Sign-on]
    └─► READ:  SEC-USER-DATA

DEPENDENCIES:
  ◄── Reads from: Cut_1 (ACCOUNT-RECORD, CUSTOMER-RECORD)
  ──► Provides to: Cut_1 (SEC-USER-DATA)`
  },
  3: {
    id: 3,
    name: "Manage Customer Loan Accounts and Processing",
    type: "READ_ONLY_CUT",
    stats: { flows: 2, batch: 2, screen: 0, tables: 10 },
    batchFlow: ["CBTRN03C", "Loan Account Processing"],
    tables: {
      reference: [
        { name: "ACCOUNT-FILE", reads: "CBTRN03C" },
        { name: "DALYREJS-FILE", reads: "" },
        { name: "DALYTRAN-FILE", reads: "CBTRN03C" },
        { name: "DATE-PARMS-FILE", reads: "CBTRN03C" },
        { name: "REPORT-FILE", reads: "CBTRN03C (output)" },
        { name: "TCATBAL-FILE", reads: "CBTRN03C" },
        { name: "TRANCATG-FILE", reads: "CBTRN03C" },
        { name: "TRANSACT-FILE", reads: "CBTRN03C" },
        { name: "TRANTYPE-FILE", reads: "CBTRN03C" },
        { name: "XREF-FILE", reads: "CBTRN03C" }
      ]
    },
    steps: [
      { process: "CBTRN03C", steps: ["1100-WRITE-TRANSACTION-REPORT", "1110-WRITE-PAGE-TOTALS", "1111-WRITE-REPORT-REC", "9910-DISPLAY-IO-STATUS"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 2 Batch flows
TABLES: 10 (All Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process 1: CBTRN03C (Transaction Report Generation)            │
│  Batch Process 2: [Additional Loan Account Processing]                │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLES:                                                     │
│    {ACCOUNT-FILE}          ──► READ  ──► CBTRN03C                      │
│    {DALYREJS-FILE}         ──► READ  ──►                               │
│    {DALYTRAN-FILE}         ──► READ  ──► CBTRN03C                      │
│    {DATE-PARMS-FILE}       ──► READ  ──► CBTRN03C                      │
│    {REPORT-FILE}           ──► READ  ──► CBTRN03C (output)             │
│    {TCATBAL-FILE}          ──► READ  ──► CBTRN03C                      │
│    {TRANCATG-FILE}         ──► READ  ──► CBTRN03C                      │
│    {TRANSACT-FILE}         ──► READ  ──► CBTRN03C                      │
│    {TRANTYPE-FILE}         ──► READ  ──► CBTRN03C                      │
│    {XREF-FILE}             ──► READ  ──► CBTRN03C                      │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

Batch 1: CBTRN03C
  Step 1: 1100-WRITE-TRANSACTION-REPORT
  Step 2: 1110-WRITE-PAGE-TOTALS
  Step 3: 1111-WRITE-REPORT-REC
  Step 4: 9910-DISPLAY-IO-STATUS

  Reads: TRANSACT-FILE, XREF-FILE, TRANTYPE-FILE, TRANCATG-FILE,
         DATE-PARMS-FILE
  Writes: REPORT-FILE (report output)`
  },
  4: {
    id: 4,
    name: "Process and Report Cardholder Records Sequentially",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 1 },
    batchFlow: ["CBACT02C (Sequential Card File Processing)"],
    tables: {
      reference: [
        { name: "CARDFILE-FILE", reads: "CBACT02C" }
      ]
    },
    steps: [
      { process: "CBACT02C", steps: ["0000-CARDFILE-OPEN", "1000-CARDFILE-GET-NEXT", "9000-CARDFILE-CLOSE", "9910-DISPLAY-IO-STATUS"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 1 Batch flow
TABLES: 1 (Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: CBACT02C (Sequential Card File Processing)            │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLE:                                                      │
│    {CARDFILE-FILE}         ──► READ  ──► CBACT02C                      │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

CBACT02C
  Step 1: 0000-CARDFILE-OPEN
  Step 2: 1000-CARDFILE-GET-NEXT (sequential read)
  Step 3: 9000-CARDFILE-CLOSE
  Step 4: 9910-DISPLAY-IO-STATUS

  Reads: CARDFILE-FILE (sequential processing)
  Writes: None`
  },
  5: {
    id: 5,
    name: "Process Cross Reference File with Status Tracking",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 1 },
    batchFlow: ["CBACT03C (Cross-Reference File Processing)"],
    tables: {
      reference: [
        { name: "XREFFILE-FILE", reads: "CBACT03C" }
      ]
    },
    steps: [
      { process: "CBACT03C", steps: ["0000-XREFFILE-OPEN", "1000-XREFFILE-GET-NEXT", "9000-XREFFILE-CLOSE", "9910-DISPLAY-IO-STATUS"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 1 Batch flow
TABLES: 1 (Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: CBACT03C (Cross-Reference File Processing)            │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLE:                                                      │
│    {XREFFILE-FILE}         ──► READ  ──► CBACT03C                      │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

CBACT03C
  Step 1: 0000-XREFFILE-OPEN
  Step 2: 1000-XREFFILE-GET-NEXT (sequential read with status tracking)
  Step 3: 9000-XREFFILE-CLOSE
  Step 4: 9910-DISPLAY-IO-STATUS

  Reads: XREFFILE-FILE
  Writes: None`
  },
  6: {
    id: 6,
    name: "Control Execution Delays for Batch Processing",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 0 },
    batchFlow: ["COBSWAIT -> MVSWAIT"],
    tables: { reference: [] },
    steps: [
       { process: "COBSWAIT", steps: ["Calls: MVSWAIT"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing - Utility)
FLOWS: 1 Batch flow
TABLES: 0 (No database access)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: COBSWAIT → MVSWAIT (Timing Control)                   │
│                                                                         │
│  Purpose: Control execution delays and timing for batch jobs          │
│  No database operations - pure logic/timing control                    │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

COBSWAIT
  └─► Calls: MVSWAIT (assembler routine for timer control)

  Reads: None
  Writes: None

  Note: Utility program for controlling batch job scheduling and delays`
  },
  7: {
    id: 7,
    name: "Process Account Records for Multi-Format Output",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 4 },
    batchFlow: ["CBACT01C (Multi-Format Account Output)"],
    tables: {
      reference: [
        { name: "ACCTFILE-FILE", reads: "CBACT01C" },
        { name: "ARRY-FILE", reads: "CBACT01C" },
        { name: "OUT-FILE", reads: "CBACT01C" },
        { name: "VBRC-FILE", reads: "CBACT01C" }
      ]
    },
    steps: [
       { process: "CBACT01C", steps: ["1000-ACCTFILE-GET-NEXT", "1100-DISPLAY-ACCT-RECORD", "1300-POPUL-ACCT-RECORD", "1350-WRITE-ACCT-RECORD", "1450-WRITE-ARRY-RECORD"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 1 Batch flow
TABLES: 4 (Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: CBACT01C (Multi-Format Account Output)                │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLES:                                                     │
│    {ACCTFILE-FILE}         ──► READ  ──► CBACT01C                      │
│    {ARRY-FILE}             ──► READ  ──► CBACT01C (array output)       │
│    {OUT-FILE}              ──► READ  ──► CBACT01C (standard output)    │
│    {VBRC-FILE}             ──► READ  ──► CBACT01C (variable format)    │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

CBACT01C
  Step 1: 1000-ACCTFILE-GET-NEXT
  Step 2: 1100-DISPLAY-ACCT-RECORD
  Step 3: 1300-POPUL-ACCT-RECORD → COBDATFT (date formatting)
  Step 4: 1350-WRITE-ACCT-RECORD (standard format)
  Step 5: 1450-WRITE-ARRY-RECORD (array format)
  Step 6: 1550-WRITE-VB1-RECORD (variable format 1)
  Step 7: 1575-WRITE-VB2-RECORD (variable format 2)

  Reads: ACCTFILE-FILE
  Writes: OUT-FILE, ARRY-FILE, VBRC-FILE (multiple format outputs)`
  },
  8: {
    id: 8,
    name: "Automate Monthly Interest Accrual Processing",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 5 },
    batchFlow: ["CBACT04C (Interest Calculation & Accrual)"],
    tables: {
      reference: [
        { name: "ACCOUNT-FILE", reads: "CBACT04C" },
        { name: "DISCGRP-FILE", reads: "CBACT04C" },
        { name: "TCATBAL-FILE", reads: "CBACT04C" },
        { name: "TRANSACT-FILE", reads: "CBACT04C" },
        { name: "XREF-FILE", reads: "CBACT04C" }
      ]
    },
    steps: [
       { process: "CBACT04C", steps: ["1000-TCATBALF-GET-NEXT", "1050-UPDATE-ACCOUNT", "1100-GET-ACCT-DATA", "1300-COMPUTE-INTEREST"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 1 Batch flow
TABLES: 5 (Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: CBACT04C (Interest Calculation & Accrual)             │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLES:                                                     │
│    {ACCOUNT-FILE}          ──► READ  ──► CBACT04C                      │
│    {DISCGRP-FILE}          ──► READ  ──► CBACT04C (discount groups)    │
│    {TCATBAL-FILE}          ──► READ  ──► CBACT04C (category balances)  │
│    {TRANSACT-FILE}         ──► READ  ──► CBACT04C                      │
│    {XREF-FILE}             ──► READ  ──► CBACT04C                      │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

CBACT04C
  Step 1: 1000-TCATBALF-GET-NEXT
  Step 2: 1050-UPDATE-ACCOUNT
  Step 3: 1100-GET-ACCT-DATA
  Step 4: 1110-GET-XREF-DATA
  Step 5: 1200-GET-INTEREST-RATE
  Step 6: 1200-A-GET-DEFAULT-INT-RATE
  Step 7: 1300-COMPUTE-INTEREST
  Step 8: 1300-B-WRITE-TX → Z-GET-DB2-FORMAT-TIMESTAMP

  Reads: TCATBAL-FILE, ACCOUNT-FILE, XREF-FILE, DISCGRP-FILE, TRANSACT-FILE
  Writes: Transaction records with computed interest`
  },
  9: {
    id: 9,
    name: "Manage Customer Record Retrieval and Display",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 1 },
    batchFlow: ["CBCUS01C (Customer File Sequential Processing)"],
    tables: {
      reference: [
        { name: "CUSTFILE-FILE", reads: "CBCUS01C" }
      ]
    },
    steps: [
       { process: "CBCUS01C", steps: ["0000-CUSTFILE-OPEN", "1000-CUSTFILE-GET-NEXT", "9000-CUSTFILE-CLOSE"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 1 Batch flow
TABLES: 1 (Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: CBCUS01C (Customer File Sequential Processing)        │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLE:                                                      │
│    {CUSTFILE-FILE}         ──► READ  ──► CBCUS01C                      │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

CBCUS01C
  Step 1: 0000-CUSTFILE-OPEN
  Step 2: 1000-CUSTFILE-GET-NEXT (sequential read)
  Step 3: 9000-CUSTFILE-CLOSE
  Step 4: Z-DISPLAY-IO-STATUS

  Reads: CUSTFILE-FILE
  Writes: None (display only)`
  },
  10: {
    id: 10,
    name: "Execute Comprehensive Export for Financial Data",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 6 },
    batchFlow: ["CBEXPORT (Comprehensive Data Export)"],
    tables: {
      reference: [
        { name: "ACCOUNT-INPUT", reads: "CBEXPORT" },
        { name: "CARD-INPUT", reads: "CBEXPORT" },
        { name: "CUSTOMER-INPUT", reads: "CBEXPORT" },
        { name: "TRANSACTION-INPUT", reads: "CBEXPORT" },
        { name: "XREF-INPUT", reads: "CBEXPORT" },
        { name: "EXPORT-OUTPUT", writes: "CBEXPORT" }
      ]
    },
    steps: [
       { process: "CBEXPORT", steps: ["2000-EXPORT-CUSTOMERS", "3000-EXPORT-ACCOUNTS", "4000-EXPORT-XREFS"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 1 Batch flow
TABLES: 6 (Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: CBEXPORT (Comprehensive Data Export)                  │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLES:                                                     │
│    {ACCOUNT-INPUT}         ──► READ  ──► CBEXPORT                      │
│    {CARD-INPUT}            ──► READ  ──► CBEXPORT                      │
│    {CUSTOMER-INPUT}        ──► READ  ──► CBEXPORT                      │
│    {TRANSACTION-INPUT}     ──► READ  ──► CBEXPORT                      │
│    {XREF-INPUT}            ──► READ  ──► CBEXPORT                      │
│    {EXPORT-OUTPUT}         ──► WRITE ──► CBEXPORT (export file)        │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

CBEXPORT
  Step 1: 0000-MAIN-PROCESSING
  Step 2: 1000-INITIALIZE
  Step 3: 1050-GENERATE-TIMESTAMP
  Step 4: 1100-OPEN-FILES
  Step 5: 2000-EXPORT-CUSTOMERS → 2100-READ-CUSTOMER-RECORD
  Step 6: 2200-CREATE-CUSTOMER-EXP-REC
  Step 7: 3000-EXPORT-ACCOUNTS → 3100-READ-ACCOUNT-RECORD
  Step 8: 3200-CREATE-ACCOUNT-EXP-REC
  Step 9: 4000-EXPORT-XREFS → 4100-READ-XREF-RECORD
  Step 10: 4200-CREATE-XREF-EXPORT-RECORD

  Reads: ACCOUNT-INPUT, CARD-INPUT, CUSTOMER-INPUT, TRANSACTION-INPUT, XREF-INPUT
  Writes: EXPORT-OUTPUT (consolidated export file)`
  },
  11: {
    id: 11,
    name: "Process and Import Customer Data Records",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 7 },
    batchFlow: ["CBIMPORT (Data Import Processing)"],
    tables: {
      reference: [
        { name: "EXPORT-INPUT", reads: "CBIMPORT" },
        { name: "ACCOUNT-OUTPUT", writes: "CBIMPORT" },
        { name: "CARD-OUTPUT", writes: "CBIMPORT" },
        { name: "CUSTOMER-OUTPUT", writes: "CBIMPORT" }
      ]
    },
    steps: [
       { process: "CBIMPORT", steps: ["2000-PROCESS-EXPORT-FILE", "2200-PROCESS-RECORD-BY-TYPE", "2300-PROCESS-CUSTOMER-RECORD"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 1 Batch flow
TABLES: 7 (Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: CBIMPORT (Data Import Processing)                     │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLES:                                                     │
│    {EXPORT-INPUT}          ──► READ  ──► CBIMPORT (source file)        │
│    {ACCOUNT-OUTPUT}        ──► WRITE ──► CBIMPORT                      │
│    {CARD-OUTPUT}           ──► WRITE ──► CBIMPORT                      │
│    {CUSTOMER-OUTPUT}       ──► WRITE ──► CBIMPORT                      │
│    {TRANSACTION-OUTPUT}    ──► WRITE ──► CBIMPORT                      │
│    {XREF-OUTPUT}           ──► WRITE ──► CBIMPORT                      │
│    {ERROR-OUTPUT}          ──► WRITE ──► CBIMPORT (error log)          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

CBIMPORT
  Step 1: 0000-MAIN-PROCESSING
  Step 2: 1000-INITIALIZE → 1100-OPEN-FILES
  Step 3: 2000-PROCESS-EXPORT-FILE → 2100-READ-EXPORT-RECORD
  Step 4: 2200-PROCESS-RECORD-BY-TYPE
  Step 5: 2300-PROCESS-CUSTOMER-RECORD
  Step 6: 2400-PROCESS-ACCOUNT-RECORD
  Step 7: 2500-PROCESS-XREF-RECORD

  Reads: EXPORT-INPUT
  Writes: ACCOUNT-OUTPUT, CARD-OUTPUT, CUSTOMER-OUTPUT,
          TRANSACTION-OUTPUT, XREF-OUTPUT, ERROR-OUTPUT`
  },
  12: {
    id: 12,
    name: "Manage Data Processes for Entity Updates",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 1, screen: 0, tables: 6 },
    batchFlow: ["CBSTM03A (Statement Generation & Entity Updates)"],
    tables: {
      reference: [
        { name: "XREF-FILE", reads: "CBSTM03A" },
        { name: "CUST-FILE", reads: "CBSTM03A" },
        { name: "ACCT-FILE", reads: "CBSTM03A" },
        { name: "TRNX-FILE", reads: "CBSTM03A" }
      ]
    },
    steps: [
       { process: "CBSTM03A", steps: ["1000-MAINLINE", "2000-CUSTFILE-GET", "3000-ACCTFILE-GET", "4000-TRNXFILE-GET"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Batch Processing)
FLOWS: 1 Batch flow
TABLES: 6 (Reference/Read-Heavy)
================================================================================

BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Batch Process: CBSTM03A (Statement Generation & Entity Updates)      │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLES:                                                     │
│    {XREF-FILE}             ──► READ  ──► CBSTM03A                      │
│    {CUST-FILE}             ──► READ  ──► CBSTM03A                      │
│    {ACCT-FILE}             ──► READ  ──► CBSTM03A                      │
│    {TRNX-FILE}             ──► READ  ──► CBSTM03A                      │
│    {STMT-FILE}             ──► WRITE ──► CBSTM03A (statement output)   │
│    {HTML-FILE}             ──► WRITE ──► CBSTM03A (HTML output)        │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

BATCH PROCESS STEPS:

CBSTM03A
  Step 1: 0000-START → 8100-FILE-OPEN
  Step 2: 1000-MAINLINE → 1000-XREFFILE-GET-NEXT → CBSTM03B
  Step 3: 1000-TRNXFILE-PROC
  Step 4: 2000-CUSTFILE-GET → CBSTM03B
  Step 5: 2000-XREFFILE-PROC
  Step 6: 3000-ACCTFILE-GET → CBSTM03B
  Step 7: 3000-CUSTFILE-PROC
  Step 8: 4000-ACCTFILE-PROC
  Step 9: 4000-TRNXFILE-GET → 6000-WRITE-TRANS
  Step 10: 1900-EXIT

  Reads: XREF-FILE, CUST-FILE, ACCT-FILE, TRNX-FILE
  Writes: STMT-FILE, HTML-FILE`
  },
  13: {
    id: 13,
    name: "Verify Daily Card Transactions for Processing",
    type: "READ_ONLY_CUT",
    stats: { flows: 1, batch: 0, screen: 1, tables: 6 },
    batchFlow: ["CBTRN01C (Daily Transaction Verification)"],
    tables: {
      reference: [
        { name: "DALYTRAN-FILE", reads: "CBTRN01C" },
        { name: "CUSTOMER-FILE", reads: "CBTRN01C" },
        { name: "XREF-FILE", reads: "CBTRN01C" },
        { name: "CARD-FILE", reads: "CBTRN01C" },
        { name: "ACCOUNT-FILE", reads: "CBTRN01C" },
        { name: "TRANSACT-FILE", reads: "CBTRN01C" }
      ]
    },
    steps: [
       { process: "CBTRN01C", steps: ["1000-DALYTRAN-GET-NEXT", "0000-DALYTRAN-OPEN"] }
    ],
    asciiChart: `================================================================================
TYPE: READ_ONLY_CUT (Screen + Batch Hybrid)
FLOWS: 1 Screen flow
TABLES: 6 (Reference/Read-Heavy)
================================================================================

SCREEN/BATCH FLOW:
┌────────────────────────────────────────────────────────────────────────┐
│  Process: CBTRN01C (Daily Transaction Verification)                   │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ READ Operations Only
                              ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    DATABASE TABLES (Read-Only)                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REFERENCE TABLES:                                                     │
│    {DALYTRAN-FILE}         ──► READ  ──► CBTRN01C (daily transactions) │
│    {CUSTOMER-FILE}         ──► READ  ──► CBTRN01C                      │
│    {XREF-FILE}             ──► READ  ──► CBTRN01C                      │
│    {CARD-FILE}             ──► READ  ──► CBTRN01C                      │
│    {ACCOUNT-FILE}          ──► READ  ──► CBTRN01C                      │
│    {TRANSACT-FILE}         ──► READ  ──► CBTRN01C                      │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

PROCESS STEPS:

CBTRN01C
  Step 1: MAIN-PARA
  Step 2: 0000-DALYTRAN-OPEN → Z-DISPLAY-IO-STATUS
  Step 3: 0100-CUSTFILE-OPEN
  Step 4: 0200-XREFFILE-OPEN
  Step 5: 0300-CARDFILE-OPEN
  Step 6: 0400-ACCTFILE-OPEN
  Step 7: 0500-TRANFILE-OPEN
  Step 8: 1000-DALYTRAN-GET-NEXT (verify daily transactions)
  Step 9: 9000-DALYTRAN-CLOSE

  Reads: DALYTRAN-FILE, CUSTOMER-FILE, XREF-FILE, CARD-FILE,
         ACCOUNT-FILE, TRANSACT-FILE
  Writes: None (verification only)`
  }
};
