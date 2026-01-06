import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Upload, Calendar, MapPin, FileText } from 'lucide-react';
import FileUploadField from './FileUploadField';

interface GeneralMeetingUploadProps {
  meetingId?: string;
  prefillDate?: string;
  prefillLocation?: string;
  prefillType?: 'ordinær' | 'ekstraordinær';
  onClose?: () => void;
}

export default function GeneralMeetingUpload({
  meetingId,
  prefillDate,
  prefillLocation,
  prefillType,
  onClose
}: GeneralMeetingUploadProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [meetingDate, setMeetingDate] = useState(prefillDate || '');
  const [location, setLocation] = useState(prefillLocation || '');
  const [meetingType, setMeetingType] = useState<'ordinær' | 'ekstraordinær'>(prefillType || 'ordinær');
  const [boardProposalFile, setBoardProposalFile] = useState<File | null>(null);
  const [boardReportFile, setBoardReportFile] = useState<File | null>(null);
  const [minutesFile, setMinutesFile] = useState<File | null>(null);

  useEffect(() => {
    if (prefillDate) setMeetingDate(prefillDate);
    if (prefillLocation) setLocation(prefillLocation);
    if (prefillType) setMeetingType(prefillType);
  }, [prefillDate, prefillLocation, prefillType]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingDate || !location || !meetingType) {
      toast.error('Udfyld dato, sted og type');
      return;
    }

    setIsLoading(true);

    try {
      const timestamp = Date.now();
      const updateData: any = {};

      if (boardProposalFile) {
        const fileExt = boardProposalFile.name.split('.').pop();
        const fileName = `${meetingDate}_proposal_${timestamp}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('general_meetings_documents')
          .upload(fileName, boardProposalFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('general_meetings_documents')
          .getPublicUrl(fileName);

        updateData.board_proposal_file_url = publicUrl;
        updateData.board_proposal_file_name = boardProposalFile.name;
        updateData.board_proposal_file_size = boardProposalFile.size;
      }

      if (boardReportFile) {
        const fileExt = boardReportFile.name.split('.').pop();
        const fileName = `${meetingDate}_report_${timestamp}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('general_meetings_documents')
          .upload(fileName, boardReportFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('general_meetings_documents')
          .getPublicUrl(fileName);

        updateData.board_report_file_url = publicUrl;
        updateData.board_report_file_name = boardReportFile.name;
        updateData.board_report_file_size = boardReportFile.size;
      }

      if (minutesFile) {
        const fileExt = minutesFile.name.split('.').pop();
        const fileName = `${meetingDate}_minutes_${timestamp}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('general_meetings_documents')
          .upload(fileName, minutesFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('general_meetings_documents')
          .getPublicUrl(fileName);

        updateData.minutes_file_url = publicUrl;
        updateData.minutes_file_name = minutesFile.name;
        updateData.minutes_file_size = minutesFile.size;
      }

      if (meetingId) {
        const { error } = await supabase
          .from('general_meetings')
          .update(updateData)
          .eq('id', meetingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('general_meetings')
          .insert({
            date: meetingDate,
            type: meetingType,
            location,
            ...updateData,
          });

        if (error) throw error;
      }

      toast.success(meetingId ? 'Dokumenter opdateret!' : 'Generalforsamling oprettet!');

      setMeetingDate('');
      setLocation('');
      setMeetingType('ordinær');
      setBoardProposalFile(null);
      setBoardReportFile(null);
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
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {meetingId ? 'Upload Referat' : 'Opret Generalforsamling'}
        </h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Type
          </label>
          <select
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value as 'ordinær' | 'ekstraordinær')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          >
            <option value="ordinær">Ordinær generalforsamling</option>
            <option value="ekstraordinær">Ekstraordinær generalforsamling</option>
          </select>
        </div>

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
            placeholder="F.eks. Engbakkevej 37"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        {meetingType === 'ordinær' && (
          <>
            <FileUploadField
              label="Forslag til bestyrelse"
              file={boardProposalFile}
              onChange={setBoardProposalFile}
              optional
            />

            <FileUploadField
              label="Bestyrelsens beretning"
              file={boardReportFile}
              onChange={setBoardReportFile}
              optional
            />
          </>
        )}

        <FileUploadField
          label="Referat"
          file={minutesFile}
          onChange={setMinutesFile}
          optional
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Uploader...' : meetingId ? 'Upload Referat' : 'Opret Generalforsamling'}
        </button>
      </form>
    </div>
  );
}
