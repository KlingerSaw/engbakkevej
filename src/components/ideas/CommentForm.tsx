import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { HouseVerification } from '../shared/HouseVerification';

interface CommentFormProps {
  ideaId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ ideaId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [showHouseVerification, setShowHouseVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setShowHouseVerification(true);
  };

  const handleHouseVerified = async (houseNumber: number) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('idea_comments')
        .insert([{
          idea_id: ideaId,
          house_number: houseNumber,
          content: content.trim()
        }]);

      if (error) throw error;

      toast.success('Kommentar tilføjet!');
      setContent('');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Kunne ikke tilføje kommentar');
    } finally {
      setIsSubmitting(false);
      setShowHouseVerification(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Skriv en kommentar..."
            className="flex-1 px-3 py-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {showHouseVerification && (
        <HouseVerification
          onVerified={handleHouseVerified}
          onCancel={() => setShowHouseVerification(false)}
          title="Vælg dit husnummer"
        />
      )}
    </>
  );
}