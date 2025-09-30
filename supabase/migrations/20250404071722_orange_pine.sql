/*
  # Improve config functions and add session variables

  1. Changes
    - Drop existing config functions
    - Create improved config functions with session variable handling
    - Add explicit error handling
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS app_set_config_value;
DROP FUNCTION IF EXISTS app_get_config_value;

-- Create improved set config function
CREATE OR REPLACE FUNCTION app_set_config_value(param_key text, param_value text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result text;
BEGIN
  -- Set the config value at session level
  PERFORM set_config(param_key, param_value, false);
  
  -- Verify the value was set
  result := current_setting(param_key, true);
  
  -- Raise an error if the value wasn't set properly
  IF result IS NULL OR result != param_value THEN
    RAISE EXCEPTION 'Failed to set configuration value for %', param_key;
  END IF;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error setting configuration: %', SQLERRM;
END;
$$;

-- Create improved get config function
CREATE OR REPLACE FUNCTION app_get_config_value(param_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  val text;
BEGIN
  -- Get the current setting with explicit error on missing value
  val := current_setting(param_key);
  RETURN val;
EXCEPTION
  WHEN undefined_object THEN
    RETURN NULL;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error getting configuration: %', SQLERRM;
END;
$$;