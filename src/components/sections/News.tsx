import React from 'react';
import { Newspaper } from 'lucide-react';
import { Section } from '../Section';
import { useNews } from '../../hooks/useNews';

interface NewsSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function NewsSection({ hoveredSection, setHoveredSection }: NewsSectionProps) {
  const { news, loading } = useNews();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Section
        index={1}
        title="Nyheder"
        icon={<Newspaper className="w-6 h-6" />}
        content={
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/20 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        }
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      />
    );
  }

  return (
    <Section
      index={1}
      title="Nyheder"
      icon={<Newspaper className="w-6 h-6" />}
      content={
        <div className="space-y-4">
          {news.length === 0 ? (
            <p className="text-center text-gray-500">Ingen nyheder endnu</p>
          ) : (
            news.map((item) => (
              <div key={item.id} className="bg-white/20 rounded-lg p-4">
                <h3 className="font-semibold text-brand-blue mb-2">{item.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{item.content}</p>
                <p className="text-xs text-gray-600">{formatDate(item.created_at)}</p>
              </div>
            ))
          )}
        </div>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}