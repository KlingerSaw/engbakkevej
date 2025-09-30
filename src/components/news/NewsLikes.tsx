import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getDeviceId } from '../../lib/deviceId';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface NewsLikesProps {
  newsId: string;
}

export function NewsLikes({ newsId }: NewsLikesProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deviceId = getDeviceId();

  useEffect(() => {
    fetchLikes();
    checkIfLiked();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`news_likes_${newsId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'news_likes',
        filter: `news_id=eq.${newsId}`
      }, () => {
        fetchLikes();
        checkIfLiked();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newsId]);

  const fetchLikes = async () => {
    try {
      const { count, error } = await supabase
        .from('news_likes')
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId);

      if (error) throw error;
      setLikeCount(count || 0);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const checkIfLiked = async () => {
    try {
      const { data, error } = await supabase
        .from('news_likes')
        .select('id')
        .eq('news_id', newsId)
        .eq('device_id', deviceId)
        .maybeSingle();

      if (error) throw error;
      setHasLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    if (isLoading || hasLiked) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('news_likes')
        .insert([{
          news_id: newsId,
          device_id: deviceId
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Du har allerede liket denne nyhed');
        } else {
          throw error;
        }
      } else {
        toast.success('Tak for dit like! ❤️');
      }
    } catch (error) {
      console.error('Error liking news:', error);
      toast.error('Kunne ikke like nyheden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading || hasLiked}
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
        hasLiked 
          ? 'bg-red-100 text-red-600 cursor-not-allowed' 
          : 'bg-white/50 text-gray-600 hover:bg-red-100 hover:text-red-600'
      }`}
      whileHover={{ scale: hasLiked ? 1 : 1.05 }}
      whileTap={{ scale: hasLiked ? 1 : 0.95 }}
    >
      <Heart 
        className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} 
      />
      <span>{likeCount}</span>
    </motion.button>
  );
}