-- STELLA 2026 — campaign attribution (UTM) on choir applications.
-- Additive only: lets completed applications be attributed to an outreach
-- campaign/segment (e.g. utm_campaign=stella_residence_2026, utm_content=ireland_choirs).

ALTER TABLE stella_applications ADD COLUMN utm_source TEXT;
ALTER TABLE stella_applications ADD COLUMN utm_medium TEXT;
ALTER TABLE stella_applications ADD COLUMN utm_campaign TEXT;
ALTER TABLE stella_applications ADD COLUMN utm_content TEXT;
ALTER TABLE stella_applications ADD COLUMN utm_term TEXT;

CREATE INDEX IF NOT EXISTS idx_stella_app_utm_campaign ON stella_applications(utm_campaign);
