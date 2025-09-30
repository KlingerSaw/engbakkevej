import React from 'react';
import { PenTool as Tool } from 'lucide-react';
import { Section } from '../Section';

interface ActivitiesSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function ActivitiesSection({ hoveredSection, setHoveredSection }: ActivitiesSectionProps) {
  return (
    <Section
      index={4}
      title="Arbejdsdage og vejfest"
      icon={<Tool className="w-6 h-6" />}
      content={
        <>
          <p>Der afholdes årligt to-tre arbejdsdage, hvor vi i fællesskab værner om de grønne fællesarealer.</p>
          <p className="mt-2">Cirka hvert andet år afholdes også en vejfest.</p>
          <p className="font-bold mt-2">Vi har brug for stor opbakning til begge dele! 🎉</p>
        </>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}