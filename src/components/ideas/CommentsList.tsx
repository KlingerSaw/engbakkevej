import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Home, Edit2, Trash2 } from 'lucide-react';
import { HouseVerification } from '../shared/HouseVerification';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Comment {
  id: string;
  house_number: number;
  content: string;
  created_at: string;
}

interface CommentsListProps {
  ideaId: string;
  refreshTrigger: number;
}

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <h3 className="text-xl font-semibold text-red-500 mb-4">
          Handling ikke tilladt
        </h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Luk
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function CommentsList({ ideaId, refreshTrigger }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHouseVerification, setShowHouseVerification] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);
  const [editContent, setEditContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [ideaId, refreshTrigger]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setSelectedComment(comment);
    setEditContent(comment.content);
    setAction('edit');
    setShowHouseVerification(true);
  };

  const handleDelete = (comment: Comment) => {
    setSelectedComment(comment);
    setAction('delete');
    setShowHouseVerification(true);
  };

  const handleHouseVerified = async (houseNumber: number) => {
    if (!selectedComment || !action) return;

    if (houseNumber !== selectedComment.house_number) {
      const message = `Denne kommentar er skrevet af husnummer ${selectedComment.house_number} og kan derfor ikke ${action === 'edit' ? 'rettes' : 'slettes'} af husnummer ${houseNumber}`;
      setErrorMessage(message);
      setShowHouseVerification(false);
      return;
    }

    try {
      if (action === 'edit') {
        const { error } = await supabase
          .from('idea_comments')
          .update({ content: editContent })
          .eq('id', selectedComment.id)
          .eq('house_number', houseNumber);

        if (error) throw error;
        toast.success('Kommentar opdateret');
      } else if (action === 'delete') {
        const { error } = await supabase
          .from('idea_comments')
          .delete()
          .eq('id', selectedComment.id)
          .eq('house_number', houseNumber);

        if (error) throw error;
        toast.success('Kommentar slettet');
      }

      await fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Der opstod en fejl');
    } finally {
      setShowHouseVerification(false);
      setSelectedComment(null);
      setAction(null);
      setEditContent('');
    }
  };

  if (loading) {
    return (
      <div className="mt-4 space-y-2 animate-pulse">
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (comments.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Home className="w-4 h-4" />
                  <span>Nr. {comment.house_number}</span>
                  <span>•</span>
                  <span>{new Date(comment.created_at).toLocaleDateString('da-DK')}</span>
                </div>
                {selectedComment?.id === comment.id && action === 'edit' ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-700">{comment.content}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleEdit(comment)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  title="Rediger kommentar"
                >
                  <Edit2 className="w-4 h-4 text-brand-blue" />
                </button>
                <button
                  onClick={() => handleDelete(comment)}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  title="Slet kommentar"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showHouseVerification && (
        <HouseVerification
          onVerified={handleHouseVerified}
          onCancel={() => {
            setShowHouseVerification(false);
            setSelectedComment(null);
            setAction(null);
            setEditContent('');
          }}
          title={`Bekræft husnummer for at ${action === 'edit' ? 'redigere' : 'slette'}`}
        />
      )}

      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => {
            setErrorMessage(null);
            setSelectedComment(null);
            setAction(null);
          }}
        />
      )}
    </>
  );
}