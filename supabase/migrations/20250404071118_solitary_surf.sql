/*
  # Create application configuration functions

  1. Changes
    - Create custom configuration management functions
    - Use unique names to avoid conflicts with built-in PostgreSQL functions
    - Maintain security and functionality
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_config;
DROP FUNCTION IF EXISTS app_set_config;
DROP FUNCTION IF EXISTS app_get_config;

-- Create custom set config function with unique name
CREATE OR REPLACE FUNCTION app_set_config_value(param_key text, param_value text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use the built-in set_config with explicit parameter names
  PERFORM pg_catalog.set_config(param_key, param_value, false);
  -- Return the newly set value to confirm
  RETURN current_setting(param_key, true);
END;
$$;

-- Create custom get config function with unique name
CREATE OR REPLACE FUNCTION app_get_config_value(param_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  val text;
BEGIN
  -- Get the current setting, allowing it to be null
  val := current_setting(param_key, true);
  
  -- Return the value (could be null)
  RETURN val;
END;
$$;