/*
  # Fix event registrations RLS policies

  1. Changes
    - Drop existing RLS policies
    - Create new, more specific policies for CRUD operations
    - Ensure device_id checking works correctly
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON event_registrations;
DROP POLICY IF EXISTS "Allow public insert access" ON event_registrations;
DROP POLICY IF EXISTS "Enable delete for users with matching device_id" ON event_registrations;
DROP POLICY IF EXISTS "Enable update for users with matching device_id" ON event_registrations;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON event_registrations FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert access for all users"
ON event_registrations FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable delete for users with matching device_id"
ON event_registrations FOR DELETE
TO public
USING (
  device_id = current_setting('app.device_id'::text, true)::text
);

CREATE POLICY "Enable update for users with matching device_id"
ON event_registrations FOR UPDATE
TO public
USING (
  device_id = current_setting('app.device_id'::text, true)::text
)
WITH CHECK (
  device_id = current_setting('app.device_id'::text, true)::text
);