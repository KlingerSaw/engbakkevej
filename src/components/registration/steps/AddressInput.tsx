import React, { useState } from 'react';
import { AddressStepProps } from '../../../types/registration';
import { motion, AnimatePresence } from 'framer-motion';

interface AddressInputProps extends AddressStepProps {
  onEnterPress?: () => void;
}

const AVAILABLE_NUMBERS = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38
];

export function AddressInput({
  houseNumber,
  setHouseNumber,
  houseNumberError,
  eventId,
  existingRegistration,
  onEnterPress
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<number[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setHouseNumber(value);
    
    if (value) {
      const filtered = AVAILABLE_NUMBERS.filter(num => 
        num.toString().startsWith(value)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (number: number) => {
    setHouseNumber(number.toString());
    setShowSuggestions(false);
    if (onEnterPress) {
      onEnterPress();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (houseNumber && AVAILABLE_NUMBERS.includes(parseInt(houseNumber))) {
        setShowSuggestions(false);
        if (onEnterPress) {
          onEnterPress();
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={houseNumber}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
          placeholder="Indtast husnummer (8-38)"
          maxLength={2}
          autoFocus
          disabled={!!existingRegistration}
        />
        
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && !existingRegistration && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <ul className="max-h-60 py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                {suggestions.map((number) => (
                  <li
                    key={number}
                    className="cursor-pointer select-none relative py-2 px-3 hover:bg-gray-100 transition-colors rounded-md"
                    onClick={() => handleSuggestionClick(number)}
                  >
                    <span className="block truncate">
                      Husnummer {number}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {houseNumberError && (
        <p className="mt-2 text-sm text-red-600">{houseNumberError}</p>
      )}
    </div>
  );
}