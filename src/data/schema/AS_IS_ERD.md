# AS-IS Entity Relationship Diagram (CardDemo Legacy)

Derived from COBOL copybooks and FD definitions in the codebase.
Entity and attribute names match legacy structures (CUSTOMER-RECORD, ACCOUNT-RECORD, CARD-XREF-RECORD, TRAN-RECORD, etc.).

**System Architecture:** COBOL/CICS application with VSAM (Virtual Storage Access Method) data stores
- **VSAM Type:** KSDS (Key-Sequenced Data Sets) with alternate indexes
- **Record Format:** Fixed-length records with COBOL PIC clauses
- **Key Files:** CUSTDATA, ACCTDATA, CARDDATA, CARDXREF, TRANSACT, TRANTYPE, TRANCATG, TCATBALF, DISCGRP, USRSEC

```mermaid
erDiagram
    CUSTOMER {
        decimal CUST_ID PK "9(09)"
        string CUST_FIRST_NAME "X(25)"
        string CUST_MIDDLE_NAME "X(25)"
        string CUST_LAST_NAME "X(25)"
        string CUST_ADDR_LINE_1 "X(50)"
        string CUST_ADDR_LINE_2 "X(50)"
        string CUST_ADDR_LINE_3 "X(50)"
        string CUST_ADDR_STATE_CD "X(02)"
        string CUST_ADDR_COUNTRY_CD "X(03)"
        string CUST_ADDR_ZIP "X(10)"
        string CUST_PHONE_NUM_1 "X(15)"
        string CUST_PHONE_NUM_2 "X(15)"
        string CUST_SSN "9(09)"
        string CUST_GOVT_ISSUED_ID "X(20)"
        string CUST_DOB_YYYY_MM_DD "X(10)"
        string CUST_EFT_ACCOUNT_ID "X(10)"
        string CUST_PRI_CARD_HOLDER_IND "X(01)"
        decimal CUST_FICO_CREDIT_SCORE "9(03)"
    }

    ACCOUNT {
        decimal ACCT_ID PK "9(11)"
        string ACCT_ACTIVE_STATUS "X(01)"
        decimal ACCT_CURR_BAL "S9(10)V99"
        decimal ACCT_CREDIT_LIMIT "S9(10)V99"
        decimal ACCT_CASH_CREDIT_LIMIT "S9(10)V99"
        string ACCT_OPEN_DATE "X(10)"
        string ACCT_EXPIRAION_DATE "X(10)"
        string ACCT_REISSUE_DATE "X(10)"
        decimal ACCT_CURR_CYC_CREDIT "S9(10)V99"
        decimal ACCT_CURR_CYC_DEBIT "S9(10)V99"
        string ACCT_ADDR_ZIP "X(10)"
        string ACCT_GROUP_ID "X(10)"
    }

    CARD {
        string CARD_NUM PK "X(16)"
        decimal CARD_ACCT_ID FK "9(11)"
        decimal CARD_CVV_CD "9(03)"
        string CARD_EMBOSSED_NAME "X(50)"
        string CARD_EXPIRAION_DATE "X(10)"
        string CARD_ACTIVE_STATUS "X(01)"
    }

    CARD_XREF {
        string XREF_CARD_NUM PK "X(16)"
        decimal XREF_CUST_ID FK "9(09)"
        decimal XREF_ACCT_ID FK "9(11)"
    }

    TRAN_TYPE {
        string TRAN_TYPE PK "X(02)"
        string TRAN_TYPE_DESC "X(50)"
    }

    TRAN_CAT {
        string TRAN_TYPE_CD PK_FK "X(02)"
        decimal TRAN_CAT_CD PK "9(04)"
        string TRAN_CAT_TYPE_DESC "X(50)"
    }

    TRAN {
        string TRAN_ID PK "X(16)"
        string TRAN_TYPE_CD FK "X(02)"
        decimal TRAN_CAT_CD "9(04)"
        string TRAN_SOURCE "X(10)"
        string TRAN_DESC "X(100)"
        decimal TRAN_AMT "S9(09)V99"
        decimal TRAN_MERCHANT_ID "9(09)"
        string TRAN_MERCHANT_NAME "X(50)"
        string TRAN_MERCHANT_CITY "X(50)"
        string TRAN_MERCHANT_ZIP "X(10)"
        string TRAN_CARD_NUM FK "X(16)"
        string TRAN_ORIG_TS "X(26)"
        string TRAN_PROC_TS "X(26)"
    }

    TRAN_CAT_BAL {
        decimal TRANCAT_ACCT_ID PK_FK "9(11)"
        string TRANCAT_TYPE_CD PK_FK "X(02)"
        decimal TRANCAT_CD PK "9(04)"
        decimal TRAN_CAT_BAL "S9(09)V99"
    }

    DISC_GROUP {
        string DIS_ACCT_GROUP_ID PK "X(10)"
        string DIS_TRAN_TYPE_CD PK_FK "X(02)"
        decimal DIS_TRAN_CAT_CD PK_FK "9(04)"
        decimal DIS_INT_RATE "S9(04)V99"
    }

    SEC_USER {
        string SEC_USR_ID PK "X(08)"
        string SEC_USR_FNAME "X(20)"
        string SEC_USR_LNAME "X(20)"
        string SEC_USR_PWD "X(08)"
        string SEC_USR_TYPE "X(01)"
    }

    CUSTOMER ||--o{ CARD_XREF : "XREF_CUST_ID"
    ACCOUNT ||--o{ CARD : "CARD_ACCT_ID"
    ACCOUNT ||--o{ CARD_XREF : "XREF_ACCT_ID"
    CARD ||--|| CARD_XREF : "CARD_NUM"
    CARD ||--o{ TRAN : "TRAN_CARD_NUM"
    ACCOUNT ||--o{ TRAN_CAT_BAL : "TRANCAT_ACCT_ID"
    TRAN_TYPE ||--o{ TRAN : "TRAN_TYPE_CD"
    TRAN_TYPE ||--o{ TRAN_CAT : "TRAN_TYPE_CD"
    TRAN_CAT ||--o{ TRAN : "TRAN_TYPE_CD TRAN_CAT_CD"
    TRAN_CAT ||--o{ TRAN_CAT_BAL : "TRANCAT_TYPE_CD TRANCAT_CD"
    TRAN_TYPE ||--o{ TRAN_CAT_BAL : "TRANCAT_TYPE_CD"
    TRAN_TYPE ||--o{ DISC_GROUP : "DIS_TRAN_TYPE_CD"
    TRAN_CAT ||--o{ DISC_GROUP : "DIS_TRAN_CAT_CD"
```

