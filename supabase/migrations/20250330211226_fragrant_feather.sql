/*
  # Create event registrations table

  1. New Tables
    - `event_registrations`
      - `id` (uuid, primary key)
      - `event_date` (timestamptz, event date)
      - `event_name` (text, event name)
      - `house_number` (integer, house number)
      - `adults` (integer, number of adults)
      - `children` (integer, number of children)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `event_registrations` table
    - Add policy for public read access
    - Add policy for public insert access
*/

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date timestamptz NOT NULL,
  event_name text NOT NULL,
  house_number integer NOT NULL,
  adults integer NOT NULL DEFAULT 0,
  children integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON event_registrations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON event_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);