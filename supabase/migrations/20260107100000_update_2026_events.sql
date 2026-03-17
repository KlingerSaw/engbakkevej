/*
  # Update 2026 event calendar

  1. Changes
    - Replace key 2026 event entries with the latest approved schedule
    - Ensure all inserted events have `year = 2026`
*/

DELETE FROM events
WHERE year = 2026
  AND name IN (
    'Fej- og kantdag',
    'Hæk- og havedag',
    'Foreningsdag - arbejdsdag',
    'Generalforsamling',
    'Vejfest'
  );

INSERT INTO events (date, name, description, year)
VALUES
  (
    '2026-04-17 16:00:00+02'::timestamptz,
    'Fej- og kantdag',
    'Kom og vær med til at feje og hakke kanter på vores fællesarealer. Vi har en øl/sodavand klar, når vi er færdige.',
    2026
  ),
  (
    '2026-06-21 09:30:00+02'::timestamptz,
    'Hæk- og havedag',
    'Vi klipper hæk og plejer de grønne arealer. Efterfølgende nyder vi en øl/sodavand og pølser. Medbring gerne trailer.',
    2026
  ),
  (
    '2026-09-12 10:00:00+02'::timestamptz,
    'Foreningsdag - arbejdsdag',
    'Vi starter med hækklipning og pleje af de grønne arealer. Efterfølgende er der øl/sodavand og pølser. Medbring gerne trailer.',
    2026
  ),
  (
    '2026-09-12 14:00:00+02'::timestamptz,
    'Generalforsamling',
    'Generalforsamling i teltet på plænen.',
    2026
  ),
  (
    '2026-09-12 17:00:00+02'::timestamptz,
    'Vejfest',
    'Vejfest i teltet på plænen.',
    2026
  );
