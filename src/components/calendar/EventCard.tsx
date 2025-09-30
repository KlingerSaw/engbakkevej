import React from 'react';
import { Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Event } from '../../types/events';
import { EventRegistrations } from '../EventRegistrations';

interface EventCardProps {
  event: Event;
  registrationsKey: number;
  onSelect: (event: Event) => void;
}

export function EventCard({ event, registrationsKey, onSelect }: EventCardProps) {
  const isEventInFuture = new Date(event.date) > new Date();

  const handleRegistrationClick = () => {
    if (isEventInFuture) {
      onSelect(event);
    }
  };

  return (
    <div className={`space-y-2 transition-opacity duration-300 ${!isEventInFuture ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-2">
        <div className={`rounded px-2 py-1 text-sm whitespace-nowrap ${
          isEventInFuture ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {new Date(event.date).toLocaleDateString('da-DK', {
            day: 'numeric',
            month: 'short'
          })}
        </div>
        <div className="flex-1">
          {isEventInFuture ? (
            <motion.button
              onClick={handleRegistrationClick}
              className="mb-2 flex items-center gap-1 text-sm bg-brand-blue text-white px-3 py-1 rounded-full hover:bg-brand-blue-dark transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-4 h-4" />
              <span>Svar</span>
            </motion.button>
          ) : (
            <div className="mb-2 flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tak for deltagelsen!</span>
            </div>
          )}
          <h4 className={`font-semibold ${isEventInFuture ? 'text-brand-blue' : 'text-gray-600'}`}>
            {event.name}
          </h4>
          <p className={`text-sm ${isEventInFuture ? 'text-brand-blue' : 'text-gray-600'}`}>
            Kl. {new Date(event.date).toLocaleTimeString('da-DK', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          {event.description && (
            <p className={`text-sm mt-1 ${isEventInFuture ? 'text-brand-blue' : 'text-gray-600'}`}>
              {event.description}
            </p>
          )}
          {isEventInFuture && (
            <EventRegistrations 
              key={registrationsKey}
              eventName={event.name}
              eventDate={event.date}
              eventId={event.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}