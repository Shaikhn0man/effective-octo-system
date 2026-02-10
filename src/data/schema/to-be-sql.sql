-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Account (
  acct_id numeric NOT NULL,
  active_status character varying,
  current_balance numeric,
  credit_limit numeric,
  cash_credit_limit numeric,
  open_date date,
  expiration_date date,
  reissue_date date,
  current_cycle_credit numeric,
  current_cycle_debit numeric,
  zip_code character varying,
  group_id character varying,
  CONSTRAINT Account_pkey PRIMARY KEY (acct_id)
);
CREATE TABLE public.Card (
  card_number character varying NOT NULL,
  acct_id numeric NOT NULL,
  cvv_code numeric,
  embossed_name character varying,
  expiration_date date,
  active_status character varying,
  CONSTRAINT Card_pkey PRIMARY KEY (card_number),
  CONSTRAINT Card_acct_id_fkey FOREIGN KEY (acct_id) REFERENCES public.Account(acct_id)
);
CREATE TABLE public.CardXref (
  card_number character varying NOT NULL,
  cust_id numeric NOT NULL,
  acct_id numeric NOT NULL,
  CONSTRAINT CardXref_pkey PRIMARY KEY (card_number),
  CONSTRAINT CardXref_card_number_fkey FOREIGN KEY (card_number) REFERENCES public.Card(card_number),
  CONSTRAINT CardXref_cust_id_fkey FOREIGN KEY (cust_id) REFERENCES public.Customer(cust_id),
  CONSTRAINT CardXref_acct_id_fkey FOREIGN KEY (acct_id) REFERENCES public.Account(acct_id)
);
CREATE TABLE public.Customer (
  cust_id numeric NOT NULL,
  first_name character varying,
  middle_name character varying,
  last_name character varying,
  address_line_1 character varying,
  address_line_2 character varying,
  address_line_3 character varying,
  state_code character varying,
  country_code character varying,
  zip_code character varying,
  phone_number_1 character varying,
  phone_number_2 character varying,
  ssn numeric,
  govt_issued_id character varying,
  date_of_birth date,
  eft_account_id character varying,
  primary_card_holder_ind character varying,
  fico_credit_score numeric,
  CONSTRAINT Customer_pkey PRIMARY KEY (cust_id)
);
CREATE TABLE public.DisclosureGroup (
  group_id character varying NOT NULL,
  tran_type_code character varying NOT NULL,
  tran_cat_code numeric NOT NULL,
  interest_rate numeric,
  CONSTRAINT DisclosureGroup_pkey PRIMARY KEY (group_id, tran_type_code, tran_cat_code),
  CONSTRAINT DisclosureGroup_tran_type_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionType(tran_type),
  CONSTRAINT DisclosureGroup_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionCategory(tran_type_code),
  CONSTRAINT DisclosureGroup_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_cat_code) REFERENCES public.TransactionCategory(tran_type_code),
  CONSTRAINT DisclosureGroup_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionCategory(tran_cat_code),
  CONSTRAINT DisclosureGroup_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_cat_code) REFERENCES public.TransactionCategory(tran_cat_code)
);
CREATE TABLE public.SecurityUser (
  user_id character varying NOT NULL,
  first_name character varying,
  last_name character varying,
  password character varying,
  user_type character varying,
  CONSTRAINT SecurityUser_pkey PRIMARY KEY (user_id)
);
CREATE TABLE public.Transaction (
  tran_id character varying NOT NULL,
  tran_type_code character varying NOT NULL,
  tran_category_code numeric,
  tran_source character varying,
  tran_desc character varying,
  tran_amount numeric,
  merchant_id numeric,
  merchant_name character varying,
  merchant_city character varying,
  merchant_zip character varying,
  card_number character varying,
  orig_timestamp timestamp without time zone,
  proc_timestamp timestamp without time zone,
  CONSTRAINT Transaction_pkey PRIMARY KEY (tran_id),
  CONSTRAINT Transaction_card_number_fkey FOREIGN KEY (card_number) REFERENCES public.Card(card_number),
  CONSTRAINT Transaction_tran_type_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionType(tran_type),
  CONSTRAINT Transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionCategory(tran_type_code),
  CONSTRAINT Transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_category_code) REFERENCES public.TransactionCategory(tran_type_code),
  CONSTRAINT Transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionCategory(tran_cat_code),
  CONSTRAINT Transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_category_code) REFERENCES public.TransactionCategory(tran_cat_code)
);
CREATE TABLE public.TransactionCategory (
  tran_type_code character varying NOT NULL,
  tran_cat_code numeric NOT NULL,
  tran_cat_type_desc character varying,
  CONSTRAINT TransactionCategory_pkey PRIMARY KEY (tran_type_code, tran_cat_code),
  CONSTRAINT TransactionCategory_tran_type_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionType(tran_type)
);
CREATE TABLE public.TransactionCategoryBalance (
  acct_id numeric NOT NULL,
  tran_type_code character varying NOT NULL,
  tran_cat_code numeric NOT NULL,
  tran_cat_balance numeric,
  CONSTRAINT TransactionCategoryBalance_pkey PRIMARY KEY (acct_id, tran_type_code, tran_cat_code),
  CONSTRAINT TransactionCategoryBalance_acct_id_fkey FOREIGN KEY (acct_id) REFERENCES public.Account(acct_id),
  CONSTRAINT TransactionCategoryBalance_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionCategory(tran_type_code),
  CONSTRAINT TransactionCategoryBalance_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_cat_code) REFERENCES public.TransactionCategory(tran_type_code),
  CONSTRAINT TransactionCategoryBalance_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.TransactionCategory(tran_cat_code),
  CONSTRAINT TransactionCategoryBalance_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_cat_code) REFERENCES public.TransactionCategory(tran_cat_code)
);
CREATE TABLE public.TransactionType (
  tran_type character varying NOT NULL,
  tran_type_desc character varying,
  CONSTRAINT TransactionType_pkey PRIMARY KEY (tran_type)
);
CREATE TABLE public.account (
  acct_id numeric NOT NULL,
  active_status character varying CHECK (active_status::text = ANY (ARRAY['Y'::character varying, 'N'::character varying]::text[])),
  current_balance numeric,
  credit_limit numeric,
  cash_credit_limit numeric,
  open_date date,
  expiration_date date,
  reissue_date date,
  current_cycle_credit numeric,
  current_cycle_debit numeric,
  zip_code character varying,
  group_id character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT account_pkey PRIMARY KEY (acct_id)
);
CREATE TABLE public.card (
  card_number character varying NOT NULL,
  acct_id numeric NOT NULL,
  cvv_code numeric,
  embossed_name character varying,
  expiration_date date,
  active_status character varying CHECK (active_status::text = ANY (ARRAY['Y'::character varying, 'N'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT card_pkey PRIMARY KEY (card_number),
  CONSTRAINT card_acct_id_fkey FOREIGN KEY (acct_id) REFERENCES public.account(acct_id)
);
CREATE TABLE public.card_xref (
  card_number character varying NOT NULL,
  cust_id numeric NOT NULL,
  acct_id numeric NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT card_xref_pkey PRIMARY KEY (card_number),
  CONSTRAINT card_xref_card_number_fkey FOREIGN KEY (card_number) REFERENCES public.card(card_number),
  CONSTRAINT card_xref_cust_id_fkey FOREIGN KEY (cust_id) REFERENCES public.customer(cust_id),
  CONSTRAINT card_xref_acct_id_fkey FOREIGN KEY (acct_id) REFERENCES public.account(acct_id)
);
CREATE TABLE public.customer (
  cust_id numeric NOT NULL,
  first_name character varying,
  middle_name character varying,
  last_name character varying,
  address_line_1 character varying,
  address_line_2 character varying,
  address_line_3 character varying,
  state_code character varying,
  country_code character varying DEFAULT 'USA'::character varying,
  zip_code character varying,
  phone_number_1 character varying,
  phone_number_2 character varying,
  ssn numeric,
  govt_issued_id character varying,
  date_of_birth date,
  eft_account_id character varying,
  primary_card_holder_ind character varying CHECK (primary_card_holder_ind::text = ANY (ARRAY['Y'::character varying, 'N'::character varying]::text[])),
  fico_credit_score numeric,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT customer_pkey PRIMARY KEY (cust_id)
);
CREATE TABLE public.daily_transaction (
  tran_id character varying NOT NULL,
  tran_type_code character varying,
  tran_category_code numeric,
  tran_source character varying,
  tran_desc character varying,
  tran_amount numeric,
  merchant_id numeric,
  merchant_name character varying,
  merchant_city character varying,
  merchant_zip character varying,
  card_number character varying,
  orig_timestamp timestamp without time zone,
  proc_timestamp timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT daily_transaction_pkey PRIMARY KEY (tran_id),
  CONSTRAINT daily_transaction_card_number_fkey FOREIGN KEY (card_number) REFERENCES public.card(card_number),
  CONSTRAINT daily_transaction_tran_type_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_type(tran_type),
  CONSTRAINT daily_transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_category(tran_type_code),
  CONSTRAINT daily_transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_category_code) REFERENCES public.transaction_category(tran_type_code),
  CONSTRAINT daily_transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_category(tran_cat_code),
  CONSTRAINT daily_transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_category_code) REFERENCES public.transaction_category(tran_cat_code)
);
CREATE TABLE public.disclosure_group (
  group_id character varying NOT NULL,
  tran_type_code character varying NOT NULL,
  tran_cat_code numeric NOT NULL,
  interest_rate numeric,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT disclosure_group_pkey PRIMARY KEY (group_id, tran_type_code, tran_cat_code),
  CONSTRAINT disclosure_group_tran_type_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_type(tran_type),
  CONSTRAINT disclosure_group_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_category(tran_type_code),
  CONSTRAINT disclosure_group_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_cat_code) REFERENCES public.transaction_category(tran_type_code),
  CONSTRAINT disclosure_group_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_category(tran_cat_code),
  CONSTRAINT disclosure_group_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_cat_code) REFERENCES public.transaction_category(tran_cat_code)
);
CREATE TABLE public.export_record (
  export_sequence_num numeric NOT NULL,
  export_rec_type character varying NOT NULL,
  export_timestamp timestamp without time zone NOT NULL,
  export_date date,
  export_time character varying,
  branch_id character varying,
  region_code character varying,
  record_data text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT export_record_pkey PRIMARY KEY (export_sequence_num)
);
CREATE TABLE public.pending_authorization (
  auth_date_key numeric NOT NULL,
  auth_time_key numeric NOT NULL,
  auth_orig_date character varying,
  auth_orig_time character varying,
  card_number character varying NOT NULL,
  auth_type character varying,
  card_expiry_date character varying,
  message_type character varying,
  message_source character varying,
  auth_id_code character varying,
  auth_resp_code character varying,
  auth_resp_reason character varying,
  processing_code numeric,
  transaction_amt numeric,
  approved_amt numeric,
  merchant_category_code character varying,
  acquirer_country_code character varying,
  pos_entry_mode numeric,
  merchant_id character varying,
  merchant_name character varying,
  merchant_city character varying,
  merchant_state character varying,
  merchant_zip character varying,
  transaction_id character varying,
  match_status character varying CHECK (match_status::text = ANY (ARRAY['P'::character varying, 'D'::character varying, 'E'::character varying, 'M'::character varying]::text[])),
  auth_fraud character varying CHECK (auth_fraud::text = ANY (ARRAY['F'::character varying, 'R'::character varying, ' '::character varying]::text[])),
  fraud_report_date character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pending_authorization_pkey PRIMARY KEY (auth_date_key, auth_time_key),
  CONSTRAINT pending_authorization_card_number_fkey FOREIGN KEY (card_number) REFERENCES public.card(card_number)
);
CREATE TABLE public.pending_authorization_summary (
  acct_id numeric NOT NULL,
  cust_id numeric,
  auth_status character varying,
  account_status_1 character varying,
  account_status_2 character varying,
  account_status_3 character varying,
  account_status_4 character varying,
  account_status_5 character varying,
  credit_limit numeric,
  cash_limit numeric,
  credit_balance numeric,
  cash_balance numeric,
  approved_auth_count numeric,
  declined_auth_count numeric,
  approved_auth_amt numeric,
  declined_auth_amt numeric,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pending_authorization_summary_pkey PRIMARY KEY (acct_id),
  CONSTRAINT pending_authorization_summary_acct_id_fkey FOREIGN KEY (acct_id) REFERENCES public.account(acct_id),
  CONSTRAINT pending_authorization_summary_cust_id_fkey FOREIGN KEY (cust_id) REFERENCES public.customer(cust_id)
);
CREATE TABLE public.security_user (
  user_id character varying NOT NULL,
  first_name character varying,
  last_name character varying,
  password character varying,
  user_type character varying CHECK (user_type::text = ANY (ARRAY['A'::character varying, 'U'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT security_user_pkey PRIMARY KEY (user_id)
);
CREATE TABLE public.transaction (
  tran_id character varying NOT NULL,
  tran_type_code character varying NOT NULL,
  tran_category_code numeric,
  tran_source character varying,
  tran_desc character varying,
  tran_amount numeric,
  merchant_id numeric,
  merchant_name character varying,
  merchant_city character varying,
  merchant_zip character varying,
  card_number character varying,
  orig_timestamp timestamp without time zone,
  proc_timestamp timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT transaction_pkey PRIMARY KEY (tran_id),
  CONSTRAINT transaction_card_number_fkey FOREIGN KEY (card_number) REFERENCES public.card(card_number),
  CONSTRAINT transaction_tran_type_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_type(tran_type),
  CONSTRAINT transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_category(tran_type_code),
  CONSTRAINT transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_category_code) REFERENCES public.transaction_category(tran_type_code),
  CONSTRAINT transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_category(tran_cat_code),
  CONSTRAINT transaction_tran_type_code_tran_category_code_fkey FOREIGN KEY (tran_category_code) REFERENCES public.transaction_category(tran_cat_code)
);
CREATE TABLE public.transaction_category (
  tran_type_code character varying NOT NULL,
  tran_cat_code numeric NOT NULL,
  tran_cat_type_desc character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT transaction_category_pkey PRIMARY KEY (tran_type_code, tran_cat_code),
  CONSTRAINT transaction_category_tran_type_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_type(tran_type)
);
CREATE TABLE public.transaction_category_balance (
  acct_id numeric NOT NULL,
  tran_type_code character varying NOT NULL,
  tran_cat_code numeric NOT NULL,
  tran_cat_balance numeric,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT transaction_category_balance_pkey PRIMARY KEY (acct_id, tran_type_code, tran_cat_code),
  CONSTRAINT transaction_category_balance_acct_id_fkey FOREIGN KEY (acct_id) REFERENCES public.account(acct_id),
  CONSTRAINT transaction_category_balance_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_category(tran_type_code),
  CONSTRAINT transaction_category_balance_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_cat_code) REFERENCES public.transaction_category(tran_type_code),
  CONSTRAINT transaction_category_balance_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_type_code) REFERENCES public.transaction_category(tran_cat_code),
  CONSTRAINT transaction_category_balance_tran_type_code_tran_cat_code_fkey FOREIGN KEY (tran_cat_code) REFERENCES public.transaction_category(tran_cat_code)
);
CREATE TABLE public.transaction_type (
  tran_type character varying NOT NULL,
  tran_type_desc character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT transaction_type_pkey PRIMARY KEY (tran_type)
);