-- Casting VoxLaci: inscrições e pagamentos Stripe Checkout (pagamento único).
CREATE TABLE IF NOT EXISTS casting_applications (
  id TEXT PRIMARY KEY,
  private_token TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  age TEXT NOT NULL,
  country TEXT,
  telephone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  ensemble TEXT,
  experience TEXT,
  music_reading TEXT,
  source TEXT,
  recommendation TEXT,
  motivation TEXT,
  language TEXT NOT NULL DEFAULT 'pt',
  status TEXT NOT NULL DEFAULT 'payment_pending',
  payment_label TEXT NOT NULL DEFAULT 'Pagamento pendente',
  amount_cents INTEGER NOT NULL DEFAULT 2000,
  currency TEXT NOT NULL DEFAULT 'eur',
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_casting_applications_email
  ON casting_applications(email);
CREATE INDEX IF NOT EXISTS idx_casting_applications_status
  ON casting_applications(status, created_at);

CREATE TABLE IF NOT EXISTS casting_stripe_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  checkout_session_id TEXT,
  application_id TEXT,
  processed_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (application_id) REFERENCES casting_applications(id)
);
