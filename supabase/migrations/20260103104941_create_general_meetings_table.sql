/*
  # Create general_meetings table

  1. New Tables
    - `general_meetings`
      - `id` (uuid, primary key) - Unique identifier
      - `date` (date) - Date of the general meeting
      - `type` (text) - Type of meeting ('ordinær' or 'ekstraordinær')
      - `location` (text) - Location of the meeting
      - `minutes_url` (text, nullable) - URL to the uploaded minutes PDF
      - `minutes_text` (text, nullable) - Extracted text content from minutes
      - `created_at` (timestamptz) - Timestamp when record was created

  2. Security
    - Enable RLS on `general_meetings` table
    - Add policy for public read access (anyone can view)

  3. Important Notes
    - Supports both ordinary and extraordinary general meetings
    - Similar structure to board_meetings table for consistency
    - Minutes can be uploaded as PDF and text is extracted
*/

CREATE TABLE IF NOT EXISTS general_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('ordinær', 'ekstraordinær')),
  location text NOT NULL,
  minutes_url text,
  minutes_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE general_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON general_meetings
  FOR SELECT
  TO public
  USING (true);