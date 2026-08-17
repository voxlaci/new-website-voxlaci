-- RAMOS 2027 Artistic Residency registrations
-- Single source of truth for PT + EN registration flows.

CREATE TABLE IF NOT EXISTS residency_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE NOT NULL,
  language TEXT NOT NULL CHECK(language IN ('pt','en')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  mobile TEXT,
  choir_institution TEXT,
  role TEXT NOT NULL,
  room_type TEXT NOT NULL CHECK(room_type IN ('single','shared')),
  amount_due_cents INTEGER NOT NULL,
  share_known INTEGER,
  share_names TEXT,
  payment_method TEXT NOT NULL CHECK(payment_method IN ('bank_transfer','paypal','revolut')),
  proof_key TEXT,
  proof_original_filename TEXT,
  proof_mime TEXT,
  proof_size INTEGER,
  status TEXT NOT NULL DEFAULT 'payment_submitted'
    CHECK(status IN ('pending_payment','payment_submitted','confirmed','cancelled','expired')),
  admin_note TEXT,
  seminario_email_sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_residency_status ON residency_registrations(status);
CREATE INDEX IF NOT EXISTS idx_residency_reference ON residency_registrations(reference);
CREATE INDEX IF NOT EXISTS idx_residency_email ON residency_registrations(email);
