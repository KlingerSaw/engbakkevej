import React, { useState, useEffect } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Section } from '../Section';
import { useBoardMembers } from '../../hooks/useBoardMembers';
import { supabase } from '../../lib/supabase';

interface BoardSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function BoardSection({ hoveredSection, setHoveredSection }: BoardSectionProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const { members, loading } = useBoardMembers(selectedYear);

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  const fetchAvailableYears = async () => {
    try {
      const { data, error } = await supabase
        .from('board_members')
        .select('start_year, end_year');

      if (error) throw error;

      const years = new Set<number>();
      data?.forEach(member => {
        years.add(member.start_year);
        if (member.end_year) {
          for (let y = member.start_year; y <= member.end_year; y++) {
            years.add(y);
          }
        } else {
          for (let y = member.start_year; y <= currentYear; y++) {
            years.add(y);
          }
        }
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);
      setAvailableYears(sortedYears.length > 0 ? sortedYears : [currentYear]);
    } catch (error) {
      console.error('Error fetching years:', error);
      setAvailableYears([currentYear]);
    }
  };

  const handlePreviousYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1]);
    }
  };

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1]);
    }
  };

  const canGoPrevious = availableYears.indexOf(selectedYear) < availableYears.length - 1;
  const canGoNext = availableYears.indexOf(selectedYear) > 0;

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
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={handlePreviousYear}
              disabled={!canGoPrevious}
              className={`p-2 rounded-lg transition-colors ${
                canGoPrevious
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Forrige år"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold min-w-[100px] text-center">
              {selectedYear}
            </span>
            <button
              onClick={handleNextYear}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${
                canGoNext
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Næste år"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
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