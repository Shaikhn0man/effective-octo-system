# CardDemo Application - To-Be ERD Schema

**Generated:** 2026-02-05
**Source:** Legacy COBOL/CICS Application with VSAM Data Stores
**Target:** Relational Database System

## Overview

This directory contains the Entity-Relationship Diagram (ERD) schema for the CardDemo credit card management system. The schema has been reverse-engineered from the legacy COBOL/VSAM codebase and represents the **to-be state** for modernization to a relational database.

## Files

### 1. `to-be-erd.yaml`
**Comprehensive YAML schema** optimized for agent/tool consumption and detailed documentation.

- **Best for:** Automated processing, data migration tools, code generation
- **Format:** Structured YAML with complete metadata
- **Contains:**
  - Detailed entity definitions with COBOL copybook mappings
  - Full attribute specifications with PIC clauses
  - VSAM file definitions and key structures
  - Relationship definitions with cardinality
  - Business rules and migration notes
  - Data type mappings (COBOL → Relational)

**Usage:**
```yaml
# Parse with any YAML library
import yaml
with open('to-be-erd.yaml') as f:
    schema = yaml.safe_load(f)

# Access entities
for entity_name, entity_def in schema['entities'].items():
    print(f"Entity: {entity_name}")
    print(f"  VSAM: {entity_def['source_vsam']}")
    print(f"  Copybook: {entity_def['source_copybook']}")
```

### 2. `to-be-schema.dbml`
**Database Markup Language (DBML)** schema for visualization and documentation.

- **Best for:** Visual ERD generation, team communication, documentation
- **Format:** DBML - industry-standard database modeling language
- **Contains:**
  - Table definitions with columns and constraints
  - Primary keys, foreign keys, and indexes
  - Relationships with referential integrity
  - Table groups for organization
  - Inline documentation and notes

**Usage:**
```bash
# Visualize online at dbdiagram.io
# 1. Go to https://dbdiagram.io
# 2. Import the to-be-schema.dbml file
# 3. View interactive ERD

# Or use dbml-cli
npm install -g @dbml/cli
dbml2sql to-be-schema.dbml --postgres > schema.sql
dbml2sql to-be-schema.dbml --mysql > schema_mysql.sql
```

### 3. `README.md` (this file)
Documentation and usage guide for the schema files.

## System Architecture

### Core Entities

| Entity | VSAM File | Copybook | Description |
|--------|-----------|----------|-------------|
| **Customer** | CUSTDATA.VSAM.KSDS | CVCUS01Y.cpy | Customer master data |
| **Account** | ACCTDATA.VSAM.KSDS | CVACT01Y.cpy | Credit card accounts |
| **Card** | CARDDATA.VSAM.KSDS | CVCRD01Y.cpy | Physical card details |
| **CardXref** | CARDXREF.VSAM.KSDS | CVACT03Y.cpy | Card-Customer-Account junction |
| **Transaction** | TRANSACT.VSAM.KSDS | CVTRA05Y.cpy | Transaction records |

### Reference Data

| Entity | VSAM File | Copybook | Description |
|--------|-----------|----------|-------------|
| **TransactionType** | TRANTYPE.VSAM.KSDS | CVTRA03Y.cpy | Transaction type lookup |
| **TransactionCategory** | TRANCATG.VSAM.KSDS | CVTRA04Y.cpy | Transaction category lookup |
| **DisclosureGroup** | DISCGRP.VSAM.KSDS | CVTRA02Y.cpy | Interest rate disclosure groups |

### Balance & Security

| Entity | VSAM File | Copybook | Description |
|--------|-----------|----------|-------------|
| **TransactionCategoryBalance** | TCATBALF.VSAM.KSDS | CVTRA01Y.cpy | Balance by category |
| **SecurityUser** | USRSEC.VSAM.KSDS | CSUSR01Y.cpy | System users |

## Entity Relationships

```
Customer ←→ CardXref ←→ Card → Account
                ↓
            Transaction → TransactionType
                ↓              ↓
         TransactionCategory ←┘
                ↓
    TransactionCategoryBalance → Account → DisclosureGroup
                                             ↓
                                    TransactionCategory
```

### Key Relationships

1. **Customer ↔ Card ↔ Account (Many-to-Many)**
   - Junction table: `CardXref`
   - A customer can have multiple cards
   - A card can have multiple authorized users
   - An account can have multiple cards

2. **Transaction → Card**
   - Each transaction uses one card
   - Via card, transactions link to accounts and customers

