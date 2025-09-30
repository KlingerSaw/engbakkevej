/*
  # Fix event registration deletion

  1. Changes
    - Add NOT NULL constraint to device_id column
    - Update existing rows with a default value
    - Add RLS policy for deletion
*/

-- First set a default value for existing rows
UPDATE event_registrations 
SET device_id = 'legacy_user' 
WHERE device_id IS NULL;

-- Make device_id required
ALTER TABLE event_registrations 
ALTER COLUMN device_id SET NOT NULL;

-- Add policy for deletion
CREATE POLICY "Enable delete for users with matching device_id" ON event_registrations
FOR DELETE USING (
  device_id = current_setting('app.device_id', true)::text
);