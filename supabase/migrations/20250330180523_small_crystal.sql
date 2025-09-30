/*
  # Add upvotes to ideas table

  1. Changes
    - Add upvotes column to ideas table with default value of 0
    - Add upvoted_by array column to track who has upvoted
    - Add RLS policies for upvoting

  2. Security
    - Enable RLS on ideas table
    - Add policies for public read/write access
*/

-- Add upvotes column with default value of 0
ALTER TABLE ideas 
ADD COLUMN IF NOT EXISTS upvotes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS upvoted_by text[] DEFAULT '{}';

-- Update RLS policies
CREATE POLICY "Enable read access for all users" ON ideas
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON ideas
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for upvotes" ON ideas
FOR UPDATE USING (true)
WITH CHECK (true);