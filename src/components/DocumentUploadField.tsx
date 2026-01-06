import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { File, Upload, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface DocumentUploadFieldProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  optional?: boolean;
}

export default function DocumentUploadField({ label, value, onChange, optional = false }: DocumentUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-document`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returnerede ikke JSON. Tjek console for detaljer.');
      }

      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `Server fejl: ${response.status}`);
      }

      if (!data.html) {
        throw new Error('Ingen HTML modtaget fra server');
      }

      onChange(data.html);
      toast.success(`${file.name} parsed succesfuldt!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Fejl ved upload');
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleClear = () => {
    onChange('');
    setFileName(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {optional && <span className="text-gray-500 text-xs">(valgfrit)</span>}
      </label>

      {!value ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragActive
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-300 hover:border-emerald-400'
          } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-sm text-gray-600">Parser {fileName}...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Slip fil her...' : 'Træk og slip DOCX fil her, eller klik for at vælge'}
              </p>
              <p className="text-xs text-gray-500">Kun DOCX filer understøttes</p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <File className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                {fileName || 'Dokument uploadet'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-600 hover:text-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
