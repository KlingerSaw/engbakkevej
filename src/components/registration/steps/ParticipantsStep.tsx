import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { ParticipantsStepProps } from '../../../types/registration';
import { ParticipantsForm } from './ParticipantsForm';

export function ParticipantsStep(props: ParticipantsStepProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 text-brand-blue mb-4">
        <Users className="w-5 h-5" />
        <span>Antal deltagere fra Engbakkevej {props.houseNumber}</span>
      </div>

      <ParticipantsForm {...props} />
    </motion.div>
  );
}