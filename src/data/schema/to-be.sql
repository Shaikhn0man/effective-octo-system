CREATE TYPE "account_status" AS ENUM (
  'Y',
  'N'
);

CREATE TYPE "card_status" AS ENUM (
  'Y',
  'N'
);

CREATE TYPE "user_type" AS ENUM (
  'A',
  'U'
);

CREATE TABLE "Customer" (
  "cust_id" numeric(9) PRIMARY KEY NOT NULL,
  "first_name" varchar(25),
  "middle_name" varchar(25),
  "last_name" varchar(25),
  "address_line_1" varchar(50),
  "address_line_2" varchar(50),
  "address_line_3" varchar(50),
  "state_code" varchar(2),
  "country_code" varchar(3),
  "zip_code" varchar(10),
  "phone_number_1" varchar(15),
  "phone_number_2" varchar(15),
  "ssn" numeric(9),
  "govt_issued_id" varchar(20),
  "date_of_birth" date,
  "eft_account_id" varchar(10),
  "primary_card_holder_ind" varchar(1),
  "fico_credit_score" numeric(3)
);

CREATE TABLE "Account" (
  "acct_id" numeric(11) PRIMARY KEY NOT NULL,
  "active_status" varchar(1),
  "current_balance" decimal(12,2),
  "credit_limit" decimal(12,2),
  "cash_credit_limit" decimal(12,2),
  "open_date" date,
  "expiration_date" date,
  "reissue_date" date,
  "current_cycle_credit" decimal(12,2),
  "current_cycle_debit" decimal(12,2),
  "zip_code" varchar(10),
  "group_id" varchar(10)
);

CREATE TABLE "Card" (
  "card_number" varchar(16) PRIMARY KEY NOT NULL,
  "acct_id" numeric(11) NOT NULL,
  "cvv_code" numeric(3),
  "embossed_name" varchar(50),
  "expiration_date" date,
  "active_status" varchar(1)
);

CREATE TABLE "CardXref" (
  "card_number" varchar(16) PRIMARY KEY NOT NULL,
  "cust_id" numeric(9) NOT NULL,
  "acct_id" numeric(11) NOT NULL
);

CREATE TABLE "Transaction" (
  "tran_id" varchar(16) PRIMARY KEY NOT NULL,
  "tran_type_code" varchar(2) NOT NULL,
  "tran_category_code" numeric(4),
  "tran_source" varchar(10),
  "tran_desc" varchar(100),
  "tran_amount" decimal(11,2),
  "merchant_id" numeric(9),
  "merchant_name" varchar(50),
  "merchant_city" varchar(50),
  "merchant_zip" varchar(10),
  "card_number" varchar(16),
  "orig_timestamp" timestamp,
  "proc_timestamp" timestamp
);

CREATE TABLE "TransactionType" (
  "tran_type" varchar(2) PRIMARY KEY NOT NULL,
  "tran_type_desc" varchar(50)
);

CREATE TABLE "TransactionCategory" (
  "tran_type_code" varchar(2) NOT NULL,
  "tran_cat_code" numeric(4) NOT NULL,
  "tran_cat_type_desc" varchar(50),
  PRIMARY KEY ("tran_type_code", "tran_cat_code")
);

CREATE TABLE "TransactionCategoryBalance" (
  "acct_id" numeric(11) NOT NULL,
  "tran_type_code" varchar(2) NOT NULL,
  "tran_cat_code" numeric(4) NOT NULL,
  "tran_cat_balance" decimal(11,2),
  PRIMARY KEY ("acct_id", "tran_type_code", "tran_cat_code")
);

CREATE TABLE "DisclosureGroup" (
  "group_id" varchar(10) NOT NULL,
  "tran_type_code" varchar(2) NOT NULL,
  "tran_cat_code" numeric(4) NOT NULL,
  "interest_rate" decimal(6,2),
  PRIMARY KEY ("group_id", "tran_type_code", "tran_cat_code")
);

CREATE TABLE "SecurityUser" (
  "user_id" varchar(8) PRIMARY KEY NOT NULL,
  "first_name" varchar(20),
  "last_name" varchar(20),
  "password" varchar(8),
  "user_type" varchar(1)
);

CREATE INDEX "idx_account_group_id" ON "Account" ("group_id");

CREATE INDEX "idx_card_acct_id" ON "Card" ("acct_id");

CREATE INDEX "idx_cardxref_acct_id" ON "CardXref" ("acct_id");

CREATE INDEX "idx_cardxref_cust_id" ON "CardXref" ("cust_id");

CREATE INDEX "idx_tran_proc_ts" ON "Transaction" ("proc_timestamp");

CREATE INDEX "idx_tran_card_num" ON "Transaction" ("card_number");

CREATE INDEX "idx_tran_type" ON "Transaction" ("tran_type_code");

CREATE INDEX "idx_tran_category" ON "Transaction" ("tran_type_code", "tran_category_code");

CREATE INDEX "idx_trancat_type" ON "TransactionCategory" ("tran_type_code");

CREATE INDEX "idx_tcatbal_acct" ON "TransactionCategoryBalance" ("acct_id");

