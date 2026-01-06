import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { File, Upload, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadFieldProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  optional?: boolean;
  accept?: Record<string, string[]>;
}

export default function FileUploadField({
  label,
  file,
  onChange,
  optional = false,
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  }
}: FileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    const maxSize = 10 * 1024 * 1024;
    if (uploadedFile.size > maxSize) {
      toast.error('Filen er for stor. Maksimal størrelse er 10MB');
      return;
    }

    onChange(uploadedFile);
    toast.success(`${uploadedFile.name} er klar til upload!`);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  const handleClear = () => {
    onChange(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {optional && <span className="text-gray-500 text-xs">(valgfrit)</span>}
      </label>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragActive
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-300 hover:border-emerald-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive ? 'Slip fil her...' : 'Træk og slip fil her, eller klik for at vælge'}
            </p>
            <p className="text-xs text-gray-500">PDF eller DOCX (maks. 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-600 hover:text-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
