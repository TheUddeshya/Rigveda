import { useState, useEffect } from 'react';
import { loadVerses } from '../utils/verseLoader';
import type { VerseData } from '../store/verseStore';

export const useVerses = () => {
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        setLoading(true);
        const data = await loadVerses();
        setVerses(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load verses');
      } finally {
        setLoading(false);
      }
    };
    fetchVerses();
  }, []);

  return { verses, loading, error };
};
