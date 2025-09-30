/*
  # Create bylaws table

  1. New Tables
    - `bylaws`
      - `id` (uuid, primary key)
      - `section_number` (integer, not null)
      - `title` (text, not null)
      - `content` (text, not null, stores HTML content)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `bylaws` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS bylaws (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bylaws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON bylaws
  FOR SELECT
  TO public
  USING (true);

-- Insert initial bylaws data
INSERT INTO bylaws (section_number, title, content) VALUES
(1, 'Foreningens formål', '<div class="prose"><h3>§1 Foreningens formål</h3><p>Foreningens formål er at varetage medlemmernes fælles interesser i deres egenskab af grundejere, herunder vedligeholdelse af fællesarealer og veje.</p><p>Foreningen er berettiget til at fremsætte påkrav over for medlemmerne til opfyldelse af deres forpligtelser i henhold til nærværende vedtægter.</p></div>'),
(2, 'Medlemskab', '<div class="prose"><h3>§2 Medlemskab</h3><p>Enhver ejer af en parcel udstykket fra matr.nr. 279a, Viborg markjorder, er pligtig at være medlem af foreningen.</p><p>Medlemskabet er pligtmæssigt og indtræder den dag, hvor skøde på en parcel er tinglyst. Ophør af medlemskab sker ved tinglysning af skøde til ny ejer.</p></div>');