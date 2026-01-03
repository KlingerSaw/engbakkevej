import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { getDeviceId } from '../../lib/deviceId';
import { IdeaCard } from './IdeaCard';
import { IdeaForm } from './IdeaForm';
import { Idea } from '../../types/ideas';

export function IdeasList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const deviceId = getDeviceId();

  const fetchIdeas = async () => {
    try {
      console.log('Fetching ideas...');
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          upvotes:idea_upvotes(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const ideasWithUpvotes = data?.map(idea => ({
        ...idea,
        upvotes: idea.upvotes[0]?.count || 0
      })) || [];

      ideasWithUpvotes.sort((a, b) => b.upvotes - a.upvotes);

      console.log('Fetched ideas:', ideasWithUpvotes);
      setIdeas(ideasWithUpvotes);

      const years = Array.from(new Set(ideasWithUpvotes.map(i => new Date(i.created_at).getFullYear())));
      years.sort((a, b) => b - a);
      setAvailableYears(years);
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
  }, []);

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

  const filteredIdeas = ideas.filter(i => new Date(i.created_at).getFullYear() === selectedYear);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setShowForm(true)}
          className="flex-1 bg-brand-blue px-6 py-3 text-white rounded-lg hover:bg-brand-blue-dark transition-colors"
        >
          Del din idé
        </button>

        {availableYears.length > 0 && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-3 border border-white/20 bg-white/10 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent font-medium text-white"
          >
            {availableYears.map(year => (
              <option key={year} value={year} className="bg-gray-800">
                {year}
              </option>
            ))}
          </select>
        )}
      </div>

      {showForm && (
        <IdeaForm onIdeaAdded={handleIdeaAdded} />
      )}

      {filteredIdeas.length === 0 ? (
        <p className="text-center">Ingen ideer i {selectedYear}.</p>
      ) : (
        filteredIdeas.map((idea) => (
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