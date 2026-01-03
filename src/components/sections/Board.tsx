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
  const { categorized, loading } = useBoardMembers(selectedYear);

  const positionOrder = ['Formand', 'Næstformand', 'Kasserer', 'Medlem'];
  const sortMembers = (members: typeof categorized.allMembers) => {
    return [...members].sort((a, b) => {
      return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
    });
  };

  const sortedAllMembers = sortMembers(categorized.allMembers);
  const sortedNewMembers = sortMembers(categorized.newMembers);
  const sortedDepartedMembers = sortMembers(categorized.departedMembers);

  const renderMemberCard = (member: typeof categorized.allMembers[0]) => (
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
  );

  return (
    <Section
      index={7}
      title={`Bestyrelsen ${selectedYear}`}
      icon={<Users className="w-6 h-6" />}
      content={
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Indlæser...</div>
          ) : sortedAllMembers.length > 0 ? (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4">Bestyrelsesmedlemmer i {selectedYear}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {sortedAllMembers.map(renderMemberCard)}
                </div>
              </div>

              {sortedNewMembers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-700">
                    Nye medlemmer i {selectedYear}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {sortedNewMembers.map(renderMemberCard)}
                  </div>
                </div>
              )}

              {sortedDepartedMembers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-700">
                    Fratrådte medlemmer i {selectedYear}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {sortedDepartedMembers.map(renderMemberCard)}
                  </div>
                </div>
              )}
            </>
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