-- voX±Pop v2: configurable editions with capacity, atomic confirmed_count, payments.
-- Extends (does not replace) voxpop_registrations from migration 0004 — existing rows preserved.

CREATE TABLE IF NOT EXISTS voxpop_editions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  venue TEXT,
  address TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK(status IN ('preparing','coming_soon','open','last_spots','sold_out','waitlist','closed','done')),
  capacity INTEGER NOT NULL DEFAULT 150,
  confirmed_count INTEGER NOT NULL DEFAULT 0,
  price_individual_cents INTEGER,
  price_group_cents INTEGER,
  dinner_addon_cents INTEGER,
  dinner_standalone_cents INTEGER,
  addons_json TEXT,
  registration_deadline TEXT,
  eventbrite_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_voxpop_editions_slug ON voxpop_editions(slug);
CREATE INDEX IF NOT EXISTS idx_voxpop_editions_status ON voxpop_editions(status);

-- Real, already-published data only (verified live on Eventbrite / existing site copy — nothing invented).
INSERT INTO voxpop_editions (slug, city, country, venue, address, start_date, end_date, status, capacity, price_individual_cents, dinner_addon_cents, dinner_standalone_cents, addons_json, registration_deadline, eventbrite_url) VALUES
  ('lisboa', 'Lisboa', 'Portugal', 'Câmara Municipal de Lisboa', 'Praça do Município, 1149-014 Lisboa', '2026-09-10', '2026-09-13', 'open', 150, 9900, 2500, 5000, '["Surf","Boat","Visit Sintra","Guincho","Fado"]', '2026-09-09', 'https://www.eventbrite.pt/e/lisboa-vox-pop-september-2026-tickets-1759362824569'),
  ('cascais', 'Cascais', 'Portugal', 'Câmara Municipal de Cascais', NULL, '2027-06-10', '2027-06-13', 'open', 150, 9900, NULL, NULL, '["Surf","Boat","Visit Sintra","Guincho","Lisboa Fado"]', NULL, 'https://www.eventbrite.pt/e/cascais-vox-pop-june-2027-tickets-1750076809849'),
  ('porto', 'Porto', 'Portugal', 'Igreja da Lapa', NULL, '2027-02-04', '2027-02-07', 'open', 150, 9900, NULL, NULL, '["Surf","Boat","Fado"]', NULL, 'https://www.eventbrite.pt/e/porto-vox-pop-february-2027-tickets-1750029468249'),
  ('monopoli', 'Monopoli', 'Italia', 'Centro storico di Monopoli', NULL, '2027-05-06', '2027-05-09', 'open', 150, 9900, NULL, NULL, '["Surf","Boat","Fado"]', NULL, 'https://www.eventbrite.pt/e/monopoli-vox-pop-may-2027-tickets-1759248793499'),
  ('london', 'London', 'United Kingdom', NULL, NULL, NULL, NULL, 'coming_soon', 150, NULL, NULL, NULL, NULL, NULL, NULL),
  ('dakar', 'Dakar', 'Senegal', NULL, NULL, NULL, NULL, 'coming_soon', 150, NULL, NULL, NULL, NULL, NULL, NULL);

ALTER TABLE voxpop_registrations ADD COLUMN edition_id INTEGER REFERENCES voxpop_editions(id);
ALTER TABLE voxpop_registrations ADD COLUMN status TEXT NOT NULL DEFAULT 'received'
  CHECK(status IN ('received','payment_pending','payment_review','confirmed','cancelled','waitlist'));
ALTER TABLE voxpop_registrations ADD COLUMN num_participants INTEGER NOT NULL DEFAULT 1;
ALTER TABLE voxpop_registrations ADD COLUMN amount_total_cents INTEGER;
ALTER TABLE voxpop_registrations ADD COLUMN amount_paid_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE voxpop_registrations ADD COLUMN addons_selected TEXT;
ALTER TABLE voxpop_registrations ADD COLUMN dinner_selected INTEGER NOT NULL DEFAULT 0;
ALTER TABLE voxpop_registrations ADD COLUMN admin_note TEXT;
ALTER TABLE voxpop_registrations ADD COLUMN updated_at TEXT;
CREATE INDEX IF NOT EXISTS idx_voxpop_reg_edition ON voxpop_registrations(edition_id);
CREATE INDEX IF NOT EXISTS idx_voxpop_reg_status ON voxpop_registrations(status);

CREATE TABLE IF NOT EXISTS voxpop_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id INTEGER NOT NULL REFERENCES voxpop_registrations(id),
  amount_cents INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK(payment_method IN ('bank_transfer','paypal','revolut','mbway')),
  proof_key TEXT,
  proof_original_filename TEXT,
  proof_mime TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','confirmed','rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_voxpop_payments_reg ON voxpop_payments(registration_id);
