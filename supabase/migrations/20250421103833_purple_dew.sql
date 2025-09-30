/*
  # Fix events table and registrations

  1. Changes
    - Create events table
    - Add RLS policy only if it doesn't exist
    - Populate events with data
    - Link registrations to events
*/

-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' 
    AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access"
    ON events
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;

-- Insert events data
INSERT INTO events (date, name, description)
SELECT d.date, d.name, d.description
FROM (VALUES 
  ('2025-04-11 16:00:00+02'::timestamptz, 'Fej- og kantdag', 'Vi byder på øl/sodavand, når vi er færdige!'),
  ('2025-06-22 09:00:00+02'::timestamptz, 'Hæk- og havedag', 'Medbring gerne trailer.'),
  ('2025-09-13 10:00:00+02'::timestamptz, 'Foreningsdag - Fælles arbejde', NULL),
  ('2025-09-13 14:00:00+02'::timestamptz, 'Foreningsdag - Generalforsamling', NULL),
  ('2025-09-13 17:00:00+02'::timestamptz, 'Foreningsdag - Vejfest', NULL)
) AS d(date, name, description)
WHERE NOT EXISTS (
  SELECT 1 FROM events e 
  WHERE e.date = d.date AND e.name = d.name
);

-- First, drop existing foreign key constraints if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name IN ('fk_event', 'event_registrations_event_id_fkey')
    AND table_name = 'event_registrations'
  ) THEN
    ALTER TABLE event_registrations 
    DROP CONSTRAINT IF EXISTS fk_event,
    DROP CONSTRAINT IF EXISTS event_registrations_event_id_fkey;
  END IF;
END $$;

-- Drop event_id column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_registrations' 
    AND column_name = 'event_id'
  ) THEN
    ALTER TABLE event_registrations DROP COLUMN event_id;
  END IF;
END $$;

-- Add event_id column as nullable first
ALTER TABLE event_registrations
ADD COLUMN event_id uuid;

-- Update existing registrations with event IDs
UPDATE event_registrations er
SET event_id = e.id
FROM events e
WHERE er.event_name = e.name
AND er.event_date = e.date;

-- Delete any registrations that couldn't be matched to an event
DELETE FROM event_registrations
WHERE event_id IS NULL;

-- Now make event_id required and add foreign key constraint
ALTER TABLE event_registrations
ALTER COLUMN event_id SET NOT NULL,
ADD CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id);