import React from 'react';
import { Users } from 'lucide-react';
import { Section } from '../Section';

interface FeesSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function FeesSection({ hoveredSection, setHoveredSection }: FeesSectionProps) {
  return (
    <Section
      index={2}
      title="Kontingent"
      icon={<Users className="w-6 h-6" />}
      content={
        <>
          <p>Kontingent afregnes årligt og forfalder 1. oktober.</p>
          <p className="font-bold mt-2">Kontingentsats er på 1600 kr.</p>
          <p className="font-bold">Bidrag til vejfond er på 400 kr.</p>
          <p className="mt-2">Anmodning om indbetaling sendes via mail.</p>
        </>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}