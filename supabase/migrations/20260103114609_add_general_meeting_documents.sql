/*
  # Add board proposal and board report to general meetings

  1. Changes
    - Add `board_proposal_text` column to store board election proposals
    - Add `board_report_text` column to store the board's annual report
    
  2. Important Notes
    - These fields are nullable - if not provided, UI will show "Ingen rettidig indkommet"
    - Only applies to ordinary general meetings (ordinær generalforsamling)
    - Follows same text storage pattern as minutes_text
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'general_meetings' AND column_name = 'board_proposal_text'
  ) THEN
    ALTER TABLE general_meetings ADD COLUMN board_proposal_text text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'general_meetings' AND column_name = 'board_report_text'
  ) THEN
    ALTER TABLE general_meetings ADD COLUMN board_report_text text;
  END IF;
END $$;