import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
  comments: number;
  shares: number;
}

function formatDate(date: string): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Lige nu';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minut' : 'minutter'} siden`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'time' : 'timer'} siden`;
  } else if (diffInSeconds < 172800) {
    return 'I går';
  } else {
    return postDate.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export function FacebookPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('facebook_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Kunne ikke hente opslag');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/50 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">Ingen opslag endnu</p>
      ) : (
        posts.map((post) => (
          <motion.div
            key={post.id}
            className="bg-white rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white font-semibold">
                {post.author[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{post.author}</p>
                <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{post.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>{post.shares}</span>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}