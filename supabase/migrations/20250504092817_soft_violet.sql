/*
  # Add comments for ideas

  1. New Tables
    - `idea_comments`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `house_number` (integer, not null)
      - `content` (text, not null)
      - `created_at` (timestamptz)

  2. Security
    - No RLS needed as per project requirements
*/

CREATE TABLE IF NOT EXISTS idea_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  house_number integer NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);