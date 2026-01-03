import React from 'react';
import { Users } from 'lucide-react';
import { Section } from '../Section';
import { GeneralMeetingsList } from '../GeneralMeetingsList';

interface GeneralMeetingSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function GeneralMeetingSection({ hoveredSection, setHoveredSection }: GeneralMeetingSectionProps) {
  return (
    <Section
      index={3}
      title="Generalforsamling"
      icon={<Users className="w-6 h-6" />}
      content={
        <>
          <p className="mb-6">Årligt afholdes den ordinære generalforsamling efter foreningens vedtægter. Vi håber, at I vil bakke op om generalforsamlingen ved at deltage.</p>
          <GeneralMeetingsList />
        </>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}