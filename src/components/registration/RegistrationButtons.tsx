import React from 'react';
import { RegistrationButtonsProps } from '../../types/registration';

export function RegistrationButtons({
  step,
  setStep,
  onClose,
  isSubmitting,
  houseNumberError,
  existingRegistration,
  onVerifyHouse
}: RegistrationButtonsProps) {
  const handleContinueClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (step === 1 && onVerifyHouse) {
      onVerifyHouse();
    }
  };

  return (
    <div className="flex justify-end gap-3 mt-6">
      {step === 2 && (
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-4 py-2 text-brand-blue hover:text-brand-blue-dark"
        >
          Tilbage
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-brand-blue hover:text-brand-blue-dark"
      >
        Annuller
      </button>
      <button
        type={step === 2 ? "submit" : "button"}
        onClick={step === 1 ? handleContinueClick : undefined}
        disabled={isSubmitting || !!houseNumberError}
        className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:opacity-50"
      >
        {isSubmitting ? 'Sender...' : step === 1 ? 'Fortsæt' : (existingRegistration ? 'Opdater' : 'Tilmeld')}
      </button>
    </div>
  );
}