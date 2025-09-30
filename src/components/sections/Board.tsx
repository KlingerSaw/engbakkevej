import React from 'react';
import { MapPin } from 'lucide-react';
import { Section } from '../Section';

interface BoardSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function BoardSection({ hoveredSection, setHoveredSection }: BoardSectionProps) {
  return (
    <Section
      index={7}
      title="Bestyrelsen"
      icon={<MapPin className="w-6 h-6" />}
      content={
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold">René nr. 37</p>
            <p className="text-sm">Formand</p>
          </div>
          <div>
            <p className="font-semibold">Sune nr. 22</p>
            <p className="text-sm">Næstformand</p>
          </div>
          <div>
            <p className="font-semibold">Lars nr. 28</p>
            <p className="text-sm">Kasserer</p>
          </div>
          <div>
            <p className="font-semibold">Inger nr. 24</p>
            <p className="text-sm">Medlem</p>
          </div>
          <div>
            <p className="font-semibold">Birger nr. 21</p>
            <p className="text-sm">Medlem</p>
          </div>
        </div>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}