/*
  # Add Row Level Security Policies for Authentication

  1. Security Changes
    - Add RLS policies for `board_meetings` table
      - Allow SELECT for everyone (anon and authenticated)
      - Allow INSERT, UPDATE, DELETE only for authenticated users
    
    - Add RLS policies for `general_meetings` table
      - Allow SELECT for everyone (anon and authenticated)
      - Allow INSERT, UPDATE, DELETE only for authenticated users
    
  2. Notes
    - RLS is already enabled on these tables from previous migrations
    - These policies ensure public can view meetings but only authenticated admin can modify them
*/

-- Board Meetings Policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can view board meetings" ON board_meetings;
  DROP POLICY IF EXISTS "Authenticated users can insert board meetings" ON board_meetings;
  DROP POLICY IF EXISTS "Authenticated users can update board meetings" ON board_meetings;
  DROP POLICY IF EXISTS "Authenticated users can delete board meetings" ON board_meetings;
END $$;

CREATE POLICY "Anyone can view board meetings"
  ON board_meetings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert board meetings"
  ON board_meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update board meetings"
  ON board_meetings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete board meetings"
  ON board_meetings FOR DELETE
  TO authenticated
  USING (true);

-- General Meetings Policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can view general meetings" ON general_meetings;
  DROP POLICY IF EXISTS "Authenticated users can insert general meetings" ON general_meetings;
  DROP POLICY IF EXISTS "Authenticated users can update general meetings" ON general_meetings;
  DROP POLICY IF EXISTS "Authenticated users can delete general meetings" ON general_meetings;
END $$;

CREATE POLICY "Anyone can view general meetings"
  ON general_meetings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert general meetings"
  ON general_meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update general meetings"
  ON general_meetings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete general meetings"
  ON general_meetings FOR DELETE
  TO authenticated
  USING (true);
