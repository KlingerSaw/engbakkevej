/*
  # Add news likes system

  1. New Tables
    - `news_likes`
      - `id` (uuid, primary key)
      - `news_id` (uuid, foreign key to news)
      - `device_id` (text, to track unique likes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `news_likes` table
    - Add policy for public insert and read access

  3. Changes
    - Allow users to like news items
    - Track likes by device ID to prevent duplicate likes
*/

CREATE TABLE IF NOT EXISTS news_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id uuid REFERENCES news(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(news_id, device_id)
);

ALTER TABLE news_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to news likes"
  ON news_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to news likes"
  ON news_likes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_news_likes_news_id ON news_likes(news_id);
CREATE INDEX IF NOT EXISTS idx_news_likes_device_id ON news_likes(device_id);