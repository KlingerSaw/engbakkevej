import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ThumbsUp, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDeviceId } from '../lib/deviceId';

interface Idea {
  id: number;
  title: string;
  description: string;
  created_at: string;
  upvotes: number;
  upvoted_by: string[];
  house_number: number;
  device_id: string;
}

export function IdeasList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const deviceId = getDeviceId();

  useEffect(() => {
    fetchIdeas();
  }, []);

  async function fetchIdeas() {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('upvotes', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast.error('Kunne ikke hente ideer');
    } finally {
      setLoading(false);
    }
  }

  const handleUpvote = async (idea: Idea) => {
    if (idea.upvoted_by.includes(deviceId)) {
      toast.error('Du har allerede stemt på denne idé');
      return;
    }

    try {
      const { error } = await supabase
        .from('ideas')
        .update({ 
          upvotes: idea.upvotes + 1,
          upvoted_by: [...idea.upvoted_by, deviceId]
        })
        .eq('id', idea.id);

      if (error) throw error;
      toast.success('Tak for din stemme! 👍');
    } catch (error) {
      console.error('Error upvoting:', error);
      toast.error('Kunne ikke stemme på ideen');
    }
  };

  const cardVariants = {
    rest: {
      borderRadius: "0.5rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    hover: {
      borderRadius: "0.75rem 0.25rem 0.75rem 0.25rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  if (loading) {
    return <div className="text-center">Indlæser ideer...</div>;
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {ideas.length === 0 ? (
        <p className="text-center">Ingen ideer endnu. Vær den første til at dele en idé!</p>
      ) : (
        ideas.map((idea) => (
          <motion.div
            key={idea.id}
            className="p-4 shadow bg-white rounded-lg"
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            animate="rest"
            layout
          >
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
              </div>
              <motion.button
                onClick={() => handleUpvote(idea)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full bg-brand-blue text-white hover:bg-brand-blue-dark ${
                  idea.upvoted_by.includes(deviceId) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: idea.upvoted_by.includes(deviceId) ? 1 : 1.05 }}
                whileTap={{ scale: idea.upvoted_by.includes(deviceId) ? 1 : 0.95 }}
                disabled={idea.upvoted_by.includes(deviceId)}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{idea.upvotes}</span>
              </motion.button>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}