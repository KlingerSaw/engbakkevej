/*
  # Add Year Tracking and Board Members History

  1. Changes to Existing Tables
    - Add `year` column to `events` table (extracted from date, indexed for performance)
    - Add `year` column to `board_meetings` table (extracted from date, indexed for performance)
    - Add `year` column to `general_meetings` table (extracted from date, indexed for performance)

  2. New Tables
    - `board_members`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the board member
      - `house_number` (integer) - House number
      - `position` (text) - Board position (Formand, Næstformand, Kasserer, Medlem)
      - `start_year` (integer) - Year they joined the board
      - `end_year` (integer, nullable) - Year they left (null if current member)
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on `board_members` table
    - Add policy for public read access
    - Add indexes for year columns on all tables

  4. Data Migration
    - Update existing events with year from date column
    - Update existing board_meetings with year from date column
    - Update existing general_meetings with year from date column
    - Insert current board members
*/

-- Add year column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS year integer;

-- Update existing events with year from date
UPDATE events 
SET year = EXTRACT(YEAR FROM date)::integer 
WHERE year IS NULL;

-- Add year column to board_meetings table
ALTER TABLE board_meetings 
ADD COLUMN IF NOT EXISTS year integer;

-- Update existing board_meetings with year from date
UPDATE board_meetings 
SET year = EXTRACT(YEAR FROM date)::integer 
WHERE year IS NULL;

-- Add year column to general_meetings table
ALTER TABLE general_meetings 
ADD COLUMN IF NOT EXISTS year integer;

-- Update existing general_meetings with year from date
UPDATE general_meetings 
SET year = EXTRACT(YEAR FROM date)::integer 
WHERE year IS NULL;

-- Create board_members table
CREATE TABLE IF NOT EXISTS board_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  house_number integer NOT NULL,
  position text NOT NULL,
  start_year integer NOT NULL,
  end_year integer,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_position CHECK (position IN ('Formand', 'Næstformand', 'Kasserer', 'Medlem'))
);

-- Enable RLS
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view board members"
  ON board_members
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_year ON events(year);
CREATE INDEX IF NOT EXISTS idx_board_meetings_year ON board_meetings(year);
CREATE INDEX IF NOT EXISTS idx_general_meetings_year ON general_meetings(year);
CREATE INDEX IF NOT EXISTS idx_board_members_years ON board_members(start_year, end_year);

-- Insert current board members (2026)
INSERT INTO board_members (name, house_number, position, start_year, end_year)
VALUES
  ('René', 37, 'Formand', 2026, NULL),
  ('Sune', 22, 'Næstformand', 2026, NULL),
  ('Inger', 24, 'Kasserer', 2026, NULL),
  ('Tommy', 9, 'Medlem', 2026, NULL),
  ('Birger', 21, 'Medlem', 2026, NULL)
ON CONFLICT DO NOTHING;