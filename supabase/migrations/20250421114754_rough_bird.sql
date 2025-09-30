/*
  # Fix events table and add RLS policy

  1. Changes
    - Ensure events exists as a proper table
    - Enable RLS
    - Add policy for public read access
*/

-- First, drop the view if it exists
DROP VIEW IF EXISTS events;

-- Create the events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' 
    AND policyname = 'Allow public read access to events'
  ) THEN
    CREATE POLICY "Allow public read access to events"
      ON events
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Insert sample events if table is empty
INSERT INTO events (date, name, description)
SELECT d.date, d.name, d.description
FROM (VALUES 
  ('2025-04-11 16:00:00+02'::timestamptz, 'Fej- og kantdag', 'Vi byder på øl/sodavand, når vi er færdige!'),
  ('2025-06-22 09:00:00+02'::timestamptz, 'Hæk- og havedag', 'Medbring gerne trailer.'),
  ('2025-09-13 10:00:00+02'::timestamptz, 'Foreningsdag - Fælles arbejde', NULL),
  ('2025-09-13 14:00:00+02'::timestamptz, 'Foreningsdag - Generalforsamling', NULL),
  ('2025-09-13 17:00:00+02'::timestamptz, 'Foreningsdag - Vejfest', NULL)
) AS d(date, name, description)
WHERE NOT EXISTS (SELECT 1 FROM events);