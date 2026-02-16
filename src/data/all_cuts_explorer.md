# Complete System Flow Chart - All Cuts Analysis

## System Overview

This document provides a comprehensive ASCII flow chart showing how screens, batch processes, and database tables interact across all 13 business cuts in the credit card demo system.

---

## Summary Statistics

| Cut # | Cut Name | Type | Flows | Batch | Screen | Tables | Screens |
|-------|----------|------|-------|-------|--------|--------|---------|
| 1 | Manage Accounts, Cards, Transactions, and Bill Payments | CLEAN_CUT | 14 | 0 | 14 | 11 | 14 |
| 2 | User Access Security and Permission Management | CLEAN_CUT | 7 | 0 | 7 | 5 | 8 |
| 3 | Manage Customer Loan Accounts and Processing | READ_ONLY_CUT | 2 | 2 | 0 | 10 | 0 |
| 4 | Process and Report Cardholder Records Sequentially | READ_ONLY_CUT | 1 | 1 | 0 | 1 | 0 |
| 5 | Process Cross Reference File with Status Tracking | READ_ONLY_CUT | 1 | 1 | 0 | 1 | 0 |
| 6 | Control Execution Delays for Batch Processing | READ_ONLY_CUT | 1 | 1 | 0 | 0 | 0 |
| 7 | Batch Process Account Records for Multi-Format Output | READ_ONLY_CUT | 1 | 1 | 0 | 4 | 0 |
| 8 | Automate Monthly Interest Accrual Processing | READ_ONLY_CUT | 1 | 1 | 0 | 5 | 0 |
| 9 | Manage Customer Record Retrieval and Display | READ_ONLY_CUT | 1 | 1 | 0 | 1 | 0 |
| 10 | Execute Comprehensive Export for Financial Data | READ_ONLY_CUT | 1 | 1 | 0 | 6 | 0 |
| 11 | Process and Import Customer Data Records | READ_ONLY_CUT | 1 | 1 | 0 | 7 | 0 |
| 12 | Manage Data Processes for Entity Updates | READ_ONLY_CUT | 1 | 1 | 0 | 6 | 0 |
| 13 | Verify Daily Card Transactions for Processing | READ_ONLY_CUT | 1 | 0 | 1 | 6 | 0 |

**TOTALS:** 33 Flows, 11 Batch Processes, 22 Screen Flows, 63 Total Tables Referenced

---

# CUT 1: Manage Accounts, Cards, Transactions, and Bill Payments

```
================================================================================
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
  ◄── Reads from: Cut_2 (SEC-USER-DATA)
```

---

# CUT 2: User Access Security and Permission Management

```
================================================================================
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
  ──► Provides to: Cut_1 (SEC-USER-DATA)
```

---

# CUT 3: Manage Customer Loan Accounts and Processing

```
================================================================================
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
  Writes: REPORT-FILE (report output)
```

---

# CUT 4: Process and Report Cardholder Records Sequentially

```
================================================================================
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
  Writes: None
```

---

# CUT 5: Process Cross Reference File with Status Tracking

```
================================================================================
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
  Writes: None
```

---

# CUT 6: Control Execution Delays for Batch Processing

```
================================================================================
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

  Note: Utility program for controlling batch job scheduling and delays
```

---

# CUT 7: Batch Process Account Records for Multi-Format Output

```
================================================================================
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
  Writes: OUT-FILE, ARRY-FILE, VBRC-FILE (multiple format outputs)
```

---

# CUT 8: Automate Monthly Interest Accrual Processing

```
================================================================================
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
  Writes: Transaction records with computed interest
```

---

# CUT 9: Manage Customer Record Retrieval and Display

```
================================================================================
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
  Writes: None (display only)
```

---

# CUT 10: Execute Comprehensive Export for Financial Data

```
================================================================================
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
  Writes: EXPORT-OUTPUT (consolidated export file)
```

---

# CUT 11: Process and Import Customer Data Records

```
================================================================================
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
          TRANSACTION-OUTPUT, XREF-OUTPUT, ERROR-OUTPUT
```

---

# CUT 12: Manage Data Processes for Entity Updates

```
================================================================================
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
  Writes: STMT-FILE, HTML-FILE
```

---

# CUT 13: Verify Daily Card Transactions for Processing

```
================================================================================
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
  Writes: None (verification only)
```

---

# CROSS-CUT DATABASE TABLE REFERENCE MAP

