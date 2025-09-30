-- Drop existing tables if they exist
DROP TABLE IF EXISTS idea_upvotes CASCADE;
DROP TABLE IF EXISTS idea_comments CASCADE;

-- Recreate idea_upvotes table without RLS
CREATE TABLE idea_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  house_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent multiple votes from same house
CREATE UNIQUE INDEX unique_house_vote ON idea_upvotes (idea_id, house_number);

-- Recreate idea_comments table without RLS
CREATE TABLE idea_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  house_number integer NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Disable RLS on ideas table if it's enabled
ALTER TABLE ideas DISABLE ROW LEVEL SECURITY;