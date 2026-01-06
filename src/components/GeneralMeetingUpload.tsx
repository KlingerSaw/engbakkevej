import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Upload, Calendar, MapPin, FileText } from 'lucide-react';
import DocumentUploadField from './DocumentUploadField';

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
  const [boardProposalHtml, setBoardProposalHtml] = useState('');
  const [boardReportHtml, setBoardReportHtml] = useState('');
  const [minutesHtml, setMinutesHtml] = useState('');

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
      const updateData: any = {
        board_proposal_text: boardProposalHtml || null,
        board_report_text: boardReportHtml || null,
        minutes_text: minutesHtml || null,
      };

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
      setBoardProposalHtml('');
      setBoardReportHtml('');
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
            <DocumentUploadField
              label="Forslag til bestyrelse"
              value={boardProposalHtml}
              onChange={setBoardProposalHtml}
              optional
            />

            <DocumentUploadField
              label="Bestyrelsens beretning"
              value={boardReportHtml}
              onChange={setBoardReportHtml}
              optional
            />
          </>
        )}

        <DocumentUploadField
          label="Referat"
          value={minutesHtml}
          onChange={setMinutesHtml}
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
