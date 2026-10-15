-- Add the two commercial accommodation choices to STELLA Individual Residence.
ALTER TABLE stella_individual_residences ADD COLUMN accommodation_type TEXT
  CHECK(accommodation_type IN ('single','shared'));
ALTER TABLE stella_individual_residences ADD COLUMN second_guest_name TEXT;