CREATE INDEX "idx_tcatbal_category" ON "TransactionCategoryBalance" ("tran_type_code", "tran_cat_code");

CREATE INDEX "idx_discgrp_category" ON "DisclosureGroup" ("tran_type_code", "tran_cat_code");

COMMENT ON TABLE "Customer" IS 'Customer master data from VSAM KSDS: CUSTDATA.VSAM.KSDS
Source copybook: CVCUS01Y.cpy / CUSTREC.cpy
Record length: 500 bytes
Key: CUST-ID (position 0, length 9)
';

COMMENT ON COLUMN "Customer"."cust_id" IS 'CUST-ID PIC 9(09)';

COMMENT ON COLUMN "Customer"."first_name" IS 'CUST-FIRST-NAME';

COMMENT ON COLUMN "Customer"."middle_name" IS 'CUST-MIDDLE-NAME';

COMMENT ON COLUMN "Customer"."last_name" IS 'CUST-LAST-NAME';

COMMENT ON COLUMN "Customer"."ssn" IS 'Sensitive - requires encryption';

COMMENT ON COLUMN "Customer"."govt_issued_id" IS 'Sensitive';

COMMENT ON COLUMN "Customer"."date_of_birth" IS 'CUST-DOB-YYYY-MM-DD';

COMMENT ON COLUMN "Customer"."primary_card_holder_ind" IS 'Y/N indicator';

COMMENT ON TABLE "Account" IS 'Account/Credit card account master data
Source VSAM KSDS: ACCTDATA.VSAM.KSDS
Source copybook: CVACT01Y.cpy
Record length: 300 bytes
Key: ACCT-ID (position 0, length 11)
';

COMMENT ON COLUMN "Account"."acct_id" IS 'ACCT-ID PIC 9(11)';

COMMENT ON COLUMN "Account"."active_status" IS 'Y/N';

COMMENT ON COLUMN "Account"."current_balance" IS 'PIC S9(10)V99';

COMMENT ON COLUMN "Account"."group_id" IS 'FK to DisclosureGroup';

COMMENT ON TABLE "Card" IS 'Credit card physical card data
Source VSAM KSDS: CARDDATA.VSAM.KSDS
Source copybook: CVACT02Y.cpy / CVCRD01Y.cpy
Record length: 150 bytes
Primary Key: CARD-NUM (position 0, length 16)
Alternate Index: CARD-ACCT-ID (position 16, length 11)
';

COMMENT ON COLUMN "Card"."card_number" IS 'CARD-NUM - Sensitive PCI data';

COMMENT ON COLUMN "Card"."acct_id" IS 'FK to Account';

COMMENT ON COLUMN "Card"."cvv_code" IS 'Sensitive - PCI';

COMMENT ON COLUMN "Card"."active_status" IS 'Y/N';

COMMENT ON TABLE "CardXref" IS 'Cross-reference junction table linking cards, customers, and accounts
Enables many-to-many relationships:
- A customer can have multiple cards
- A card can have multiple authorized users (customers)
- An account can have multiple cards and customers

Source VSAM KSDS: CARDXREF.VSAM.KSDS
Source copybook: CVACT03Y.cpy
Record length: 50 bytes
Primary Key: XREF-CARD-NUM (position 0, length 16)
Alternate Index: XREF-ACCT-ID (position 25, length 11)
';

COMMENT ON COLUMN "CardXref"."card_number" IS 'XREF-CARD-NUM';

COMMENT ON COLUMN "CardXref"."cust_id" IS 'FK to Customer';

COMMENT ON COLUMN "CardXref"."acct_id" IS 'FK to Account';

COMMENT ON TABLE "Transaction" IS 'Transaction records - credit card transaction details
Source VSAM KSDS: TRANSACT.VSAM.KSDS
Source copybook: CVTRA05Y.cpy
Record length: 350 bytes
Primary Key: TRAN-ID (position 0, length 16)
Alternate Index: TRAN-PROC-TS (position 304, length 26)
';

COMMENT ON COLUMN "Transaction"."tran_id" IS 'TRAN-ID';

COMMENT ON COLUMN "Transaction"."tran_type_code" IS 'FK to TransactionType';

COMMENT ON COLUMN "Transaction"."tran_category_code" IS 'FK to TransactionCategory';

COMMENT ON COLUMN "Transaction"."tran_amount" IS 'PIC S9(09)V99';

COMMENT ON COLUMN "Transaction"."card_number" IS 'FK to Card';

COMMENT ON COLUMN "Transaction"."orig_timestamp" IS 'Transaction origination';

COMMENT ON COLUMN "Transaction"."proc_timestamp" IS 'Transaction processing - indexed';

COMMENT ON TABLE "TransactionType" IS 'Transaction type lookup table
Examples: DB=Debit, CR=Credit, etc.
Source VSAM KSDS: TRANTYPE.VSAM.KSDS
Source copybook: CVTRA03Y.cpy
Record length: 60 bytes
Key: TRAN-TYPE (position 0, length 2)
';

COMMENT ON COLUMN "TransactionType"."tran_type" IS 'TRAN-TYPE';

