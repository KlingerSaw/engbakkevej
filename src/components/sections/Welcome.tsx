import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Section } from '../Section';

interface WelcomeSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function WelcomeSection({ hoveredSection, setHoveredSection }: WelcomeSectionProps) {
  return (
    <Section
      index={0}
      title="Velkommen"
      icon={<Heart className="w-6 h-6" />}
      content={
        <>
          <p>Som grundejer på Engbakkevej nr. 8-38 er du medlem af Grundejerforeningen Engbakken.</p>
          <p className="mt-4">
            <a 
              href="https://www.google.com/maps/place/Engbakkevej+15,+8800+Viborg"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-200 inline-flex items-center gap-2 ${
                hoveredSection === 0 ? 'text-brand-cream hover:text-brand-cream' : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              Hjertestarter findes på garagen hos nr. 15 ❤️
              <ExternalLink className="w-4 h-4" />
            </a>
          </p>
        </>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}