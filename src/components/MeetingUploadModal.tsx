import { X } from 'lucide-react';
import MinutesUpload from './MinutesUpload';

interface MeetingUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId?: string;
  meetingDate?: string;
  meetingLocation?: string;
}

export default function MeetingUploadModal({
  isOpen,
  onClose,
  meetingId,
  meetingDate,
  meetingLocation,
}: MeetingUploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <MinutesUpload
            meetingId={meetingId}
            prefillDate={meetingDate}
            prefillLocation={meetingLocation}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
