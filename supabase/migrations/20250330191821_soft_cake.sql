/*
  # Update February 2025 board meeting location

  1. Changes
    - Update the location of the February 2025 board meeting from 'Lars' to 'Birger'
*/

UPDATE board_meetings 
SET location = 'Birger'
WHERE date = '2025-02-27 19:00:00+01';