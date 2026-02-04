export const clusterData = {
  "total_clusters": 13,
  "clusters": [
    {
      "cluster_id": "Cut_10_Manage_Data_Processes_for_Entity_Updates",
      "topic": "Domain handling Manage_Data_Processes_for_Entity_Updates",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 10,
      "description": "This business cut represents the manage data processes for entity updates functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from ACCT-FILE, CUST-FILE, and 4 other reference tables. This data architecture supports critical business functions including data management, processing, and reporting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 2,
      "table_count": 6,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_11_Verify_Daily_Card_Transactions_for_Processing",
      "topic": "Domain handling Verify_Daily_Card_Transactions_for_Processing",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 11,
      "description": "This business cut represents the verify daily card transactions for processing functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from ACCOUNT-FILE, CARD-FILE, and 4 other reference tables. This data architecture supports critical business functions including transaction posting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 1,
      "table_count": 6,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_12_Manage_Customer_Loan_Accounts_and_Processing",
      "topic": "Domain handling Manage_Customer_Loan_Accounts_and_Processing",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 12,
      "description": "This business cut represents the manage customer loan accounts and processing functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from ACCOUNT-FILE, DALYREJS-FILE, and 8 other reference tables. This data architecture supports critical business functions including customer onboarding while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 2,
      "screen_count": 0,
      "program_count": 2,
      "table_count": 10,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_13_Control_Execution_Delays_for_Batch_Processing",
      "topic": "Domain handling Control_Execution_Delays_for_Batch_Processing",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 13,
      "description": "This business cut represents the control execution delays for batch processing functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system primarily performs computational and logical operations without direct database modifications.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 2,
      "table_count": 0,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_1_User_access_security_and_permission_management",
      "topic": "Domain handling User_access_security_and_permission_management",
      "type": "CLEAN_CUT",
      "cut_seq_no": 1,
      "description": "This business cut represents the process credit card authorization requests efficiently functionality within the system. \n\nThe application orchestrates interactive screen-based execution flows that guide users through their business operations. Users access a main menu (COADM1A) that serves as the central navigation hub to various functional modules including facilitate user deletion operations (COUSR3A, COUSR0A), update user records in cics interface (COUSR2A, COUSR0A), manage user data in cobol screen (COUSR0A, COSGN0A), add new users through interface (COUSR1A, COSGN0A), retrieve customer authorization details (COPAU0A), display authorization transaction details (COPAU1A).\n\nThe system manages both master data and transactional records through coordinated database operations. Write-intensive operations target the SEC-USER-DATA table. The application maintains referential integrity by reading from ACCOUNT-RECORD, CARD-XREF-RECORD, and 2 other reference tables. This data architecture supports critical business functions including customer onboarding, credit limit management, card activation/deactivation, transaction posting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 7,
      "screen_count": 8,
      "program_count": 9,
      "table_count": 5,
      "sub_cut_count": 2,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 2,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        },
        {
          "sub_cut_type": "CLEAN_SUBCUT",
          "sub_cut_topic": "Handling User_access_security_and_permission_management",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_User_access_security_and_permission_management"
        }
      ],
      "dependencies": {
        "reads_from_cuts": [
          "Cut_2_Maintain_Transaction_Type_Data (Table: ACCOUNT-RECORD)",
          "Cut_2_Maintain_Transaction_Type_Data (Table: CUSTOMER-RECORD)"
        ]
      }
    },
    {
      "cluster_id": "Cut_2_Maintain_Transaction_Type_Data",
      "topic": "Domain handling Maintain_Transaction_Type_Data",
      "type": "CLEAN_CUT",
      "cut_seq_no": 2,
      "description": "This business cut represents a comprehensive system that manages the complete lifecycle of accounts, credit cards, customers, transactions. The system provides an integrated platform for user authentication, account management, card operations, transaction processing, reporting capabilities.\n\nThe application provides 14 interactive screens for users to perform various business operations including update account and customer information (CACTUPA), capture credit card details efficiently (CCRDSLA), facilitate user input validation (COBIL0A), generate transaction reports by date range (CORPT0A).\n\nThe system manages both master data and transactional records through coordinated database operations. Write-intensive operations target 8 primary tables including ACCOUNT-RECORD and ACCT-UPDATE-RECORD for account information; CARD-RECORD, CARD-UPDATE-RECORD, and others for credit card details; CUST-UPDATE-RECORD and CUSTOMER-RECORD for customer demographics. The application maintains referential integrity by reading from CARD-XREF-RECORD and MQTM and SEC-USER-DATA. This data architecture supports critical business functions including customer onboarding, credit limit management, card activation/deactivation, transaction posting, balance tracking, financial reporting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 14,
      "screen_count": 14,
      "program_count": 17,
      "table_count": 11,
      "sub_cut_count": 2,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 2,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        },
        {
          "sub_cut_type": "CLEAN_SUBCUT",
          "sub_cut_topic": "Handling Maintain_Transaction_Types_Interface",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_Maintain_Transaction_Types_Interface"
        }
      ],
      "dependencies": {
        "reads_from_cuts": [
          "Cut_1_User_access_security_and_permission_management (Table: SEC-USER-DATA)"
        ]
      }
    },
    {
      "cluster_id": "Cut_3_Batch_Process_Account_Records_for_Multi_Format_Output",
      "topic": "Domain handling Batch_Process_Account_Records_for_Multi_Format_Output",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 3,
      "description": "This business cut represents the batch process account records for multi-format output functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from ACCTFILE-FILE, ARRY-FILE, and 2 other reference tables. This data architecture supports critical business functions including data management, processing, and reporting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 2,
      "table_count": 4,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_4_Process_and_Report_Cardholder_Records_Sequentially",
      "topic": "Domain handling Process_and_Report_Cardholder_Records_Sequentially",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 4,
      "description": "This business cut represents the process and report cardholder records sequentially functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from CARDFILE-FILE. This data architecture supports critical business functions including financial reporting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 1,
      "table_count": 1,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_5_Process_Cross_Reference_File_with_Status_Tracking",
      "topic": "Domain handling Process_Cross_Reference_File_with_Status_Tracking",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 5,
      "description": "This business cut represents the process cross-reference file with status tracking functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from XREFFILE-FILE. This data architecture supports critical business functions including data management, processing, and reporting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 1,
      "table_count": 1,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_6_Automate_Monthly_Interest_Accrual_Processing",
      "topic": "Domain handling Automate_Monthly_Interest_Accrual_Processing",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 6,
      "description": "This business cut represents the automate monthly interest accrual processing functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from ACCOUNT-FILE, DISCGRP-FILE, and 3 other reference tables. This data architecture supports critical business functions including data management, processing, and reporting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 1,
      "table_count": 5,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_7_Manage_Customer_Record_Retrieval_and_Display",
      "topic": "Domain handling Manage_Customer_Record_Retrieval_and_Display",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 7,
      "description": "This business cut represents the manage customer record retrieval and display functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from CUSTFILE-FILE. This data architecture supports critical business functions including customer onboarding while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 1,
      "table_count": 1,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_8_Execute_Comprehensive_Export_for_Financial_Data",
      "topic": "Domain handling Execute_Comprehensive_Export_for_Financial_Data",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 8,
      "description": "This business cut represents the execute comprehensive export for financial data functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from ACCOUNT-INPUT, CARD-INPUT, and 4 other reference tables. This data architecture supports critical business functions including data management, processing, and reporting while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 1,
      "table_count": 6,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    },
    {
      "cluster_id": "Cut_9_Process_and_Import_Customer_Data_Records",
      "topic": "Domain handling Process_and_Import_Customer_Data_Records",
      "type": "READ_ONLY_CUT",
      "cut_seq_no": 9,
      "description": "This business cut represents the process and import customer data records functionality within the system. \n\nThe system operates through batch processing flows and backend operations.\n\nThe system reads from reference data to support its operations. The application maintains referential integrity by reading from ACCOUNT-OUTPUT, CARD-OUTPUT, and 5 other reference tables. This data architecture supports critical business functions including customer onboarding while ensuring data consistency and audit trail maintenance across all operations.",
      "flow_count": 1,
      "screen_count": 0,
      "program_count": 1,
      "table_count": 7,
      "sub_cut_count": 1,
      "sub_cuts": [
        {
          "sub_cut_type": "SUPPORT_LOGIC",
          "sub_cut_topic": "Read-Only and Logic Flows",
          "sub_cut_seq_no": 1,
          "sub_cut_id": "SubCut_LOGIC_AND_READS"
        }
      ],
      "dependencies": {
        "reads_from_cuts": []
      }
    }
  ]
}
