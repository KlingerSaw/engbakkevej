/*
  # Add device_id to event_registrations table

  1. Changes
    - Add device_id column to event_registrations table
    - Make it a text column that can be NULL for existing registrations
    - Will be required for new registrations going forward
*/

ALTER TABLE event_registrations 
ADD COLUMN device_id text;