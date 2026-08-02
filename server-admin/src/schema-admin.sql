-- Admin-side tables (share the same SQLite database as the supplier side)

CREATE TABLE IF NOT EXISTS admin_users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  full_name      TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'Admin',
  otp_code       TEXT,
  phone_masked   TEXT,
  email_masked   TEXT,
  status         TEXT NOT NULL DEFAULT 'active',
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until   TEXT,
  last_login     TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

CREATE TABLE IF NOT EXISTS audit_logs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user       TEXT NOT NULL,
  role       TEXT NOT NULL,
  action     TEXT NOT NULL,
  module     TEXT,
  entity     TEXT,
  ip         TEXT,
  detail     TEXT,
  success    INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_module ON audit_logs(module);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

CREATE TABLE IF NOT EXISTS blacklist (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  company    TEXT NOT NULL,
  code       TEXT,
  reason     TEXT,
  severity   TEXT NOT NULL DEFAULT 'Medium',
  listed_by  TEXT,
  listed_at  TEXT NOT NULL DEFAULT (datetime('now')),
  reapply    TEXT DEFAULT 'Never',
  contact    TEXT,
  status     TEXT NOT NULL DEFAULT 'listed'
);

CREATE TABLE IF NOT EXISTS admin_notifications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  description TEXT,
  type        TEXT NOT NULL DEFAULT 'system',
  priority    TEXT NOT NULL DEFAULT 'normal',
  is_read     INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT UNIQUE NOT NULL,
  active    INTEGER NOT NULL DEFAULT 1,
  suppliers INTEGER NOT NULL DEFAULT 0,
  products  TEXT
);

CREATE TABLE IF NOT EXISTS workflow_stages (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  stage    TEXT NOT NULL,
  assignee TEXT NOT NULL,
  sla      TEXT NOT NULL,
  active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS system_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users_managed (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  role       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'active',
  last_login TEXT
);

CREATE TABLE IF NOT EXISTS report_definitions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  type       TEXT NOT NULL,
  schedule   TEXT,
  last_run   TEXT,
  next_run   TEXT,
  recipients INTEGER NOT NULL DEFAULT 0,
  active     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS generated_reports (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  type         TEXT NOT NULL,
  generated_by TEXT,
  generated_at TEXT NOT NULL DEFAULT (datetime('now')),
  size         TEXT
);

CREATE TABLE IF NOT EXISTS mail_messages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  folder       TEXT NOT NULL DEFAULT 'inbox',
  sender       TEXT,
  sender_email TEXT,
  subject      TEXT NOT NULL,
  preview      TEXT,
  tag          TEXT,
  time         TEXT,
  unread       INTEGER NOT NULL DEFAULT 0,
  starred      INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mail_templates (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  description TEXT,
  used        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mail_campaigns (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  type        TEXT,
  recipients  INTEGER NOT NULL DEFAULT 0,
  sent        TEXT,
  opened      TEXT,
  status      TEXT NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS performance_reviews (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  cycle       TEXT NOT NULL,
  review_date TEXT,
  score       INTEGER NOT NULL DEFAULT 0,
  reviewed_by TEXT,
  note        TEXT,
  band        TEXT
);

CREATE INDEX IF NOT EXISTS idx_perf_reviews_supplier ON performance_reviews(supplier_id);

CREATE TABLE IF NOT EXISTS evaluation_scores (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  pillar         TEXT NOT NULL,
  score          INTEGER NOT NULL DEFAULT 0,
  max            INTEGER NOT NULL DEFAULT 100
);

CREATE INDEX IF NOT EXISTS idx_eval_scores_app ON evaluation_scores(application_id);

CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  po          TEXT,
  item        TEXT,
  order_date  TEXT,
  value       TEXT,
  status      TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_supplier ON orders(supplier_id);
