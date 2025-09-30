import React from 'react';
import { Newspaper } from 'lucide-react';
import { Section } from '../Section';

interface NewsSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function NewsSection({ hoveredSection, setHoveredSection }: NewsSectionProps) {
  return (
    <Section
      index={1}
      title="Nyheder"
      icon={<Newspaper className="w-6 h-6" />}
      content={
        <div className="space-y-4">
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="font-semibold text-brand-blue mb-2">Velkommen til den nye hjemmeside! 🎉</h3>
            <p className="text-sm text-gray-700 mb-2">
              Vi er glade for at kunne præsentere vores nye hjemmeside for Grundejerforeningen Engbakken.
            </p>
            <p className="text-xs text-gray-600">15. januar 2025</p>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="font-semibold text-brand-blue mb-2">Kommende arrangementer</h3>
            <p className="text-sm text-gray-700 mb-2">
              Hold øje med kalenderen for kommende arrangementer og arbejdsdage i 2025.
            </p>
            <p className="text-xs text-gray-600">10. januar 2025</p>
          </div>
        </div>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}