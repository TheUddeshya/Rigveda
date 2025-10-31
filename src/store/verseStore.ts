import { create } from 'zustand';

export interface Translation {
  language: string;
  translator: string;
  text: string;
  year?: number;
}

export interface VerseData {
  id: string;
  mandala: number;
  sukta: number;
  verse: number;
  text: {
    sanskrit: string;
    iast: string;
    translations: Translation[];
  };
  metadata: {
    deity: { primary: string; secondary?: string | null };
    rishi: { name: string; gotra?: string; family?: string };
    meter: string;
    category?: string;
  };
  themes: string[];
  keywords?: {
    sanskrit: string[];
    english: string[];
  };
  context?: {
    significance?: string;
    ritual_use?: string;
    symbolic_meaning?: string;
    note?: string;
  };
  connections?: {
    related_verses?: string[];
    parallel_hymns?: string[];
    referenced_in?: string[];
  };
  geography?: {
    region?: string;
    modern_location?: string;
    coordinates?: { lat: number; lng: number };
  };
  chronology?: {
    layer?: string;
    approx_period?: string;
    relative_date?: number;
  };
  audio?: {
    pronunciation_url?: string;
    recitation_style?: string;
  };
  analysis?: {
    word_count?: number;
    complexity?: string;
    poetic_devices?: string[];
    grammatical_notes?: string;
  };
}

interface VerseStore {
  verses: VerseData[];
  setVerses: (verses: VerseData[]) => void;
  featuredVerse: VerseData | null;
  setFeaturedVerse: (verse: VerseData | null) => void;
  filteredVerses: VerseData[];
  setFilteredVerses: (verses: VerseData[]) => void;
}

export const useVerseStore = create<VerseStore>((set) => ({
  verses: [],
  setVerses: (verses) => set({ verses }),
  featuredVerse: null,
  setFeaturedVerse: (verse) => set({ featuredVerse: verse }),
  filteredVerses: [],
  setFilteredVerses: (verses) => set({ filteredVerses: verses }),
}));