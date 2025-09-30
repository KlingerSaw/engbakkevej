/*
  # Fix database schema

  1. Changes
    - Drop development and production schemas
    - Restore tables to public schema
    - Disable RLS on tables that need it
    - Keep data intact
*/

-- Drop schemas if they exist (cascade will remove all objects within them)
DROP SCHEMA IF EXISTS development CASCADE;
DROP SCHEMA IF EXISTS production CASCADE;

-- Recreate tables in public schema if they don't exist
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS board_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  location text NOT NULL,
  minutes_text text,
  created_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  upvotes integer DEFAULT 0,
  upvoted_by text[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS webmaster_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS bylaws (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Disable RLS on tables that need direct access
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE board_meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE ideas DISABLE ROW LEVEL SECURITY;
ALTER TABLE webmaster_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE bylaws DISABLE ROW LEVEL SECURITY;