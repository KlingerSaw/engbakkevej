import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Upload, Mail, Lock, Calendar, MapPin, FileText } from 'lucide-react';

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
  const [step, setStep] = useState<'email' | 'verify' | 'upload'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [meetingDate, setMeetingDate] = useState(prefillDate || '');
  const [location, setLocation] = useState(prefillLocation || '');
  const [meetingType, setMeetingType] = useState<'ordinær' | 'ekstraordinær'>(prefillType || 'ordinær');
  const [minutesHtml, setMinutesHtml] = useState('');

  useEffect(() => {
    if (prefillDate) setMeetingDate(prefillDate);
    if (prefillLocation) setLocation(prefillLocation);
    if (prefillType) setMeetingType(prefillType);
  }, [prefillDate, prefillLocation, prefillType]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunne ikke sende verifikationskode');
      }

      if (data.code) {
        toast.success(`Kode sendt! (Dev mode: ${data.code})`);
      } else {
        toast.success('Verifikationskode sendt til din email!');
      }

      setStep('verify');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Der opstod en fejl');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingDate || !location || !meetingType || !minutesHtml) {
      toast.error('Udfyld alle felter');
      return;
    }

    setIsLoading(true);

    try {
      if (meetingId) {
        const { error } = await supabase
          .from('general_meetings')
          .update({
            minutes_text: minutesHtml,
          })
          .eq('id', meetingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('general_meetings')
          .insert({
            date: meetingDate,
            type: meetingType,
            location,
            minutes_text: minutesHtml,
          });

        if (error) throw error;
      }

      toast.success(meetingId ? 'Referat opdateret!' : 'Generalforsamling oprettet!');

      setStep('email');
      setEmail('');
      setCode('');
      setMeetingDate('');
      setLocation('');
      setMeetingType('ordinær');
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

      {step === 'email' && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email (kun formand)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rene@engbakken.dk"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Sender...' : 'Send Verifikationskode'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerifyAndUpload} className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-emerald-800">
              <Lock className="w-4 h-4 inline mr-2" />
              En 6-cifret kode er blevet sendt til din email. Koden er gyldig i 15 minutter.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verifikationskode
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-2xl tracking-widest"
              required
              maxLength={6}
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referat (HTML)
            </label>
            <textarea
              value={minutesHtml}
              onChange={(e) => setMinutesHtml(e.target.value)}
              placeholder="Indsæt HTML fra referat her..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
              rows={12}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Du kan kopiere hele HTML-dokumentet herfra
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Tilbage
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Uploader...' : meetingId ? 'Upload Referat' : 'Opret Generalforsamling'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
