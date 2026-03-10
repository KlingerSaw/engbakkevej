import React, { useState, useEffect } from 'react';
import { ThumbsUp, Home, Edit2, FileText, Trash2, ExternalLink, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Idea } from '../../types/ideas';
import { HouseVerification } from '../shared/HouseVerification';
import { IdeaForm } from './IdeaForm';
import { CommentForm } from './CommentForm';
import { CommentsList } from './CommentsList';

interface IdeaCardProps {
  idea: Idea;
  deviceId: string;
  onUpvote: (idea: Idea) => void;
  onEdit: (idea: Idea) => void;
  onDelete: (ideaId: string) => void;
}

export function IdeaCard({ idea, deviceId, onUpvote, onEdit, onDelete }: IdeaCardProps) {
  const [showHouseVerification, setShowHouseVerification] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [verificationAction, setVerificationAction] = useState<'edit' | 'upvote' | 'delete'>('upvote');
  const [showComments, setShowComments] = useState(false);
  const [refreshComments, setRefreshComments] = useState(0);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    fetchUpvotes();
    checkIfUpvoted();
  }, [idea.id]);

  const fetchUpvotes = async () => {
    try {
      const { count } = await supabase
        .from('idea_upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('idea_id', idea.id);

      setUpvoteCount(count || 0);
    } catch (error) {
      console.error('Error fetching upvotes:', error);
    }
  };

  const checkIfUpvoted = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_upvotes')
        .select('house_number')
        .eq('idea_id', idea.id);

      if (error) {
        throw error;
      }

      if (data && Array.isArray(data)) {
        const houseNumbers = data.map(upvote => upvote.house_number);
        setHasUpvoted(houseNumbers.length > 0);
      } else {
        setHasUpvoted(false);
      }
    } catch (error) {
      console.error('Error checking upvote status:', error);
      setHasUpvoted(false);
    }
  };

  const handleUpvoteClick = async () => {
    setVerificationAction('upvote');
    setShowHouseVerification(true);
  };

  const handleEditClick = () => {
    setVerificationAction('edit');
    setShowHouseVerification(true);
  };

  const handleDeleteClick = () => {
    setVerificationAction('delete');
    setShowHouseVerification(true);
  };

  const handleVerified = async (verifiedHouseNumber: number) => {
    if (verificationAction === 'upvote') {
      // Check if this house has already voted
      const { data: existingVotes, error: checkError } = await supabase
        .from('idea_upvotes')
        .select('id')
        .eq('idea_id', idea.id)
        .eq('house_number', verifiedHouseNumber);

      if (checkError) {
        console.error('Error checking votes:', checkError);
        toast.error('Der opstod en fejl ved verificering af stemmer');
        setShowHouseVerification(false);
        return;
      }

      if (existingVotes && existingVotes.length > 0) {
        toast.error(`Husnummer ${verifiedHouseNumber} har allerede stemt på denne idé`);
        setShowHouseVerification(false);
        return;
      }

      await handleUpvote(verifiedHouseNumber);
    } else if (verificationAction === 'edit') {
      if (verifiedHouseNumber !== idea.house_number) {
        toast.error('Det valgte husnummer matcher ikke idéen');
        setShowHouseVerification(false);
        return;
      }
      setIsEditing(true);
    } else if (verificationAction === 'delete') {
      if (verifiedHouseNumber !== idea.house_number) {
        toast.error('Det valgte husnummer matcher ikke idéen');
        setShowHouseVerification(false);
        return;
      }
      await handleDelete();
    }
    setShowHouseVerification(false);
  };

  const handleUpvote = async (verifiedHouseNumber: number) => {
    if (isUpvoting) return;
    
    try {
      setIsUpvoting(true);
      
      const { error } = await supabase
        .from('idea_upvotes')
        .insert([{
          idea_id: idea.id,
          house_number: verifiedHouseNumber
        }]);

      if (error) throw error;
      
      toast.success('Tak for din stemme! 👍');
      await fetchUpvotes();
      await checkIfUpvoted();
    } catch (error) {
      console.error('Error upvoting:', error);
      toast.error('Kunne ikke stemme på ideen');
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', idea.id)
        .eq('device_id', deviceId);

      if (error) throw error;
      
      toast.success('Idé er blevet slettet');
      onDelete(idea.id);
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast.error('Kunne ikke slette idéen');
    }
  };

  const canModify = idea.device_id === deviceId;

  if (isEditing) {
    return (
      <IdeaForm 
        existingIdea={idea}
        onIdeaAdded={(updatedIdea) => {
          if (updatedIdea) {
            onEdit(updatedIdea);
          }
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="p-4 shadow bg-white rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 text-sm text-brand-blue">
                <Home className="w-4 h-4" />
                <span>Nr. {idea.house_number}</span>
              </div>
              <span className="text-sm text-gray-500">
                • {new Date(idea.created_at).toLocaleDateString('da-DK')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-brand-blue">
              {idea.title}
            </h3>
            <p className="text-gray-600 mt-2">
              {idea.description}
            </p>
            {idea.attachment_url && (
              <a
                href={idea.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-sm text-brand-blue hover:text-brand-blue-dark"
              >
                <FileText className="w-4 h-4" />
                <span>Se vedhæftet fil</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canModify && (
              <>
                <button
                  onClick={handleEditClick}
                  className="p-2 hover:bg-brand-blue/10 rounded-full transition-colors"
                  title="Rediger idé"
                >
                  <Edit2 className="w-4 h-4 text-brand-blue" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  title="Slet idé"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </>
            )}
            <button
              onClick={handleUpvoteClick}
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                hasUpvoted 
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-brand-blue text-white hover:bg-brand-blue-dark'
              }`}
              disabled={isUpvoting || hasUpvoted}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{upvoteCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand-blue text-white hover:bg-brand-blue-dark"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kommentér</span>
            </button>
          </div>
        </div>

        {showComments && (
          <>
            <CommentsList 
              ideaId={idea.id} 
              refreshTrigger={refreshComments}
            />
            <CommentForm 
              ideaId={idea.id}
              onCommentAdded={() => setRefreshComments(prev => prev + 1)}
            />
          </>
        )}
      </div>

      {showHouseVerification && (
        <HouseVerification
          onVerified={handleVerified}
          onCancel={() => setShowHouseVerification(false)}
          title={`Bekræft dit husnummer for at ${
            verificationAction === 'upvote' 
              ? 'stemme' 
              : verificationAction === 'edit'
                ? 'redigere'
                : 'slette'
          }`}
        />
      )}
    </>
  );
}