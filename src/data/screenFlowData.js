export const screenFlowData = {
  nodes: [
    // Main Menu
    {
      id: "MENU-001",
      data: { label: "MENU-001\nUser authentication and login screens" },
      position: { x: 0, y: 100 },
      style: {
        background: "#e1f5ff",
        border: "2px solid #01579b",
        borderRadius: "8px",
        padding: "12px",
        textAlign: "center",
        fontSize: "12px",
        fontWeight: "bold",
        width: "180px",
      },
    },

    // Account Management Flow
    {
      id: "ACCT-MGM1-001",
      data: { label: "ACCT-MGM1-001\nAccount Management menu with options to view account services information" },
      position: { x: 300, y: 0 },
      style: {
        background: "#f3e5f5",
        border: "2px solid #4a148c",
        borderRadius: "8px",
        padding: "12px",
        textAlign: "center",
        fontSize: "11px",
        width: "200px",
      },
    },
    {
      id: "VIEW-ACCT-001",
      data: { label: "VIEW-ACCT-001\nDisplay account information (user only)" },
      position: { x: 550, y: 0 },
      style: {
        background: "#f3e5f5",
        border: "1px solid #7b1fa2",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },
    {
      id: "UPDATE-ACCT-001",
      data: { label: "UPDATE-ACCT-001\nUpdate account information (user only)" },
      position: { x: 750, y: 0 },
      style: {
        background: "#f3e5f5",
        border: "1px solid #7b1fa2",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },

    // Card Management Flow
    {
      id: "CARD-MGM1-001",
      data: { label: "CARD-MGM1-001\nCard Management menu with options to view card services information" },
      position: { x: 300, y: 120 },
      style: {
        background: "#f3e5f5",
        border: "2px solid #4a148c",
        borderRadius: "8px",
        padding: "12px",
        textAlign: "center",
        fontSize: "11px",
        width: "200px",
      },
    },
    {
      id: "VIEW-CARD-001",
      data: { label: "VIEW-CARD-001\nDisplay card information (user only)" },
      position: { x: 550, y: 120 },
      style: {
        background: "#f3e5f5",
        border: "1px solid #7b1fa2",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },
    {
      id: "UPDATE-CARD-001",
      data: { label: "UPDATE-CARD-001\nUpdate card information (user only)" },
      position: { x: 750, y: 120 },
      style: {
        background: "#f3e5f5",
        border: "1px solid #7b1fa2",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },
    {
      id: "LIST-CARD-001",
      data: { label: "LIST-CARD-001\nDisplay list of all cards associated with the account" },
      position: { x: 950, y: 120 },
      style: {
        background: "#f3e5f5",
        border: "1px solid #7b1fa2",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },

    // Transaction Flow
    {
      id: "TRANS-001",
      data: { label: "TRANS-001\nTransaction history search and view options for view and add transaction (ACT, Amt, Add)" },
      position: { x: 300, y: 280 },
      style: {
        background: "#fce4ec",
        border: "2px solid #880e4f",
        borderRadius: "8px",
        padding: "12px",
        textAlign: "center",
        fontSize: "11px",
        width: "200px",
      },
    },
    {
      id: "VIEW-TRANS-001",
      data: { label: "VIEW-TRANS-001\nDisplay transaction information (user only)" },
      position: { x: 550, y: 280 },
      style: {
        background: "#fce4ec",
        border: "1px solid #c2185b",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },
    {
      id: "ADD-TRANS-001",
      data: { label: "ADD-TRANS-001\nAdd new transaction information" },
      position: { x: 750, y: 280 },
      style: {
        background: "#fce4ec",
        border: "1px solid #c2185b",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },
    {
      id: "LIST-TRANS-001",
      data: { label: "LIST-TRANS-001\nList of all transactions associated with the account" },
      position: { x: 950, y: 280 },
      style: {
        background: "#fce4ec",
        border: "1px solid #c2185b",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },
    {
      id: "REPORT-TRANS-001",
      data: { label: "REPORT-TRANS-001\nGenerate transaction report" },
      position: { x: 1150, y: 280 },
      style: {
        background: "#fce4ec",
        border: "1px solid #c2185b",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
        fontSize: "10px",
        width: "160px",
      },
    },

    // Bill Payment Flow
    {
      id: "BILLPAY-001",
      data: { label: "BILLPAY-001\nBill Pay services for paying account statements" },
      position: { x: 300, y: 420 },
      style: {
        background: "#fff3e0",
        border: "2px solid #e65100",
        borderRadius: "8px",
        padding: "12px",
        textAlign: "center",
        fontSize: "11px",
        width: "200px",
      },
    },
  ],

  edges: [
    // Menu to Account Management
    { id: "MENU-ACCT", source: "MENU-001", target: "ACCT-MGM1-001", animated: true, style: { stroke: "#01579b" } },

    // Account Management Flow
    { id: "ACCT-VIEW", source: "ACCT-MGM1-001", target: "VIEW-ACCT-001", animated: true, style: { stroke: "#4a148c" } },
    { id: "VIEW-UPDATE-ACCT", source: "VIEW-ACCT-001", target: "UPDATE-ACCT-001", animated: true, style: { stroke: "#7b1fa2" } },

    // Menu to Card Management
    { id: "MENU-CARD", source: "MENU-001", target: "CARD-MGM1-001", animated: true, style: { stroke: "#01579b" } },

    // Card Management Flow
    { id: "CARD-VIEW", source: "CARD-MGM1-001", target: "VIEW-CARD-001", animated: true, style: { stroke: "#4a148c" } },
    { id: "VIEW-UPDATE-CARD", source: "VIEW-CARD-001", target: "UPDATE-CARD-001", animated: true, style: { stroke: "#7b1fa2" } },
    { id: "UPDATE-LIST-CARD", source: "UPDATE-CARD-001", target: "LIST-CARD-001", animated: true, style: { stroke: "#7b1fa2" } },

    // Menu to Transaction
    { id: "MENU-TRANS", source: "MENU-001", target: "TRANS-001", animated: true, style: { stroke: "#01579b" } },

    // Transaction Flow
    { id: "TRANS-VIEW", source: "TRANS-001", target: "VIEW-TRANS-001", animated: true, style: { stroke: "#880e4f" } },
    { id: "TRANS-ADD", source: "TRANS-001", target: "ADD-TRANS-001", animated: true, style: { stroke: "#880e4f" } },
    { id: "ADD-LIST-TRANS", source: "ADD-TRANS-001", target: "LIST-TRANS-001", animated: true, style: { stroke: "#c2185b" } },
    { id: "LIST-REPORT-TRANS", source: "LIST-TRANS-001", target: "REPORT-TRANS-001", animated: true, style: { stroke: "#c2185b" } },

    // Menu to Bill Payment
    { id: "MENU-BILL", source: "MENU-001", target: "BILLPAY-001", animated: true, style: { stroke: "#01579b" } },
  ],
};
