/*
  # Add year column to ideas table

  1. Changes
    - Add `year` column to `ideas` table
    - Populate year from created_at timestamp
    - Create index on year column for better query performance

  2. Notes
    - Existing ideas will have their year calculated from created_at
    - New ideas should set the year column when created
*/

-- Add year column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ideas' AND column_name = 'year'
  ) THEN
    ALTER TABLE ideas ADD COLUMN year integer;
  END IF;
END $$;

-- Populate year from created_at for existing records
UPDATE ideas 
SET year = EXTRACT(YEAR FROM created_at)
WHERE year IS NULL;

-- Set default for new records
ALTER TABLE ideas ALTER COLUMN year SET DEFAULT EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::integer;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ideas_year ON ideas(year);