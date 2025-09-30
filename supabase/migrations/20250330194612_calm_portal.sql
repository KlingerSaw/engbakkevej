/*
  # Add minutes_text column to board_meetings table

  1. Changes
    - Add `minutes_text` column to store meeting minutes content
    - Make it a TEXT column that can be NULL
*/

ALTER TABLE board_meetings 
ADD COLUMN minutes_text TEXT;