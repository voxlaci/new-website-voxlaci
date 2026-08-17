-- voX±Pop: registration/interest capture (no online payment — payment happens on Eventbrite)
-- and "Bring voX±Pop to your city" proposals.

CREATE TABLE IF NOT EXISTS voxpop_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  voxpop_id TEXT UNIQUE,
  language TEXT NOT NULL CHECK(language IN ('pt','en')),
  city_slug TEXT NOT NULL,
  participation_type TEXT NOT NULL CHECK(participation_type IN ('individual','choir','group','conductor','other')),
  full_name TEXT NOT NULL,
  choir_name TEXT,
  country TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT,
  participation_option TEXT NOT NULL CHECK(participation_option IN ('festival_only','festival_dinner')),
  voice_type TEXT,
  choir_experience TEXT,
  reads_music TEXT,
  num_singers INTEGER,
  voice_distribution TEXT,
  conductor_name TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_voxpop_reg_city ON voxpop_registrations(city_slug);
CREATE INDEX IF NOT EXISTS idx_voxpop_reg_email ON voxpop_registrations(email);

CREATE TABLE IF NOT EXISTS voxpop_city_proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  voxpop_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  organisation TEXT,
  role TEXT,
  city TEXT NOT NULL,
  country TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
