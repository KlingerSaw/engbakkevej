import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface YearContextType {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export function YearProvider({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([currentYear]);

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  const fetchAvailableYears = async () => {
    try {
      const years = new Set<number>();

      const [eventsData, boardMeetingsData, generalMeetingsData, boardMembersData, newsData, ideasData] = await Promise.all([
        supabase.from('events').select('year'),
        supabase.from('board_meetings').select('year'),
        supabase.from('general_meetings').select('year'),
        supabase.from('board_members').select('start_year, end_year'),
        supabase.from('news').select('year'),
        supabase.from('ideas').select('year')
      ]);

      eventsData.data?.forEach(item => item.year && years.add(item.year));
      boardMeetingsData.data?.forEach(item => item.year && years.add(item.year));
      generalMeetingsData.data?.forEach(item => item.year && years.add(item.year));
      newsData.data?.forEach(item => item.year && years.add(item.year));
      ideasData.data?.forEach(item => item.year && years.add(item.year));

      boardMembersData.data?.forEach(member => {
        years.add(member.start_year);
        if (member.end_year) {
          for (let y = member.start_year; y <= member.end_year; y++) {
            years.add(y);
          }
        } else {
          for (let y = member.start_year; y <= currentYear; y++) {
            years.add(y);
          }
        }
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);
      setAvailableYears(sortedYears.length > 0 ? sortedYears : [currentYear]);
    } catch (error) {
      console.error('Error fetching available years:', error);
      setAvailableYears([currentYear]);
    }
  };

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, availableYears }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYear() {
  const context = useContext(YearContext);
  if (context === undefined) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return context;
}
