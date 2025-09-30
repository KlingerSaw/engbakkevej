/*
  # Add event declines tracking

  1. Changes
    - Add declined column to event_registrations table
    - Add reason column for optional decline message
*/

ALTER TABLE event_registrations
ADD COLUMN declined boolean DEFAULT false,
ADD COLUMN decline_reason text;