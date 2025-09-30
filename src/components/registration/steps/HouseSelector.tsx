import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface HouseSelectorProps {
  expectedNumber: number;
  onSelect: (houseNumber: number) => void;
  onClose: () => void;
}

interface HouseOption {
  number: number;
  imageUrl: string;
}

const AVAILABLE_NUMBERS = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38
];

export function HouseSelector({ expectedNumber, onSelect, onClose }: HouseSelectorProps) {
  const [houses, setHouses] = useState<HouseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wrongSelection, setWrongSelection] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isSelectionDisabled, setIsSelectionDisabled] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    fetchRandomHouses();
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
        if (cooldown === 1) {
          setIsSelectionDisabled(false);
          setWrongSelection(false);
          fetchRandomHouses(); // Fetch new options when cooldown ends
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const fetchRandomHouses = async () => {
    try {
      setLoading(true);
      const expectedFileName = `${expectedNumber}.png`;
      const { data: expectedUrlData, error: expectedUrlError } = supabase
        .storage
        .from('houses')
        .getPublicUrl(expectedFileName);

      if (expectedUrlError) throw expectedUrlError;

      // Filter out the expected number from available numbers
      const availableNumbers = AVAILABLE_NUMBERS.filter(n => n !== expectedNumber);
      
      // Get 8 random numbers (plus the correct one makes 9)
      const randomHouseNumbers = availableNumbers
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);

      const otherHouses = randomHouseNumbers.map(number => ({
        number,
        imageUrl: supabase.storage.from('houses').getPublicUrl(`${number}.png`).data.publicUrl
      }));

      const allHouses = [
        { number: expectedNumber, imageUrl: expectedUrlData.publicUrl },
        ...otherHouses
      ].sort(() => 0.5 - Math.random());

      setHouses(allHouses);
    } catch (err) {
      console.error('Error fetching house images:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke hente husbilleder');
    } finally {
      setLoading(false);
    }
  };

  const handleHouseSelect = (number: number) => {
    if (isSelectionDisabled) return;

    if (number === expectedNumber) {
      onSelect(number);
    } else {
      setWrongSelection(true);
      setIsSelectionDisabled(true);
      setCooldown(5); // 5 seconds cooldown before allowing new selection
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-4xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-brand-blue">
            Vælg dit hus
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="aspect-video bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">
            <p>{error}</p>
            <p className="mt-2 text-sm">Prøv venligst igen senere eller kontakt webmaster via kontaktformularen.</p>
          </div>
        ) : (
          <>
            {wrongSelection && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="font-semibold">Forkert valg</p>
                </div>
                <p className="text-red-600">
                  Det valgte hus matcher ikke det indtastede husnummer. Prøv igen om {cooldown} sekunder.
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {houses.map((house) => (
                <motion.button
                  key={house.number}
                  onClick={() => handleHouseSelect(house.number)}
                  className={`relative aspect-video rounded-lg overflow-hidden hover:ring-2 ring-brand-blue focus:outline-none ${
                    isSelectionDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: isSelectionDisabled ? 1 : 1.02 }}
                  whileTap={{ scale: isSelectionDisabled ? 1 : 0.98 }}
                  disabled={isSelectionDisabled}
                >
                  <img
                    src={house.imageUrl}
                    alt="Hus"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Error loading image for house ${house.number}:`, {
                        url: house.imageUrl,
                        error: e
                      });
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}