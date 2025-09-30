import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { AddressStepProps } from '../../../types/registration';
import { AddressInput } from './AddressInput';

interface ExtendedAddressStepProps extends AddressStepProps {
  onEnterPress?: () => void;
}

export function AddressStep({
  houseNumber,
  setHouseNumber,
  houseNumberError,
  eventId,
  existingRegistration,
  onEnterPress
}: ExtendedAddressStepProps) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 text-brand-blue mb-4">
        <MapPin className="w-5 h-5" />
        <span>Vælg dit husnummer</span>
      </div>

      <AddressInput
        houseNumber={houseNumber}
        setHouseNumber={setHouseNumber}
        houseNumberError={houseNumberError}
        eventId={eventId}
        existingRegistration={existingRegistration}
        onEnterPress={onEnterPress}
      />
    </motion.div>
  );
}