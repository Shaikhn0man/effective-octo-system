-- ===================================================================
-- CardDemo Application - Supabase/PostgreSQL Database Schema
-- Generated from COBOL/VSAM to-be schema
-- Last Updated: 2026-02-05
-- ===================================================================
-- This script creates tables and inserts realistic synthetic data
-- for the CardDemo credit card management system
-- ===================================================================

-- ===================================================================
-- DROP TABLES (in reverse dependency order)
-- ===================================================================

DROP TABLE IF EXISTS export_record CASCADE;
DROP TABLE IF EXISTS pending_authorization_summary CASCADE;
DROP TABLE IF EXISTS pending_authorization CASCADE;
DROP TABLE IF EXISTS daily_transaction CASCADE;
DROP TABLE IF EXISTS transaction_category_balance CASCADE;
DROP TABLE IF EXISTS transaction CASCADE;
DROP TABLE IF EXISTS transaction_category CASCADE;
DROP TABLE IF EXISTS transaction_type CASCADE;
DROP TABLE IF EXISTS disclosure_group CASCADE;
DROP TABLE IF EXISTS card_xref CASCADE;
DROP TABLE IF EXISTS card CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS security_user CASCADE;

-- ===================================================================
-- CREATE TABLES
-- ===================================================================

-- Security User Table
CREATE TABLE security_user (
    user_id VARCHAR(8) PRIMARY KEY,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    password VARCHAR(255), -- Extended for hashed passwords
    user_type VARCHAR(1) CHECK (user_type IN ('A', 'U')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE security_user IS 'System user security and authentication';
COMMENT ON COLUMN security_user.password IS 'Hashed password (bcrypt/PBKDF2)';
COMMENT ON COLUMN security_user.user_type IS 'A=Admin, U=User';

-- Customer Table
CREATE TABLE customer (
    cust_id NUMERIC(9) PRIMARY KEY,
    first_name VARCHAR(25),
    middle_name VARCHAR(25),
    last_name VARCHAR(25),
    address_line_1 VARCHAR(50),
    address_line_2 VARCHAR(50),
    address_line_3 VARCHAR(50),
    state_code VARCHAR(2),
    country_code VARCHAR(3) DEFAULT 'USA',
    zip_code VARCHAR(10),
    phone_number_1 VARCHAR(15),
    phone_number_2 VARCHAR(15),
    ssn NUMERIC(9), -- Sensitive - encrypt in production
    govt_issued_id VARCHAR(20),
    date_of_birth DATE,
    eft_account_id VARCHAR(10),
    primary_card_holder_ind VARCHAR(1) CHECK (primary_card_holder_ind IN ('Y', 'N')),
    fico_credit_score NUMERIC(3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE customer IS 'Customer master data';
COMMENT ON COLUMN customer.ssn IS 'Sensitive - requires encryption';

CREATE INDEX idx_customer_name ON customer(last_name, first_name);
CREATE INDEX idx_customer_zip ON customer(zip_code);

-- Account Table
CREATE TABLE account (
    acct_id NUMERIC(11) PRIMARY KEY,
    active_status VARCHAR(1) CHECK (active_status IN ('Y', 'N')),
    current_balance DECIMAL(12,2),
    credit_limit DECIMAL(12,2),
    cash_credit_limit DECIMAL(12,2),
    open_date DATE,
    expiration_date DATE,
    reissue_date DATE,
    current_cycle_credit DECIMAL(12,2),
    current_cycle_debit DECIMAL(12,2),
    zip_code VARCHAR(10),
    group_id VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE account IS 'Credit card account master data';

CREATE INDEX idx_account_group_id ON account(group_id);
CREATE INDEX idx_account_status ON account(active_status);

-- Card Table
CREATE TABLE card (
    card_number VARCHAR(16) PRIMARY KEY,
    acct_id NUMERIC(11) NOT NULL,
    cvv_code NUMERIC(3), -- Sensitive - PCI
    embossed_name VARCHAR(50),
    expiration_date DATE,
    active_status VARCHAR(1) CHECK (active_status IN ('Y', 'N')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (acct_id) REFERENCES account(acct_id)
);

COMMENT ON TABLE card IS 'Credit card physical card data';
COMMENT ON COLUMN card.card_number IS 'Sensitive PCI data';

CREATE INDEX idx_card_acct_id ON card(acct_id);
CREATE INDEX idx_card_status ON card(active_status);

-- Card Cross-Reference Table
CREATE TABLE card_xref (
    card_number VARCHAR(16) PRIMARY KEY,
    cust_id NUMERIC(9) NOT NULL,
    acct_id NUMERIC(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_number) REFERENCES card(card_number),
    FOREIGN KEY (cust_id) REFERENCES customer(cust_id),
    FOREIGN KEY (acct_id) REFERENCES account(acct_id)
);

COMMENT ON TABLE card_xref IS 'Junction table linking cards, customers, and accounts';

CREATE INDEX idx_cardxref_acct_id ON card_xref(acct_id);
CREATE INDEX idx_cardxref_cust_id ON card_xref(cust_id);

-- Transaction Type Table
CREATE TABLE transaction_type (
    tran_type VARCHAR(2) PRIMARY KEY,
    tran_type_desc VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE transaction_type IS 'Transaction type lookup table';

-- Transaction Category Table
CREATE TABLE transaction_category (
    tran_type_code VARCHAR(2) NOT NULL,
    tran_cat_code NUMERIC(4) NOT NULL,
    tran_cat_type_desc VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tran_type_code, tran_cat_code),
    FOREIGN KEY (tran_type_code) REFERENCES transaction_type(tran_type)
);

COMMENT ON TABLE transaction_category IS 'Transaction category lookup table';

CREATE INDEX idx_trancat_type ON transaction_category(tran_type_code);

-- Disclosure Group Table
CREATE TABLE disclosure_group (
    group_id VARCHAR(10) NOT NULL,
    tran_type_code VARCHAR(2) NOT NULL,
    tran_cat_code NUMERIC(4) NOT NULL,
    interest_rate DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, tran_type_code, tran_cat_code),
    FOREIGN KEY (tran_type_code) REFERENCES transaction_type(tran_type),
    FOREIGN KEY (tran_type_code, tran_cat_code) REFERENCES transaction_category(tran_type_code, tran_cat_code)
);

COMMENT ON TABLE disclosure_group IS 'Interest rates per account group and transaction category';

CREATE INDEX idx_discgrp_category ON disclosure_group(tran_type_code, tran_cat_code);

-- Transaction Table
CREATE TABLE transaction (
    tran_id VARCHAR(16) PRIMARY KEY,
    tran_type_code VARCHAR(2) NOT NULL,
    tran_category_code NUMERIC(4),
    tran_source VARCHAR(10),
    tran_desc VARCHAR(100),
    tran_amount DECIMAL(11,2),
    merchant_id NUMERIC(9),
    merchant_name VARCHAR(50),
    merchant_city VARCHAR(50),
    merchant_zip VARCHAR(10),
    card_number VARCHAR(16),
    orig_timestamp TIMESTAMP,
    proc_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_number) REFERENCES card(card_number),
    FOREIGN KEY (tran_type_code) REFERENCES transaction_type(tran_type),
    FOREIGN KEY (tran_type_code, tran_category_code) REFERENCES transaction_category(tran_type_code, tran_cat_code)
);

COMMENT ON TABLE transaction IS 'Transaction records - credit card transaction details';

CREATE INDEX idx_tran_proc_ts ON transaction(proc_timestamp);
CREATE INDEX idx_tran_card_num ON transaction(card_number);
CREATE INDEX idx_tran_type ON transaction(tran_type_code);
CREATE INDEX idx_tran_category ON transaction(tran_type_code, tran_category_code);

-- Daily Transaction Table
CREATE TABLE daily_transaction (
    tran_id VARCHAR(16) PRIMARY KEY,
    tran_type_code VARCHAR(2),
    tran_category_code NUMERIC(4),
    tran_source VARCHAR(10),
    tran_desc VARCHAR(100),
    tran_amount DECIMAL(11,2),
    merchant_id NUMERIC(9),
    merchant_name VARCHAR(50),
    merchant_city VARCHAR(50),
    merchant_zip VARCHAR(10),
    card_number VARCHAR(16),
    orig_timestamp TIMESTAMP,
    proc_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_number) REFERENCES card(card_number),
    FOREIGN KEY (tran_type_code) REFERENCES transaction_type(tran_type),
    FOREIGN KEY (tran_type_code, tran_category_code) REFERENCES transaction_category(tran_type_code, tran_cat_code)
);

COMMENT ON TABLE daily_transaction IS 'Daily transaction staging file for batch processing';

CREATE INDEX idx_dalytran_proc_ts ON daily_transaction(proc_timestamp);
CREATE INDEX idx_dalytran_card_num ON daily_transaction(card_number);

-- Transaction Category Balance Table
CREATE TABLE transaction_category_balance (
    acct_id NUMERIC(11) NOT NULL,
    tran_type_code VARCHAR(2) NOT NULL,
    tran_cat_code NUMERIC(4) NOT NULL,
    tran_cat_balance DECIMAL(11,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (acct_id, tran_type_code, tran_cat_code),
    FOREIGN KEY (acct_id) REFERENCES account(acct_id),
    FOREIGN KEY (tran_type_code, tran_cat_code) REFERENCES transaction_category(tran_type_code, tran_cat_code)
);

COMMENT ON TABLE transaction_category_balance IS 'Balance breakdown by transaction category for each account';

CREATE INDEX idx_tcatbal_acct ON transaction_category_balance(acct_id);
CREATE INDEX idx_tcatbal_category ON transaction_category_balance(tran_type_code, tran_cat_code);

-- Pending Authorization Table
CREATE TABLE pending_authorization (
    auth_date_key NUMERIC(5) NOT NULL,
    auth_time_key NUMERIC(9) NOT NULL,
    auth_orig_date VARCHAR(6),
    auth_orig_time VARCHAR(6),
    card_number VARCHAR(16) NOT NULL,
    auth_type VARCHAR(4),
    card_expiry_date VARCHAR(4),
    message_type VARCHAR(6),
    message_source VARCHAR(6),
    auth_id_code VARCHAR(6),
    auth_resp_code VARCHAR(2),
    auth_resp_reason VARCHAR(4),
    processing_code NUMERIC(6),
    transaction_amt DECIMAL(12,2),
    approved_amt DECIMAL(12,2),
    merchant_category_code VARCHAR(4),
    acquirer_country_code VARCHAR(3),
    pos_entry_mode NUMERIC(2),
    merchant_id VARCHAR(15),
    merchant_name VARCHAR(22),
    merchant_city VARCHAR(13),
    merchant_state VARCHAR(2),
    merchant_zip VARCHAR(9),
    transaction_id VARCHAR(15),
    match_status VARCHAR(1) CHECK (match_status IN ('P', 'D', 'E', 'M')),
    auth_fraud VARCHAR(1) CHECK (auth_fraud IN ('F', 'R', ' ')),
    fraud_report_date VARCHAR(8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (auth_date_key, auth_time_key),
    FOREIGN KEY (card_number) REFERENCES card(card_number)
);

COMMENT ON TABLE pending_authorization IS 'Pending authorization requests - real-time pre-authorization tracking';
COMMENT ON COLUMN pending_authorization.match_status IS 'P=Pending, D=Declined, E=Expired, M=Matched';

CREATE INDEX idx_pendauth_card ON pending_authorization(card_number);
CREATE INDEX idx_pendauth_status ON pending_authorization(match_status);
CREATE INDEX idx_pendauth_card_status ON pending_authorization(card_number, match_status);

-- Pending Authorization Summary Table
CREATE TABLE pending_authorization_summary (
    acct_id NUMERIC(11) PRIMARY KEY,
    cust_id NUMERIC(9),
    auth_status VARCHAR(1),
    account_status_1 VARCHAR(2),
    account_status_2 VARCHAR(2),
    account_status_3 VARCHAR(2),
    account_status_4 VARCHAR(2),
    account_status_5 VARCHAR(2),
    credit_limit DECIMAL(11,2),
    cash_limit DECIMAL(11,2),
    credit_balance DECIMAL(11,2),
    cash_balance DECIMAL(11,2),
    approved_auth_count NUMERIC(4),
    declined_auth_count NUMERIC(4),
    approved_auth_amt DECIMAL(11,2),
    declined_auth_amt DECIMAL(11,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (acct_id) REFERENCES account(acct_id),
    FOREIGN KEY (cust_id) REFERENCES customer(cust_id)
);

COMMENT ON TABLE pending_authorization_summary IS 'Authorization summary metrics per account';

CREATE INDEX idx_pendauthsum_cust ON pending_authorization_summary(cust_id);

-- Export Record Table
CREATE TABLE export_record (
    export_sequence_num NUMERIC(9) PRIMARY KEY,
    export_rec_type VARCHAR(1) NOT NULL,
    export_timestamp TIMESTAMP NOT NULL,
    export_date DATE,
    export_time VARCHAR(15),
    branch_id VARCHAR(4),
    region_code VARCHAR(5),
    record_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE export_record IS 'Multi-record export structure for data migration and branch transfers';

CREATE INDEX idx_export_rec_type ON export_record(export_rec_type);
CREATE INDEX idx_export_timestamp ON export_record(export_timestamp);
CREATE INDEX idx_export_branch_region ON export_record(branch_id, region_code);

-- ===================================================================
-- INSERT REFERENCE DATA
-- ===================================================================

-- Transaction Types
INSERT INTO transaction_type (tran_type, tran_type_desc) VALUES
('DB', 'Debit Purchase'),
('CR', 'Credit/Refund'),
('FE', 'Fee'),
('IN', 'Interest Charge'),
('PM', 'Payment'),
('CA', 'Cash Advance'),
('TR', 'Transfer'),
('AD', 'Adjustment'),
('RV', 'Reversal'),
('AU', 'Authorization');

-- Transaction Categories
INSERT INTO transaction_category (tran_type_code, tran_cat_code, tran_cat_type_desc) VALUES
-- Debit Categories
('DB', 1001, 'Retail Purchase'),
('DB', 1002, 'Online Purchase'),
('DB', 1003, 'Restaurant/Dining'),
('DB', 1004, 'Gas/Fuel'),
('DB', 1005, 'Grocery'),
('DB', 1006, 'Travel/Hotel'),
('DB', 1007, 'Entertainment'),
-- Credit Categories
('CR', 2001, 'Purchase Return'),
('CR', 2002, 'Merchant Credit'),
('CR', 2003, 'Cashback Reward'),
-- Fee Categories
('FE', 3001, 'Annual Fee'),
('FE', 3002, 'Late Payment Fee'),
('FE', 3003, 'Over Limit Fee'),
('FE', 3004, 'Foreign Transaction Fee'),
('FE', 3005, 'Cash Advance Fee'),
-- Interest Categories
('IN', 4001, 'Purchase Interest'),
('IN', 4002, 'Cash Advance Interest'),
('IN', 4003, 'Balance Transfer Interest'),
-- Payment Categories
('PM', 5001, 'Regular Payment'),
('PM', 5002, 'Minimum Payment'),
('PM', 5003, 'Full Payment'),
-- Cash Advance
('CA', 6001, 'ATM Cash Advance'),
('CA', 6002, 'Bank Cash Advance'),
-- Transfer
('TR', 7001, 'Balance Transfer In'),
('TR', 7002, 'Balance Transfer Out'),
-- Adjustment
('AD', 8001, 'Billing Adjustment'),
('AD', 8002, 'Dispute Adjustment'),
-- Reversal
('RV', 9001, 'Transaction Reversal'),
-- Authorization
('AU', 1101, 'Pre-Authorization');

-- Disclosure Groups
INSERT INTO disclosure_group (group_id, tran_type_code, tran_cat_code, interest_rate) VALUES
('GRP001', 'DB', 1001, 18.99),
('GRP001', 'DB', 1002, 18.99),
('GRP001', 'DB', 1003, 18.99),
('GRP001', 'CA', 6001, 24.99),
('GRP001', 'CA', 6002, 24.99),
('GRP001', 'TR', 7001, 15.99),
('GRP002', 'DB', 1001, 16.99),
('GRP002', 'DB', 1002, 16.99),
('GRP002', 'CA', 6001, 22.99),
('GRP003', 'DB', 1001, 21.99),
('GRP003', 'DB', 1002, 21.99),
('GRP003', 'CA', 6001, 26.99),
('PREMIUM', 'DB', 1001, 14.99),
('PREMIUM', 'CA', 6001, 19.99),
('PREMIUM', 'TR', 7001, 12.99);

-- ===================================================================
-- INSERT SECURITY USERS
-- ===================================================================

INSERT INTO security_user (user_id, first_name, last_name, password, user_type) VALUES
('ADMIN001', 'Sarah', 'Johnson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'A'),
('ADMIN002', 'Michael', 'Chen', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'A'),
('USER0001', 'Jennifer', 'Martinez', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0002', 'David', 'Williams', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0003', 'Emily', 'Brown', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0004', 'James', 'Garcia', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0005', 'Lisa', 'Anderson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0006', 'Robert', 'Taylor', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0007', 'Amanda', 'Thomas', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0008', 'Christopher', 'Moore', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0009', 'Jessica', 'Jackson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0010', 'Daniel', 'White', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0011', 'Ashley', 'Harris', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0012', 'Matthew', 'Martin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0013', 'Stephanie', 'Thompson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0014', 'Joshua', 'Lee', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0015', 'Michelle', 'Walker', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0016', 'Andrew', 'Hall', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0017', 'Melissa', 'Allen', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0018', 'Ryan', 'Young', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0019', 'Nicole', 'King', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0020', 'Kevin', 'Wright', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0021', 'Rachel', 'Lopez', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0022', 'Brian', 'Hill', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0023', 'Laura', 'Scott', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0024', 'Brandon', 'Green', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U'),
('USER0025', 'Samantha', 'Adams', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667GaoDSq', 'U');

-- ===================================================================
-- INSERT CUSTOMER DATA
-- ===================================================================

INSERT INTO customer (cust_id, first_name, middle_name, last_name, address_line_1, address_line_2, address_line_3,
                      state_code, country_code, zip_code, phone_number_1, phone_number_2, ssn, govt_issued_id,
                      date_of_birth, eft_account_id, primary_card_holder_ind, fico_credit_score) VALUES
(100000001, 'John', 'Michael', 'Smith', '1234 Oak Street', 'Apt 5B', NULL, 'CA', 'USA', '90210', '310-555-0101', '310-555-0102', 123456789, 'DL-CA-12345678', '1985-03-15', 'EFT0001', 'Y', 720),
(100000002, 'Mary', 'Ann', 'Johnson', '5678 Maple Avenue', NULL, NULL, 'NY', 'USA', '10001', '212-555-0201', NULL, 234567890, 'DL-NY-23456789', '1990-07-22', 'EFT0002', 'Y', 680),
(100000003, 'Robert', 'James', 'Williams', '9012 Pine Road', 'Suite 300', NULL, 'TX', 'USA', '75001', '214-555-0301', '214-555-0302', 345678901, 'DL-TX-34567890', '1982-11-08', 'EFT0003', 'Y', 750),
(100000004, 'Patricia', 'Lynn', 'Brown', '3456 Elm Street', NULL, NULL, 'FL', 'USA', '33101', '305-555-0401', NULL, 456789012, 'DL-FL-45678901', '1988-05-30', 'EFT0004', 'Y', 695),
(100000005, 'Michael', 'David', 'Jones', '7890 Cedar Lane', 'Unit 12', NULL, 'IL', 'USA', '60601', '312-555-0501', '312-555-0502', 567890123, 'DL-IL-56789012', '1975-09-14', 'EFT0005', 'Y', 760),
(100000006, 'Linda', 'Marie', 'Garcia', '2345 Birch Boulevard', NULL, NULL, 'AZ', 'USA', '85001', '602-555-0601', NULL, 678901234, 'DL-AZ-67890123', '1992-01-25', 'EFT0006', 'Y', 640),
(100000007, 'David', 'Lee', 'Martinez', '6789 Willow Way', 'Floor 2', NULL, 'WA', 'USA', '98101', '206-555-0701', '206-555-0702', 789012345, 'DL-WA-78901234', '1987-12-03', 'EFT0007', 'Y', 705),
(100000008, 'Barbara', 'Jean', 'Rodriguez', '1357 Spruce Street', NULL, NULL, 'GA', 'USA', '30301', '404-555-0801', NULL, 890123456, 'DL-GA-89012345', '1983-06-18', 'EFT0008', 'Y', 670),
(100000009, 'William', 'Charles', 'Wilson', '2468 Ash Avenue', 'Apt 7C', NULL, 'PA', 'USA', '19101', '215-555-0901', NULL, 901234567, 'DL-PA-90123456', '1991-04-07', 'EFT0009', 'Y', 730),
(100000010, 'Elizabeth', 'Rose', 'Anderson', '3579 Poplar Place', NULL, NULL, 'OH', 'USA', '44101', '216-555-1001', '216-555-1002', 123450987, 'DL-OH-12345098', '1986-10-29', 'EFT0010', 'Y', 685),
(100000011, 'Richard', 'Paul', 'Taylor', '4680 Cherry Court', 'Suite 150', NULL, 'MA', 'USA', '02101', '617-555-1101', NULL, 234561098, 'DL-MA-23456109', '1989-08-16', 'EFT0011', 'Y', 740),
(100000012, 'Susan', 'Kay', 'Thomas', '5791 Magnolia Drive', NULL, NULL, 'CO', 'USA', '80201', '303-555-1201', NULL, 345672109, 'DL-CO-34567210', '1984-02-11', 'EFT0012', 'Y', 710),
(100000013, 'Joseph', 'Anthony', 'Hernandez', '6802 Hickory Hill', 'Unit 8', NULL, 'MI', 'USA', '48201', '313-555-1301', '313-555-1302', 456783210, 'DL-MI-45678321', '1993-07-04', 'EFT0013', 'Y', 655),
(100000014, 'Jessica', 'Marie', 'Moore', '7913 Dogwood Drive', NULL, NULL, 'VA', 'USA', '22201', '703-555-1401', NULL, 567894321, 'DL-VA-56789432', '1981-12-20', 'EFT0014', 'Y', 775),
(100000015, 'Thomas', 'Edward', 'Martin', '8024 Redwood Road', 'Apt 3A', NULL, 'NC', 'USA', '27601', '919-555-1501', NULL, 678905432, 'DL-NC-67890543', '1990-03-09', 'EFT0015', 'Y', 690),
(100000016, 'Sarah', 'Elizabeth', 'Jackson', '9135 Sycamore Street', NULL, NULL, 'NV', 'USA', '89101', '702-555-1601', '702-555-1602', 789016543, 'DL-NV-78901654', '1987-11-12', 'EFT0016', 'Y', 725),
(100000017, 'Christopher', 'John', 'White', '1246 Cypress Circle', 'Suite 200', NULL, 'OR', 'USA', '97201', '503-555-1701', NULL, 890127654, 'DL-OR-89012765', '1985-05-27', 'EFT0017', 'Y', 745),
(100000018, 'Nancy', 'Lee', 'Harris', '2357 Juniper Lane', NULL, NULL, 'MN', 'USA', '55401', '612-555-1801', NULL, 901238765, 'DL-MN-90123876', '1992-09-03', 'EFT0018', 'Y', 665),
(100000019, 'Daniel', 'Robert', 'Clark', '3468 Fir Forest', 'Unit 15', NULL, 'WI', 'USA', '53201', '414-555-1901', NULL, 123459876, 'DL-WI-12345987', '1988-01-30', 'EFT0019', 'Y', 700),
(100000020, 'Karen', 'Ann', 'Lewis', '4579 Beech Boulevard', NULL, NULL, 'MO', 'USA', '63101', '314-555-2001', '314-555-2002', 234560987, 'DL-MO-23456098', '1986-06-21', 'EFT0020', 'Y', 735),
(100000021, 'Matthew', 'William', 'Robinson', '5680 Walnut Way', NULL, NULL, 'TN', 'USA', '37201', '615-555-2101', NULL, 345671098, 'DL-TN-34567109', '1991-10-15', 'EFT0021', 'Y', 680),
(100000022, 'Betty', 'Jane', 'Walker', '6791 Chestnut Chase', 'Apt 9B', NULL, 'MD', 'USA', '21201', '410-555-2201', NULL, 456782109, 'DL-MD-45678210', '1984-04-08', 'EFT0022', 'Y', 715),
(100000023, 'Donald', 'Ray', 'Young', '7802 Oakwood Oval', NULL, NULL, 'IN', 'USA', '46201', '317-555-2301', NULL, 567893210, 'DL-IN-56789321', '1989-08-24', 'EFT0023', 'Y', 695),
(100000024, 'Dorothy', 'May', 'Allen', '8913 Maplewood Mile', 'Suite 50', NULL, 'KY', 'USA', '40201', '502-555-2401', '502-555-2402', 678904321, 'DL-KY-67890432', '1983-12-06', 'EFT0024', 'Y', 760),
(100000025, 'Mark', 'Steven', 'King', '9024 Pinewood Path', NULL, NULL, 'LA', 'USA', '70112', '504-555-2501', NULL, 789015432, 'DL-LA-78901543', '1990-02-19', 'EFT0025', 'Y', 670),
(100000026, 'Lisa', 'Michelle', 'Wright', '1135 Elmwood Estate', NULL, NULL, 'SC', 'USA', '29201', '803-555-2601', NULL, 890126543, 'DL-SC-89012654', '1987-07-11', 'EFT0026', 'Y', 705),
(100000027, 'Paul', 'Joseph', 'Lopez', '2246 Cedarwood Court', 'Unit 20', NULL, 'AL', 'USA', '35201', '205-555-2701', NULL, 901237654, 'DL-AL-90123765', '1985-11-28', 'EFT0027', 'Y', 720),
(100000028, 'Helen', 'Grace', 'Hill', '3357 Birchwood Bend', NULL, NULL, 'OK', 'USA', '73101', '405-555-2801', NULL, 123458765, 'DL-OK-12345876', '1992-05-14', 'EFT0028', 'Y', 650),
(100000029, 'Steven', 'Andrew', 'Scott', '4468 Willowwood Way', 'Apt 4D', NULL, 'CT', 'USA', '06101', '860-555-2901', NULL, 234569876, 'DL-CT-23456987', '1988-09-02', 'EFT0029', 'Y', 730),
(100000030, 'Sandra', 'Sue', 'Green', '5579 Sprucewood Square', NULL, NULL, 'IA', 'USA', '50301', '515-555-3001', '515-555-3002', 345670987, 'DL-IA-34567098', '1986-03-25', 'EFT0030', 'Y', 685);

-- ===================================================================
-- INSERT ACCOUNT DATA
-- ===================================================================

INSERT INTO account (acct_id, active_status, current_balance, credit_limit, cash_credit_limit, open_date,
                     expiration_date, reissue_date, current_cycle_credit, current_cycle_debit, zip_code, group_id) VALUES
(10000000001, 'Y', 1234.56, 5000.00, 1000.00, '2020-01-15', '2027-01-31', NULL, 0.00, 567.89, '90210', 'GRP001'),
(10000000002, 'Y', 2345.67, 10000.00, 2000.00, '2019-03-22', '2026-03-31', NULL, 150.00, 890.45, '10001', 'PREMIUM'),
(10000000003, 'Y', 456.78, 3000.00, 500.00, '2021-06-10', '2028-06-30', NULL, 0.00, 234.12, '75001', 'GRP002'),
(10000000004, 'Y', 3456.89, 8000.00, 1500.00, '2018-11-05', '2025-11-30', '2023-11-15', 200.00, 1234.56, '33101', 'GRP001'),
(10000000005, 'Y', 567.90, 15000.00, 3000.00, '2017-09-18', '2024-09-30', '2022-09-20', 0.00, 345.67, '60601', 'PREMIUM'),
(10000000006, 'Y', 4567.01, 4000.00, 800.00, '2022-02-28', '2029-02-28', NULL, 50.00, 678.90, '85001', 'GRP003'),
(10000000007, 'Y', 678.12, 7000.00, 1200.00, '2020-07-14', '2027-07-31', NULL, 0.00, 456.78, '98101', 'GRP002'),
(10000000008, 'Y', 5678.23, 6000.00, 1000.00, '2019-12-03', '2026-12-31', NULL, 100.00, 789.01, '30301', 'GRP001'),
(10000000009, 'Y', 789.34, 9000.00, 1800.00, '2021-04-19', '2028-04-30', NULL, 0.00, 567.89, '19101', 'GRP002'),
(10000000010, 'Y', 6789.45, 12000.00, 2500.00, '2018-08-27', '2025-08-31', '2023-08-30', 300.00, 890.12, '44101', 'PREMIUM'),
(10000000011, 'Y', 890.56, 5500.00, 1100.00, '2020-10-11', '2027-10-31', NULL, 0.00, 234.56, '02101', 'GRP001'),
(10000000012, 'Y', 7890.67, 11000.00, 2200.00, '2019-05-25', '2026-05-31', NULL, 150.00, 678.90, '80201', 'GRP002'),
(10000000013, 'Y', 901.78, 3500.00, 700.00, '2022-01-08', '2029-01-31', NULL, 0.00, 345.67, '48201', 'GRP003'),
(10000000014, 'Y', 8901.89, 20000.00, 4000.00, '2017-11-30', '2024-11-30', '2022-12-01', 500.00, 1234.56, '22201', 'PREMIUM'),
(10000000015, 'Y', 1012.90, 4500.00, 900.00, '2021-03-16', '2028-03-31', NULL, 0.00, 456.78, '27601', 'GRP002'),
(10000000016, 'Y', 9012.01, 8500.00, 1700.00, '2020-06-22', '2027-06-30', NULL, 200.00, 789.01, '89101', 'GRP001'),
(10000000017, 'Y', 123.12, 6500.00, 1300.00, '2019-09-14', '2026-09-30', NULL, 0.00, 567.89, '97201', 'PREMIUM'),
(10000000018, 'Y', 234.23, 5000.00, 1000.00, '2021-12-20', '2028-12-31', NULL, 50.00, 890.12, '55401', 'GRP002'),
(10000000019, 'Y', 345.34, 7500.00, 1500.00, '2018-04-09', '2025-04-30', '2023-05-01', 0.00, 234.56, '53201', 'GRP001'),
(10000000020, 'Y', 456.45, 10500.00, 2100.00, '2020-08-17', '2027-08-31', NULL, 250.00, 678.90, '63101', 'PREMIUM'),
(10000000021, 'Y', 567.56, 4000.00, 800.00, '2022-03-05', '2029-03-31', NULL, 0.00, 345.67, '37201', 'GRP003'),
(10000000022, 'Y', 678.67, 9500.00, 1900.00, '2019-07-23', '2026-07-31', NULL, 100.00, 456.78, '21201', 'GRP002'),
(10000000023, 'Y', 789.78, 6000.00, 1200.00, '2021-11-11', '2028-11-30', NULL, 0.00, 789.01, '46201', 'GRP001'),
(10000000024, 'Y', 890.89, 14000.00, 2800.00, '2018-02-14', '2025-02-28', '2023-02-20', 400.00, 567.89, '40201', 'PREMIUM'),
(10000000025, 'Y', 901.90, 4500.00, 900.00, '2020-05-29', '2027-05-31', NULL, 0.00, 890.12, '70112', 'GRP002'),
(10000000026, 'Y', 1012.01, 7000.00, 1400.00, '2019-10-07', '2026-10-31', NULL, 150.00, 234.56, '29201', 'GRP001'),
(10000000027, 'Y', 123.12, 5500.00, 1100.00, '2021-08-18', '2028-08-31', NULL, 0.00, 678.90, '35201', 'GRP002'),
(10000000028, 'Y', 234.23, 3000.00, 600.00, '2022-12-24', '2029-12-31', NULL, 0.00, 345.67, '73101', 'GRP003'),
(10000000029, 'Y', 345.34, 8000.00, 1600.00, '2020-01-30', '2027-01-31', NULL, 100.00, 456.78, '06101', 'GRP002'),
(10000000030, 'Y', 456.45, 11000.00, 2200.00, '2019-04-12', '2026-04-30', NULL, 200.00, 789.01, '50301', 'PREMIUM');

-- ===================================================================
-- INSERT CARD DATA
-- ===================================================================

INSERT INTO card (card_number, acct_id, cvv_code, embossed_name, expiration_date, active_status) VALUES
('4532123456789001', 10000000001, 123, 'JOHN M SMITH', '2027-01-31', 'Y'),
('4532123456789002', 10000000002, 234, 'MARY A JOHNSON', '2026-03-31', 'Y'),
('4532123456789003', 10000000003, 345, 'ROBERT J WILLIAMS', '2028-06-30', 'Y'),
('4532123456789004', 10000000004, 456, 'PATRICIA L BROWN', '2025-11-30', 'Y'),
('4532123456789005', 10000000005, 567, 'MICHAEL D JONES', '2024-09-30', 'Y'),
('4532123456789006', 10000000006, 678, 'LINDA M GARCIA', '2029-02-28', 'Y'),
('4532123456789007', 10000000007, 789, 'DAVID L MARTINEZ', '2027-07-31', 'Y'),
('4532123456789008', 10000000008, 890, 'BARBARA J RODRIGUEZ', '2026-12-31', 'Y'),
('4532123456789009', 10000000009, 901, 'WILLIAM C WILSON', '2028-04-30', 'Y'),
('4532123456789010', 10000000010, 112, 'ELIZABETH R ANDERSON', '2025-08-31', 'Y'),
('4532123456789011', 10000000011, 223, 'RICHARD P TAYLOR', '2027-10-31', 'Y'),
('4532123456789012', 10000000012, 334, 'SUSAN K THOMAS', '2026-05-31', 'Y'),
('4532123456789013', 10000000013, 445, 'JOSEPH A HERNANDEZ', '2029-01-31', 'Y'),
('4532123456789014', 10000000014, 556, 'JESSICA M MOORE', '2024-11-30', 'Y'),
('4532123456789015', 10000000015, 667, 'THOMAS E MARTIN', '2028-03-31', 'Y'),
('4532123456789016', 10000000016, 778, 'SARAH E JACKSON', '2027-06-30', 'Y'),
('4532123456789017', 10000000017, 889, 'CHRISTOPHER J WHITE', '2026-09-30', 'Y'),
('4532123456789018', 10000000018, 990, 'NANCY L HARRIS', '2028-12-31', 'Y'),
('4532123456789019', 10000000019, 101, 'DANIEL R CLARK', '2025-04-30', 'Y'),
('4532123456789020', 10000000020, 212, 'KAREN A LEWIS', '2027-08-31', 'Y'),
('4532123456789021', 10000000021, 323, 'MATTHEW W ROBINSON', '2029-03-31', 'Y'),
('4532123456789022', 10000000022, 434, 'BETTY J WALKER', '2026-07-31', 'Y'),
('4532123456789023', 10000000023, 545, 'DONALD R YOUNG', '2028-11-30', 'Y'),
('4532123456789024', 10000000024, 656, 'DOROTHY M ALLEN', '2025-02-28', 'Y'),
('4532123456789025', 10000000025, 767, 'MARK S KING', '2027-05-31', 'Y'),
('4532123456789026', 10000000026, 878, 'LISA M WRIGHT', '2026-10-31', 'Y'),
('4532123456789027', 10000000027, 989, 'PAUL J LOPEZ', '2028-08-31', 'Y'),
('4532123456789028', 10000000028, 100, 'HELEN G HILL', '2029-12-31', 'Y'),
('4532123456789029', 10000000029, 211, 'STEVEN A SCOTT', '2027-01-31', 'Y'),
('4532123456789030', 10000000030, 322, 'SANDRA S GREEN', '2026-04-30', 'Y');

-- ===================================================================
-- INSERT CARD XREF DATA
-- ===================================================================

INSERT INTO card_xref (card_number, cust_id, acct_id) VALUES
('4532123456789001', 100000001, 10000000001),
('4532123456789002', 100000002, 10000000002),
('4532123456789003', 100000003, 10000000003),
('4532123456789004', 100000004, 10000000004),
('4532123456789005', 100000005, 10000000005),
('4532123456789006', 100000006, 10000000006),
('4532123456789007', 100000007, 10000000007),
('4532123456789008', 100000008, 10000000008),
('4532123456789009', 100000009, 10000000009),
('4532123456789010', 100000010, 10000000010),
('4532123456789011', 100000011, 10000000011),
('4532123456789012', 100000012, 10000000012),
('4532123456789013', 100000013, 10000000013),
('4532123456789014', 100000014, 10000000014),
('4532123456789015', 100000015, 10000000015),
('4532123456789016', 100000016, 10000000016),
('4532123456789017', 100000017, 10000000017),
('4532123456789018', 100000018, 10000000018),
('4532123456789019', 100000019, 10000000019),
('4532123456789020', 100000020, 10000000020),
('4532123456789021', 100000021, 10000000021),
('4532123456789022', 100000022, 10000000022),
('4532123456789023', 100000023, 10000000023),
('4532123456789024', 100000024, 10000000024),
('4532123456789025', 100000025, 10000000025),
('4532123456789026', 100000026, 10000000026),
('4532123456789027', 100000027, 10000000027),
('4532123456789028', 100000028, 10000000028),
('4532123456789029', 100000029, 10000000029),
('4532123456789030', 100000030, 10000000030);

-- ===================================================================
-- INSERT TRANSACTION DATA
-- ===================================================================

INSERT INTO transaction (tran_id, tran_type_code, tran_category_code, tran_source, tran_desc, tran_amount,
                        merchant_id, merchant_name, merchant_city, merchant_zip, card_number,
                        orig_timestamp, proc_timestamp) VALUES
('T20260201000001', 'DB', 1001, 'POS', 'TARGET PURCHASE', -89.99, 123456789, 'TARGET #1234', 'Los Angeles', '90210', '4532123456789001', '2026-02-01 10:15:23', '2026-02-01 10:15:25'),
('T20260201000002', 'DB', 1003, 'POS', 'STARBUCKS', -5.75, 234567890, 'STARBUCKS #5678', 'New York', '10001', '4532123456789002', '2026-02-01 08:30:12', '2026-02-01 08:30:14'),
('T20260201000003', 'DB', 1004, 'POS', 'SHELL GAS STATION', -45.00, 345678901, 'SHELL #9012', 'Dallas', '75001', '4532123456789003', '2026-02-01 14:22:45', '2026-02-01 14:22:47'),
('T20260201000004', 'DB', 1005, 'POS', 'WHOLE FOODS MARKET', -127.34, 456789012, 'WHOLE FOODS #3456', 'Miami', '33101', '4532123456789004', '2026-02-01 16:45:30', '2026-02-01 16:45:32'),
('T20260202000005', 'PM', 5001, 'ONLINE', 'PAYMENT - THANK YOU', 500.00, 999999999, 'CARDDEMO PAYMENT', 'Chicago', '60601', '4532123456789005', '2026-02-02 09:00:00', '2026-02-02 09:00:02'),
('T20260202000006', 'DB', 1002, 'ONLINE', 'AMAZON.COM PURCHASE', -156.78, 567890123, 'AMAZON.COM', 'Phoenix', '85001', '4532123456789006', '2026-02-02 11:30:15', '2026-02-02 11:30:17'),
('T20260202000007', 'DB', 1007, 'POS', 'AMC THEATRES', -42.50, 678901234, 'AMC THEATRES #7890', 'Seattle', '98101', '4532123456789007', '2026-02-02 19:15:00', '2026-02-02 19:15:02'),
('T20260203000008', 'DB', 1006, 'POS', 'MARRIOTT HOTEL', -289.99, 789012345, 'MARRIOTT DOWNTOWN', 'Atlanta', '30301', '4532123456789008', '2026-02-03 15:30:45', '2026-02-03 15:30:47'),
('T20260203000009', 'DB', 1003, 'POS', 'OLIVE GARDEN', -67.85, 890123456, 'OLIVE GARDEN #1234', 'Philadelphia', '19101', '4532123456789009', '2026-02-03 18:45:20', '2026-02-03 18:45:22'),
('T20260203000010', 'CR', 2001, 'POS', 'RETURN - NORDSTROM', 125.00, 901234567, 'NORDSTROM #5678', 'Cleveland', '44101', '4532123456789010', '2026-02-03 12:20:10', '2026-02-03 12:20:12'),
('T20260204000011', 'DB', 1001, 'POS', 'WALMART SUPERCENTER', -78.45, 123450987, 'WALMART #9012', 'Boston', '02101', '4532123456789011', '2026-02-04 13:10:30', '2026-02-04 13:10:32'),
('T20260204000012', 'DB', 1004, 'POS', 'CHEVRON GAS', -52.30, 234561098, 'CHEVRON #3456', 'Denver', '80201', '4532123456789012', '2026-02-04 07:45:15', '2026-02-04 07:45:17'),
('T20260204000013', 'FE', 3002, 'SYSTEM', 'LATE PAYMENT FEE', -35.00, 999999999, 'CARDDEMO BILLING', 'Detroit', '48201', '4532123456789013', '2026-02-04 00:01:00', '2026-02-04 00:01:02'),
('T20260205000014', 'DB', 1002, 'ONLINE', 'EBAY PURCHASE', -234.56, 345672109, 'EBAY.COM', 'Arlington', '22201', '4532123456789014', '2026-02-05 10:25:40', '2026-02-05 10:25:42'),
('T20260205000015', 'DB', 1005, 'POS', 'TRADER JOES', -89.12, 456783210, 'TRADER JOES #7890', 'Raleigh', '27601', '4532123456789015', '2026-02-05 17:30:55', '2026-02-05 17:30:57'),
('T20260205000016', 'CA', 6001, 'ATM', 'ATM CASH WITHDRAWAL', -200.00, 567894321, 'CHASE ATM #1234', 'Las Vegas', '89101', '4532123456789016', '2026-02-05 21:15:30', '2026-02-05 21:15:32'),
('T20260205000017', 'FE', 3005, 'SYSTEM', 'CASH ADVANCE FEE', -10.00, 999999999, 'CARDDEMO BILLING', 'Las Vegas', '89101', '4532123456789016', '2026-02-05 21:15:33', '2026-02-05 21:15:35'),
('T20260205000018', 'DB', 1003, 'POS', 'CHIPOTLE MEXICAN GRILL', -23.45, 678905432, 'CHIPOTLE #5678', 'Portland', '97201', '4532123456789017', '2026-02-05 12:40:20', '2026-02-05 12:40:22'),
('T20260205000019', 'PM', 5003, 'ONLINE', 'FULL PAYMENT', 234.23, 999999999, 'CARDDEMO PAYMENT', 'Minneapolis', '55401', '4532123456789018', '2026-02-05 08:00:00', '2026-02-05 08:00:02'),
('T20260205000020', 'DB', 1001, 'POS', 'BEST BUY', -399.99, 789016543, 'BEST BUY #9012', 'Milwaukee', '53201', '4532123456789019', '2026-02-05 14:55:10', '2026-02-05 14:55:12'),
('T20260205000021', 'DB', 1002, 'ONLINE', 'APPLE.COM PURCHASE', -1299.00, 890127654, 'APPLE.COM/BILL', 'St Louis', '63101', '4532123456789020', '2026-02-05 16:20:45', '2026-02-05 16:20:47'),
('T20260205000022', 'DB', 1003, 'POS', 'PANERA BREAD', -18.75, 901238765, 'PANERA BREAD #3456', 'Nashville', '37201', '4532123456789021', '2026-02-05 11:30:30', '2026-02-05 11:30:32'),
('T20260205000023', 'DB', 1004, 'POS', 'BP GAS STATION', -48.90, 123459876, 'BP #7890', 'Baltimore', '21201', '4532123456789022', '2026-02-05 15:10:15', '2026-02-05 15:10:17'),
('T20260205000024', 'DB', 1005, 'POS', 'SAFEWAY', -95.67, 234560987, 'SAFEWAY #1234', 'Indianapolis', '46201', '4532123456789023', '2026-02-05 18:25:50', '2026-02-05 18:25:52'),
('T20260205000025', 'CR', 2003, 'SYSTEM', 'CASHBACK REWARD', 25.00, 999999999, 'CARDDEMO REWARDS', 'Louisville', '40201', '4532123456789024', '2026-02-05 00:05:00', '2026-02-05 00:05:02'),
('T20260205000026', 'DB', 1006, 'POS', 'HILTON HOTELS', -345.00, 345671098, 'HILTON GARDEN INN', 'New Orleans', '70112', '4532123456789025', '2026-02-05 14:00:00', '2026-02-05 14:00:02'),
('T20260205000027', 'DB', 1007, 'POS', 'SPOTIFY SUBSCRIPTION', -9.99, 456782109, 'SPOTIFY USA', 'Columbia', '29201', '4532123456789026', '2026-02-05 09:15:00', '2026-02-05 09:15:02'),
('T20260205000028', 'DB', 1001, 'POS', 'HOME DEPOT', -187.34, 567893210, 'HOME DEPOT #5678', 'Birmingham', '35201', '4532123456789027', '2026-02-05 13:40:25', '2026-02-05 13:40:27'),
('T20260205000029', 'DB', 1002, 'ONLINE', 'NETFLIX SUBSCRIPTION', -15.99, 678904321, 'NETFLIX.COM', 'Oklahoma City', '73101', '4532123456789028', '2026-02-05 10:00:00', '2026-02-05 10:00:02'),
('T20260205000030', 'DB', 1003, 'POS', 'SUBWAY SANDWICH', -12.50, 789015432, 'SUBWAY #9012', 'Hartford', '06101', '4532123456789029', '2026-02-05 12:15:40', '2026-02-05 12:15:42');

-- ===================================================================
-- INSERT DAILY TRANSACTION DATA
-- ===================================================================

INSERT INTO daily_transaction (tran_id, tran_type_code, tran_category_code, tran_source, tran_desc, tran_amount,
                               merchant_id, merchant_name, merchant_city, merchant_zip, card_number,
                               orig_timestamp, proc_timestamp) VALUES
('D20260205000001', 'DB', 1001, 'POS', 'COSTCO WHOLESALE', -156.78, 890126543, 'COSTCO #3456', 'Des Moines', '50301', '4532123456789030', '2026-02-05 11:20:15', '2026-02-05 11:20:17'),
('D20260205000002', 'DB', 1004, 'POS', 'EXXON MOBIL', -55.00, 123456789, 'EXXON #7890', 'Los Angeles', '90210', '4532123456789001', '2026-02-05 07:30:20', '2026-02-05 07:30:22'),
('D20260205000003', 'DB', 1003, 'POS', 'MCDONALDS', -14.35, 234567890, 'MCDONALDS #1234', 'New York', '10001', '4532123456789002', '2026-02-05 13:45:30', '2026-02-05 13:45:32'),
('D20260205000004', 'DB', 1005, 'POS', 'KROGER', -112.50, 345678901, 'KROGER #5678', 'Dallas', '75001', '4532123456789003', '2026-02-05 16:10:45', '2026-02-05 16:10:47'),
('D20260205000005', 'DB', 1002, 'ONLINE', 'ETSY PURCHASE', -67.89, 456789012, 'ETSY.COM', 'Miami', '33101', '4532123456789004', '2026-02-05 14:25:55', '2026-02-05 14:25:57'),
('D20260205000006', 'DB', 1001, 'POS', 'LOWES HOME IMPROVEMENT', -234.67, 567890123, 'LOWES #9012', 'Chicago', '60601', '4532123456789005', '2026-02-05 10:40:10', '2026-02-05 10:40:12'),
('D20260205000007', 'DB', 1007, 'POS', 'REGAL CINEMAS', -38.00, 678901234, 'REGAL CINEMAS #3456', 'Phoenix', '85001', '4532123456789006', '2026-02-05 20:15:25', '2026-02-05 20:15:27'),
('D20260205000008', 'DB', 1003, 'POS', 'APPLEBEES', -56.78, 789012345, 'APPLEBEES #7890', 'Seattle', '98101', '4532123456789007', '2026-02-05 19:30:40', '2026-02-05 19:30:42'),
('D20260205000009', 'DB', 1001, 'POS', 'CVSI PHARMACY', -34.99, 890123456, 'CVS PHARMACY #1234', 'Atlanta', '30301', '4532123456789008', '2026-02-05 11:50:50', '2026-02-05 11:50:52'),
('D20260205000010', 'DB', 1004, 'POS', 'MOBIL GAS', -42.30, 901234567, 'MOBIL #5678', 'Philadelphia', '19101', '4532123456789009', '2026-02-05 08:20:05', '2026-02-05 08:20:07'),
('D20260205000011', 'DB', 1002, 'ONLINE', 'MICROSOFT STORE', -89.99, 123450987, 'MICROSOFT.COM', 'Cleveland', '44101', '4532123456789010', '2026-02-05 15:35:20', '2026-02-05 15:35:22'),
('D20260205000012', 'DB', 1005, 'POS', 'PUBLIX SUPERMARKET', -78.45, 234561098, 'PUBLIX #9012', 'Boston', '02101', '4532123456789011', '2026-02-05 17:45:35', '2026-02-05 17:45:37'),
('D20260205000013', 'DB', 1003, 'POS', 'TACO BELL', -11.25, 345672109, 'TACO BELL #3456', 'Denver', '80201', '4532123456789012', '2026-02-05 12:30:45', '2026-02-05 12:30:47'),
('D20260205000014', 'DB', 1001, 'POS', 'PETCO', -67.89, 456783210, 'PETCO #7890', 'Detroit', '48201', '4532123456789013', '2026-02-05 14:15:00', '2026-02-05 14:15:02'),
('D20260205000015', 'DB', 1006, 'POS', 'HYATT REGENCY', -299.00, 567894321, 'HYATT REGENCY', 'Arlington', '22201', '4532123456789014', '2026-02-05 16:00:00', '2026-02-05 16:00:02'),
('D20260205000016', 'DB', 1002, 'ONLINE', 'PAYPAL PURCHASE', -145.67, 678905432, 'PAYPAL *MERCHANT', 'Raleigh', '27601', '4532123456789015', '2026-02-05 13:25:15', '2026-02-05 13:25:17'),
('D20260205000017', 'DB', 1007, 'POS', 'GYM MEMBERSHIP', -49.99, 789016543, 'LIFETIME FITNESS', 'Las Vegas', '89101', '4532123456789016', '2026-02-05 06:00:00', '2026-02-05 06:00:02'),
('D20260205000018', 'DB', 1003, 'POS', 'CHICK-FIL-A', -16.85, 890127654, 'CHICK-FIL-A #1234', 'Portland', '97201', '4532123456789017', '2026-02-05 11:40:30', '2026-02-05 11:40:32'),
('D20260205000019', 'DB', 1001, 'POS', 'STAPLES', -94.56, 901238765, 'STAPLES #5678', 'Minneapolis', '55401', '4532123456789018', '2026-02-05 15:20:45', '2026-02-05 15:20:47'),
('D20260205000020', 'DB', 1004, 'POS', 'SUNOCO GAS', -46.75, 123459876, 'SUNOCO #9012', 'Milwaukee', '53201', '4532123456789019', '2026-02-05 07:55:00', '2026-02-05 07:55:02'),
('D20260205000021', 'DB', 1005, 'POS', 'ALDI', -65.34, 234560987, 'ALDI #3456', 'St Louis', '63101', '4532123456789020', '2026-02-05 18:10:15', '2026-02-05 18:10:17'),
('D20260205000022', 'DB', 1002, 'ONLINE', 'UBER EATS', -34.56, 345671098, 'UBER EATS', 'Nashville', '37201', '4532123456789021', '2026-02-05 19:45:30', '2026-02-05 19:45:32'),
('D20260205000023', 'DB', 1003, 'POS', 'DOMINOS PIZZA', -27.99, 456782109, 'DOMINOS #7890', 'Baltimore', '21201', '4532123456789022', '2026-02-05 20:30:45', '2026-02-05 20:30:47'),
('D20260205000024', 'DB', 1001, 'POS', 'WALGREENS', -43.21, 567893210, 'WALGREENS #1234', 'Indianapolis', '46201', '4532123456789023', '2026-02-05 12:05:00', '2026-02-05 12:05:02'),
('D20260205000025', 'DB', 1007, 'POS', 'DISNEY+ SUBSCRIPTION', -13.99, 678904321, 'DISNEYPLUS.COM', 'Louisville', '40201', '4532123456789024', '2026-02-05 09:00:00', '2026-02-05 09:00:02'),
('D20260205000026', 'DB', 1001, 'POS', 'KOHLS DEPARTMENT STORE', -156.78, 789015432, 'KOHLS #5678', 'New Orleans', '70112', '4532123456789025', '2026-02-05 14:40:15', '2026-02-05 14:40:17'),
('D20260205000027', 'DB', 1004, 'POS', 'ARCO GAS', -38.50, 890126543, 'ARCO #9012', 'Columbia', '29201', '4532123456789026', '2026-02-05 08:15:30', '2026-02-05 08:15:32'),
('D20260205000028', 'DB', 1003, 'POS', 'RED LOBSTER', -78.90, 901237654, 'RED LOBSTER #3456', 'Birmingham', '35201', '4532123456789027', '2026-02-05 19:00:45', '2026-02-05 19:00:47'),
('D20260205000029', 'DB', 1002, 'ONLINE', 'HULU SUBSCRIPTION', -7.99, 123458765, 'HULU.COM', 'Oklahoma City', '73101', '4532123456789028', '2026-02-05 10:30:00', '2026-02-05 10:30:02'),
('D20260205000030', 'DB', 1005, 'POS', 'SPROUTS FARMERS MARKET', -89.45, 234569876, 'SPROUTS #7890', 'Hartford', '06101', '4532123456789029', '2026-02-05 16:50:15', '2026-02-05 16:50:17');

-- ===================================================================
-- INSERT TRANSACTION CATEGORY BALANCE DATA
-- ===================================================================

INSERT INTO transaction_category_balance (acct_id, tran_type_code, tran_cat_code, tran_cat_balance) VALUES
(10000000001, 'DB', 1001, -89.99),
(10000000001, 'DB', 1004, -55.00),
(10000000002, 'DB', 1003, -20.10),
(10000000002, 'DB', 1002, -34.56),
(10000000003, 'DB', 1004, -45.00),
(10000000003, 'DB', 1005, -112.50),
(10000000004, 'DB', 1005, -127.34),
(10000000004, 'DB', 1002, -67.89),
(10000000005, 'PM', 5001, 500.00),
(10000000005, 'DB', 1001, -234.67),
(10000000006, 'DB', 1002, -156.78),
(10000000006, 'DB', 1007, -38.00),
(10000000007, 'DB', 1007, -42.50),
(10000000007, 'DB', 1003, -56.78),
(10000000008, 'DB', 1006, -289.99),
(10000000008, 'DB', 1001, -34.99),
(10000000009, 'DB', 1003, -67.85),
(10000000009, 'DB', 1004, -42.30),
(10000000010, 'CR', 2001, 125.00),
(10000000010, 'DB', 1002, -89.99),
(10000000011, 'DB', 1001, -78.45),
(10000000011, 'DB', 1005, -78.45),
(10000000012, 'DB', 1004, -52.30),
(10000000012, 'DB', 1003, -11.25),
(10000000013, 'FE', 3002, -35.00),
(10000000013, 'DB', 1001, -67.89),
(10000000014, 'DB', 1002, -234.56),
(10000000014, 'DB', 1006, -299.00),
(10000000015, 'DB', 1005, -89.12),
(10000000015, 'DB', 1002, -145.67),
(10000000016, 'CA', 6001, -200.00),
(10000000016, 'FE', 3005, -10.00),
(10000000016, 'DB', 1007, -49.99),
(10000000017, 'DB', 1003, -35.30),
(10000000017, 'DB', 1001, -94.56),
(10000000018, 'PM', 5003, 234.23),
(10000000019, 'DB', 1001, -443.20),
(10000000019, 'DB', 1004, -46.75),
(10000000020, 'DB', 1002, -1299.00),
(10000000020, 'DB', 1005, -65.34),
(10000000021, 'DB', 1003, -18.75),
(10000000021, 'DB', 1002, -34.56),
(10000000022, 'DB', 1004, -48.90),
(10000000022, 'DB', 1003, -27.99),
(10000000023, 'DB', 1005, -95.67),
(10000000023, 'DB', 1001, -43.21),
(10000000024, 'CR', 2003, 25.00),
(10000000024, 'DB', 1007, -13.99),
(10000000025, 'DB', 1006, -345.00),
(10000000025, 'DB', 1001, -156.78);

-- ===================================================================
-- INSERT PENDING AUTHORIZATION DATA
-- ===================================================================

INSERT INTO pending_authorization (auth_date_key, auth_time_key, auth_orig_date, auth_orig_time, card_number,
                                   auth_type, card_expiry_date, message_type, message_source, auth_id_code,
                                   auth_resp_code, auth_resp_reason, processing_code, transaction_amt, approved_amt,
                                   merchant_category_code, acquirer_country_code, pos_entry_mode, merchant_id,
                                   merchant_name, merchant_city, merchant_state, merchant_zip, transaction_id,
                                   match_status, auth_fraud, fraud_report_date) VALUES
(26036, 123456789, '260205', '143000', '4532123456789001', 'SALE', '2701', 'AUTH01', 'POS001', 'A12345', '00', '0000', 123456, 125.50, 125.50, '5411', 'USA', 5, 'MER123456789001', 'VONS SUPERMARKET', 'Los Angeles', 'CA', '90210', 'TXN260205000001', 'P', ' ', NULL),
(26036, 123457890, '260205', '150000', '4532123456789002', 'SALE', '2603', 'AUTH01', 'POS002', 'A12346', '00', '0000', 123456, 45.75, 45.75, '5812', 'USA', 5, 'MER123456789002', 'SHAKE SHACK', 'New York', 'NY', '10001', 'TXN260205000002', 'P', ' ', NULL),
(26036, 123458901, '260205', '093000', '4532123456789003', 'SALE', '2806', 'AUTH01', 'POS003', 'A12347', '00', '0000', 123456, 67.80, 67.80, '5541', 'USA', 81, 'MER123456789003', '76 GAS STATION', 'Dallas', 'TX', '75001', 'TXN260205000003', 'M', ' ', NULL),
(26036, 123459012, '260205', '164500', '4532123456789004', 'SALE', '2511', 'AUTH01', 'POS004', 'A12348', '00', '0000', 123456, 234.90, 234.90, '5999', 'USA', 5, 'MER123456789004', 'MACYS', 'Miami', 'FL', '33101', 'TXN260205000004', 'P', ' ', NULL),
(26036, 123460123, '260205', '113000', '4532123456789005', 'SALE', '2409', 'AUTH01', 'ONLN01', 'A12349', '00', '0000', 123456, 89.99, 89.99, '5732', 'USA', 10, 'MER123456789005', 'DELL.COM', 'Chicago', 'IL', '60601', 'TXN260205000005', 'P', ' ', NULL),
(26036, 123461234, '260205', '201500', '4532123456789006', 'SALE', '2902', 'AUTH01', 'POS005', 'A12350', '05', '0001', 123456, 1500.00, 0.00, '5311', 'USA', 5, 'MER123456789006', 'NORDSTROM', 'Phoenix', 'AZ', '85001', 'TXN260205000006', 'D', ' ', NULL),
(26036, 123462345, '260205', '185000', '4532123456789007', 'SALE', '2707', 'AUTH01', 'POS006', 'A12351', '00', '0000', 123456, 75.00, 75.00, '7832', 'USA', 5, 'MER123456789007', 'CINEMARK THEATRES', 'Seattle', 'WA', '98101', 'TXN260205000007', 'P', ' ', NULL),
(26036, 123463456, '260205', '133000', '4532123456789008', 'SALE', '2612', 'AUTH01', 'POS007', 'A12352', '00', '0000', 123456, 189.50, 189.50, '7011', 'USA', 5, 'MER123456789008', 'WESTIN HOTEL', 'Atlanta', 'GA', '30301', 'TXN260205000008', 'M', ' ', NULL),
(26036, 123464567, '260205', '123000', '4532123456789009', 'SALE', '2804', 'AUTH01', 'POS008', 'A12353', '00', '0000', 123456, 89.99, 89.99, '5812', 'USA', 5, 'MER123456789009', 'CAPITAL GRILLE', 'Philadelphia', 'PA', '19101', 'TXN260205000009', 'P', ' ', NULL),
(26036, 123465678, '260205', '103000', '4532123456789010', 'REFD', '2508', 'AUTH02', 'POS009', 'A12354', '00', '0000', 345678, 50.00, 50.00, '5651', 'USA', 5, 'MER123456789010', 'GAP STORES', 'Cleveland', 'OH', '44101', 'TXN260205000010', 'M', ' ', NULL),
(26036, 123466789, '260205', '145000', '4532123456789011', 'SALE', '2710', 'AUTH01', 'POS010', 'A12355', '00', '0000', 123456, 156.78, 156.78, '5411', 'USA', 5, 'MER123456789011', 'STOP & SHOP', 'Boston', 'MA', '02101', 'TXN260205000011', 'P', ' ', NULL),
(26036, 123467890, '260205', '083000', '4532123456789012', 'SALE', '2605', 'AUTH01', 'POS011', 'A12356', '00', '0000', 123456, 55.20, 55.20, '5541', 'USA', 5, 'MER123456789012', 'CONOCO GAS', 'Denver', 'CO', '80201', 'TXN260205000012', 'P', ' ', NULL),
(26036, 123468901, '260205', '213000', '4532123456789013', 'SALE', '2901', 'AUTH01', 'POS012', 'A12357', '51', '0002', 123456, 2500.00, 0.00, '5999', 'USA', 5, 'MER123456789013', 'ELECTRONICS OUTLET', 'Detroit', 'MI', '48201', 'TXN260205000013', 'D', ' ', NULL),
(26036, 123469012, '260205', '161500', '4532123456789014', 'SALE', '2411', 'AUTH01', 'ONLN02', 'A12358', '00', '0000', 123456, 399.99, 399.99, '5942', 'USA', 10, 'MER123456789014', 'BOOK DEPOSITORY', 'Arlington', 'VA', '22201', 'TXN260205000014', 'P', ' ', NULL),
(26036, 123470123, '260205', '173000', '4532123456789015', 'SALE', '2803', 'AUTH01', 'POS013', 'A12359', '00', '0000', 123456, 112.34, 112.34, '5411', 'USA', 5, 'MER123456789015', 'HARRIS TEETER', 'Raleigh', 'NC', '27601', 'TXN260205000015', 'P', ' ', NULL),
(26036, 123471234, '260205', '223000', '4532123456789016', 'CASH', '2706', 'AUTH03', 'ATM001', 'A12360', '00', '0000', 456789, 300.00, 300.00, '6011', 'USA', 2, 'MER123456789016', 'BOA ATM #12345', 'Las Vegas', 'NV', '89101', 'TXN260205000016', 'M', ' ', NULL),
(26036, 123472345, '260205', '122000', '4532123456789017', 'SALE', '2609', 'AUTH01', 'POS014', 'A12361', '00', '0000', 123456, 28.90, 28.90, '5814', 'USA', 5, 'MER123456789017', 'WENDY S', 'Portland', 'OR', '97201', 'TXN260205000017', 'P', ' ', NULL),
(26036, 123473456, '260205', '095000', '4532123456789018', 'SALE', '2812', 'AUTH01', 'POS015', 'A12362', '00', '0000', 123456, 456.78, 456.78, '7230', 'USA', 5, 'MER123456789018', 'GREAT CLIPS', 'Minneapolis', 'MN', '55401', 'TXN260205000018', 'P', ' ', NULL),
(26036, 123474567, '260205', '142000', '4532123456789019', 'SALE', '2504', 'AUTH01', 'POS016', 'A12363', '00', '0000', 123456, 567.89, 567.89, '5732', 'USA', 5, 'MER123456789019', 'MICRO CENTER', 'Milwaukee', 'WI', '53201', 'TXN260205000019', 'M', ' ', NULL),
(26036, 123475678, '260205', '175000', '4532123456789020', 'SALE', '2708', 'AUTH01', 'ONLN03', 'A12364', '00', '0000', 123456, 199.99, 199.99, '5732', 'USA', 10, 'MER123456789020', 'NEWEGG.COM', 'St Louis', 'MO', '63101', 'TXN260205000020', 'P', ' ', NULL),
(26036, 123476789, '260205', '111500', '4532123456789021', 'SALE', '2903', 'AUTH01', 'POS017', 'A12365', '00', '0000', 123456, 34.50, 34.50, '5812', 'USA', 5, 'MER123456789021', 'FIVE GUYS', 'Nashville', 'TN', '37201', 'TXN260205000021', 'P', ' ', NULL),
(26036, 123477890, '260205', '152000', '4532123456789022', 'SALE', '2607', 'AUTH01', 'POS018', 'A12366', '00', '0000', 123456, 65.40, 65.40, '5541', 'USA', 5, 'MER123456789022', 'MARATHON GAS', 'Baltimore', 'MD', '21201', 'TXN260205000022', 'P', ' ', NULL),
(26036, 123478901, '260205', '192000', '4532123456789023', 'SALE', '2811', 'AUTH01', 'POS019', 'A12367', '00', '0000', 123456, 234.56, 234.56, '5411', 'USA', 5, 'MER123456789023', 'MEIJER', 'Indianapolis', 'IN', '46201', 'TXN260205000023', 'P', ' ', NULL),
(26036, 123479012, '260205', '063000', '4532123456789024', 'SALE', '2502', 'AUTH01', 'POS020', 'A12368', '00', '0000', 123456, 98.76, 98.76, '7994', 'USA', 5, 'MER123456789024', 'TOPGOLF', 'Louisville', 'KY', '40201', 'TXN260205000024', 'M', ' ', NULL),
(26036, 123480123, '260205', '135000', '4532123456789025', 'SALE', '2705', 'AUTH01', 'POS021', 'A12369', '00', '0000', 123456, 450.00, 450.00, '7011', 'USA', 5, 'MER123456789025', 'SHERATON HOTEL', 'New Orleans', 'LA', '70112', 'TXN260205000025', 'P', ' ', NULL),
(26036, 123481234, '260205', '101500', '4532123456789026', 'SALE', '2610', 'AUTH01', 'ONLN04', 'A12370', '00', '0000', 123456, 19.99, 19.99, '4899', 'USA', 10, 'MER123456789026', 'HBO MAX', 'Columbia', 'SC', '29201', 'TXN260205000026', 'P', ' ', NULL),
(26036, 123482345, '260205', '131000', '4532123456789027', 'SALE', '2808', 'AUTH01', 'POS022', 'A12371', '00', '0000', 123456, 345.67, 345.67, '5211', 'USA', 5, 'MER123456789027', 'ACE HARDWARE', 'Birmingham', 'AL', '35201', 'TXN260205000027', 'P', ' ', NULL),
(26036, 123483456, '260205', '104500', '4532123456789028', 'SALE', '2912', 'AUTH01', 'ONLN05', 'A12372', '00', '0000', 123456, 12.99, 12.99, '4899', 'USA', 10, 'MER123456789028', 'PARAMOUNT+', 'Oklahoma City', 'OK', '73101', 'TXN260205000028', 'P', ' ', NULL),
(26036, 123484567, '260205', '121500', '4532123456789029', 'SALE', '2701', 'AUTH01', 'POS023', 'A12373', '00', '0000', 123456, 23.45, 23.45, '5812', 'USA', 5, 'MER123456789029', 'PANERA', 'Hartford', 'CT', '06101', 'TXN260205000029', 'P', ' ', NULL),
(26036, 123485678, '260205', '165000', '4532123456789030', 'SALE', '2604', 'AUTH01', 'POS024', 'A12374', '00', '0000', 123456, 145.90, 145.90, '5411', 'USA', 5, 'MER123456789030', 'HY-VEE', 'Des Moines', 'IA', '50301', 'TXN260205000030', 'P', ' ', NULL);

-- ===================================================================
-- INSERT PENDING AUTHORIZATION SUMMARY DATA
-- ===================================================================

INSERT INTO pending_authorization_summary (acct_id, cust_id, auth_status, account_status_1, account_status_2,
                                          account_status_3, account_status_4, account_status_5, credit_limit,
                                          cash_limit, credit_balance, cash_balance, approved_auth_count,
                                          declined_auth_count, approved_auth_amt, declined_auth_amt) VALUES
(10000000001, 100000001, 'A', '00', '00', '00', '00', '00', 5000.00, 1000.00, 1234.56, 0.00, 2, 0, 180.50, 0.00),
(10000000002, 100000002, 'A', '00', '00', '00', '00', '00', 10000.00, 2000.00, 2345.67, 0.00, 1, 0, 45.75, 0.00),
(10000000003, 100000003, 'A', '00', '00', '00', '00', '00', 3000.00, 500.00, 456.78, 0.00, 1, 0, 67.80, 0.00),
(10000000004, 100000004, 'A', '00', '00', '00', '00', '00', 8000.00, 1500.00, 3456.89, 0.00, 1, 0, 234.90, 0.00),
(10000000005, 100000005, 'A', '00', '00', '00', '00', '00', 15000.00, 3000.00, 567.90, 0.00, 1, 0, 89.99, 0.00),
(10000000006, 100000006, 'A', '00', '00', '00', '00', '00', 4000.00, 800.00, 4567.01, 0.00, 0, 1, 0.00, 1500.00),
(10000000007, 100000007, 'A', '00', '00', '00', '00', '00', 7000.00, 1200.00, 678.12, 0.00, 1, 0, 75.00, 0.00),
(10000000008, 100000008, 'A', '00', '00', '00', '00', '00', 6000.00, 1000.00, 5678.23, 0.00, 1, 0, 189.50, 0.00),
(10000000009, 100000009, 'A', '00', '00', '00', '00', '00', 9000.00, 1800.00, 789.34, 0.00, 1, 0, 89.99, 0.00),
(10000000010, 100000010, 'A', '00', '00', '00', '00', '00', 12000.00, 2500.00, 6789.45, 0.00, 1, 0, 50.00, 0.00),
(10000000011, 100000011, 'A', '00', '00', '00', '00', '00', 5500.00, 1100.00, 890.56, 0.00, 1, 0, 156.78, 0.00),
(10000000012, 100000012, 'A', '00', '00', '00', '00', '00', 11000.00, 2200.00, 7890.67, 0.00, 1, 0, 55.20, 0.00),
(10000000013, 100000013, 'A', '00', '00', '00', '00', '00', 3500.00, 700.00, 901.78, 0.00, 0, 1, 0.00, 2500.00),
(10000000014, 100000014, 'A', '00', '00', '00', '00', '00', 20000.00, 4000.00, 8901.89, 0.00, 1, 0, 399.99, 0.00),
(10000000015, 100000015, 'A', '00', '00', '00', '00', '00', 4500.00, 900.00, 1012.90, 0.00, 1, 0, 112.34, 0.00),
(10000000016, 100000016, 'A', '00', '00', '00', '00', '00', 8500.00, 1700.00, 9012.01, 300.00, 1, 0, 300.00, 0.00),
(10000000017, 100000017, 'A', '00', '00', '00', '00', '00', 6500.00, 1300.00, 123.12, 0.00, 1, 0, 28.90, 0.00),
(10000000018, 100000018, 'A', '00', '00', '00', '00', '00', 5000.00, 1000.00, 234.23, 0.00, 1, 0, 456.78, 0.00),
(10000000019, 100000019, 'A', '00', '00', '00', '00', '00', 7500.00, 1500.00, 345.34, 0.00, 1, 0, 567.89, 0.00),
(10000000020, 100000020, 'A', '00', '00', '00', '00', '00', 10500.00, 2100.00, 456.45, 0.00, 1, 0, 199.99, 0.00),
(10000000021, 100000021, 'A', '00', '00', '00', '00', '00', 4000.00, 800.00, 567.56, 0.00, 1, 0, 34.50, 0.00),
(10000000022, 100000022, 'A', '00', '00', '00', '00', '00', 9500.00, 1900.00, 678.67, 0.00, 1, 0, 65.40, 0.00),
(10000000023, 100000023, 'A', '00', '00', '00', '00', '00', 6000.00, 1200.00, 789.78, 0.00, 1, 0, 234.56, 0.00),
(10000000024, 100000024, 'A', '00', '00', '00', '00', '00', 14000.00, 2800.00, 890.89, 0.00, 1, 0, 98.76, 0.00),
(10000000025, 100000025, 'A', '00', '00', '00', '00', '00', 4500.00, 900.00, 901.90, 0.00, 1, 0, 450.00, 0.00),
(10000000026, 100000026, 'A', '00', '00', '00', '00', '00', 7000.00, 1400.00, 1012.01, 0.00, 1, 0, 19.99, 0.00),
(10000000027, 100000027, 'A', '00', '00', '00', '00', '00', 5500.00, 1100.00, 123.12, 0.00, 1, 0, 345.67, 0.00),
(10000000028, 100000028, 'A', '00', '00', '00', '00', '00', 3000.00, 600.00, 234.23, 0.00, 1, 0, 12.99, 0.00),
(10000000029, 100000029, 'A', '00', '00', '00', '00', '00', 8000.00, 1600.00, 345.34, 0.00, 1, 0, 23.45, 0.00),
(10000000030, 100000030, 'A', '00', '00', '00', '00', '00', 11000.00, 2200.00, 456.45, 0.00, 1, 0, 145.90, 0.00);

-- ===================================================================
-- INSERT EXPORT RECORD DATA
-- ===================================================================

INSERT INTO export_record (export_sequence_num, export_rec_type, export_timestamp, export_date, export_time,
                          branch_id, region_code, record_data) VALUES
(1, 'C', '2026-02-05 00:00:00', '2026-02-05', '00:00:00.000000', 'BR01', 'WEST', '{"cust_id": 100000001, "first_name": "John", "last_name": "Smith"}'),
(2, 'A', '2026-02-05 00:00:01', '2026-02-05', '00:00:01.000000', 'BR01', 'WEST', '{"acct_id": 10000000001, "balance": 1234.56}'),
(3, 'D', '2026-02-05 00:00:02', '2026-02-05', '00:00:02.000000', 'BR01', 'WEST', '{"card_number": "4532123456789001"}'),
(4, 'C', '2026-02-05 00:00:03', '2026-02-05', '00:00:03.000000', 'BR02', 'EAST', '{"cust_id": 100000002, "first_name": "Mary", "last_name": "Johnson"}'),
(5, 'A', '2026-02-05 00:00:04', '2026-02-05', '00:00:04.000000', 'BR02', 'EAST', '{"acct_id": 10000000002, "balance": 2345.67}'),
(6, 'D', '2026-02-05 00:00:05', '2026-02-05', '00:00:05.000000', 'BR02', 'EAST', '{"card_number": "4532123456789002"}'),
(7, 'T', '2026-02-05 00:00:06', '2026-02-05', '00:00:06.000000', 'BR01', 'WEST', '{"tran_id": "T20260201000001", "amount": -89.99}'),
(8, 'T', '2026-02-05 00:00:07', '2026-02-05', '00:00:07.000000', 'BR02', 'EAST', '{"tran_id": "T20260201000002", "amount": -5.75}'),
(9, 'C', '2026-02-05 00:00:08', '2026-02-05', '00:00:08.000000', 'BR03', 'SOUTH', '{"cust_id": 100000003, "first_name": "Robert", "last_name": "Williams"}'),
(10, 'A', '2026-02-05 00:00:09', '2026-02-05', '00:00:09.000000', 'BR03', 'SOUTH', '{"acct_id": 10000000003, "balance": 456.78}'),
(11, 'X', '2026-02-05 00:00:10', '2026-02-05', '00:00:10.000000', 'BR01', 'WEST', '{"card_number": "4532123456789001", "cust_id": 100000001}'),
(12, 'X', '2026-02-05 00:00:11', '2026-02-05', '00:00:11.000000', 'BR02', 'EAST', '{"card_number": "4532123456789002", "cust_id": 100000002}'),
(13, 'C', '2026-02-05 00:00:12', '2026-02-05', '00:00:12.000000', 'BR04', 'NORTH', '{"cust_id": 100000004, "first_name": "Patricia", "last_name": "Brown"}'),
(14, 'A', '2026-02-05 00:00:13', '2026-02-05', '00:00:13.000000', 'BR04', 'NORTH', '{"acct_id": 10000000004, "balance": 3456.89}'),
(15, 'D', '2026-02-05 00:00:14', '2026-02-05', '00:00:14.000000', 'BR04', 'NORTH', '{"card_number": "4532123456789004"}'),
(16, 'T', '2026-02-05 00:00:15', '2026-02-05', '00:00:15.000000', 'BR03', 'SOUTH', '{"tran_id": "T20260201000003", "amount": -45.00}'),
(17, 'T', '2026-02-05 00:00:16', '2026-02-05', '00:00:16.000000', 'BR04', 'NORTH', '{"tran_id": "T20260201000004", "amount": -127.34}'),
(18, 'C', '2026-02-05 00:00:17', '2026-02-05', '00:00:17.000000', 'BR01', 'WEST', '{"cust_id": 100000005, "first_name": "Michael", "last_name": "Jones"}'),
(19, 'A', '2026-02-05 00:00:18', '2026-02-05', '00:00:18.000000', 'BR01', 'WEST', '{"acct_id": 10000000005, "balance": 567.90}'),
(20, 'D', '2026-02-05 00:00:19', '2026-02-05', '00:00:19.000000', 'BR01', 'WEST', '{"card_number": "4532123456789005"}'),
(21, 'C', '2026-02-05 00:00:20', '2026-02-05', '00:00:20.000000', 'BR02', 'EAST', '{"cust_id": 100000006, "first_name": "Linda", "last_name": "Garcia"}'),
(22, 'A', '2026-02-05 00:00:21', '2026-02-05', '00:00:21.000000', 'BR02', 'EAST', '{"acct_id": 10000000006, "balance": 4567.01}'),
(23, 'T', '2026-02-05 00:00:22', '2026-02-05', '00:00:22.000000', 'BR01', 'WEST', '{"tran_id": "T20260202000005", "amount": 500.00}'),
(24, 'T', '2026-02-05 00:00:23', '2026-02-05', '00:00:23.000000', 'BR02', 'EAST', '{"tran_id": "T20260202000006", "amount": -156.78}'),
(25, 'C', '2026-02-05 00:00:24', '2026-02-05', '00:00:24.000000', 'BR03', 'SOUTH', '{"cust_id": 100000007, "first_name": "David", "last_name": "Martinez"}'),
(26, 'A', '2026-02-05 00:00:25', '2026-02-05', '00:00:25.000000', 'BR03', 'SOUTH', '{"acct_id": 10000000007, "balance": 678.12}'),
(27, 'X', '2026-02-05 00:00:26', '2026-02-05', '00:00:26.000000', 'BR03', 'SOUTH', '{"card_number": "4532123456789007", "cust_id": 100000007}'),
(28, 'D', '2026-02-05 00:00:27', '2026-02-05', '00:00:27.000000', 'BR04', 'NORTH', '{"card_number": "4532123456789008"}'),
(29, 'T', '2026-02-05 00:00:28', '2026-02-05', '00:00:28.000000', 'BR03', 'SOUTH', '{"tran_id": "T20260202000007", "amount": -42.50}'),
(30, 'T', '2026-02-05 00:00:29', '2026-02-05', '00:00:29.000000', 'BR04', 'NORTH', '{"tran_id": "T20260203000008", "amount": -289.99}');

-- ===================================================================
-- CREATE VIEWS (OPTIONAL)
-- ===================================================================

-- View for customer card details
CREATE OR REPLACE VIEW vw_customer_cards AS
SELECT
    c.cust_id,
    c.first_name,
    c.last_name,
    ca.card_number,
    ca.expiration_date,
    ca.active_status,
    a.acct_id,
    a.current_balance,
    a.credit_limit
FROM customer c
JOIN card_xref cx ON c.cust_id = cx.cust_id
JOIN card ca ON cx.card_number = ca.card_number
JOIN account a ON cx.acct_id = a.acct_id;

-- View for recent transactions
CREATE OR REPLACE VIEW vw_recent_transactions AS
SELECT
    t.tran_id,
    t.tran_desc,
    t.tran_amount,
    t.merchant_name,
    t.proc_timestamp,
    c.card_number,
    cust.first_name || ' ' || cust.last_name AS customer_name
FROM transaction t
JOIN card c ON t.card_number = c.card_number
JOIN card_xref cx ON c.card_number = cx.card_number
JOIN customer cust ON cx.cust_id = cust.cust_id
ORDER BY t.proc_timestamp DESC
LIMIT 100;

-- View for pending authorizations with card info
CREATE OR REPLACE VIEW vw_pending_auth_details AS
SELECT
    pa.auth_date_key,
    pa.auth_time_key,
    pa.card_number,
    pa.transaction_amt,
    pa.merchant_name,
    pa.match_status,
    c.embossed_name,
    a.acct_id,
    cust.first_name || ' ' || cust.last_name AS customer_name
FROM pending_authorization pa
JOIN card c ON pa.card_number = c.card_number
JOIN card_xref cx ON c.card_number = cx.card_number
JOIN account a ON cx.acct_id = a.acct_id
JOIN customer cust ON cx.cust_id = cust.cust_id
WHERE pa.match_status = 'P';

-- ===================================================================
-- GRANT PERMISSIONS (ADJUST AS NEEDED FOR SUPABASE)
-- ===================================================================

-- Note: Supabase uses Row Level Security (RLS)
-- Uncomment and adjust these if needed for your security model

-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON security_user TO authenticated;
-- GRANT SELECT ON transaction TO authenticated;

-- ===================================================================
-- COMPLETION MESSAGE
-- ===================================================================

DO $$
BEGIN
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'CardDemo Database Schema Successfully Created!';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Tables Created: 14';
    RAISE NOTICE 'Reference Data Records: ~70';
    RAISE NOTICE 'Customer Records: 30';
    RAISE NOTICE 'Account Records: 30';
    RAISE NOTICE 'Card Records: 30';
    RAISE NOTICE 'Security Users: 27';
    RAISE NOTICE 'Transactions: 30';
    RAISE NOTICE 'Daily Transactions: 30';
    RAISE NOTICE 'Pending Authorizations: 30';
    RAISE NOTICE 'Export Records: 30';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Views Created: 3';
    RAISE NOTICE '  - vw_customer_cards';
    RAISE NOTICE '  - vw_recent_transactions';
    RAISE NOTICE '  - vw_pending_auth_details';
    RAISE NOTICE '=================================================================';
END $$;
