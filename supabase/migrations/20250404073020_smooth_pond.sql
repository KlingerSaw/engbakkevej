/*
  # Implement secure event registration management

  1. Changes
    - Add security definer function to handle device verification
    - Update RLS policies to use the new verification function
    - Remove direct device_id comparison in favor of secure verification
*/

-- Create a function to verify device ownership
CREATE OR REPLACE FUNCTION verify_device_ownership(registration_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  device_id_from_registration text;
  current_device_id text;
BEGIN
  -- Get the device_id from the registration
  SELECT device_id INTO device_id_from_registration
  FROM event_registrations
  WHERE id = registration_id;

  -- Get the current device_id from the session
  current_device_id := current_setting('app.device_id', true);

  -- Return true if the device_ids match
  RETURN device_id_from_registration = current_device_id;
END;
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable insert access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable delete for users with matching device_id" ON event_registrations;
DROP POLICY IF EXISTS "Enable update for users with matching device_id" ON event_registrations;

-- Create new policies using the verification function
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
USING (verify_device_ownership(id));

CREATE POLICY "Enable update for users with matching device_id"
ON event_registrations FOR UPDATE
TO public
USING (verify_device_ownership(id))
WITH CHECK (verify_device_ownership(id));