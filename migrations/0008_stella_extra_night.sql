-- STELLA Choir Residence — optional extra night from Sunday to Monday.
-- The choice is stored per room and applies to each named guest in that room.

ALTER TABLE stella_rooms ADD COLUMN extra_night_option TEXT NOT NULL DEFAULT 'none'
  CHECK(extra_night_option IN ('none', 'with_dinner', 'without_dinner'));
