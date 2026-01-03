import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface BoardMember {
  id: string;
  name: string;
  house_number: number;
  position: string;
  start_year: number;
  end_year: number | null;
}

export function useBoardMembers(year?: number) {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();

    const channel = supabase
      .channel('board_members_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'board_members' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [year]);

  const fetchMembers = async () => {
    try {
      let query = supabase
        .from('board_members')
        .select('*');

      if (year) {
        query = query
          .lte('start_year', year)
          .or(`end_year.is.null,end_year.gte.${year}`);
      }

      const { data, error } = await query.order('position');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching board members:', error);
      toast.error('Kunne ikke hente bestyrelsesmedlemmer');
    } finally {
      setLoading(false);
    }
  };

  return { members, loading };
}
