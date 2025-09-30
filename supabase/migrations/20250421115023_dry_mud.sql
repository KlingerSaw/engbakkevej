/*
  # Remove RLS from tables

  1. Changes
    - Disable RLS on events table
    - Disable RLS on board_meetings table
    - Disable RLS on event_registrations table
    - Drop all existing policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
DROP POLICY IF EXISTS "Allow public read access to board meetings" ON board_meetings;
DROP POLICY IF EXISTS "Allow public read access to event registrations" ON event_registrations;
DROP POLICY IF EXISTS "Enable read access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable insert access for all users" ON event_registrations;
DROP POLICY IF EXISTS "Enable delete for users with matching device_id" ON event_registrations;
DROP POLICY IF EXISTS "Enable update for users with matching device_id" ON event_registrations;

-- Disable RLS on all tables
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE board_meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;