import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Section } from '../Section';
import { BoardMeetingsList } from '../BoardMeetingsList';

interface BoardMeetingsSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function BoardMeetingsSection({ hoveredSection, setHoveredSection }: BoardMeetingsSectionProps) {
  return (
    <Section
      index={9}
      title="Bestyrelsesmøder"
      icon={<ClipboardList className="w-6 h-6" />}
      content={
        <div className="space-y-4">
          <p>Her finder du en oversigt over bestyrelsesmøder og deres referater 📋</p>
          <BoardMeetingsList />
        </div>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}