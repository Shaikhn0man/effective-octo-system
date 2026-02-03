export const clusterDetailData = {
  "Cut_2_SEC-USER-DATA": {
    cluster_id: "Cut_2_SEC-USER-DATA",
    topic: "Domain handling SEC-USER-DATA",
    type: "CLEAN_CUT",
    stats: {
      flow_count: 6,
      screen_count: 8,
      program_count: 9,
      table_count: 5,
    },
    dependencies: {
      reads_from_cuts: [
        "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD (Table: ACCOUNT-RECORD)",
        "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD (Table: CUSTOMER-RECORD)",
      ],
    },
  },
};

export const clusterDependencyMapData = {
  total_clusters: 16,
  dependency_map: [
    {
      cluster_id: "Cut_10_LOGIC_OR_READ_ONLY_10",
      topic: "Domain handling LOGIC_OR_READ_ONLY_10",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_11_LOGIC_OR_READ_ONLY_11",
      topic: "Domain handling LOGIC_OR_READ_ONLY_11",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_12_LOGIC_OR_READ_ONLY_12",
      topic: "Domain handling LOGIC_OR_READ_ONLY_12",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_13_LOGIC_OR_READ_ONLY_13",
      topic: "Domain handling LOGIC_OR_READ_ONLY_13",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_14_LOGIC_OR_READ_ONLY_14",
      topic: "Domain handling LOGIC_OR_READ_ONLY_14",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_15_LOGIC_OR_READ_ONLY_15",
      topic: "Domain handling LOGIC_OR_READ_ONLY_15",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_16_LOGIC_OR_READ_ONLY_16",
      topic: "Domain handling LOGIC_OR_READ_ONLY_16",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD",
      topic: "Domain handling ACCOUNT-RECORD__ACCT-UPDATE-RECORD",
      type: "CLEAN_CUT",
      depends_on_count: 1,
      depends_on: [
        {
          cluster_id: "Cut_2_SEC-USER-DATA",
          table: "SEC-USER-DATA",
        },
      ],
    },
    {
      cluster_id: "Cut_2_SEC-USER-DATA",
      topic: "Domain handling SEC-USER-DATA",
      type: "CLEAN_CUT",
      depends_on_count: 2,
      depends_on: [
        {
          cluster_id: "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD",
          table: "ACCOUNT-RECORD",
        },
        {
          cluster_id: "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD",
          table: "CUSTOMER-RECORD",
        },
      ],
    },
    {
      cluster_id: "Cut_3_CARDDEMO.TRANSACTION_TYPE",
      topic: "Domain handling CARDDEMO.TRANSACTION_TYPE",
      type: "CLEAN_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_4_LOGIC_OR_READ_ONLY_4",
      topic: "Domain handling LOGIC_OR_READ_ONLY_4",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_5_LOGIC_OR_READ_ONLY_5",
      topic: "Domain handling LOGIC_OR_READ_ONLY_5",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_6_LOGIC_OR_READ_ONLY_6",
      topic: "Domain handling LOGIC_OR_READ_ONLY_6",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_7_LOGIC_OR_READ_ONLY_7",
      topic: "Domain handling LOGIC_OR_READ_ONLY_7",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_8_LOGIC_OR_READ_ONLY_8",
      topic: "Domain handling LOGIC_OR_READ_ONLY_8",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
    {
      cluster_id: "Cut_9_LOGIC_OR_READ_ONLY_9",
      topic: "Domain handling LOGIC_OR_READ_ONLY_9",
      type: "READ_ONLY_CUT",
      depends_on_count: 0,
      depends_on: [],
    },
  ],
};

export const clusterSpecificDependencyData = {
  cluster_id: "Cut_2_SEC-USER-DATA",
  cluster: {
    reads_from_cuts: [
      "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD (Table: ACCOUNT-RECORD)",
      "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD (Table: CUSTOMER-RECORD)",
    ],
    table_count: 5,
    cluster_id: "Cut_2_SEC-USER-DATA",
    flow_count: 6,
    screen_count: 8,
    topic: "Domain handling SEC-USER-DATA",
    type: "CLEAN_CUT",
    program_count: 9,
  },
  depends_on: {
    count: 2,
    clusters: [
      {
        cluster_id: "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD",
        table: "ACCOUNT-RECORD",
        raw: "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD (Table: ACCOUNT-RECORD)",
      },
      {
        cluster_id: "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD",
        table: "CUSTOMER-RECORD",
        raw: "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD (Table: CUSTOMER-RECORD)",
      },
    ],
  },
  depended_by: {
    count: 1,
    clusters: [
      {
        reads_from_cuts: ["Cut_2_SEC-USER-DATA (Table: SEC-USER-DATA)"],
        table_count: 11,
        cluster_id: "Cut_1_ACCOUNT-RECORD__ACCT-UPDATE-RECORD",
        flow_count: 12,
        screen_count: 15,
        topic: "Domain handling ACCOUNT-RECORD__ACCT-UPDATE-RECORD",
        type: "CLEAN_CUT",
        program_count: 18,
      },
    ],
  },
};