COMMENT ON TABLE "TransactionCategory" IS 'Transaction category lookup table
Hierarchical: Type -> Category
Examples: Purchase categories, fee types, etc.
Source VSAM KSDS: TRANCATG.VSAM.KSDS
Source copybook: CVTRA04Y.cpy
Record length: 60 bytes
Composite Key: TRAN-TYPE-CD + TRAN-CAT-CD (position 0, length 6)
';

COMMENT ON COLUMN "TransactionCategory"."tran_type_code" IS 'TRAN-TYPE-CD';

COMMENT ON COLUMN "TransactionCategory"."tran_cat_code" IS 'TRAN-CAT-CD';

COMMENT ON TABLE "TransactionCategoryBalance" IS 'Transaction category balance per account
Tracks balance breakdown by transaction category for each account
Source VSAM KSDS: TCATBALF.VSAM.KSDS
Source copybook: CVTRA01Y.cpy
Record length: 50 bytes
Composite Key: TRANCAT-ACCT-ID + TRANCAT-TYPE-CD + TRANCAT-CD (17 bytes)
';

COMMENT ON COLUMN "TransactionCategoryBalance"."acct_id" IS 'TRANCAT-ACCT-ID';

COMMENT ON COLUMN "TransactionCategoryBalance"."tran_type_code" IS 'TRANCAT-TYPE-CD';

COMMENT ON COLUMN "TransactionCategoryBalance"."tran_cat_code" IS 'TRANCAT-CD';

COMMENT ON COLUMN "TransactionCategoryBalance"."tran_cat_balance" IS 'PIC S9(09)V99';

COMMENT ON TABLE "DisclosureGroup" IS 'Disclosure group with interest rate information
Defines interest rates per account group and transaction category
Used for statement disclosures and interest calculations
Source VSAM KSDS: DISCGRP.VSAM.KSDS
Source copybook: CVTRA02Y.cpy
Record length: 50 bytes
Composite Key: DIS-ACCT-GROUP-ID + DIS-TRAN-TYPE-CD + DIS-TRAN-CAT-CD (16 bytes)
';

COMMENT ON COLUMN "DisclosureGroup"."group_id" IS 'DIS-ACCT-GROUP-ID';

COMMENT ON COLUMN "DisclosureGroup"."tran_type_code" IS 'DIS-TRAN-TYPE-CD';

COMMENT ON COLUMN "DisclosureGroup"."tran_cat_code" IS 'DIS-TRAN-CAT-CD';

COMMENT ON COLUMN "DisclosureGroup"."interest_rate" IS 'PIC S9(04)V99';

COMMENT ON TABLE "SecurityUser" IS 'System user security and authentication
Source VSAM KSDS: USRSEC.VSAM.KSDS
Source copybook: CSUSR01Y.cpy
Record length: 80 bytes
Key: SEC-USR-ID (position 0, length 8)

MIGRATION NOTE: Passwords must be hashed (bcrypt/PBKDF2)
';

COMMENT ON COLUMN "SecurityUser"."user_id" IS 'SEC-USR-ID';

COMMENT ON COLUMN "SecurityUser"."password" IS 'Sensitive - hash required';

COMMENT ON COLUMN "SecurityUser"."user_type" IS 'A=Admin, U=User';

ALTER TABLE "Card" ADD FOREIGN KEY ("acct_id") REFERENCES "Account" ("acct_id");

ALTER TABLE "CardXref" ADD FOREIGN KEY ("card_number") REFERENCES "Card" ("card_number");

ALTER TABLE "CardXref" ADD FOREIGN KEY ("cust_id") REFERENCES "Customer" ("cust_id");

ALTER TABLE "CardXref" ADD FOREIGN KEY ("acct_id") REFERENCES "Account" ("acct_id");

ALTER TABLE "Transaction" ADD FOREIGN KEY ("card_number") REFERENCES "Card" ("card_number");

ALTER TABLE "Transaction" ADD FOREIGN KEY ("tran_type_code") REFERENCES "TransactionType" ("tran_type");

ALTER TABLE "Transaction" ADD FOREIGN KEY ("tran_type_code", "tran_category_code") REFERENCES "TransactionCategory" ("tran_type_code", "tran_cat_code");

ALTER TABLE "TransactionCategory" ADD FOREIGN KEY ("tran_type_code") REFERENCES "TransactionType" ("tran_type");

ALTER TABLE "TransactionCategoryBalance" ADD FOREIGN KEY ("acct_id") REFERENCES "Account" ("acct_id");

ALTER TABLE "TransactionCategoryBalance" ADD FOREIGN KEY ("tran_type_code", "tran_cat_code") REFERENCES "TransactionCategory" ("tran_type_code", "tran_cat_code");

ALTER TABLE "Account" ADD FOREIGN KEY ("group_id") REFERENCES "DisclosureGroup" ("group_id");

ALTER TABLE "DisclosureGroup" ADD FOREIGN KEY ("tran_type_code") REFERENCES "TransactionType" ("tran_type");

ALTER TABLE "DisclosureGroup" ADD FOREIGN KEY ("tran_type_code", "tran_cat_code") REFERENCES "TransactionCategory" ("tran_type_code", "tran_cat_code");
