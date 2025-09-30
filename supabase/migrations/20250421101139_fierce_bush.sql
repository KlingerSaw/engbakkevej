/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `date` (timestamptz, event date and time)
      - `name` (text, event name)
      - `description` (text, optional description)

  2. Security
    - Enable RLS on `events` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Insert initial events
INSERT INTO events (date, name, description) VALUES
('2025-04-11 16:00:00+02', 'Fej- og kantdag', 'Vi byder på øl/sodavand, når vi er færdige!'),
('2025-06-22 09:00:00+02', 'Hæk- og havedag', 'Medbring gerne trailer.'),
('2025-09-13 10:00:00+02', 'Foreningsdag - Fælles arbejde', NULL),
('2025-09-13 14:00:00+02', 'Foreningsdag - Generalforsamling', NULL),
('2025-09-13 17:00:00+02', 'Foreningsdag - Vejfest', NULL);