/*
  # Fix RLS tables and policies

  1. Changes
    - Drop existing views if they exist
    - Create board_meetings table with RLS enabled
    - Create event_registrations table with RLS enabled
    - Add public read policies
*/

-- Drop existing views if they exist
DROP VIEW IF EXISTS board_meetings;
DROP VIEW IF EXISTS event_registrations;

-- Create board_meetings table
CREATE TABLE IF NOT EXISTS board_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  location text NOT NULL,
  minutes_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE board_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to board meetings"
  ON board_meetings
  FOR SELECT
  TO public
  USING (true);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id),
  event_date timestamptz NOT NULL,
  event_name text NOT NULL,
  house_number integer NOT NULL,
  adults integer NOT NULL DEFAULT 0,
  children integer NOT NULL DEFAULT 0,
  device_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to event registrations"
  ON event_registrations
  FOR SELECT
  TO public
  USING (true);