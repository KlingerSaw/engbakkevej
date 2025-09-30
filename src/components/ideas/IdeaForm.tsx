import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { getDeviceId } from '../../lib/deviceId';
import { HouseVerification } from '../shared/HouseVerification';
import { Idea } from '../../types/ideas';

interface IdeaFormProps {
  onIdeaAdded: (idea: Idea | null) => void;
  existingIdea?: Idea;
}

const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function IdeaForm({ onIdeaAdded, existingIdea }: IdeaFormProps) {
  const [title, setTitle] = useState(existingIdea?.title || '');
  const [description, setDescription] = useState(existingIdea?.description || '');
  const [showHouseVerification, setShowHouseVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const deviceId = getDeviceId();

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: ALLOWED_FILE_TYPES
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowHouseVerification(true);
  };

  const handleHouseVerified = async (houseNumber: number) => {
    setIsSubmitting(true);
    try {
      let fileUrl = null;
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('idea-attachments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('idea-attachments')
          .getPublicUrl(fileName);
          
        fileUrl = publicUrl;
      }

      if (existingIdea) {
        const { data, error } = await supabase
          .from('ideas')
          .update({
            title,
            description,
            attachment_url: fileUrl || existingIdea.attachment_url
          })
          .eq('id', existingIdea.id)
          .eq('device_id', deviceId)
          .select()
          .single();

        if (error) throw error;
        toast.success('Din idé er blevet opdateret!');
        setShowHouseVerification(false);
        onIdeaAdded(data);
      } else {
        const newIdea = {
          title,
          description,
          house_number: houseNumber,
          device_id: deviceId,
          upvotes: 0,
          upvoted_by: [],
          attachment_url: fileUrl
        };

        const { data, error } = await supabase
          .from('ideas')
          .insert([newIdea])
          .select()
          .single();

        if (error) throw error;

        toast.success('Din idé er blevet tilføjet!');
        clearForm(); // Clear the form after successful submission
        setShowHouseVerification(false);
        onIdeaAdded(data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Der opstod en fejl. Prøv igen senere.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showHouseVerification) {
    return (
      <HouseVerification
        onVerified={handleHouseVerified}
        onCancel={() => {
          setShowHouseVerification(false);
          if (!existingIdea) {
            onIdeaAdded(null);
          }
        }}
        title="Vælg dit husnummer"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Titel
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue bg-white px-3 py-2 text-black"
          required
          placeholder="Skriv din titel her..."
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Beskrivelse
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full border border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue bg-white px-3 py-2 text-black"
          required
          placeholder="Beskriv din idé her..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vedhæft PDF fil (valgfrit)
        </label>
        <div className="mt-1">
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-300 hover:border-brand-blue'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Træk en PDF fil hertil, eller klik for at vælge
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Maks. 10MB. Kun PDF filer understøttes
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5" />
              <span className="flex-1 text-sm truncate">{file.name}</span>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue px-4 py-2 text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-50 rounded"
        >
          {isSubmitting ? 'Sender...' : (existingIdea ? 'Opdater' : 'Send idé')}
        </button>
      </div>
    </form>
  );
}