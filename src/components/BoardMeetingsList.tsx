import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MapPin, AlertTriangle, Upload, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { generatePDF } from '../utils/pdf';
import MeetingUploadModal from './MeetingUploadModal';

interface BoardMeeting {
  id: string;
  date: string;
  location: string;
  minutes_text: string | null;
}

export function BoardMeetingsList() {
  const [meetings, setMeetings] = useState<BoardMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<BoardMeeting | null>(null);

  useEffect(() => {
    fetchMeetings();

    const channel = supabase
      .channel('board_meetings_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'board_meetings' }, () => {
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
        .from('board_meetings')
        .select('*')
        .order('date', { ascending: true });

      if (dbError) throw dbError;
      setMeetings(dbMeetings || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Kunne ikke hente bestyrelsesmøder');
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadMinutes = async (meeting: BoardMeeting) => {
    if (!meeting.minutes_text) return;

    const date = new Date(meeting.date).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    try {
      await generatePDF({
        title: `Referat - ${date}`,
        content: meeting.minutes_text,
        filename: `Referat-${date}.pdf`
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Kunne ikke generere PDF');
    }
  };

  const isFutureDate = (date: string) => {
    return new Date(date) > new Date();
  };

  const isPastDate = (date: string) => {
    return new Date(date) < new Date();
  };

  const getNextMeeting = () => {
    const now = new Date();
    return meetings.find(meeting => new Date(meeting.date) > now);
  };

  const nextMeeting = getNextMeeting();

  if (loading) {
    return <div className="text-center">Indlæser bestyrelsesmøder...</div>;
  }

  // Sort meetings by date, most recent first
  const sortedMeetings = [...meetings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleOpenUploadModal = (meeting?: BoardMeeting) => {
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
      {/* Create New Meeting Button */}
      <button
        onClick={() => handleOpenUploadModal()}
        className="w-full bg-brand-blue text-white py-3 px-4 rounded-lg hover:bg-brand-blue-dark transition flex items-center justify-center gap-2 font-medium"
      >
        <Plus className="w-5 h-5" />
        Opret nyt møde
      </button>

      {meetings.length === 0 ? (
        <p className="text-center">Ingen bestyrelsesmøder planlagt.</p>
      ) : (
        <>
          {/* Next Meeting Section */}
          {nextMeeting && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Næste møde</h3>
              <motion.div
                key={nextMeeting.id}
                className="bg-brand-blue text-white rounded-lg p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
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
                      Hos {nextMeeting.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* All Meetings List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Alle møder</h3>
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
                        Hos {meeting.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPastDate(meeting.date) && !meeting.minutes_text && (
                        <motion.button
                          onClick={() => handleOpenUploadModal(meeting)}
                          className="flex items-center gap-1 text-sm bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload referat</span>
                        </motion.button>
                      )}
                      {meeting.minutes_text && (
                        <motion.button
                          onClick={() => handleDownloadMinutes(meeting)}
                          className="flex items-center gap-1 text-sm text-brand-blue hover:text-white transition-colors group-hover:text-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Hent referat</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Upload Modal */}
      <MeetingUploadModal
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
        meetingId={selectedMeeting?.id}
        meetingDate={selectedMeeting?.date.split('T')[0]}
        meetingLocation={selectedMeeting?.location}
      />
    </div>
  );
}