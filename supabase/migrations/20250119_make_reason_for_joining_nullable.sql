-- Make reason_for_joining nullable since it was removed from the application form
ALTER TABLE member_applications
ALTER COLUMN reason_for_joining DROP NOT NULL;

-- Set default value for existing rows if needed
UPDATE member_applications
SET reason_for_joining = ''
WHERE reason_for_joining IS NULL;
