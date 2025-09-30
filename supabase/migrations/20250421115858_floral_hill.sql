/*
  # Fix ideas table creation

  1. Changes
    - Drop existing ideas view if it exists
    - Create ideas as a proper table
    - Enable RLS and add policies
*/

-- First, drop the view if it exists
DROP VIEW IF EXISTS ideas;

-- Create the ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  upvotes integer DEFAULT 0,
  upvoted_by text[] DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Create policies
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