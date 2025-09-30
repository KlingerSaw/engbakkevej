/*
  # Add INSERT rule for event_registrations table

  1. Changes
    - Add ON INSERT DO INSTEAD rule with RETURNING clause for event_registrations table
    - This allows the table to support INSERT RETURNING operations needed by the application
    
  2. Technical Details
    - Creates a rule that handles INSERT operations
    - Returns all columns from the newly inserted row
    - Ensures compatibility with Supabase's REST API
*/

CREATE OR REPLACE RULE event_registrations_insert AS
ON INSERT TO event_registrations
DO INSTEAD (
  INSERT INTO event_registrations (
    id,
    event_id,
    event_name,
    event_date,
    house_number,
    adults,
    children,
    device_id,
    created_at
  )
  VALUES (
    COALESCE(NEW.id, gen_random_uuid()),
    NEW.event_id,
    NEW.event_name,
    NEW.event_date,
    NEW.house_number,
    NEW.adults,
    NEW.children,
    NEW.device_id,
    COALESCE(NEW.created_at, now())
  )
  RETURNING *;
);