import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AddressInput } from '../registration/steps/AddressInput';
import { HouseSelector } from '../registration/steps/HouseSelector';

interface HouseVerificationProps {
  onVerified: (houseNumber: number) => void;
  onCancel: () => void;
  title?: string;
}

export function HouseVerification({ onVerified, onCancel, title = 'Vælg dit husnummer' }: HouseVerificationProps) {
  const [showHouseSelector, setShowHouseSelector] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');
  const [houseNumberError, setHouseNumberError] = useState('');

  const handleContinue = () => {
    if (!houseNumber) {
      setHouseNumberError('Indtast venligst et husnummer');
      return;
    }
    setShowHouseSelector(true);
  };

  const handleHouseSelect = (number: number) => {
    if (number.toString() !== houseNumber) {
      setHouseNumberError('Vælg venligst det indtastede husnummer');
      return;
    }
    onVerified(number);
  };

  if (showHouseSelector) {
    return (
      <HouseSelector
        expectedNumber={parseInt(houseNumber)}
        onSelect={handleHouseSelect}
        onClose={() => {
          setShowHouseSelector(false);
          onCancel();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <h3 className="text-xl font-semibold text-brand-blue mb-4">
          {title}
        </h3>
        <AddressInput
          houseNumber={houseNumber}
          setHouseNumber={setHouseNumber}
          houseNumberError={houseNumberError}
          eventId=""
          onEnterPress={handleContinue}
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-brand-blue hover:text-brand-blue-dark"
          >
            Annuller
          </button>
          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark"
          >
            Fortsæt
          </button>
        </div>
      </motion.div>
    </div>
  );
}