import { useEffect } from 'react';
import { create } from 'zustand';

interface BookmarksState {
  bookmarks: string[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const LOCAL_KEY = 'rv-bookmarks';

const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  addBookmark: (id: string) => set((state) => {
    const next = state.bookmarks.includes(id) ? state.bookmarks : [...state.bookmarks, id];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    return { bookmarks: next };
  }),
  removeBookmark: (id: string) => set((state) => {
    const next = state.bookmarks.filter((v) => v !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    return { bookmarks: next };
  }),
  toggleBookmark: (id: string) => set((state) => {
    const isBookmarked = state.bookmarks.includes(id);
    const next = isBookmarked ? state.bookmarks.filter((v) => v !== id) : [...state.bookmarks, id];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    return { bookmarks: next };
  }),
  isBookmarked: (id: string) => get().bookmarks.includes(id)
}));

export function useBookmarks() {
  const store = useBookmarksStore();
  // initialize bookmarks from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem(LOCAL_KEY);
    if (data) {
      try {
        const ids = JSON.parse(data);
        if (Array.isArray(ids)) {
          useBookmarksStore.setState({ bookmarks: ids });
        }
      } catch { /* ignore */ }
    }
  }, []);
  return store;
}
