import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Section } from '../Section';
import { EventRegistration } from '../EventRegistration';
import { useEvents } from '../../hooks/useEvents';
import { CalendarGrid } from '../calendar/CalendarGrid';
import { LoadingCalendar } from '../calendar/LoadingCalendar';
import { Event } from '../../types/events';
import { supabase } from '../../lib/supabase';

interface CalendarSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function CalendarSection({ hoveredSection, setHoveredSection }: CalendarSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationsKey, setRegistrationsKey] = useState(0);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const { events, loading } = useEvents(selectedYear);

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  const fetchAvailableYears = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('year')
        .order('year', { ascending: false });

      if (error) throw error;

      const years = [...new Set(data?.map(d => d.year).filter(Boolean))] as number[];
      setAvailableYears(years.length > 0 ? years : [currentYear]);
    } catch (error) {
      console.error('Error fetching years:', error);
      setAvailableYears([currentYear]);
    }
  };

  const handleRegistrationComplete = () => {
    setRegistrationsKey(prev => prev + 1);
  };

  const handlePreviousYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1]);
    }
  };

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1]);
    }
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

  const canGoPrevious = availableYears.indexOf(selectedYear) < availableYears.length - 1;
  const canGoNext = availableYears.indexOf(selectedYear) > 0;

  return (
    <>
      <Section
        index={6}
        title={`Arrangementskalender ${selectedYear}`}
        icon={<Calendar className="w-6 h-6" />}
        content={
          <div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={handlePreviousYear}
                disabled={!canGoPrevious}
                className={`p-2 rounded-lg transition-colors ${
                  canGoPrevious
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Forrige år"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-semibold min-w-[100px] text-center">
                {selectedYear}
              </span>
              <button
                onClick={handleNextYear}
                disabled={!canGoNext}
                className={`p-2 rounded-lg transition-colors ${
                  canGoNext
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Næste år"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <CalendarGrid
              events={events}
              registrationsKey={registrationsKey}
              onEventSelect={setSelectedEvent}
            />
          </div>
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