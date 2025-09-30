import React from 'react';
import { motion } from 'framer-motion';
import { AddressInput } from '../registration/steps/AddressInput';
import { HouseSelector } from '../registration/steps/HouseSelector';

interface IdeaFormViewProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  showAddressModal: boolean;
  setShowAddressModal: (value: boolean) => void;
  showHouseSelector: boolean;
  setShowHouseSelector: (value: boolean) => void;
  showIdeaForm: boolean;
  houseNumber: string;
  setHouseNumber: (value: string) => void;
  houseNumberError: string;
  handleHouseSelect: (number: number) => void;
  handleContinue: () => void;
  handleNewIdea: () => void;
}

export function IdeaFormView({
  title,
  setTitle,
  description,
  setDescription,
  isSubmitting,
  handleSubmit,
  handleCancel,
  showAddressModal,
  setShowAddressModal,
  showHouseSelector,
  setShowHouseSelector,
  showIdeaForm,
  houseNumber,
  setHouseNumber,
  houseNumberError,
  handleHouseSelect,
  handleContinue,
  handleNewIdea
}: IdeaFormViewProps) {
  if (!showAddressModal && !showHouseSelector && !showIdeaForm) {
    return (
      <div className="flex justify-center">
        <button
          onClick={handleNewIdea}
          className="bg-brand-blue px-6 py-3 text-white rounded-lg hover:bg-brand-blue-dark transition-colors"
        >
          Del din idé
        </button>
      </div>
    );
  }

  if (showAddressModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-6 max-w-md w-full"
        >
          <h3 className="text-xl font-semibold text-brand-blue mb-4">
            Vælg dit husnummer
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
              onClick={() => {
                setShowAddressModal(false);
                setHouseNumber('');
              }}
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

  if (showHouseSelector) {
    return (
      <HouseSelector
        expectedNumber={parseInt(houseNumber)}
        onSelect={handleHouseSelect}
        onClose={() => {
          setShowHouseSelector(false);
          setShowAddressModal(false);
          setHouseNumber('');
        }}
      />
    );
  }

  if (showIdeaForm) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Titel
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue bg-white px-3 py-2 text-black"
            required
            placeholder="Skriv din titel her..."
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Beskrivelse
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full border border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue bg-white px-3 py-2 text-black"
            required
            placeholder="Beskriv din idé her..."
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-brand-blue hover:text-brand-blue-dark border border-brand-blue rounded"
          >
            Annuller
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-brand-blue px-4 py-2 text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-50 rounded"
          >
            {isSubmitting ? 'Sender...' : 'Send idé'}
          </button>
        </div>
      </form>
    );
  }

  return null;
}