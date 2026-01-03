/*
  # Add year column to news table

  1. Changes
    - Add `year` column to `news` table
    - Set default value to extract year from created_at
    - Update existing records with year based on created_at
    - Add index for better query performance
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'year'
  ) THEN
    ALTER TABLE news ADD COLUMN year integer;
  END IF;
END $$;

UPDATE news SET year = EXTRACT(YEAR FROM created_at) WHERE year IS NULL;

ALTER TABLE news ALTER COLUMN year SET DEFAULT EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::integer;

CREATE INDEX IF NOT EXISTS idx_news_year ON news(year);
