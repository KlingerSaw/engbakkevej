import React from 'react';
import { Users } from 'lucide-react';
import { Section } from '../Section';
import { useBoardMembers } from '../../hooks/useBoardMembers';
import { useYear } from '../../contexts/YearContext';

interface BoardSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function BoardSection({ hoveredSection, setHoveredSection }: BoardSectionProps) {
  const { selectedYear } = useYear();
  const { members, loading } = useBoardMembers(selectedYear);

  const positionOrder = ['Formand', 'Næstformand', 'Kasserer', 'Medlem'];
  const sortedMembers = [...members].sort((a, b) => {
    return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
  });

  return (
    <Section
      index={7}
      title={`Bestyrelsen ${selectedYear}`}
      icon={<Users className="w-6 h-6" />}
      content={
        <div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Indlæser...</div>
          ) : sortedMembers.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {sortedMembers.map(member => (
                <div key={member.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold">
                    {member.name} nr. {member.house_number}
                  </p>
                  <p className="text-sm text-gray-600">{member.position}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {member.start_year}
                    {member.end_year ? ` - ${member.end_year}` : ' - nu'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Ingen bestyrelsesmedlemmer fundet for {selectedYear}
            </div>
          )}
        </div>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}