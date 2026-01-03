import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useYear } from '../contexts/YearContext';

export function GlobalYearSelector() {
  const { selectedYear, setSelectedYear, availableYears } = useYear();

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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-blue text-white shadow-lg z-50">
      <div className="max-w-6xl mx-auto py-4 px-8">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousYear}
            disabled={!canGoPrevious}
            className={`p-2 rounded-lg transition-colors ${
              canGoPrevious
                ? 'hover:bg-white/20 text-white'
                : 'text-white/30 cursor-not-allowed'
            }`}
            aria-label="Forrige år"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-2xl font-bold min-w-[120px] text-center">
            {selectedYear}
          </span>
          <button
            onClick={handleNextYear}
            disabled={!canGoNext}
            className={`p-2 rounded-lg transition-colors ${
              canGoNext
                ? 'hover:bg-white/20 text-white'
                : 'text-white/30 cursor-not-allowed'
            }`}
            aria-label="Næste år"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
