import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Section } from '../Section';
import { EventRegistration } from '../EventRegistration';
import { useEvents } from '../../hooks/useEvents';
import { CalendarGrid } from '../calendar/CalendarGrid';
import { LoadingCalendar } from '../calendar/LoadingCalendar';
import { Event } from '../../types/events';
import { useYear } from '../../contexts/YearContext';

interface CalendarSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function CalendarSection({ hoveredSection, setHoveredSection }: CalendarSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationsKey, setRegistrationsKey] = useState(0);
  const { selectedYear } = useYear();
  const { events, loading } = useEvents(selectedYear);

  const handleRegistrationComplete = () => {
    setRegistrationsKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <Section
        index={6}
        title={`Arrangementskalender ${selectedYear}`}
        icon={<Calendar className="w-6 h-6" />}
        content={<LoadingCalendar />}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      />
    );
  }

  return (
    <>
      <Section
        index={6}
        title={`Arrangementskalender ${selectedYear}`}
        icon={<Calendar className="w-6 h-6" />}
        content={
          <CalendarGrid
            events={events}
            registrationsKey={registrationsKey}
            onEventSelect={setSelectedEvent}
          />
        }
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      />

      {selectedEvent && (
        <EventRegistration
          eventName={selectedEvent.name}
          eventDate={selectedEvent.date}
          eventId={selectedEvent.id}
          onClose={() => setSelectedEvent(null)}
          onRegistrationComplete={handleRegistrationComplete}
        />
      )}
    </>
  );
}