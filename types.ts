export interface SleepEntry {
  id: string;
  date: string;
  bedTime: string; // ISO string
  wakeTime: string; // ISO string
  quality: number; // 1-10
  mood: 'rested' | 'tired' | 'groggy' | 'neutral';
  notes: string;
}

export interface User {
  email: string;
  name: string;
}

export type Language = 'en' | 'ar';

export interface AnalysisResult {
  summary: string;
  recommendations: string[];
  score: number;
}

export interface ChartDataPoint {
  date: string;
  duration: number; // in hours
  quality: number;
  bedTimeOffset: number; // minutes from midnight (negative for before midnight)
}
