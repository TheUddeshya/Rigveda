import { useState, useMemo, useEffect } from 'react';
import { createSearchEngine, search } from '../utils/searchEngine';
import type { VerseData } from '../store/verseStore';

const SEARCH_HISTORY_KEY = 'rigveda_search_history';
const MAX_HISTORY_SIZE = 5;

export const useSearch = (verses: VerseData[]) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VerseData[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load search history from localStorage", error);
    }
  }, []);

  const fuse = useMemo(() => createSearchEngine(verses), [verses]);

  const performSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const searchResults = search(fuse, searchQuery);
    setResults(searchResults);

    // Update search history
    setHistory(prevHistory => {
      const newHistory = [searchQuery, ...prevHistory.filter(item => item !== searchQuery)];
      const trimmedHistory = newHistory.slice(0, MAX_HISTORY_SIZE);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmedHistory));
      } catch (error) {
        console.error("Failed to save search history to localStorage", error);
      }
      return trimmedHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error("Failed to clear search history from localStorage", error);
    }
  };

  return { query, setQuery: performSearch, results, history, clearHistory };
};
