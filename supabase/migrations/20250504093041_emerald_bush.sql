/*
  # Move upvotes to separate table

  1. New Tables
    - `idea_upvotes`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `house_number` (integer, not null)
      - `created_at` (timestamptz)

  2. Changes
    - Remove upvotes and upvoted_by from ideas table
    - Add foreign key constraint with cascade delete
*/

-- Create idea_upvotes table
CREATE TABLE IF NOT EXISTS idea_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  house_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent multiple votes from same house
ALTER TABLE idea_upvotes
ADD CONSTRAINT unique_house_vote UNIQUE (idea_id, house_number);

-- Remove old columns from ideas table
ALTER TABLE ideas
DROP COLUMN upvotes,
DROP COLUMN upvoted_by;