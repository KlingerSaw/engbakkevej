import React from 'react';
import { Mail } from 'lucide-react';
import { Section } from '../Section';

interface GeneralMeetingSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function GeneralMeetingSection({ hoveredSection, setHoveredSection }: GeneralMeetingSectionProps) {
  return (
    <Section
      index={3}
      title="Generalforsamling"
      icon={<Mail className="w-6 h-6" />}
      content={
        <>
          <p>Årligt afholdes den ordinære generalforsamling efter foreningens vedtægter.</p>
          <p className="font-bold mt-4">Vi håber, at I vil bakke op om generalforsamlingen ved at deltage.</p>
        </>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}