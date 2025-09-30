import React from 'react';
import { ParticipantsStepProps } from '../../../types/registration';

export function ParticipantsForm({
  adults,
  children,
  setAdults,
  setChildren
}: ParticipantsStepProps) {
  return (
    <>
      <div>
        <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
          Antal voksne (1-5)
        </label>
        <input
          type="number"
          id="adults"
          min="1"
          max="5"
          required
          value={adults}
          onChange={(e) => setAdults(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue text-brand-blue"
        />
      </div>

      <div>
        <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
          Antal børn (0-5)
        </label>
        <input
          type="number"
          id="children"
          min="0"
          max="5"
          required
          value={children}
          onChange={(e) => setChildren(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue text-brand-blue"
        />
      </div>
    </>
  );
}