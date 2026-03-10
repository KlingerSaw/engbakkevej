import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Event } from '../types/events';

export function useEvents(year?: number) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [year]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select('*');

      if (year) {
        query = query.eq('year', year);
      }

      const { data, error } = await query.order('date');

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Kunne ikke hente arrangementer');
    } finally {
      setLoading(false);
    }
  };

  return { events, loading };
}