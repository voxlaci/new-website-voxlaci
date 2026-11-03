-- Rastreabilidade técnica do envio de emails de Casting.
-- Não guarda conteúdo adicional da candidatura nem altera dados existentes.
ALTER TABLE casting_applications ADD COLUMN submission_key TEXT;
ALTER TABLE casting_applications ADD COLUMN notification_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE casting_applications ADD COLUMN internal_email_id TEXT;
ALTER TABLE casting_applications ADD COLUMN candidate_email_id TEXT;
ALTER TABLE casting_applications ADD COLUMN notification_error TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_casting_applications_submission_key
  ON casting_applications(submission_key)
  WHERE submission_key IS NOT NULL;

