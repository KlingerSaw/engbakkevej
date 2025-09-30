import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RegistrationForm } from './registration/RegistrationForm';
import { RegistrationModalProps } from '../types/registration';

export function EventRegistration({
  eventName,
  eventDate,
  eventId,
  onClose,
  onRegistrationComplete,
  existingRegistration
}: RegistrationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <h3 className="text-xl font-semibold text-brand-blue mb-4">
          {existingRegistration ? 'Rediger tilmelding til' : 'Tilmelding til'} {eventName}
        </h3>
        
        <RegistrationForm
          eventName={eventName}
          eventDate={eventDate}
          eventId={eventId}
          onClose={onClose}
          onRegistrationComplete={onRegistrationComplete}
          existingRegistration={existingRegistration}
        />
      </motion.div>
    </div>
  );
}