-- Create a function to delete event registration
CREATE OR REPLACE FUNCTION delete_event_registration(registration_id uuid, device_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM event_registrations
  WHERE id = registration_id
  AND device_id = device_identifier
  RETURNING 1 INTO deleted_count;
  
  RETURN deleted_count = 1;
END;
$$;