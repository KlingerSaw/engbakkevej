import React, { useState, useCallback } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Section } from '../Section';
import { IdeaForm } from '../ideas/IdeaForm';
import { IdeasList } from '../ideas/IdeasList';

interface IdeasSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function IdeasSection({ hoveredSection, setHoveredSection }: IdeasSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleIdeaAdded = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <Section
      index={7}
      title="Del dine ideer"
      icon={<MessageSquarePlus className="w-6 h-6" />}
      content={
        <div className="space-y-8">
          <div>
            <p>Har du ideer eller forslag til forbedringer? Del dem med bestyrelsen og andre beboere her! 🤗</p>
            <div className="mt-6">
              <IdeaForm onIdeaAdded={handleIdeaAdded} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Indsendte ideer</h3>
            <IdeasList key={refreshTrigger} />
          </div>
        </div>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}