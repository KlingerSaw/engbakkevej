import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { getDeviceId } from '../../lib/deviceId';
import { IdeaCard } from './IdeaCard';
import { IdeaForm } from './IdeaForm';
import { Idea } from '../../types/ideas';
import { useYear } from '../../contexts/YearContext';

export function IdeasList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { selectedYear } = useYear();
  const deviceId = getDeviceId();

  const fetchIdeas = async () => {
    try {
      console.log('Fetching ideas for year:', selectedYear);
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          upvotes:idea_upvotes(count)
        `)
        .eq('year', selectedYear)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ideasWithUpvotes = data?.map(idea => ({
        ...idea,
        upvotes: idea.upvotes[0]?.count || 0
      })) || [];

      ideasWithUpvotes.sort((a, b) => b.upvotes - a.upvotes);

      console.log('Fetched ideas:', ideasWithUpvotes);
      setIdeas(ideasWithUpvotes);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast.error('Kunne ikke hente ideer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();

    const channel = supabase
      .channel('ideas_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ideas'
      }, (payload) => {
        console.log('Received change:', payload);
        fetchIdeas();
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedYear]);

  const handleIdeaAdded = (newIdea: Idea | null) => {
    if (newIdea) {
      setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
    }
    setShowForm(false);
  };

  const handleUpvote = (updatedIdea: Idea) => {
    setIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea.id === updatedIdea.id ? updatedIdea : idea
      )
    );
  };

  const handleEdit = (updatedIdea: Idea) => {
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea.id === updatedIdea.id ? updatedIdea : idea
      )
    );
  };

  const handleDelete = (ideaId: string) => {
    setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 shadow bg-white rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-brand-blue px-6 py-3 text-white rounded-lg hover:bg-brand-blue-dark transition-colors"
      >
        Del din idé
      </button>

      {showForm && (
        <IdeaForm onIdeaAdded={handleIdeaAdded} />
      )}

      {ideas.length === 0 ? (
        <p className="text-center">Ingen ideer i {selectedYear}.</p>
      ) : (
        ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            deviceId={deviceId}
            onUpvote={handleUpvote}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}