3. **Transaction → TransactionType → TransactionCategory**
   - Hierarchical transaction classification
   - Type (e.g., "DB" = Debit) → Category (e.g., "0001" = Purchase)

4. **Account → DisclosureGroup**
   - Accounts grouped for interest rate disclosure
   - Rates vary by transaction type/category

5. **TransactionCategoryBalance → Account**
   - Tracks balance breakdown per category
   - Aggregated from transactions

## VSAM to Relational Mapping

### Key Structures

| VSAM Concept | Relational Equivalent |
|--------------|----------------------|
| KSDS (Key-Sequenced Data Set) | Table with PRIMARY KEY |
| Primary Key | PRIMARY KEY constraint |
| Alternate Index (AIX) | INDEX / UNIQUE constraint |
| Record | Row |
| Field | Column |
| RECORDSIZE | Not applicable (variable length) |

### Data Type Mappings

| COBOL Format | Relational Type | Example |
|--------------|----------------|---------|
| PIC 9(n) | INTEGER / NUMERIC(n) | `PIC 9(09)` → `NUMERIC(9)` |
| PIC X(n) | VARCHAR(n) | `PIC X(25)` → `VARCHAR(25)` |
| PIC S9(n)V99 | DECIMAL(n+2, 2) | `PIC S9(10)V99` → `DECIMAL(12,2)` |
| PIC X(10) (date) | DATE | `YYYY-MM-DD` string → `DATE` |
| PIC X(26) (timestamp) | TIMESTAMP | ISO timestamp |

### Alternate Indexes Identified

1. **CARDDATA.VSAM.AIX**
   - Key: `CARD-ACCT-ID` (position 16, length 11)
   - Purpose: Lookup cards by account

2. **CARDXREF.VSAM.AIX**
   - Key: `XREF-ACCT-ID` (position 25, length 11)
   - Purpose: Lookup cross-references by account

3. **TRANSACT.VSAM.AIX**
   - Key: `TRAN-PROC-TS` (position 304, length 26)
   - Purpose: Lookup transactions by processing timestamp

## Migration Considerations

### Data Quality Issues

1. **Fixed-Length Strings**
   - COBOL strings are space-padded
   - **Action:** Trim trailing spaces during migration

2. **Date Formats**
   - Stored as string `YYYY-MM-DD` in COBOL
   - **Action:** Convert to native DATE type

3. **Numeric Precision**
   - COBOL packed decimals may have precision differences
   - **Action:** Validate ranges and precision requirements

### Security & Compliance

1. **PII/Sensitive Data**
   - `Customer.ssn` - SSN (PII)
   - `Customer.govt_issued_id` - Government ID (PII)
   - `Card.card_number` - PAN (PCI DSS)
   - `Card.cvv_code` - CVV (PCI DSS)
   - `SecurityUser.password` - Credentials

   **Actions:**
   - Implement encryption at rest
   - Hash passwords (bcrypt, PBKDF2)
   - Tokenize card numbers
   - Implement field-level access controls

2. **Audit Trail**
   - Original VSAM has no audit fields
   - **Action:** Add `created_date`, `updated_date`, `created_by`, `updated_by`

### Performance Optimization

1. **Indexes**
   - Preserve all VSAM alternate indexes as database indexes
   - Add composite indexes for common query patterns
   - Consider covering indexes for reporting queries

2. **Partitioning**
   - `Transaction` table is high-volume
   - **Action:** Consider partitioning by `proc_timestamp` (monthly/yearly)

3. **Archival**
   - Implement transaction archival strategy
   - Move old transactions to historical tables

## Business Rules

1. Customer must have at least one card (via `CardXref`)
2. Each card must be associated with exactly one account
3. Transactions reference cards, which reference accounts and customers
4. Transaction categories are hierarchical: Type → Category
5. Account balances can be calculated by transaction category
6. Interest rates determined by disclosure group and transaction category
7. All monetary amounts are signed decimals with 2 decimal places
8. All dates use `YYYY-MM-DD` format in legacy system

## SQL Generation Examples

### PostgreSQL
```bash
dbml2sql to-be-schema.dbml --postgres > carddemo_postgres.sql
```

### MySQL
```bash
dbml2sql to-be-schema.dbml --mysql > carddemo_mysql.sql
```

### Oracle / DB2
Manual conversion required from DBML or use YAML for custom generation.

## Visualization

### Option 1: dbdiagram.io (Recommended)
1. Visit https://dbdiagram.io
2. Click "Import" → Choose `to-be-schema.dbml`
3. View interactive ERD with relationships
4. Export as PDF/PNG for documentation

