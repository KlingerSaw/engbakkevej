import React from 'react';
import { Event } from '../../types/events';
import { EventCard } from './EventCard';

interface MonthGroupProps {
  month: string;
  events: Event[];
  registrationsKey: number;
  onEventSelect: (event: Event) => void;
}

export function MonthGroup({ month, events, registrationsKey, onEventSelect }: MonthGroupProps) {
  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 capitalize text-brand-blue">
        {month}
      </h3>
      <div className="space-y-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            registrationsKey={registrationsKey}
            onSelect={onEventSelect}
          />
        ))}
      </div>
    </div>
  );
}