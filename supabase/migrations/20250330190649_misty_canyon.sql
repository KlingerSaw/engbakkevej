/*
  # Create board meetings table

  1. New Tables
    - `board_meetings`
      - `id` (uuid, primary key)
      - `date` (timestamptz, meeting date)
      - `location` (text, meeting location)
      - `minutes_url` (text, URL to PDF minutes)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `board_meetings` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS board_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  location text NOT NULL,
  minutes_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE board_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON board_meetings
  FOR SELECT
  TO public
  USING (true);