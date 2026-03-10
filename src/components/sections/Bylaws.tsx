import React, { useEffect, useState } from 'react';
import { ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import { Section } from '../Section';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { generatePDF } from '../../utils/pdf';
import { motion, AnimatePresence } from 'framer-motion';

interface Bylaw {
  id: string;
  section_number: number;
  title: string;
  content: string;
}

interface BylawsSectionProps {
  hoveredSection: number | null;
  setHoveredSection: (index: number | null) => void;
}

export function BylawsSection({ hoveredSection, setHoveredSection }: BylawsSectionProps) {
  const [bylaws, setBylaws] = useState<Bylaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    fetchBylaws();
  }, []);

  async function fetchBylaws() {
    try {
      console.log('Fetching bylaws...');
      const { data, error } = await supabase
        .from('bylaws')
        .select('*')
        .order('section_number');

      console.log('Bylaws response:', { data, error, count: data?.length });

      if (error) {
        console.error('Error fetching bylaws:', error);
        toast.error('Kunne ikke hente vedtægter');
        setBylaws([]);
      } else {
        console.log('Setting bylaws:', data?.length || 0, 'items');
        setBylaws(data || []);
      }
    } catch (error) {
      console.error('Exception fetching bylaws:', error);
      toast.error('Kunne ikke hente vedtægter');
      setBylaws([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const content = bylaws
        .map(bylaw => `<h2>${bylaw.title}</h2>${bylaw.content}`)
        .join('');

      await generatePDF({
        title: 'Vedtægter for Grundejerforeningen Engbakken',
        content,
        filename: 'vedtaegter.pdf'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Kunne ikke generere PDF');
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) 
        ? prev.filter(sectionId => sectionId !== id)
        : [...prev, id]
    );
  };

  return (
    <Section
      index={10}
      title="Vedtægter"
      icon={<ScrollText className="w-6 h-6" />}
      content={
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-white/20 rounded-lg"></div>
                <div className="h-32 bg-white/20 rounded-lg"></div>
              </div>
              <p className="text-center text-sm text-gray-500">Henter vedtægter...</p>
            </div>
          ) : bylaws.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">Ingen vedtægter fundet</p>
              <p className="text-sm text-gray-500">Kontakt administratoren hvis dette problem fortsætter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bylaws.map((bylaw) => (
                  <div 
                    key={bylaw.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(bylaw.id)}
                      className="w-full p-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                    >
                      <h2 className="text-xl font-semibold text-brand-blue">
                        {bylaw.title}
                      </h2>
                      {expandedSections.includes(bylaw.id) ? (
                        <ChevronUp className="w-6 h-6 text-brand-blue" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-brand-blue" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSections.includes(bylaw.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <div 
                              className="prose prose-brand max-w-none"
                              dangerouslySetInnerHTML={{ __html: bylaw.content }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              }
            </div>
          )}

          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold mb-4">Download vedtægter</h3>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors"
              disabled={bylaws.length === 0}
            >
              <ScrollText className="w-5 h-5" />
              <span>Hent som PDF</span>
            </button>
          </div>
        </div>
      }
      hoveredSection={hoveredSection}
      setHoveredSection={setHoveredSection}
    />
  );
}