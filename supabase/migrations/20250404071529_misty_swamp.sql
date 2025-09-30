/*
  # Update event registrations RLS policies

  1. Changes
    - Drop and recreate RLS policies with stricter conditions
    - Ensure device_id matching works correctly for delete operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable insert access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable delete for users with matching device_id" ON event_registrations;
DROP POLICY IF EXISTS "Enable update for users with matching device_id" ON event_registrations;

-- Create new policies with stricter conditions
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
  AND device_id IS NOT NULL
  AND current_setting('app.device_id'::text, true) IS NOT NULL
);

CREATE POLICY "Enable update for users with matching device_id"
ON event_registrations FOR UPDATE
TO public
USING (
  device_id = current_setting('app.device_id'::text, true)::text
  AND device_id IS NOT NULL
  AND current_setting('app.device_id'::text, true) IS NOT NULL
)
WITH CHECK (
  device_id = current_setting('app.device_id'::text, true)::text
  AND device_id IS NOT NULL
  AND current_setting('app.device_id'::text, true) IS NOT NULL
);