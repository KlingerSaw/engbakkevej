/*
  # Create Facebook posts table

  1. New Tables
    - `facebook_posts`
      - `id` (uuid, primary key)
      - `content` (text)
      - `author` (text)
      - `created_at` (timestamp)
      - `likes` (integer)
      - `comments` (integer)
      - `shares` (integer)
  
  2. Security
    - Enable RLS on `facebook_posts` table
    - Add policy for public read access
*/

DO $$ 
BEGIN
  -- Create table if it doesn't exist
  CREATE TABLE IF NOT EXISTS facebook_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content text NOT NULL,
    author text NOT NULL,
    created_at timestamptz DEFAULT now(),
    likes integer DEFAULT 0,
    comments integer DEFAULT 0,
    shares integer DEFAULT 0
  );

  -- Enable RLS
  ALTER TABLE facebook_posts ENABLE ROW LEVEL SECURITY;

  -- Create policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE tablename = 'facebook_posts' 
    AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access"
      ON facebook_posts
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;