```
================================================================================
MASTER TABLES (Primary Write Operations)
================================================================================

<ACCOUNT-RECORD>
  ├── OWNER: Cut 1
  ├── WRITES: Cut 1 (all account screens)
  ├── READS: Cut 1, Cut 2, Cut 3, Cut 8, Cut 13
  └── Type: MASTER, WRITE_HEAVY

<ACCT-UPDATE-RECORD>
  ├── OWNER: Cut 1
  ├── WRITES: Cut 1 (COBIL0A, COTRN2A, CACTUPA)
  └── Type: MASTER, WRITE_HEAVY (audit trail)

<CARD-RECORD>
  ├── OWNER: Cut 1
  ├── WRITES: Cut 1 (CCRDUPA)
  ├── READS: Cut 1, Cut 4, Cut 13
  └── Type: REFERENCE + WRITE_HEAVY

<CARD-UPDATE-RECORD>
  ├── OWNER: Cut 1
  ├── WRITES: Cut 1 (CCRDUPA)
  └── Type: MASTER, WRITE_HEAVY (audit trail)

<CUSTOMER-RECORD>
  ├── OWNER: Cut 1
  ├── WRITES: Cut 1 (COMEN1A, CACTUPA)
  ├── READS: Cut 1, Cut 2, Cut 9, Cut 10, Cut 11, Cut 13
  └── Type: REFERENCE + WRITE_HEAVY

<CUST-UPDATE-RECORD>
  ├── OWNER: Cut 1
  ├── WRITES: Cut 1 (COMEN1A, CACTUPA)
  └── Type: MASTER, WRITE_HEAVY (audit trail)

<TRAN-RECORD>
  ├── OWNER: Cut 1
  ├── WRITES: Cut 1 (COTRN2A)
  ├── READS: Cut 1, Cut 3, Cut 8, Cut 10, Cut 11, Cut 13
  └── Type: MASTER, WRITE_HEAVY

<SEC-USER-DATA>
  ├── OWNER: Cut 2
  ├── WRITES: Cut 2 (COUSR2A, COUSR3A)
  ├── READS: Cut 1, Cut 2
  └── Type: MASTER, WRITE_HEAVY

<<CARDDEMO.TRANSACTION_TYPE>>
  ├── OWNER: Cut 1
  ├── WRITES: Cut 1 (CTRTUPA, CTRTLIA)
  ├── READS: Cut 1
  └── Type: TEMPORARY, WRITE_HEAVY


================================================================================
REFERENCE TABLES (Primary Read Operations)
================================================================================

{CARD-XREF-RECORD}
  ├── OWNER: Cut 1
  ├── READS: Cut 1, Cut 2, Cut 3, Cut 5, Cut 10, Cut 11
  └── Type: REFERENCE, READ_HEAVY

{MQTM}
  ├── READS: Cut 1, Cut 2
  └── Type: REFERENCE, READ_HEAVY

{XREF-FILE}
  ├── READS: Cut 3, Cut 8, Cut 10, Cut 11, Cut 12, Cut 13
  └── Type: REFERENCE, READ_HEAVY


================================================================================
BATCH-SPECIFIC FILES (File-Based Operations)
================================================================================

{ACCTFILE-FILE}
  └── READS: Cut 7 (multi-format output)

{CARDFILE-FILE}
  └── READS: Cut 4 (sequential processing)

{XREFFILE-FILE}
  └── READS: Cut 5 (status tracking)

{CUSTFILE-FILE}
  └── READS: Cut 9 (retrieval & display)

{ACCOUNT-INPUT/OUTPUT}
  ├── READS: Cut 10 (export)
  └── WRITES: Cut 11 (import)

{CARD-INPUT/OUTPUT}
  ├── READS: Cut 10 (export)
  └── WRITES: Cut 11 (import)

{CUSTOMER-INPUT/OUTPUT}
  ├── READS: Cut 10 (export)
  └── WRITES: Cut 11 (import)

{TRANSACTION-INPUT/OUTPUT}
  ├── READS: Cut 10 (export)
  └── WRITES: Cut 11 (import)

{DALYTRAN-FILE}
  └── READS: Cut 3, Cut 13 (daily transaction verification)

{TCATBAL-FILE}
  └── READS: Cut 3, Cut 8 (balance categories)

{DISCGRP-FILE}
  └── READS: Cut 8 (discount groups for interest)
```

---

# SYSTEM INTEGRATION MAP

