import { createClient } from '@supabase/supabase-js';

// Log the environment variables to verify they are loaded correctly
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchMinutesFiles() {
  try {
    const { data: files, error } = await supabase
      .storage
      .from('minuts')
      .list();

    if (error) throw error;

    const meetings = files?.map(file => {
      // Extract date and location from filename (e.g., "27.02.25 Lars.pdf")
      const match = file.name.match(/(\d{2}\.\d{2}\.\d{2})\s+(\w+)\.pdf/);
      if (!match) return null;

      const [_, dateStr, location] = match;
      const [day, month, year] = dateStr.split('.');
      
      // Convert to full date string with time
      const date = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), 19, 0);

      return {
        date: date.toISOString(),
        location,
      };
    }).filter(Boolean);

    return meetings;
  } catch (error) {
    console.error('Error fetching minutes files:', error);
    return [];
  }
}