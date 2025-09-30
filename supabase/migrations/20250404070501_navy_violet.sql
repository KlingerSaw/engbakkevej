/*
  # Add get_config function

  1. Changes
    - Add function to get configuration parameters
    - Used for verifying app.device_id setting
*/

CREATE OR REPLACE FUNCTION get_config(key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN current_setting(key, true);
END;
$$;