/*
  # Add missing foreign key indexes for performance

  1. Performance Improvements
    - Add index on `event_registrations.event_id` foreign key
    - Add index on `idea_comments.idea_id` foreign key
  
  2. Notes
    - Foreign keys without indexes can lead to slow queries and table locks during deletes/updates
    - These indexes improve JOIN performance and referential integrity checks
*/

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);

CREATE INDEX IF NOT EXISTS idx_idea_comments_idea_id ON idea_comments(idea_id);
