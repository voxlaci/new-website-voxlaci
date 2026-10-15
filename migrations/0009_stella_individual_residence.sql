-- STELLA 2026 — autonomous Individual Residence, separate from choir applications.
CREATE TABLE IF NOT EXISTS stella_individual_residences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE,
  language TEXT NOT NULL CHECK(language IN ('pt','en')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  date_of_birth TEXT,
  weekend TEXT NOT NULL CHECK(weekend IN ('2026-12-04_06','2026-12-11_13')),
  participant_role TEXT NOT NULL CHECK(participant_role IN ('singer','conductor','music_teacher','other')),
  voice_type TEXT,
  dietary_restrictions TEXT,
  accessibility_needs TEXT,
  comments TEXT,
  product_name TEXT NOT NULL DEFAULT 'STELLA 2026 – Individual Residence',
  amount_cents INTEGER NOT NULL DEFAULT 36900,
  payment_method TEXT NOT NULL CHECK(payment_method IN ('bank_transfer','paypal','mbway')),
  proof_key TEXT NOT NULL,
  proof_original_filename TEXT NOT NULL,
  proof_mime TEXT,
  status TEXT NOT NULL DEFAULT 'payment_submitted'
    CHECK(status IN ('payment_submitted','confirmed','rejected','cancelled')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_stella_individual_residence_email ON stella_individual_residences(email);
CREATE INDEX IF NOT EXISTS idx_stella_individual_residence_status ON stella_individual_residences(status);
CREATE INDEX IF NOT EXISTS idx_stella_individual_residence_weekend ON stella_individual_residences(weekend);
