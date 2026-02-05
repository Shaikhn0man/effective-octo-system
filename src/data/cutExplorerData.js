export const cutExplorerData = {
  1: {
    id: 1,
    name: "Collect User Data for Credit Card Demo",
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
        { name: "TRAN-RECORD", writes: "COTRN2A", reads: "COTRN0A, COTRN1A, CORPT0A" },
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
      { screen: "COTRN0A", reads: ["TRAN-RECORD", "TRANSACTION_TYPE"], writes: [] },
      { screen: "CTRTUPA", reads: ["TRANSACTION_TYPE"], writes: ["TRANSACTION_TYPE"] },
      { screen: "CACTVWA", reads: ["ACCOUNT-RECORD", "CUSTOMER-RECORD", "CARD-RECORD"], writes: [] },
      { screen: "COBIL0A", reads: ["ACCOUNT-RECORD"], writes: ["ACCOUNT-RECORD", "ACCT-UPDATE-RECORD", "TRAN-RECORD"] },
      { screen: "COSGN0A", reads: ["SEC-USER-DATA (from Cut 2)"], writes: [] },
      { screen: "COTRN2A", reads: ["ACCOUNT-RECORD", "TRANSACTION_TYPE"], writes: ["TRAN-RECORD", "ACCOUNT-RECORD", "ACCT-UPDATE-RECORD"] },
      { screen: "CACTUPA", reads: ["ACCOUNT-RECORD", "CUSTOMER-RECORD"], writes: ["ACCOUNT-RECORD", "ACCT-UPDATE-RECORD", "CUSTOMER-RECORD", "CUST-UPDATE-RECORD"] }
    ],
    dependencies: { readsFrom: "Cut 2 (SEC-USER-DATA)" }
  },
  2: {
    id: 2,
    name: "User Access Security and Permission Management",
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
    dependencies: { readsFrom: "Cut 1 (ACCOUNT-RECORD, CUSTOMER-RECORD)", providesTo: "Cut 1 (SEC-USER-DATA)" }
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
    ]
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
    ]
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
    ]
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
    ]
  },
  7: {
    id: 7,
    name: "Batch Process Account Records for Multi-Format Output",
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
};
