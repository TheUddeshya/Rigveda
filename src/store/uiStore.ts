import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface UIStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Get initial theme from localStorage or system preference
function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('rv-theme');
    if (stored === 'light' || stored === 'dark') return stored;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // ignore
  }
  return 'light';
}

export const useUIStore = create<UIStore>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem('rv-theme', theme);
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  modalOpen: false,
  setModalOpen: (open) => set({ modalOpen: open }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
