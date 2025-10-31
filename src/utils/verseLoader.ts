import type { VerseData } from '../store/verseStore';

export const loadVerses = async (): Promise<VerseData[]> => {
  try {
    const response = await fetch('/data/verses.json');
    if (!response.ok) {
      throw new Error('Failed to load verses');
    }
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error('Error loading verses:', error);
    return [];
  }
};
