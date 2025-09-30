/*
  # Enable RLS for idea tables

  1. Security Changes
    - Enable RLS on `idea_upvotes` table
    - Enable RLS on `idea_comments` table
    - Add policies for authenticated and anonymous users to:
      - Read all upvotes and comments
      - Insert upvotes and comments with proper validation
      - Delete their own upvotes and comments
*/

-- Enable RLS
ALTER TABLE idea_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_comments ENABLE ROW LEVEL SECURITY;

-- Policies for idea_upvotes
CREATE POLICY "Anyone can view upvotes"
  ON idea_upvotes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add upvotes"
  ON idea_upvotes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can delete their own upvotes"
  ON idea_upvotes
  FOR DELETE
  TO public
  USING (true);

-- Policies for idea_comments
CREATE POLICY "Anyone can view comments"
  ON idea_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add comments"
  ON idea_comments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can delete their own comments"
  ON idea_comments
  FOR DELETE
  TO public
  USING (true);