## Entity source (copybook / FD)

| Entity       | Legacy name(s)        | Copybook / file section |
|-------------|------------------------|--------------------------|
| CUSTOMER    | CUSTOMER-RECORD        | CVCUS01Y.cpy, CUSTREC.cpy |
| ACCOUNT     | ACCOUNT-RECORD, FD-ACCTFILE-REC | CVACT01Y.cpy, ACCOUNT-FILE |
| CARD        | CARD-RECORD, FD-CARDFILE-REC    | CVACT02Y.cpy, CVCRD01Y.cpy |
| CARD_XREF   | CARD-XREF-RECORD, FD-XREFFILE-REC | CVACT03Y.cpy, XREF-FILE |
| TRAN_TYPE   | TRAN-TYPE-RECORD, FD-TRANTYPE-REC | CVTRA03Y.cpy, TRANTYPE-FILE |
| TRAN_CAT    | TRAN-CAT-RECORD, FD-TRAN-CAT-RECORD | CVTRA04Y.cpy, TRANCATG-FILE |
| TRAN        | TRAN-RECORD, FD-TRANFILE-REC    | CVTRA05Y.cpy, TRANSACT-FILE |
| TRAN_CAT_BAL| TRAN-CAT-BAL-RECORD, FD-TRAN-CAT-BAL-RECORD | CVTRA01Y.cpy, TCATBAL-FILE |
| DISC_GROUP  | DIS-GROUP-RECORD, FD-DISCGRP-REC | CVTRA02Y.cpy, DISCGRP-FILE |
| SEC_USER    | SEC-USER-DATA          | CSUSR01Y.cpy            |

