-- STELLA 2026 — applications from solo artists to STELLA Mini Concerts.
CREATE TABLE IF NOT EXISTS stella_mini_concert_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  submission_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'received' CHECK(status IN ('received','under_review','selected','not_selected','closed')),
  full_name TEXT NOT NULL,
  artistic_name TEXT,
  age INTEGER NOT NULL,
  locality TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram TEXT,
  website_url TEXT,
  concert_title TEXT NOT NULL,
  main_instrument TEXT NOT NULL,
  artist_intro TEXT NOT NULL,
  concert_concept TEXT NOT NULL,
  repertoire TEXT NOT NULL,
  original_music TEXT NOT NULL CHECK(original_music IN ('yes','no','partly')),
  media_url TEXT NOT NULL,
  availability TEXT NOT NULL,
  first_preference TEXT NOT NULL,
  audience_estimate TEXT NOT NULL,
  promotion_plan TEXT NOT NULL,
  technical_instrument TEXT NOT NULL,
  needs_microphone INTEGER NOT NULL DEFAULT 0,
  needs_piano INTEGER NOT NULL DEFAULT 0,
  uses_backing_track INTEGER NOT NULL DEFAULT 0,
  technical_notes TEXT,
  photo_key TEXT NOT NULL,
  photo_filename TEXT NOT NULL,
  photo_mime TEXT NOT NULL,
  photo_size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_stella_mini_status ON stella_mini_concert_applications(status);
CREATE INDEX IF NOT EXISTS idx_stella_mini_email ON stella_mini_concert_applications(email);
CREATE INDEX IF NOT EXISTS idx_stella_mini_created ON stella_mini_concert_applications(created_at);
