import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MapPin, Upload, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { generatePDF } from '../utils/pdf';
import GeneralMeetingUploadModal from './GeneralMeetingUploadModal';
import { useYear } from '../contexts/YearContext';
import { useAuth } from '../contexts/AuthContext';

interface GeneralMeeting {
  id: string;
  date: string;
  type: 'ordinær' | 'ekstraordinær';
  location: string;
  board_proposal_text: string | null;
  board_report_text: string | null;
  minutes_text: string | null;
}

export function GeneralMeetingsList() {
  const [meetings, setMeetings] = useState<GeneralMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<GeneralMeeting | null>(null);
  const { selectedYear } = useYear();
  const { user } = useAuth();

  useEffect(() => {
    fetchMeetings();

    const channel = supabase
      .channel('general_meetings_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'general_meetings' }, () => {
        fetchMeetings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMeetings() {
    try {
      const { data: dbMeetings, error: dbError } = await supabase
        .from('general_meetings')
        .select('*')
        .order('date', { ascending: true });

      if (dbError) throw dbError;

      const allMeetings = dbMeetings || [];
      setMeetings(allMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Kunne ikke hente generalforsamlinger');
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadDocument = async (
    meeting: GeneralMeeting,
    content: string | null,
    type: 'proposal' | 'report' | 'minutes'
  ) => {
    if (!content) return;

    const date = new Date(meeting.date).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const titles = {
      proposal: `Forslag til bestyrelse - ${meeting.type} generalforsamling - ${date}`,
      report: `Bestyrelsens beretning - ${meeting.type} generalforsamling - ${date}`,
      minutes: `Referat - ${meeting.type} generalforsamling - ${date}`
    };

    const filenames = {
      proposal: `Forslag-til-bestyrelse-${date}.pdf`,
      report: `Bestyrelsens-beretning-${date}.pdf`,
      minutes: `Referat-Generalforsamling-${date}.pdf`
    };

    try {
      await generatePDF({
        title: titles[type],
        content,
        filename: filenames[type]
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Kunne ikke generere PDF');
    }
  };

  const isPastDate = (date: string) => {
    return new Date(date) < new Date();
  };

  const getNextMeeting = () => {
    const now = new Date();
    return filteredMeetings.find(meeting => new Date(meeting.date) > now);
  };

  if (loading) {
    return <div className="text-center">Indlæser generalforsamlinger...</div>;
  }

  const filteredMeetings = meetings.filter(m => new Date(m.date).getFullYear() === selectedYear);

  const sortedMeetings = [...filteredMeetings].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const nextMeeting = getNextMeeting();

  const handleOpenUploadModal = (meeting?: GeneralMeeting) => {
    if (meeting) {
      setSelectedMeeting(meeting);
    } else {
      setSelectedMeeting(null);
    }
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedMeeting(null);
  };

  return (
    <div className="space-y-4">
      {user && (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => handleOpenUploadModal()}
            className="flex-1 bg-brand-blue text-white py-3 px-4 rounded-lg hover:bg-brand-blue-dark transition flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Opret ny generalforsamling
          </button>
        </div>
      )}

      {filteredMeetings.length === 0 ? (
        <p className="text-center">Ingen generalforsamlinger i {selectedYear}.</p>
      ) : (
        <>
          {nextMeeting && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Næste generalforsamling</h3>
              <motion.div
                key={nextMeeting.id}
                className="bg-brand-blue text-white rounded-lg p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                        {nextMeeting.type.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-semibold">
                      {new Date(nextMeeting.date).toLocaleDateString('da-DK', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </h4>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {nextMeeting.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">Alle generalforsamlinger</h3>
            <div className="space-y-4">
              {sortedMeetings.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  className="bg-white/10 rounded-lg p-4 hover:bg-brand-blue/10 group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-brand-blue/20 px-2 py-1 rounded">
                          {meeting.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-semibold">
                        {new Date(meeting.date).toLocaleDateString('da-DK', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </h4>
                      <p className="text-sm mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {meeting.location}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {user && isPastDate(meeting.date) && !meeting.minutes_text && !meeting.board_proposal_text && !meeting.board_report_text && (
                        <motion.button
                          onClick={() => handleOpenUploadModal(meeting)}
                          className="flex items-center gap-1 text-sm bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload dokumenter</span>
                        </motion.button>
                      )}
                      {meeting.type === 'ordinær' && (
                        <>
                          <motion.button
                            onClick={() => handleDownloadDocument(meeting, meeting.board_proposal_text, 'proposal')}
                            className={`flex items-center gap-1 text-sm px-3 py-1 rounded transition-colors ${
                              meeting.board_proposal_text
                                ? 'text-brand-blue hover:text-white group-hover:text-white'
                                : 'text-gray-400 italic cursor-default'
                            }`}
                            whileHover={meeting.board_proposal_text ? { scale: 1.05 } : {}}
                            whileTap={meeting.board_proposal_text ? { scale: 0.95 } : {}}
                          >
                            <FileText className="w-4 h-4" />
                            <span>{meeting.board_proposal_text ? 'Forslag til bestyrelse' : 'Ingen rettidig indkommet'}</span>
                          </motion.button>
                          <motion.button
                            onClick={() => handleDownloadDocument(meeting, meeting.board_report_text, 'report')}
                            className={`flex items-center gap-1 text-sm px-3 py-1 rounded transition-colors ${
                              meeting.board_report_text
                                ? 'text-brand-blue hover:text-white group-hover:text-white'
                                : 'text-gray-400 italic cursor-default'
                            }`}
                            whileHover={meeting.board_report_text ? { scale: 1.05 } : {}}
                            whileTap={meeting.board_report_text ? { scale: 0.95 } : {}}
                          >
                            <FileText className="w-4 h-4" />
                            <span>{meeting.board_report_text ? 'Bestyrelsens beretning' : 'Ingen rettidig indkommet'}</span>
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        onClick={() => handleDownloadDocument(meeting, meeting.minutes_text, 'minutes')}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded transition-colors ${
                          meeting.minutes_text
                            ? 'text-brand-blue hover:text-white group-hover:text-white'
                            : 'text-gray-400 italic cursor-default'
                        }`}
                        whileHover={meeting.minutes_text ? { scale: 1.05 } : {}}
                        whileTap={meeting.minutes_text ? { scale: 0.95 } : {}}
                      >
                        <FileText className="w-4 h-4" />
                        <span>{meeting.minutes_text ? 'Referat' : 'Ikke tilgængeligt'}</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      <GeneralMeetingUploadModal
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
        meetingId={selectedMeeting?.id}
        meetingDate={selectedMeeting?.date.split('T')[0]}
        meetingLocation={selectedMeeting?.location}
        meetingType={selectedMeeting?.type}
      />
    </div>
  );
}