## VSAM File Specifications

| Entity       | VSAM File                           | Record Length | Primary Key | AIX (Alternate Index) |
|-------------|-------------------------------------|---------------|-------------|----------------------|
| CUSTOMER    | CUSTDATA.VSAM.KSDS                  | 500 bytes     | CUST-ID (9 bytes, pos 0) | None |
| ACCOUNT     | ACCTDATA.VSAM.KSDS                  | 300 bytes     | ACCT-ID (11 bytes, pos 0) | None |
| CARD        | CARDDATA.VSAM.KSDS                  | 150 bytes     | CARD-NUM (16 bytes, pos 0) | CARD-ACCT-ID (11 bytes, pos 16) |
| CARD_XREF   | CARDXREF.VSAM.KSDS                  | 50 bytes      | XREF-CARD-NUM (16 bytes, pos 0) | XREF-ACCT-ID (11 bytes, pos 25) |
| TRAN_TYPE   | TRANTYPE.VSAM.KSDS                  | 60 bytes      | TRAN-TYPE (2 bytes, pos 0) | None |
| TRAN_CAT    | TRANCATG.VSAM.KSDS                  | 60 bytes      | TRAN-TYPE-CD + TRAN-CAT-CD (6 bytes, pos 0) | None |
| TRAN        | TRANSACT.VSAM.KSDS                  | 350 bytes     | TRAN-ID (16 bytes, pos 0) | TRAN-PROC-TS (26 bytes, pos 304) |
| TRAN_CAT_BAL| TCATBALF.VSAM.KSDS                  | 50 bytes      | Composite key (17 bytes, pos 0) | None |
| DISC_GROUP  | DISCGRP.VSAM.KSDS                   | 50 bytes      | Composite key (16 bytes, pos 0) | None |
| SEC_USER    | USRSEC.VSAM.KSDS                    | 80 bytes      | SEC-USR-ID (8 bytes, pos 0) | None |

## Key relationships (AS-IS)

- **CUSTOMER – CARD_XREF**: One customer to many xref rows (one customer can have many card/account links). Key: XREF-CUST-ID.
- **ACCOUNT – CARD**: One account to many cards. Key: CARD-ACCT-ID.
- **ACCOUNT – CARD_XREF**: One account to many xref rows. Key: XREF-ACCT-ID.
- **CARD – CARD_XREF**: One-to-one by card number (XREF-CARD-NUM = CARD-NUM).
- **CARD – TRAN**: One card to many transactions. Key: TRAN-CARD-NUM.
- **ACCOUNT – TRAN_CAT_BAL**: One account to many category balances. Composite key: TRANCAT-ACCT-ID, TRANCAT-TYPE-CD, TRANCAT-CD.
- **TRAN_TYPE – TRAN**: Transaction type code. TRAN-TYPE-CD → TRAN-TYPE.
- **TRAN_TYPE – TRAN_CAT**: Category header. TRAN-TYPE-CD in TRAN_CAT → TRAN-TYPE.
- **TRAN_CAT – TRAN**: Transaction category. (TRAN-TYPE-CD, TRAN-CAT-CD) in TRAN.
- **TRAN_CAT – TRAN_CAT_BAL**: Category balance. (TRANCAT-TYPE-CD, TRANCAT-CD) in TRAN_CAT_BAL.
- **TRAN_TYPE / TRAN_CAT – DISC_GROUP**: Disclosure/interest by group and type/category. DIS-ACCT-GROUP-ID, DIS-TRAN-TYPE-CD, DIS-TRAN-CAT-CD (ACCOUNT.ACCT-GROUP-ID links account to group).

## Batch / transient files (not separate entities)

- **DALYTRAN-FILE**: Input transaction records (FD-TRAN-RECORD); structure aligns with TRAN + customer data; not a separate entity in the ERD.
- **DALYREJS-FILE**: Rejected transaction records; derived from TRAN validation.
- **DATE-PARMS-FILE**, **REPORT-FILE**: Run/report control and output; not entities.
- **EXPORT-RECORD** (CVEXPORT.cpy): Multi-type export format (customer/account/xref/transaction/card); logical view over the above entities, not an additional entity.
