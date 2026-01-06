import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Upload, Calendar, MapPin } from 'lucide-react';
import DocumentUploadField from './DocumentUploadField';
import { supabase } from '../lib/supabase';

interface MinutesUploadProps {
  meetingId?: string;
  prefillDate?: string;
  prefillLocation?: string;
  onClose?: () => void;
}

export default function MinutesUpload({ meetingId, prefillDate, prefillLocation, onClose }: MinutesUploadProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [meetingDate, setMeetingDate] = useState(prefillDate || '');
  const [location, setLocation] = useState(prefillLocation || '');
  const [minutesHtml, setMinutesHtml] = useState('');

  useEffect(() => {
    if (prefillDate) setMeetingDate(prefillDate);
    if (prefillLocation) setLocation(prefillLocation);
  }, [prefillDate, prefillLocation]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingDate || !location) {
      toast.error('Udfyld dato og sted');
      return;
    }

    if (!minutesHtml) {
      toast.error('Upload referat');
      return;
    }

    setIsLoading(true);

    try {
      if (meetingId) {
        const { error } = await supabase
          .from('board_meetings')
          .update({ minutes_text: minutesHtml })
          .eq('id', meetingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('board_meetings')
          .insert({
            date: meetingDate,
            location,
            minutes_text: minutesHtml,
          });

        if (error) throw error;
      }

      toast.success('Referat uploadet!');

      setMeetingDate('');
      setLocation('');
      setMinutesHtml('');

      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Der opstod en fejl');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">Upload Referat</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Mødedato
          </label>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Sted
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Sune"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <DocumentUploadField
          label="Referat"
          value={minutesHtml}
          onChange={setMinutesHtml}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Uploader...' : 'Upload Referat'}
        </button>
      </form>
    </div>
  );
}
