/*
  # Update minutes format for board meetings

  1. Changes
    - Update the minutes URL format to match the new pattern
*/

UPDATE board_meetings 
SET minutes_url = NULL
WHERE date = '2025-02-27 19:00:00+01';