PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  full_name       TEXT,
  designation     TEXT,
  mobile          TEXT,
  alt_phone       TEXT,
  language        TEXT DEFAULT 'English',
  email_verified  INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'active',
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS companies (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  legal_name          TEXT,
  trading_name        TEXT,
  brn                 TEXT,
  business_type       TEXT,
  incorporation_date  TEXT,
  boi_number          TEXT,
  employee_count      TEXT,
  reg_address_1       TEXT,
  reg_address_2       TEXT,
  reg_city            TEXT,
  reg_district        TEXT,
  reg_province        TEXT,
  reg_postal_code     TEXT,
  maps_link           TEXT,
  bus_address_1       TEXT,
  bus_address_2       TEXT,
  bus_city            TEXT,
  bus_district        TEXT,
  bus_province        TEXT,
  bus_postal_code     TEXT,
  phone               TEXT,
  fax                 TEXT,
  email               TEXT,
  website             TEXT,
  contact_person      TEXT,
  contact_designation TEXT,
  about               TEXT,
  specializations     TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_user ON companies(user_id);

CREATE TABLE IF NOT EXISTS applications (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_no  TEXT UNIQUE NOT NULL,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id    INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  current_step  INTEGER NOT NULL DEFAULT 1,
  status        TEXT NOT NULL DEFAULT 'in_progress',
  submitted_at  TEXT,
  reviewed_at   TEXT,
  admin_notes   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);

CREATE TABLE IF NOT EXISTS application_steps (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  step_number    INTEGER NOT NULL,
  data           TEXT NOT NULL DEFAULT '{}',
  completed      INTEGER NOT NULL DEFAULT 0,
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (application_id, step_number)
);

CREATE TABLE IF NOT EXISTS documents (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  category      TEXT NOT NULL,
  label         TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type     TEXT,
  size          INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending',
  review_note   TEXT,
  uploaded_at   TEXT NOT NULL DEFAULT (datetime('now')),
  verified_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);

CREATE TABLE IF NOT EXISTS financials (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  turnover_range TEXT,
  vat_number    TEXT,
  vat_verified  INTEGER NOT NULL DEFAULT 0,
  epf_number    TEXT,
  epf_verified  INTEGER NOT NULL DEFAULT 0,
  etf_number    TEXT,
  etf_verified  INTEGER NOT NULL DEFAULT 0,
  bank_name     TEXT,
  bank_branch   TEXT,
  account_name  TEXT,
  account_number TEXT,
  swift         TEXT,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS insurance (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insurer     TEXT,
  policy_no   TEXT,
  coverage    TEXT,
  expiry_date TEXT
);

CREATE TABLE IF NOT EXISTS references_list (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL DEFAULT 'customer',
  company      TEXT,
  person       TEXT,
  phone        TEXT,
  email        TEXT,
  period       TEXT,
  annual_value TEXT,
  nature       TEXT
);

CREATE TABLE IF NOT EXISTS company_certifications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT,
  issuer      TEXT,
  cert_number TEXT,
  issue_date  TEXT,
  expiry_date TEXT
);

CREATE TABLE IF NOT EXISTS signatories (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT,
  designation   TEXT,
  nic           TEXT,
  is_primary    INTEGER NOT NULL DEFAULT 0,
  declared      INTEGER NOT NULL DEFAULT 0,
  declared_at   TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL DEFAULT '',
  type       TEXT NOT NULL DEFAULT 'info',
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

CREATE TABLE IF NOT EXISTS tickets (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject    TEXT NOT NULL,
  category   TEXT,
  priority   TEXT NOT NULL DEFAULT 'medium',
  status     TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id  INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  is_admin   INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_ticket ON ticket_messages(ticket_id);
