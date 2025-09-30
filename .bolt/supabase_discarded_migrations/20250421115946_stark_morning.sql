/*
  # Convert all views to tables and ensure RLS

  1. Changes
    - Drop all views
    - Create proper tables for all entities
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Drop existing views if they exist
DROP VIEW IF EXISTS ideas;
DROP VIEW IF EXISTS bylaws;
DROP VIEW IF EXISTS webmaster_requests;

-- Create bylaws table if it doesn't exist
CREATE TABLE IF NOT EXISTS bylaws (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create webmaster_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS webmaster_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bylaws ENABLE ROW LEVEL SECURITY;
ALTER TABLE webmaster_requests ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Allow public read access to events"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Board meetings policies
CREATE POLICY "Allow public read access to board_meetings"
  ON board_meetings
  FOR SELECT
  TO public
  USING (true);

-- Event registrations policies
CREATE POLICY "Allow public read access to event_registrations"
  ON event_registrations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to event_registrations"
  ON event_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to event_registrations"
  ON event_registrations
  FOR UPDATE
  TO public
  USING (device_id = current_setting('app.device_id'::text, true)::text)
  WITH CHECK (device_id = current_setting('app.device_id'::text, true)::text);

CREATE POLICY "Allow public delete access to event_registrations"
  ON event_registrations
  FOR DELETE
  TO public
  USING (device_id = current_setting('app.device_id'::text, true)::text);

-- Ideas policies
CREATE POLICY "Allow public read access to ideas"
  ON ideas
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to ideas"
  ON ideas
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to ideas"
  ON ideas
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Bylaws policies
CREATE POLICY "Allow public read access to bylaws"
  ON bylaws
  FOR SELECT
  TO public
  USING (true);

-- Webmaster requests policies
CREATE POLICY "Allow public read access to webmaster_requests"
  ON webmaster_requests
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to webmaster_requests"
  ON webmaster_requests
  FOR INSERT
  TO public
  WITH CHECK (true);