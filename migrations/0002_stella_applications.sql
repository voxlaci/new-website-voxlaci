-- STELLA 2026 applications, payments, rooming list, meals, workshops, concerts.
-- Lives in the same voxlaci-ramos D1 database as the RAMOS residency tables.

CREATE TABLE IF NOT EXISTS stella_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stella_id TEXT UNIQUE,
  language TEXT NOT NULL CHECK(language IN ('pt','en')),
  application_type TEXT NOT NULL CHECK(application_type IN ('choir_residence','choir_weekend','choir_day')),
  choir_name TEXT NOT NULL,
  country TEXT,
  city TEXT,
  conductor_name TEXT,
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  social_media TEXT,
  num_singers INTEGER NOT NULL,
  num_companions INTEGER NOT NULL DEFAULT 0,
  preferred_dates TEXT NOT NULL,
  biography TEXT,
  video_link TEXT,
  notes TEXT,
  amount_total_cents INTEGER,
  amount_paid_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'application_received'
    CHECK(status IN ('application_received','under_review','accepted','payment_pending','partially_paid','paid','confirmed','cancelled')),
  private_token TEXT UNIQUE NOT NULL,
  admin_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stella_app_status ON stella_applications(status);
CREATE INDEX IF NOT EXISTS idx_stella_app_id ON stella_applications(stella_id);
CREATE INDEX IF NOT EXISTS idx_stella_app_token ON stella_applications(private_token);

CREATE TABLE IF NOT EXISTS stella_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES stella_applications(id),
  amount_cents INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK(payment_method IN ('bank_transfer','paypal','revolut')),
  proof_key TEXT,
  proof_original_filename TEXT,
  proof_mime TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','confirmed','rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stella_payments_app ON stella_payments(application_id);

CREATE TABLE IF NOT EXISTS stella_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES stella_applications(id),
  room_ref TEXT,
  room_type TEXT CHECK(room_type IN ('single','twin','double','triple')),
  guest1 TEXT, guest1_role TEXT,
  guest2 TEXT, guest2_role TEXT,
  guest3 TEXT, guest3_role TEXT,
  share_with TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stella_rooms_app ON stella_rooms(application_id);

CREATE TABLE IF NOT EXISTS stella_meals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES stella_applications(id),
  meal_key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  vegetarian INTEGER NOT NULL DEFAULT 0,
  vegan INTEGER NOT NULL DEFAULT 0,
  gluten_free INTEGER NOT NULL DEFAULT 0,
  other_allergies TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stella_meals_app ON stella_meals(application_id);

CREATE TABLE IF NOT EXISTS stella_workshops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  leader TEXT,
  language TEXT,
  date TEXT,
  start_time TEXT,
  duration_minutes INTEGER,
  capacity INTEGER,
  price_cents INTEGER NOT NULL DEFAULT 0,
  registered_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stella_concerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT,
  start_time TEXT,
  venue TEXT,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER,
  tickets_sold INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
