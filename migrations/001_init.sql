-- LexSEA Database Schema
-- Aurora PostgreSQL 16.x

-- ============================================================
-- JURISDICTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS jurisdictions (
  id   SERIAL PRIMARY KEY,
  code VARCHAR(5)   UNIQUE NOT NULL,  -- 'ID', 'SG'
  name VARCHAR(100) NOT NULL
);

-- ============================================================
-- DOCUMENT TYPES
-- ============================================================
CREATE TABLE IF NOT EXISTS document_types (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(50)  UNIQUE NOT NULL,  -- 'nda', 'pkwt', 'service-agreement'
  name        VARCHAR(100) NOT NULL,
  description TEXT
);

-- ============================================================
-- CLAUSES
-- Each clause belongs to one document type + one jurisdiction.
-- article_ref traces back to a specific law (audit trail).
-- ============================================================
CREATE TABLE IF NOT EXISTS clauses (
  id               SERIAL PRIMARY KEY,
  document_type_id INTEGER REFERENCES document_types(id) ON DELETE CASCADE,
  jurisdiction_id  INTEGER REFERENCES jurisdictions(id)  ON DELETE CASCADE,
  clause_key       VARCHAR(100) NOT NULL,   -- e.g. 'confidentiality_scope'
  content          TEXT NOT NULL,
  article_ref      VARCHAR(200),            -- e.g. 'Pasal 59 UU No.13/2003'
  sort_order       INTEGER DEFAULT 0,
  is_required      BOOLEAN DEFAULT true     -- always included vs conditional
);

-- ============================================================
-- CLAUSE CONDITIONS
-- Conditional clauses are only selected when answers match.
-- ============================================================
CREATE TABLE IF NOT EXISTS clause_conditions (
  id              SERIAL PRIMARY KEY,
  clause_id       INTEGER REFERENCES clauses(id) ON DELETE CASCADE,
  condition_key   VARCHAR(100) NOT NULL,   -- e.g. 'employment_type'
  condition_value VARCHAR(100) NOT NULL    -- e.g. 'full_time'
);

-- ============================================================
-- QUESTIONNAIRE FIELDS
-- Questions shown to users per document type + jurisdiction.
-- ============================================================
CREATE TABLE IF NOT EXISTS questionnaire_fields (
  id               SERIAL PRIMARY KEY,
  document_type_id INTEGER REFERENCES document_types(id) ON DELETE CASCADE,
  jurisdiction_id  INTEGER REFERENCES jurisdictions(id)  ON DELETE CASCADE,
  field_key        VARCHAR(100) NOT NULL,
  question_text    TEXT NOT NULL,
  field_type       VARCHAR(20)  NOT NULL CHECK (field_type IN ('select', 'text', 'boolean', 'date')),
  options          JSONB,        -- [{"value": "full_time", "label": "Full Time"}]
  sort_order       INTEGER DEFAULT 0,
  is_required      BOOLEAN DEFAULT true
);

-- ============================================================
-- GENERATED DOCUMENTS (audit log)
-- ============================================================
CREATE TABLE IF NOT EXISTS generated_documents (
  id               SERIAL PRIMARY KEY,
  document_type_id INTEGER REFERENCES document_types(id),
  jurisdiction_id  INTEGER REFERENCES jurisdictions(id),
  answers          JSONB NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  session_id       VARCHAR(100)   -- anonymous session, no PII
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clauses_doctype_jurisdiction
  ON clauses (document_type_id, jurisdiction_id);

CREATE INDEX IF NOT EXISTS idx_qfields_doctype_jurisdiction
  ON questionnaire_fields (document_type_id, jurisdiction_id);

CREATE INDEX IF NOT EXISTS idx_clause_conditions_clause
  ON clause_conditions (clause_id);
