/*
  # Create news table

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `published` (boolean, default true)

  2. Security
    - Enable RLS on `news` table
    - Add policy for public read access to published news
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published boolean DEFAULT true
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published news"
  ON news
  FOR SELECT
  TO public
  USING (published = true);

-- Insert some initial news items
INSERT INTO news (title, content) VALUES 
(
  'Velkommen til den nye hjemmeside! 🎉',
  'Vi er glade for at kunne præsentere vores nye hjemmeside for Grundejerforeningen Engbakken.'
),
(
  'Kommende arrangementer',
  'Hold øje med kalenderen for kommende arrangementer og arbejdsdage i 2025.'
);