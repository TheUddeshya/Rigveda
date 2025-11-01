import Fuse, { type IFuseOptions } from 'fuse.js';
import type { VerseData } from '../store/verseStore';

export interface SearchOptions {
  threshold?: number;
  keys?: string[];
}

export const createSearchEngine = (verses: VerseData[]) => {
  const options: IFuseOptions<VerseData> = {
    threshold: 0.4,
    keys: [
      'text.sanskrit',
      'text.iast',
      'text.translations.text',
      'metadata.deity.primary',
      'metadata.rishi.name',
      'metadata.meter',
      'themes',
      'keywords.sanskrit',
      'keywords.english',
      'context.significance',
    ],
    includeScore: true,
  };

  return new Fuse(verses, options);
};

export const search = (fuse: Fuse<VerseData>, query: string): VerseData[] => {
  if (!query.trim()) return [];
  const results = fuse.search(query);
  return results.map((result) => result.item);
};
