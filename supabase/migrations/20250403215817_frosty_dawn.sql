/*
  # Create webmaster requests table

  1. New Tables
    - `webmaster_requests`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `message` (text, not null)
      - `created_at` (timestamptz)
      - `status` (text, default: 'pending')

  2. Security
    - Enable RLS on `webmaster_requests` table
    - Add policy for public insert access
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS webmaster_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE webmaster_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert access"
  ON webmaster_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access"
  ON webmaster_requests
  FOR SELECT
  TO public
  USING (true);