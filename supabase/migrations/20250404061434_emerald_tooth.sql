/*
  # Update event registrations policies

  1. Changes
    - Add policies for update and delete operations
    - Ensure device_id matching for modifications
*/

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Enable delete for users with matching device_id" ON event_registrations;

-- Create new delete policy
CREATE POLICY "Enable delete for users with matching device_id"
ON event_registrations
FOR DELETE
USING (
  device_id = current_setting('app.device_id'::text, true)
);

-- Create update policy
CREATE POLICY "Enable update for users with matching device_id"
ON event_registrations
FOR UPDATE
USING (
  device_id = current_setting('app.device_id'::text, true)
)
WITH CHECK (
  device_id = current_setting('app.device_id'::text, true)
);