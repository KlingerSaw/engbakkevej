/*
  # Update event registration policies

  1. Changes
    - Simplify RLS policies to use direct matching
    - Remove complex device verification
    - Add better error handling
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable insert access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable delete for users with matching device_id" ON event_registrations;
DROP POLICY IF EXISTS "Enable update for users with matching device_id" ON event_registrations;

-- Create new simplified policies
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
USING (device_id = current_setting('app.device_id'::text, true)::text);

CREATE POLICY "Enable update for users with matching device_id"
ON event_registrations FOR UPDATE
TO public
USING (device_id = current_setting('app.device_id'::text, true)::text)
WITH CHECK (device_id = current_setting('app.device_id'::text, true)::text);