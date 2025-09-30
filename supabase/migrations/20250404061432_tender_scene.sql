/*
  # Add set_config function for device ID

  1. Changes
    - Add function to set configuration parameters
    - Used for setting app.device_id for RLS policies
*/

CREATE OR REPLACE FUNCTION set_config(key text, value text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config(key, value, false);
END;
$$;