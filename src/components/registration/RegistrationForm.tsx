import React, { useState } from 'react';
import { ParticipantsStep } from './steps/ParticipantsStep';
import { useRegistration } from '../../hooks/useRegistration';
import { RegistrationFormProps } from '../../types/registration';
import { HouseVerification } from '../shared/HouseVerification';
import { X } from 'lucide-react';

export function RegistrationForm({ 
  eventName, 
  eventDate,
  eventId,
  onClose,
  onRegistrationComplete,
  existingRegistration 
}: RegistrationFormProps) {
  const [showHouseVerification, setShowHouseVerification] = useState(true);
  const [isDeclined, setIsDeclined] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const { 
    handleSubmit,
    isSubmitting,
    houseNumber,
    setHouseNumber,
    adults,
    setAdults,
    children,
    setChildren 
  } = useRegistration({
    eventName,
    eventDate,
    eventId,
    existingRegistration,
    onClose,
    onRegistrationComplete,
    isDeclined,
    declineReason
  });

  const handleHouseVerified = (number: number) => {
    setHouseNumber(number.toString());
    setShowHouseVerification(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showHouseVerification ? (
        <HouseVerification
          onVerified={handleHouseVerified}
          onCancel={onClose}
          title="Vælg dit husnummer"
        />
      ) : (
        <>
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setIsDeclined(false)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                !isDeclined 
                  ? 'bg-brand-blue text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Jeg deltager
            </button>
            <button
              type="button"
              onClick={() => setIsDeclined(true)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                isDeclined 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Jeg kan ikke deltage
            </button>
          </div>

          {isDeclined ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evt. begrundelse (valgfrit)
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Skriv evt. hvorfor du ikke kan deltage..."
                />
              </div>
            </div>
          ) : (
            <ParticipantsStep
              houseNumber={houseNumber}
              adults={adults}
              children={children}
              setAdults={setAdults}
              setChildren={setChildren}
            />
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowHouseVerification(true)}
              className="px-4 py-2 text-brand-blue hover:text-brand-blue-dark"
            >
              Tilbage
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-brand-blue hover:text-brand-blue-dark"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:opacity-50"
            >
              {isSubmitting ? 'Sender...' : (existingRegistration ? 'Opdater' : (isDeclined ? 'Bekræft afbud' : 'Tilmeld'))}
            </button>
          </div>
        </>
      )}
    </form>
  );
}