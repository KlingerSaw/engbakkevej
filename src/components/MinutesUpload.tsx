import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Upload, Calendar, MapPin } from 'lucide-react';
import FileUploadField from './FileUploadField';
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
  const [meetingTime, setMeetingTime] = useState('19:00');
  const [location, setLocation] = useState(prefillLocation || '');
  const [minutesFile, setMinutesFile] = useState<File | null>(null);

  useEffect(() => {
    if (prefillDate) {
      const dateObj = new Date(prefillDate);
      const dateStr = dateObj.toISOString().split('T')[0];
      const timeStr = dateObj.toTimeString().slice(0, 5);
      setMeetingDate(dateStr);
      setMeetingTime(timeStr);
    }
    if (prefillLocation) setLocation(prefillLocation);
  }, [prefillDate, prefillLocation]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingDate || !location) {
      toast.error('Udfyld dato og sted');
      return;
    }

    if (!minutesFile) {
      toast.error('Upload referat');
      return;
    }

    setIsLoading(true);

    try {
      const fullDateTime = `${meetingDate}T${meetingTime}:00`;

      const timestamp = Date.now();
      const fileExt = minutesFile.name.split('.').pop();
      const fileName = `${meetingDate}_${timestamp}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('board_meetings_documents')
        .upload(filePath, minutesFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('board_meetings_documents')
        .getPublicUrl(filePath);

      if (meetingId) {
        const { error } = await supabase
          .from('board_meetings')
          .update({
            minutes_file_url: publicUrl,
            minutes_file_name: minutesFile.name,
            minutes_file_size: minutesFile.size
          })
          .eq('id', meetingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('board_meetings')
          .insert({
            date: fullDateTime,
            location,
            minutes_file_url: publicUrl,
            minutes_file_name: minutesFile.name,
            minutes_file_size: minutesFile.size
          });

        if (error) throw error;
      }

      toast.success('Referat uploadet!');

      setMeetingDate('');
      setMeetingTime('19:00');
      setLocation('');
      setMinutesFile(null);

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
        <div className="grid grid-cols-2 gap-4">
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
              <Calendar className="w-4 h-4 inline mr-2" />
              Tidspunkt
            </label>
            <input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
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

        <FileUploadField
          label="Referat"
          file={minutesFile}
          onChange={setMinutesFile}
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
