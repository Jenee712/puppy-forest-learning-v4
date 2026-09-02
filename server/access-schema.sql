PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  access_tier TEXT NOT NULL DEFAULT 'A' CHECK (access_tier IN ('A', 'B', 'C')),
  current_grade TEXT NOT NULL DEFAULT 'G1',
  display_name TEXT NOT NULL DEFAULT '森林家长',
  coin_balance INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS grade_entitlements (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  grade TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  order_id TEXT,
  unlocked_at INTEGER NOT NULL,
  PRIMARY KEY (account_id, grade)
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS access_audit_log (
  id TEXT PRIMARY KEY,
  operator_account_id TEXT NOT NULL REFERENCES accounts(id),
  target_account_id TEXT NOT NULL REFERENCES accounts(id),
  action TEXT NOT NULL,
  detail TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_account_idx ON sessions(account_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS access_audit_target_idx ON access_audit_log(target_account_id);
