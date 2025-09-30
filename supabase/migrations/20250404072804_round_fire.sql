/*
  # Improve event registration deletion

  1. Changes
    - Simplify RLS policies
    - Update config functions to be more reliable
    - Add explicit error handling
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable insert access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable delete for users with matching device_id" ON event_registrations;
DROP POLICY IF EXISTS "Enable update for users with matching device_id" ON event_registrations;

-- Create new policies with direct device_id comparison
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
USING (device_id::text = current_setting('app.device_id'::text, true)::text);

CREATE POLICY "Enable update for users with matching device_id"
ON event_registrations FOR UPDATE
TO public
USING (device_id::text = current_setting('app.device_id'::text, true)::text)
WITH CHECK (device_id::text = current_setting('app.device_id'::text, true)::text);

-- Drop existing functions
DROP FUNCTION IF EXISTS app_set_config_value;
DROP FUNCTION IF EXISTS app_get_config_value;

-- Create simplified set config function
CREATE OR REPLACE FUNCTION app_set_config_value(param_key text, param_value text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config(param_key, param_value, false);
  RETURN param_value;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to set config value: %', SQLERRM;
END;
$$;

-- Create simplified get config function
CREATE OR REPLACE FUNCTION app_get_config_value(param_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN current_setting(param_key, true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;