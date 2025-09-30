import React from 'react';
import { Facebook, ExternalLink } from 'lucide-react';
import { Section } from '../Section';

interface FacebookSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function FacebookSection({ hoveredSection, setHoveredSection }: FacebookSectionProps) {
  return (
    <Section
      index={4}
      title="Facebookside"
      icon={<Facebook className="w-6 h-6" />}
      content={
        <>
          <p>Er man på Facebook, kan man med fordel søge om medlemskab i gruppen</p>
          <p className="font-bold mt-2 flex items-center gap-2">
            <a 
              href="https://www.facebook.com/groups/593623617486590"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-200 inline-flex items-center gap-2 ${
                hoveredSection === 4 ? 'text-brand-cream hover:text-brand-cream' : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              "Engbakkevej Viborg"
              <ExternalLink className="w-4 h-4" />
            </a>
          </p>
          <p className="mt-2">Her deles varieret indhold fra vejens beboere 📱</p>
        </>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}