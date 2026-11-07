-- Delivery audit for STELLA Mini Concerts application emails.
ALTER TABLE stella_mini_concert_applications ADD COLUMN candidate_email_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE stella_mini_concert_applications ADD COLUMN candidate_email_id TEXT;
ALTER TABLE stella_mini_concert_applications ADD COLUMN internal_email_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE stella_mini_concert_applications ADD COLUMN internal_email_id TEXT;
ALTER TABLE stella_mini_concert_applications ADD COLUMN email_last_error TEXT;