```
================================================================================
ONLINE SYSTEM (Cuts 1 & 2)
================================================================================

  ┌─────────────────────────────────────────────────────────────┐
  │                    USER INTERFACE LAYER                      │
  │                                                               │
  │  Cut 1: 14 Screens (Account, Card, Transaction Management)  │
  │  Cut 2: 8 Screens (User Security & Administration)          │
  └─────────────────────────────────────────────────────────────┘
                              │
                              │ READ/WRITE
                              ↓
  ┌─────────────────────────────────────────────────────────────┐
  │                   MASTER DATABASE TABLES                     │
  │                                                               │
  │  ACCOUNT-RECORD, CARD-RECORD, CUSTOMER-RECORD, TRAN-RECORD  │
  │  ACCT-UPDATE, CARD-UPDATE, CUST-UPDATE (Audit Trails)       │
  │  SEC-USER-DATA (Security)                                    │
  │  CARDDEMO.TRANSACTION_TYPE (Lookup)                          │
  └─────────────────────────────────────────────────────────────┘
                              │
                              │ FEEDS DATA TO
                              ↓
================================================================================
BATCH PROCESSING LAYER (Cuts 3-13)
================================================================================

  ┌─────────────────────────────────────────────────────────────┐
  │              REPORTING & ANALYSIS (Cuts 3, 4, 5, 9)         │
  │                                                               │
  │  Cut 3: Loan Account Reports         (10 tables)            │
  │  Cut 4: Cardholder Reports            (1 table)             │
  │  Cut 5: Cross-Reference Reports       (1 table)             │
  │  Cut 9: Customer Record Display       (1 table)             │
  │                                                               │
  │  All READ-ONLY operations                                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │          DATA TRANSFORMATION (Cuts 7, 10, 11, 12)           │
  │                                                               │
  │  Cut 7: Multi-Format Account Output   (4 tables)            │
  │  Cut 10: Comprehensive Data Export    (6 tables)            │
  │  Cut 11: Customer Data Import         (7 tables)            │
  │  Cut 12: Entity Update Processing     (6 tables)            │
  │                                                               │
  │  READ + WRITE to file systems                                │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │          FINANCIAL PROCESSING (Cuts 8, 13)                  │
  │                                                               │
  │  Cut 8: Monthly Interest Accrual      (5 tables)            │
  │  Cut 13: Daily Transaction Verify     (6 tables)            │
  │                                                               │
  │  Critical financial calculations                             │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                    UTILITY (Cut 6)                           │
  │                                                               │
  │  Cut 6: Batch Execution Delays        (0 tables)            │
  │                                                               │
  │  Timing control - no database access                         │
  └─────────────────────────────────────────────────────────────┘


================================================================================
DATA FLOW PATTERN
================================================================================

Online Users → [Cut 1 & 2 Screens] → MASTER TABLES → [Cuts 3-13 Batch]
      ↑                                                      ↓
      └──────────────── Reports, Exports, Imports ──────────┘
```

---

# SUMMARY & KEY INSIGHTS

## Architecture Patterns

1. **Two-Tier Architecture**
   - **Online Tier**: Cuts 1-2 (Interactive screens with heavy WRITE operations)
   - **Batch Tier**: Cuts 3-13 (Background processing with READ operations)

2. **Data Ownership**
   - Cut 1 owns all primary business tables (accounts, cards, customers, transactions)
   - Cut 2 owns security tables (user authentication)
   - Cuts 3-13 consume data via read-only operations

3. **Audit Trail Pattern**
   - Every MASTER table has corresponding UPDATE table
   - Maintains complete change history
   - Examples: ACCOUNT-RECORD + ACCT-UPDATE-RECORD

4. **Batch Processing Patterns**
   - **Sequential**: Cuts 4, 5, 9 (simple file reads)
   - **Reporting**: Cuts 3 (complex multi-table joins)
   - **Transformation**: Cuts 7, 10, 11, 12 (data import/export)
   - **Financial**: Cut 8, 13 (interest calculations, verification)
   - **Utility**: Cut 6 (timing control)

## Database Table Usage

- **Most Read Tables**: ACCOUNT-RECORD, CARD-XREF-RECORD, XREF-FILE, TRANSACT-FILE
- **Most Written Tables**: ACCOUNT-RECORD, TRAN-RECORD, CUSTOMER-RECORD
- **Cross-Cut Dependencies**:
  - Cut 1 ↔ Cut 2 (bidirectional via SEC-USER-DATA and ACCOUNT-RECORD)
  - Cut 1 → Cuts 3-13 (data provider to all batch processes)

## Operational Characteristics

- **Online Processing**: 22 interactive screens across 2 cuts
- **Batch Processing**: 11 batch programs across 11 cuts
- **Total Tables**: 63 table references (many reused across cuts)
- **Database Operations**: 688 total DB calls (511 in Cut 1 alone)

---

**END OF DOCUMENT**
