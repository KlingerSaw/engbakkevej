import React from 'react';
import { Event } from '../../types/events';
import { MonthGroup } from './MonthGroup';

interface CalendarGridProps {
  events: Event[];
  registrationsKey: number;
  onEventSelect: (event: Event) => void;
}

export function CalendarGrid({ events, registrationsKey, onEventSelect }: CalendarGridProps) {
  const groupedEvents = events.reduce((acc, event) => {
    const month = new Date(event.date).toLocaleString('da-DK', { month: 'long' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(groupedEvents).map(([month, monthEvents]) => (
        <MonthGroup
          key={month}
          month={month}
          events={monthEvents}
          registrationsKey={registrationsKey}
          onEventSelect={onEventSelect}
        />
      ))}
    </div>
  );
}