### Option 2: Mermaid (for Markdown)
Convert DBML to Mermaid for GitHub/GitLab rendering:
```bash
# Use online tools or custom scripts
# Example output:
erDiagram
    CUSTOMER ||--o{ CARDXREF : has
    CARD ||--o{ CARDXREF : has
    ACCOUNT ||--o{ CARDXREF : has
    ACCOUNT ||--o{ CARD : contains
    CARD ||--o{ TRANSACTION : uses
```

### Option 3: Database Modeling Tools
Import DBML into:
- **DbSchema** (https://dbschema.com)
- **DBeaver** (ERD editor)
- **Lucidchart** (via SQL import)
- **draw.io** (manual recreation)

## Source Code Analysis

### Analyzed Files

**COBOL Programs:** 44 programs
**Copybooks:** 61 copybooks
**JCL Files:** 60+ job control scripts

**Key Copybooks:**
- `CVCUS01Y.cpy` - Customer record
- `CVACT01Y.cpy` - Account record
- `CVCRD01Y.cpy` / `CVACT02Y.cpy` - Card record
- `CVACT03Y.cpy` - Card cross-reference
- `CVTRA01Y.cpy` - Transaction category balance
- `CVTRA02Y.cpy` - Disclosure group
- `CVTRA03Y.cpy` - Transaction type
- `CVTRA04Y.cpy` - Transaction category
- `CVTRA05Y.cpy` - Transaction record
- `CSUSR01Y.cpy` - Security user

**Key JCL Files:**
- `CUSTFILE.jcl` - Customer VSAM definition
- `ACCTFILE.jcl` - Account VSAM definition
- `CARDFILE.jcl` - Card VSAM definition (with AIX)
- `XREFFILE.jcl` - Cross-reference VSAM definition (with AIX)
- `TRANFILE.jcl` - Transaction VSAM definition (with AIX)
- `TRANTYPE.jcl` - Transaction type VSAM definition
- `TRANCATG.jcl` - Transaction category VSAM definition
- `TCATBALF.jcl` - Category balance VSAM definition
- `DISCGRP.jcl` - Disclosure group VSAM definition
- `DUSRSECJ.jcl` - Security user VSAM definition

## Next Steps

### 1. Review & Validation
- [ ] Review schema with business stakeholders
- [ ] Validate relationships and cardinality
- [ ] Confirm data type mappings
- [ ] Identify missing attributes or entities

### 2. Enhance Schema
- [ ] Add audit columns (created_date, updated_date, etc.)
- [ ] Normalize address data (consider separate Address table)
- [ ] Add surrogate keys where appropriate
- [ ] Define CHECK constraints for enums
- [ ] Add DEFAULT values

### 3. Generate DDL
- [ ] Choose target database (PostgreSQL, MySQL, Oracle, DB2)
- [ ] Generate CREATE TABLE statements
- [ ] Generate CREATE INDEX statements
- [ ] Generate foreign key constraints
- [ ] Add comments/documentation

### 4. Data Migration
- [ ] Design ETL pipeline (VSAM → Relational)
- [ ] Handle character encoding (EBCDIC → ASCII/UTF-8)
- [ ] Implement data validation rules
- [ ] Design rollback strategy
- [ ] Plan cutover approach

### 5. Application Modernization
- [ ] Rewrite COBOL business logic
- [ ] Implement ORM mappings
- [ ] Create REST APIs
- [ ] Design modern UI
- [ ] Implement security controls

## Tools & Resources

### DBML Tools
- **dbdiagram.io** - Online ERD visualization
- **@dbml/cli** - Command-line DBML tools
- **DBML Documentation** - https://dbml.dbdiagram.io/docs/

### YAML Processing
- **Python:** PyYAML, ruamel.yaml
- **JavaScript:** js-yaml
- **Java:** SnakeYAML
- **Go:** gopkg.in/yaml.v3

### Migration Tools
- **AWS SCT** (Schema Conversion Tool)
- **Flyway** - Database migrations
- **Liquibase** - Database change management
- **dbt** - Data transformation

## Contact & Support

For questions about this schema or the CardDemo modernization project:
- Review the source COBOL codebase in `/Users/1000057326/projects/Workspace/agentspace/legacy/codebase`
- Consult the original AWS CardDemo documentation
- Contact the modernization team

---

**Schema Version:** 1.0
**Last Updated:** 2026-02-05
**Generated by:** Claude Code - ERD Analysis Tool
