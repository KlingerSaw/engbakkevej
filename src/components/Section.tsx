import React from 'react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  index: number;
}

export function Section({ title, icon, content, index }: SectionProps) {
  const getBackgroundColor = (index: number) => {
    if (index === 7) return 'bg-brand-cream';
    if (index === 8) return 'bg-brand-blue-light';
    return index % 2 === 0 ? 'bg-brand-cream' : 'bg-brand-blue-light';
  };

  return (
    <div className={`relative rounded-3xl shadow-lg ${getBackgroundColor(index)}`}>
      <div className="p-6">
        <div className="bg-brand-blue text-white px-6 py-3 rounded-full inline-flex items-center gap-2 mb-6">
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="space-y-2 text-gray-700">
          {content}
        </div>
      </div>
    </div>
  );
}