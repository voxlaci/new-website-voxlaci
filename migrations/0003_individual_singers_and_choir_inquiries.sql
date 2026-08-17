-- UX revision: choir-vs-individual online paths for STELLA and RAMOS.

-- STELLA individual singers: interest capture only (no approved pricing yet, no payment).
CREATE TABLE IF NOT EXISTS stella_individual_interest (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stella_id TEXT UNIQUE,
  language TEXT NOT NULL CHECK(language IN ('pt','en')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  phone TEXT,
  interests TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stella_individual_email ON stella_individual_interest(email);

-- RAMOS individual singers: real, approved product (295€ audition fee) — full application lifecycle.
CREATE TABLE IF NOT EXISTS ramos_individual_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ramos_id TEXT UNIQUE,
  language TEXT NOT NULL CHECK(language IN ('pt','en')),
  track TEXT NOT NULL CHECK(track IN ('international','resident')),
  full_name TEXT NOT NULL,
  country TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  choir_institution TEXT,
  works_chosen TEXT,
  video_link TEXT,
  biography TEXT,
  notes TEXT,
  amount_total_cents INTEGER NOT NULL DEFAULT 29500,
  amount_paid_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'application_received'
    CHECK(status IN ('application_received','under_review','accepted','payment_pending','partially_paid','paid','confirmed','cancelled')),
  private_token TEXT UNIQUE NOT NULL,
  admin_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ramos_ind_status ON ramos_individual_applications(status);
CREATE INDEX IF NOT EXISTS idx_ramos_ind_id ON ramos_individual_applications(ramos_id);
CREATE INDEX IF NOT EXISTS idx_ramos_ind_token ON ramos_individual_applications(private_token);

CREATE TABLE IF NOT EXISTS ramos_individual_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES ramos_individual_applications(id),
  amount_cents INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK(payment_method IN ('bank_transfer','paypal','mbway')),
  proof_key TEXT,
  proof_original_filename TEXT,
  proof_mime TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','confirmed','rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ramos_ind_payments_app ON ramos_individual_payments(application_id);

-- RAMOS choirs: bespoke conditions, no fixed price — structured inquiry, not a checkout.
CREATE TABLE IF NOT EXISTS ramos_choir_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ramos_id TEXT UNIQUE,
  language TEXT NOT NULL CHECK(language IN ('pt','en')),
  choir_name TEXT NOT NULL,
  country TEXT,
  city TEXT,
  conductor_name TEXT,
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  num_singers INTEGER,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'received' CHECK(status IN ('received','contacted','closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ramos_choir_status ON ramos_choir_inquiries(status);

-- RAMOS Residência Artística: add a private-area token to existing registrations (additive, no other change).
ALTER TABLE residency_registrations ADD COLUMN private_token TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_residency_token ON residency_registrations(private_token);
