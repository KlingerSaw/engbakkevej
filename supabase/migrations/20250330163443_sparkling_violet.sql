/*
  # Create ideas table

  1. New Tables
    - `ideas`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `created_at` (timestamp with time zone, default: now())

  2. Security
    - Enable RLS on `ideas` table
    - Add policy for public read access
    - Add policy for public insert access
*/

CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON ideas
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON ideas
  FOR INSERT
  TO public
  WITH CHECK (true);