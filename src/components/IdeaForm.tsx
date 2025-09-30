import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { getDeviceId } from '../lib/deviceId';
import { AddressInput } from './registration/steps/AddressInput';
import { HouseSelector } from './registration/steps/HouseSelector';

export function IdeaForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showHouseSelector, setShowHouseSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [houseNumber, setHouseNumber] = useState('8');
  const [houseNumberError, setHouseNumberError] = useState('');
  const deviceId = getDeviceId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowHouseSelector(true);
  };

  const handleHouseSelect = async (number: number) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('ideas')
        .insert([{ 
          title, 
          description,
          house_number: number,
          device_id: deviceId,
          upvotes: 0,
          upvoted_by: []
        }]);

      if (error) throw error;

      toast.success('Din idé er blevet tilføjet!');
      setTitle('');
      setDescription('');
      setShowHouseSelector(false);
    } catch (error) {
      toast.error('Der opstod en fejl. Prøv igen senere.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    rest: {
      borderRadius: "0.375rem",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hover: {
      borderRadius: "0.75rem 0.25rem 0.75rem 0.25rem",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Titel
          </label>
          <motion.input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue bg-white px-3 py-2 text-black"
            required
            variants={inputVariants}
            initial="rest"
            whileHover="hover"
            animate="rest"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Beskrivelse
          </label>
          <motion.textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full border border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue bg-white px-3 py-2 text-black"
            required
            variants={inputVariants}
            initial="rest"
            whileHover="hover"
            animate="rest"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-blue px-4 py-2 text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-50 rounded"
          variants={inputVariants}
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          {isSubmitting ? 'Sender...' : 'Send idé'}
        </motion.button>
      </motion.form>

      {showHouseSelector && (
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
              onEnterPress={() => {}}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowHouseSelector(false)}
                className="px-4 py-2 text-brand-blue hover:text-brand-blue-dark"
              >
                Annuller
              </button>
              <button
                onClick={() => handleHouseSelect(parseInt(houseNumber))}
                className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark"
              >
                Fortsæt
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}